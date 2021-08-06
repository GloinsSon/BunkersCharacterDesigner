/**
 * reads the data from JSON and creates objects
 */
import {Specie} from "../model/Specie.js";
import {SubSpecie} from "../model/Subspecie.js";
import {Variant} from "../model/Variant.js";
import {Extra} from "../model/Extra.js";

const jsonFiles = [
    {file: "species.json", callback: setSpecies},

    {file: "cubs/humanoid.xml", callback: setHumanoid},
    {file: "cubs/subspecies.json", callback: setSubSpecies},
    {file: "cubs/extras.json", callback: setExtras},

    {file: "fins/humanoid.xml", callback: setHumanoid},
    {file: "fins/subspecies.json", callback: setSubSpecies},
    {file: "fins/extras.json", callback: setExtras},

    {file: "flappers/humanoid.xml", callback: setHumanoid},
    {file: "flappers/subspecies.json", callback: setSubSpecies},
    {file: "flappers/extras.json", callback: setExtras},

    {file: "floofs/humanoid.xml", callback: setHumanoid},
    {file: "floofs/subspecies.json", callback: setSubSpecies},
    {file: "floofs/extras.json", callback: setExtras},

    {file: "hoppers/humanoid.xml", callback: setHumanoid},
    {file: "hoppers/subspecies.json", callback: setSubSpecies},
    {file: "hoppers/extras.json", callback: setExtras},

    {file: "prancers/humanoid.xml", callback: setHumanoid},
    {file: "prancers/subspecies.json", callback: setSubSpecies},
    {file: "prancers/extras.json", callback: setExtras},

    {file: "smittens/humanoid.xml", callback: setHumanoid},
    {file: "smittens/subspecies.json", callback: setSubSpecies},
    {file: "smittens/extras.json", callback: setExtras}

]

/**
 * loads all the json data-files
 */
export default function loadData() {
    for (let i = 0; i < jsonFiles.length; i++) {
        //setTimeout(() => {
        loadJSON(jsonFiles[i].file, jsonFiles[i].callback);
        //}, i*100);
    }
}

/**
 * fetches a JSON file
 * @param file  path withing "/js/data" and filename
 * @param callback  the callback function for success
 * @param elementId  the id of a DOM element (optional)
 */
export function loadJSON(file, callback, elementId) {
    fetch("./js/data/" + file)
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
            } else {
                let parts = file.split(".", 2);
                if (parts[1] === "json")
                    response.json().then(callback);
                else {
                    response.text().then(
                        function (textData) {
                            if (elementId === undefined)
                                callback(textData);
                            else
                                callback(textData, elementId);
                        }
                    );
                }
            }
        });
}

/**
 * manage the loading progress
 * @param type
 * @returns {*}
 */
export function loadingProgress(type) {
    let progressBar = document.getElementById("progressBar");
    const valueMax = jsonFiles.length;
    if (type === "init") {
        Loading = valueMax;
        progressBar.setAttribute("aria-valuemax", valueMax.toString());
    }
    if (type === "decrease") {
        Loading--;
        if (Loading <= 0) {
            document.getElementById("progress").style.display = "none";
        }
    }
    let percent = Math.round((valueMax - Loading + 1) * 100 / valueMax);
    progressBar.setAttribute("aria-valuenow", (valueMax - Loading).toString());
    progressBar.innerText = "Loading " + percent + "% done";
    progressBar.style.width = percent + "%";

    return jsonFiles.length - Loading;
}

/**
 * gets one species
 * @param specieKey
 * @returns {*}
 */
export function getSpecie(specieKey) {
    return DataStore[specieKey];
}

/**
 * gets a list of all spiecies
 * @returns {*}
 */
export function getSpeciesList() {
    return DataStore;
}

/**
 * get one subspecie
 * @param specieKey
 * @param subspecieKey
 * @returns {*}
 */
export function getSubspecie(specieKey, subspecieKey) {
    let list = getSubspeciesList(specieKey);
    return list[subspecieKey];
}

/**
 * gets a list for all subspiecies for one spiecie
 * @param speciesKey
 * @returns {*|{}}
 */
export function getSubspeciesList(speciesKey) {
    return getSpecie(speciesKey).subspecies;
}

/**
 * get a variant for a subspecie
 * @param specieKey
 * @param subspecieKey
 * @param variantKey
 * @returns {*}
 */
export function getVariant(specieKey, subspecieKey, variantKey) {
    return getVariantList(specieKey, subspecieKey)[variantKey];
}

/**
 * gets a list of all variants for a subspecies
 * @param specieKey
 * @param subspiecieKey
 * @returns {*|{}}
 */
