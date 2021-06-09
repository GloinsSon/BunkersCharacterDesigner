"use strict";

/**
 * controller for the ui
 * @author Gimli GloinsSon
 */

export class ViewController {
    constructor() {
    }

    /**
     * builds the heart shaped radio buttons
     * @param type  the type (skins, ears, eyes)
     * @param index the position index
     * @param color the color to fill the heart
     * @returns {string}  html code
     */
    buildHeart(type, index, color) {
        let template =
            "<label for='{type}{index}'>" +
            "    <input type='radio' id='{type}{index}' name='{type}' value='{index}'/>" +
            "    <svg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='-1 -1 8 8'>" +
            "        <g>" +
            "          <path d='M2.79,5.14a7.46,7.46,0,0,0-.72-.63,15.19,15.19,0,0,1-1.23-1A2.33,2.33,0,0,1,0,1.69,1.4,1.4,0,0,1,.13,1,1.67,1.67,0,0,1,.88.17,1.23,1.23,0,0,1,1.61,0a1.13,1.13,0,0,1,.72.18A1.46,1.46,0,0,1,3,.91l0,.15.1-.2A1.55,1.55,0,0,1,5.9.88,2.52,2.52,0,0,1,6,2.49a3.8,3.8,0,0,1-1.56,1.7A9,9,0,0,0,3,5.4C3,5.51,3,5.42,2.79,5.14Z'\n" +
            "                style='fill:{color}'/>" +
            "        </g>" +
            "    </svg>" +
            "  </label>";

        let replace = {
            "{type}": type,
            "{index}": index,
            "{color}": color
        };

        let html = multiReplace(template, replace);
        return html;
    }

    /**
     * builds the logos for the species / subspecies / variants
     * @param type
     * @param value
     * @param folder
     * @param image
     * @returns {string}
     */
    buildLogo(type, value, folder, image) {
        const template =
            "<label>" +
            "  <input type='radio' name='{type}' value='{value}' />" +
            "  <figure>" +
            "    <img src='./img/{folder}/{image}' title='{value}' alt='{value}'/>" +
            "    <figcaption>{value}</figcaption>" +
            " </figure>" +
            "</label>";
        let replace = {
            "{type}": type,
            "{value}": value,
            "{folder}": folder,
            "{image}": image
}
        let html = multiReplace(template, replace);
        return html;
    }
}

/**
 * replace strings based on key/value pairs
 * @param template
 * @param replace
 * @returns {string}
 */
function multiReplace(template, replace) {
    let output = template;
    for (const [key, value] of Object.entries(replace)) {
        output = output.replaceAll(key, value);
    }
    return output;
}