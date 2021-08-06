"use strict";

import {
    getSpecie,
    getSpeciesList,
    getSubspeciesList,
    getVariantList
} from "../data/DataHandler.js";
import {ViewController} from "../view/ViewController.js";
import {ColorService} from "./ColorService.js";
import {ExtrasController} from "./ExtrasController.js";

import ("../data/DataHandler.js");

/**
 * controller for species and subspieces
 * @author Gimli GloinsSon
 */


export class SpecieService {
    constructor() {
    }

    /**
     * add the species to the selection
     */
    populateSpecies() {
        (async () => {
            let exists = false;
            while (!exists) {
                exists = Object.keys(DataStore).length !== 0;
                if (!exists)
                    await new Promise(resolve => setTimeout(resolve, 100));
            }
            const viewController = new ViewController();
            const speciesList = getSpeciesList();

            const speciesLogos = document.getElementById("species");
            speciesLogos.innerText = null;
            for (const [speciesKey, specie] of Object.entries(speciesList)) {
                let logo = viewController.buildLogo(
                    "species",
                    speciesKey,
                    speciesKey,
                    specie.logo,
                    0,
                    "");
                speciesLogos.innerHTML += logo;
            }

            let species = document.querySelector("input[name='species']");
            species.checked = true;
            this.changeSpecies();
        })();

    }

    /**
     * add the subspiecies to the selection
     * @param specieKey
     */
    populateSubSpecies(specieKey) {
        (async () => {
            let exists = false;
            while (!exists) {
                exists = DataStore.hasOwnProperty(specieKey) &&
                    Object.keys(DataStore[specieKey].subspecies).length !== 0;
                if (!exists)
                    await new Promise(resolve => setTimeout(resolve, 100));
            }
            const viewController = new ViewController();
            const subspeciesList = getSubspeciesList(specieKey);
            const subSpiecesLogos = document.getElementById("subspecies");
            const dice = document.getElementById("diceSubspecies").getAttribute("data-rarity");
            subSpiecesLogos.innerText = null;

            for (const [key, subspecie] of Object.entries(subspeciesList)) {
                let disabled = "disabled";
                if (dice >= subspecie.rarity) disabled = "";
                let logo = viewController.buildLogo(
                    "subspecies",
                    key,
                    specieKey,
                    subspecie.logo,
                    subspecie.rarity,
                    disabled
                );
                subSpiecesLogos.innerHTML += logo;
            }

            let subspecies = document.querySelector("input[name='subspecies']");
            subspecies.checked = true;
            this.changeSubSpecies();
        })();
    }

    /**
     * add variants to the selection
     * @param specieKey
     * @param subspecieKey
     */
    populateVariants(specieKey, subspecieKey) {
        (async () => {
            let exists = false;
            while (!exists) {
                if (DataStore.hasOwnProperty(specieKey) &&
                    Object.keys(DataStore[specieKey].subspecies).length !== 0 &&
                    DataStore[specieKey].subspecies.hasOwnProperty(subspecieKey)) {

                    exists = Object.keys(DataStore[specieKey].subspecies[subspecieKey]).length !== 0;
                }

                if (!exists)
                    await new Promise(resolve => setTimeout(resolve, 100));
            }
            const viewController = new ViewController();
            const variantList = getVariantList(specieKey, subspecieKey);
            const variantLogos = document.getElementById("variants");
            const dice = document.getElementById("diceSubspecies").getAttribute("data-rarity");

            variantLogos.innerText = null;
            for (const [variantKey, variant] of Object.entries(variantList)) {
                let disabled = "disabled";
                if (dice >= variant.rarity) disabled = "";

                let logo = viewController.buildLogo(
                    "variant",
                    variantKey,
                    specieKey,
                    variant.logo,
                    variant.rarity,
                    disabled);
                variantLogos.innerHTML += logo;
            }

            let variants = document.querySelector("input[name='variant']");
            variants.checked = true;
            this.changeVariant();
        })();
    }

    /**
     * the user changed the specie
     */
    changeSpecies() {
        let specieKey = document.querySelector("input[name='species']:checked").value;
        const specie = getSpecie(specieKey);

        (async () => {
            let exists = false;
            while (!exists) {
                exists = DataStore[specieKey].humanoid.length !== 0;
                if (!exists)
                    await new Promise(resolve => setTimeout(resolve, 100));
            }
            let svgHuman = "";
            for (let i = 0; i < specie.humanoid.length; i++) {
                svgHuman += specie.humanoid[i];
            }
            document.getElementById("humanoid").innerHTML = svgHuman;
            const root = document.documentElement;
            root.style.setProperty("--bgColor", specie.bgcolor);
            root.style.setProperty("--formBgColor", "#fefefe80"); // specie.formBgColor);
            root.style.setProperty("--colorCommon", specie.rarityColors[0]);
            root.style.setProperty("--colorUncommon", specie.rarityColors[1]);
            root.style.setProperty("--colorRare", specie.rarityColors[2]);
            root.style.setProperty("--colorMythical", specie.rarityColors[3]);

            this.populateSubSpecies(specieKey);

            let extrasController = new ExtrasController();
            extrasController.populateExtras();
        })();
    }

    /**
     * the user changed the subSpecies
     */
    changeSubSpecies() {
        this.populateVariants(
            document.querySelector("input[name='species']:checked").value,
            document.querySelector("input[name='subspecies']:checked").value
        );
    }

    /**
     * the user changed the variant
     */
    changeVariant() {
        let colorService = new ColorService();
        colorService.populateColors("skins");
        colorService.populateColors("eyes");
        colorService.populateColors("ears");

        colorService.changeColors();
    }
}