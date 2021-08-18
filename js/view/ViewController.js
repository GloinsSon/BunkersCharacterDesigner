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
     * @param rarity the rarity of the color
     * @param disabled "disabled" or ""
     * @returns {string}  html code
     */
    buildHeart(type, index, color, rarity, disabled) {
        let template =
            "<label for='{type}{index}'>" +
            "    <input type='radio' id='{type}{index}' name='{type}' value='{index}' data-rarity='{rarity}' {disabled} />" +
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
            "{color}": color,
            "{rarity}": rarity,
            "{disabled}": disabled
        };

        return this.multiReplace(template, replace);
        ;
    }

    /**
     * builds the logos for the species / subspecies / variants
     * @param type
     * @param name
     * @param isSub  is this a subspecies
     * @param folder
     * @param image
     * @param rarity   the value for the rarity
     * @param disabled  "disabled" or ""
     * @returns {string}
     */
    buildLogo(type, name, isSub, folder, image, rarity, disabled) {
        const template =
            "<label>" +
            "  <input type='radio' name='{type}' value='{name}' data-rarity='{rarity}' {disabled} />" +
            "  <figure>" +
            "    <img src='./img/{folder}/{image}' title='{name}' alt='{name}' draggable='false'/>" +
            "    <figcaption class='{className}'>{name}</figcaption>" +
            " </figure>" +
            "</label>";

        let className = "";
        if (isSub) className = "bold";
        let replace = {
            "{type}": type,
            "{name}": name,
            "{className}": className,
            "{folder}": folder,
            "{image}": image,
            "{rarity}": rarity,
            "{disabled}": disabled
        }
        return this.multiReplace(template, replace);
    }


    /**
     * builds a selection for misc. extras
     * @param name
     * @param species
     * @param value
     * @param filename
     * @param rarity  the rarity of the extra
     * @param disabled  "disabled" or ""
     * @returns {string}
     */
    buildExtra(name, species, value, filename, rarity, disabled) {
        const template =
            "<label>" +
            "  <input type='radio' name='{name}' value='{value}' data-rarity='{rarity}' {disabled} />" +
            "  <img src='./js/data/{species}/{filename}' width='50' height='50' alt='extra' draggable='false'/>" +
            "</label>";

        let replace = {
            "{name}": name,
            "{species}": species,
            "{value}": value,
            "{filename}": filename,
            "{rarity}": rarity,
            "{disabled}": disabled
        };
        return this.multiReplace(template, replace);
    }

    buildDice(id, value, rarity) {

        const templateStart = "<div id='{id}' class='dice diceTarget' draggable='true' data-face='{value}' data-rarity='{rarity}'>";
        const templateFig = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 67 75.87'>" +
            "    <g>" +
            "        <path d='M.5,19.18,33.5.43l33,18.75v37.5l-33,18.75L.5,56.68Z'/>" +
            "        <path d='M33.5.43.5,56.68h66Z'/>" +
            "        <path d='M17,28.56.5,19.18'/>" +
            "        <path d='M50,28.56l16.5-9.38'/>" +
            "        <path d='M33.5,56.68V75.43'/>" +
            "        <path d='M17,28.56H50L33.5,56.68Z'/>" +
            "        <text transform='translate(26 42.5)' "+
            "        style='fill:#000; font-size:16px;font-family:MyriadPro-Regular, Myriad Pro'>{value}</text>" +
            "    </g>" +
            "</svg>";
        const replace = {
            "{id}": id,
            "{value}": value,
            "{rarity}": rarity
        };
        let html = this.multiReplace(templateStart, replace);
        html += this.multiReplace(templateFig, {"{value}":value});

        html += "</div>";
        return html;
    }

    /**
     * replace strings based on key/value pairs
     * @param template
     * @param replace
     * @returns {string}
     */
    multiReplace(template, replace) {
        let output = template;
        for (const [key, value] of Object.entries(replace)) {
            output = output.replaceAll(key, value);
        }
        return output;
    }
}

