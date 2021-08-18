"use strict";
import * as THREE from "../libs/three/three.module.js";
import {DiceManager, DiceD20} from "../libs/dice.js";
import {ViewController} from "./ViewController.js";
import {getSpecie} from "../data/DataHandler.js";

/**
 * controller for the dice
 * @author Gimli GloinsSon
 */

export default class DiceController {
    constructor() {
        self = this;
        self.reRoll = true;
        self.SIDES = 20;
        self.INITIALSIDE = 1;
        self.LastFace = 20;

        self.container = null;
        self.scene = null;
        self.camera = null;
        self.renderer = null;
        self.controls = null;
        self.world = null;
        self.dice = [];


    }

    init() {
        self.initWebGL();
    }

    /**
     * generates the dice for the character sheet
     */
    generateDice() {
        let viewController = new ViewController();
        const elements = [
            {"id": "diceVariants", "value": 20, "rarity": 16},
            {"id": "diceskins", "value": 20, "rarity": 16},
            {"id": "diceeyes", "value": 20, "rarity": 16},
            {"id": "diceears", "value": 20, "rarity": 16},
            {"id": "extraD0", "value": 20, "rarity": 16},
            {"id": "extraD1", "value": 20, "rarity": 16},
            {"id": "extraD2", "value": 20, "rarity": 16},
            {"id": "extraD3", "value": 20, "rarity": 16},
            {"id": "extraD4", "value": 20, "rarity": 16},
            {"id": "extraD5", "value": 20, "rarity": 16},
            {"id": "extraD6", "value": 20, "rarity": 16},
            {"id": "dice0", "value": 0, "rarity": 0},
            {"id": "dice1", "value": 0, "rarity": 0},
            {"id": "dice2", "value": 0, "rarity": 0},
            {"id": "dice3", "value": 0, "rarity": 0},
            {"id": "dice4", "value": 0, "rarity": 0},
            {"id": "dice5", "value": 0, "rarity": 0},
            {"id": "dice6", "value": 0, "rarity": 0},
            {"id": "dice7", "value": 0, "rarity": 0},
            {"id": "dice8", "value": 0, "rarity": 0},
            {"id": "dice9", "value": 0, "rarity": 0},
            {"id": "diceA", "value": 0, "rarity": 0}
        ]

        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            let html = viewController.buildDice(
                element.id,
                element.value,
                element.rarity
            );
            document.getElementById(element.id).outerHTML = html;
        }
    }

    /**
     * rolling the dice
     */
    roller() {
        document.getElementById("instructions").style.color = "transparent";
        document.getElementById("rollDice").disabled = true;
        const diceArea = document.getElementById("diceArea");
        diceArea.style.height = "100px";
        let canvas = document.getElementById("canvas");
        canvas.style.zIndex = "9";
        canvas.hidden = false;
        let diceArray = document.getElementsByClassName("dice");
        for (let i = 0; i < diceArray.length; i++) {
            let dice = diceArray[i];
            dice.setAttribute("data-face", "0");
            dice.setAttribute("data-rarity", "0");
            let text = dice.getElementsByTagName("text")[0];
            text.innerHTML = "0";
        }
        triggerUpdate();

        diceArray = diceArea.querySelectorAll("div[data-face='0']");

        self.randomDiceThrow(diceArray.length);
        let interval = setInterval(function () {
            self.collect();
            diceArray = diceArea.querySelectorAll("div[data-face='0']");
            if (diceArray.length === 0) {
                clearInterval(interval);
                canvas.hidden = true;
                canvas.style.zIndex = "-1";
                document.getElementById("resetDice").disabled = false;
            } else {
                self.randomDiceThrow(diceArray.length);
            }

        }, 4000);

    }

    /**
     * collects the dice to the diceArea
     */
    collect() {
        let count = 0;

        let diceArray = document.querySelectorAll("#diceArea > div[data-face='0']");
        for (let i = 0; i < self.dice.length; i++) {
            let result = self.dice[i].dice.getUpsideValue();
            let dice = diceArray[count];
            let rarity = "0";

            if (result === 20) rarity = "16";
            else if (result >= 15) rarity = "0";
            else if (result >= 13) rarity = "8";
            else if (result >= 9) rarity = "4";
            else rarity = "2";
            if (rarity !== "0") {
                dice.setAttribute("data-face", result);
                dice.setAttribute("data-rarity", rarity);
                let text = dice.getElementsByTagName("text")[0];
                text.innerHTML = result;
                count++;
            }
        }

        // clean all shapes from THREE
        let child;
        while (child = self.scene.getObjectByName("dice3D")) {
            self.removeObject(child);
        }

        self.renderer.renderLists.dispose();

        // clean all bodies from CANNON
        let bodies = self.world.bodies;
        for (let i = bodies.length - 1; i >= 0; i--) {
            let body = bodies[i];
            if (body.mass > 0) {
                self.world.removeBody(body);
            }
        }
        return count;
    }

    /**
     * reset the dice
     */
    resetDice() {
        let selection = document.getElementById("selection");
        let diceList = selection.getElementsByClassName("dice");
        for (let i = 0; i < diceList.length; i++) {
            let dice = diceList[i];
            dice.setAttribute("data-face", "20");
            dice.setAttribute("data-rarity", "16");
            let text = dice.getElementsByTagName("text")[0];
            text.innerHTML = "20";
        }
        selection = document.getElementById("diceArea");
        diceList = selection.getElementsByClassName("dice");
        for (let i = 0; i < diceList.length; i++) {
            let dice = diceList[i];
            dice.setAttribute("data-face", "0");
            dice.setAttribute("data-rarity", "0");
        }

        document.getElementById("rollDice").disabled = false;
        document.getElementById("resetDice").disabled = true;

        triggerUpdate();
    }

    /**
     * initialize scene, renderer, camera and world
     */
    initWebGL() {
        // SCENE
        self.scene = new THREE.Scene();
        // CAMERA
        const SCREEN_WIDTH = window.innerWidth;
        const SCREEN_HEIGHT = window.innerHeight;
        const VIEW_ANGLE = 45;
        const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
        const NEAR = 0.01, FAR = 20000;
        self.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        self.camera.position.set(0, 55, 2);
        self.camera.rotateX(-1.5);
        self.scene.add(self.camera);
        // RENDERER
        self.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
        self.renderer.setClearColor(0xffffff, 0);
        self.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        self.renderer.shadowMap.enabled = true;
        self.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        self.container = document.getElementById("canvas");
        self.container.appendChild(self.renderer.domElement);
        // EVENTS
        self.setupLights(self.scene);

        ////////////
        // CUSTOM //
        ////////////
        self.world = new CANNON.World();

        self.world.gravity.set(0, -9.82 * 20, 0);
        self.world.broadphase = new CANNON.NaiveBroadphase();
        self.world.solver.iterations = 16;

        DiceManager.setWorld(self.world);

        //Floor
        let floorBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
            material: DiceManager.floorBodyMaterial
        });
        floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        self.world.add(floorBody);

        //Walls
        self.makeWalls(ASPECT);


        requestAnimationFrame(self.animate);
    }

    /**
     * setup the lights for the scene
     * @param scene
     */
    setupLights(scene) {
        let ambient = new THREE.AmbientLight('#ffffff', 0.3);
        scene.add(ambient);

        let directionalLight = new THREE.DirectionalLight('#ffffff', 0.5);
        directionalLight.position.x = -1000;
        directionalLight.position.y = 1000;
        directionalLight.position.z = 1000;
        scene.add(directionalLight);

        let light = new THREE.SpotLight(0xefdfd5, 1.3);
        light.position.y = 100;
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.camera.near = 50;
        light.shadow.camera.far = 110;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        scene.add(light);

        scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);
    }

    /**
     * throws the dice
     * @param number  how many dice to throw
     */
    randomDiceThrow(number) {
        let colors = self.createColors();
        self.dice = [];
        for (let i = 0; i < number; i++) {
            let dice = new DiceD20({size: 1.5, backColor: colors});
            self.scene.add(dice.getObject());
            self.dice.push({
                "dice": dice,
                "value": self.getRandomInt(1, 21)
            });
        }

        const vAngularBase = 15;
        const vBase = 2.5;
        let diceValues = [];

        for (let i = 0; i < number; i++) {
            let yRand = Math.random() * 20;
            let shape = self.dice[i].dice;
            shape.resetBody();
            shape.getObject().position.x = -15 - (i % 3) * 1.5;
            shape.getObject().position.y = 2 + Math.floor(i / 3) * 1.5;
            shape.getObject().position.z = -15 + (i % 3) * 1.5;
            shape.getObject().quaternion.x = (Math.random() * 90 - 45) * Math.PI / 180;
            shape.getObject().quaternion.z = (Math.random() * 90 - 45) * Math.PI / 180;
            shape.updateBodyFromMesh();
            let rand = Math.random() * 5;
            shape.getObject().body.velocity.set(5 * vBase + rand, 8 * vBase + yRand, 3 * vBase + rand);
            shape.getObject().body.angularVelocity.set(
                vAngularBase * Math.random() - 10,
                vAngularBase * Math.random() - 10,
                vAngularBase * Math.random() - 10);

            diceValues.push(self.dice[i]);
        }

        DiceManager.prepareValues(diceValues);
    }

    /**
     * create the color array for the dice
     * @returns {[]}  array with 20 colors
     */
    createColors() {
        let colorArray = [];
        let specieKey = document.querySelector("input[name='species']:checked").value;
        const specie = getSpecie(specieKey);
        let index = 0;
        for (let i = 0; i < 20; i++) {
            if (i === 8 || i === 12 || i === 14) index++;
            if (i >= 14 && i <= 18) {
                colorArray.push("#ffffff");
            } else {
                colorArray.push(specie.rarityColors[index].substring(0, 7));
            }
        }

        return colorArray;
    }

    /**
     * removes an object from the scene
     * @param object
     * @returns {boolean}
     */
    removeObject(object) {
        if (!(object instanceof THREE.Object3D)) return false;
        // for better memory management and performance
        if (object.geometry) {
            object.geometry.dispose();
        }
        if (object.material) {
            if (object.material instanceof Array) {
                // for better memory management and performance
                object.material.forEach(material => material.dispose());
            } else {
                // for better memory management and performance
                object.material.dispose();
            }
        }
        if (object.parent) {
            object.parent.remove(object);
        }
        return true;
    }

    /**
     * animate the scene
     */
    animate() {
        self.render();
        self.update();

        requestAnimationFrame(self.animate);
    }

    /**
     * update the controls and physics
     */
    update() {
        self.world.step(1.0 / 60.0);

        for (let i in self.dice) {
            self.dice[i].dice.updateMeshFromBody();
        }

        //self.controls.update();
    }

    /**
     * renders the scene and camera
     */
    render() {
        self.renderer.render(self.scene, self.camera);
    }

    /**
     * get a random integer number
     * @param min  minimum (inclusive)
     * @param max  maximum (exclusive)
     * @returns {number}
     */
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
     * create walls for the dice to bounce off
     * @param ASPECT
     */
    makeWalls(ASPECT) {
        let barrier = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(1, 10, 50))
        });
        barrier.position.set(-12 * ASPECT, 0, 0);
        self.world.addBody(barrier);

        barrier = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(1, 10, 50))
        });
        barrier.position.set(12 * ASPECT, 0, 0);
        self.world.addBody(barrier);

        barrier = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(75, 50, 1))
        });
        barrier.position.set(0, 0, -15 * ASPECT);
        self.world.addBody(barrier);


        barrier = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(75, 50, 1))
        });
        barrier.position.set(0, 0, 15 * ASPECT);
        self.world.addBody(barrier);

    }
}