export function getVariantList(specieKey, subspiecieKey) {
    return getSubspeciesList(specieKey)[subspiecieKey].variants;
}

/**
 * gets one extra for a species
 * @param specieKey
 * @param extrasKey
 * @returns {*}
 */
export function getExtra(specieKey, extrasKey) {
    const extrasList = getExtrasList(specieKey);
    if (extrasList.hasOwnProperty(extrasKey))
        return getExtrasList(specieKey)[extrasKey];
    else
        return "";
}

/**
 * get a list of all extras for a specie
 * @param specieKey
 * @returns {*}
 */
export function getExtrasList(specieKey) {
    return getSpecie(specieKey).extras;
}

/**
 * gets one skin color
 * @param specieKey
 * @param subspecieKey
 * @param variantKey
 * @param type
 * @param colorKey
 * @returns {*}
 */
export function getColors(specieKey, subspecieKey, variantKey, type, colorKey) {
    let colors = getColorsList(specieKey, subspecieKey, variantKey, type);
    return colors[colorKey];
}

/**
 * get a list of all extras for a specie
 * @param specieKey
 * @param subspecieKey
 * @param variantKey
 * @param type
 * @returns {*}
 */
export function getColorsList(specieKey, subspecieKey, variantKey, type) {
    let variant = getVariant(specieKey, subspecieKey, variantKey);
    return variant[type];
}

/**
 * sets the vector data for the humanoid form
 * @param data
 */
function setHumanoid(data) {
    let lines = data.split(/\r?\n/);
    let specieKey = lines[0].substr(7, (lines[0].length - 9));

    (async () => {
        let exists = false;
        while (!exists) {
            if (DataStore.hasOwnProperty(specieKey)) {
                exists = true;
            }
            if (!exists)
                await new Promise(resolve => setTimeout(resolve, 100));
        }
        let species = getSpecie(specieKey);
        for (let i = 1; i < lines.length - 1; i++) {
            let line = lines[i].replace(/  +/g, ' ');
            species.humanoid.push(line);
        }
        loadingProgress("decrease");
    })();
}

/**
 * sets the species in DataStore
 * @param jsonData
 */
function setSpecies(jsonData) {
    let map = {};
    for (const [key, value] of Object.entries(jsonData)) {
        map[key] = new Specie(
            key,
            value.name,
            value.bgcolor,
            value.formBgColor,
            value.rarityColors,
            value.humanoid,
            value.logo
        );
    }
    DataStore = map;
    loadingProgress("decrease");
}

/**
 * sets the sub-species in the DataStore
 * @param jsonData
 */
function setSubSpecies(jsonData) {

    for (const [parentKey, child] of Object.entries(jsonData)) {
        let parent;
        (async () => {
            let exists = false;
            while (!exists) {
                if (DataStore.hasOwnProperty(parentKey)) {
                    parent = DataStore[parentKey];
                    exists = parent.hasOwnProperty("subspecies");
                }
                if (!exists)
                    await new Promise(resolve => setTimeout(resolve, 100));
            }

            let map = {};
            for (const [key, value] of Object.entries(child)) {
                let subspecie = new SubSpecie(
                    key,
                    value.name,
                    value.logo,
                    value.rarity
                );
                setVariants(value.variants, subspecie);
                map[key] = subspecie;
            }

            parent.subspecies = map;
            loadingProgress("decrease");
        })();
    }
}

/**
 * sets the color variants in the DataStore
 * @param variantList
 * @param parent
 */
function setVariants(variantList, parent) {
    let map = {};
    for (const [key, value] of Object.entries(variantList)) {
        map[key] = new Variant(
            key,
            key,
            value.logo,
            value.rarity,
            value.skins,
            value.ears,
            value.eyes
        );
    }
    parent.variants = map;
}

/**
 * sets the extra attributes
 * @param jsonData
 */
function setExtras(jsonData) {
    let species = jsonData.species;
    let parent;

    (async () => {
        let exists = false;
        while (!exists) {
            if (DataStore.hasOwnProperty(species)) {
                parent = DataStore[species];
                exists = parent.hasOwnProperty("extras");
            }
            if (!exists)
                await new Promise(resolve => setTimeout(resolve, 100));
        }
        for (const [extraKey, values] of Object.entries(jsonData)) {
            if (extraKey !== "species") {
                parent.extras[extraKey] = [];
                let array = [];
                for (let i = 0; i < values.length; i++) {
                    let extra = new Extra(
                        values[i].rarity,
                        values[i].elements
                    );
                    array.push(extra);
                }

                parent.extras[extraKey] = array;
            }

        }

        loadingProgress("decrease");
    })();
}