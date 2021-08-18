"use strict";

import {SpecieService} from "./SpecieService.js";
import {ColorService} from "./ColorService.js";
import {ExtrasController} from "./ExtrasController.js";
import {getSpeciesList, loadingProgress} from "../data/DataHandler.js";

/**
 * main controller
 * @author Gimli GloinsSon
 */
export default class Controller {
    constructor() {
        loadingProgress("init");
    }

    /**
     * initialize settings
     */
    init() {
        let speciesService = new SpecieService();
        speciesService.populateSpecies();
        document.getElementById("selection").className = "form-horizontal";

        setTimeout(() => {
            calcRarity();
        }, 2000);

    }

    /**
     * user changed a value in settings
     */
    changeSettings(element) {
        document.getElementById("link").hidden = true;
        let fieldName = element.target.name;
        if (fieldName === "species") {
            let speciesService = new SpecieService();
            speciesService.changeSpecies();
            let extrasController = new ExtrasController();
            extrasController.populateExtras();
        } else if (fieldName === "variant") {
            let speciesService = new SpecieService();
            speciesService.changeVariant();
        } else if (fieldName === "skins" ||
            fieldName === "ears" ||
            fieldName === "eyes") {
            let colorService = new ColorService();
            colorService.changeColors(fieldName);
        } else if (fieldName.startsWith("misc")) {
            let index = fieldName.substr(4, 1);
            let extrasController = new ExtrasController();
            extrasController.changeExtra(index);
        }

        calcRarity();
    }

    /**
     * listener for a dice being dragged
     * @param event
     */
    dragDice(event) {
        event.dataTransfer.setData("text", event.currentTarget.id);
    }

    /**
     * listener for a dice being dropped
     * @param event
     */
    dropDice(event) {
        event.preventDefault();
        const sourceId = event.dataTransfer.getData("text");
        const sourceElement = document.getElementById(sourceId);

        const targetId = event.currentTarget.id;
        const targetElement = document.getElementById(targetId);

        const tempFace = sourceElement.getAttribute("data-face");
        sourceElement.setAttribute("data-face", targetElement.getAttribute("data-face"));
        sourceElement.getElementsByTagName("text")[0].innerHTML = targetElement.getAttribute("data-face");
        targetElement.setAttribute("data-face", tempFace);
        targetElement.getElementsByTagName("text")[0].innerHTML = tempFace;

        const tempRarity = sourceElement.getAttribute("data-rarity");
        sourceElement.setAttribute("data-rarity", targetElement.getAttribute("data-rarity"));
        targetElement.setAttribute("data-rarity", tempRarity);

        triggerUpdate();
    }

    /**
     * listener for a dice being drag over
     * @param event
     */
    allowDrop(event) {
        event.preventDefault();
    }


    /**
     * shows a randomized bunker
     */
    randomize() {
        let speciesService = new SpecieService();

        // choose a species
        let speciesKeys = Object.keys(getSpeciesList());
        let specieId = this.getRandomInt(0, speciesKeys.length);
        let specieKey = speciesKeys[specieId];
        document.querySelector("input[value='" + specieKey + "']").checked = true;
        speciesService.changeSpecies();

        // choose a variant
        let variantKey = specieKey[specieId];
        document.querySelector("input[value='" + variantKey + "']").checked = true;
        document.querySelector("input[name='variant']")
            .dispatchEvent(new Event("change", {bubbles: true}));

        // choose colors
        const colorArray = ["skins", "ears", "eyes"];
        for (const fieldName of colorArray) {
            let count = document.querySelectorAll("input[name='" + fieldName + "']").length;
            let randomVal = this.getRandomInt(0, count);
            document.getElementById(fieldName + randomVal).checked = true;
            document.getElementById(fieldName + randomVal).dispatchEvent(new Event("change", {bubbles: true}));
        }

        // choose extras
        const fieldArray = ["misc0", "misc1", "misc2"];
        for (const fieldName of fieldArray) {
            let elements = document.querySelectorAll("input[name='" + fieldName + "']");
            const count = elements.length;
            if (count > 0) {
                let randomVal = this.getRandomInt(0, count);
                elements[randomVal].checked = true;
                elements[randomVal].dispatchEvent(new Event("change", {bubbles: true}));
            }
        }
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
}

function calcRarity() {
    const rarityElements = document.querySelectorAll("[data-count='true']");

    let total = 0;
    for (let element of rarityElements) {
        let selected = element.querySelector(":checked");
        if (selected !== null) {

            let rarity = parseInt(selected.getAttribute("data-rarity"));
            total += rarity;
        }
    }
    document.getElementById("rarityTotal").innerText = "Rarity: " + total;
}