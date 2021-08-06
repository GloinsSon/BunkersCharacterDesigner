"use strict";

import {getColors, getColorsList, getSpecie} from "../data/DataHandler.js";
import {ViewController} from "../view/ViewController.js";

/**
 * controller for colors
 * @author Gimli GloinsSon
 */

export class ColorService {
    constructor() {

    }

    /**
     * shows the color options for a type
     * @param type
     */
    populateColors(type) {
        let viewController = new ViewController();
        const specie = document.querySelector("input[name='species']:checked").value;
        const colorsList = getColorsList(
            specie,
            document.querySelector("input[name='subspecies']:checked").value,
            document.querySelector("input[name='variant']:checked").value,
            type
        );

        let selection = "";
        const dice = document.getElementById("dice"+type).getAttribute("data-rarity");

        let count = colorsList.length;
        for (let i = 0; i < count; i++) {
            let color = colorsList[i]["color"];
            let hexCode = "#fefefe";
            if (Array.isArray(color)) {
                color = color[0];
            }
            if (typeof color === 'object' && color[0] !== null) {
                if (color.select !== null)
                    hexCode = color.select;
            } else
                hexCode = color;

            let disabled = "disabled";
            if (dice >= colorsList[i].rarity) disabled = "";

            selection += viewController.buildHeart(
                type,
                i,
                hexCode,
                colorsList[i].rarity,
                disabled
            );
        }
        document.getElementById(type).innerHTML = selection;
        document.querySelector("input[name='" + type + "']").checked = true;
    }

    /**
     * the user changed the color for skin, ears or eyes
     */
    changeColors() {
        let style = ".skins0 {fill:none; stroke:#000; stroke-width:2px;} " +
            ".skins1,.skins2,.skins3,.ears0,.ears1,.ears2,.ears3 {fill:none;}";
        let mask = "";
        let defs = "";
        let types = ["skins", "ears", "eyes"];
        for (const type in types) {
            let fieldId = types[type];
            let colorData = getColors(
                document.querySelector("input[name='species']:checked").value,
                document.querySelector("input[name='subspecies']:checked").value,
                document.querySelector("input[name='variant']:checked").value,
                fieldId,
                document.querySelector("input[name='" + fieldId + "']:checked").value
            );


            let colors = colorData["color"];
            if (!Array.isArray(colors)) {
                colors = [colors, "none", "none"];
            }

            let data = colors[0];
            if (data == null || typeof data !== "object") {
                style += this.colorValues(colors, fieldId);
            } else {
                let keys = Object.keys(data);
                for (let j = 0; j < keys.length; j++) {
                    if (keys[j] === "style") {
                        style += data.style;
                    } else if (keys[j] === "mask") {
                        mask += data.mask;
                    } else {
                        defs += data.defs;
                    }
                }
            }

        }
        let styles = "<style id='svgStyle'>" + style + "</style>";
        document.getElementById("svgDefs").innerHTML = styles + defs;
    }

    /**
     * get the colors from an array of hex values
     * @param colors
     * @param fieldId
     * @returns {string}
     */
    colorValues(colors, fieldId) {

        let style = "";
        for (let i = 0; i < 4; i++) {
            let data;
            if (i < colors.length) {
                data = colors[i];
            } else {
                data = "none";
            }
            style += "." + fieldId + i + "{fill: " + data + "} ";
        }
        return style;
    }
}