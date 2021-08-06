"use strict";

/**
 * a species
 */

export class Specie {
    /**
     * constructor
     * @param key
     * @param name
     * @param bgcolor
     * @param formBgColor  background color for the form
     * @param rarityColors    colors for the rarity
     * @param humanoid
     * @param logo
     */
    constructor(key, name, bgcolor, formBgColor, rarityColors, humanoid, logo) {
        this.key = key;
        this.name = name;
        this.bgcolor = bgcolor;
        this.formBgColor = formBgColor;
        this.rarityColors = rarityColors;
        this.humanoid = humanoid;
        this.logo = logo;
        this.extras = {};
        this.subspecies = {};
    }

}