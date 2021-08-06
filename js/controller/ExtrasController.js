"use strict";

import {getExtra, getExtrasList, getSpecie, loadJSON} from "../data/DataHandler.js";
import {ViewController} from "../view/ViewController.js";

/**
 * controller for the extra attributes
 * @author Gimli GloinsSon
 */
export class ExtrasController {
    constructor() {
    };

    /**
     * show the input fields for extras
     */
    populateExtras() {
        let specieKey = document.querySelector("input[name='species']:checked").value;
        const countExtras = document.querySelectorAll("[id^='extraL']").length;
        for (let i = 0; i < countExtras; i++) {
            document.getElementById("extra" + i).style.display = "none";
            document.getElementById("extraL" + i).style.display = "none";
            document.getElementById("extraD" + i).style.display = "none";
        }

        (async () => {
            let exists = false;
            while (!exists) {
                if (DataStore.hasOwnProperty(specieKey) &&
                    Object.keys(DataStore[specieKey].extras).length !== 0) {
                    exists = Object.keys(DataStore[specieKey].extras).length !== 0;
                }

                if (!exists)
                    await new Promise(resolve => setTimeout(resolve, 100));
            }
            const extrasList = getExtrasList(document.querySelector("input[name='species']:checked").value);
            const viewController = new ViewController();

            let index = 0;

            for (const [extraKey, extra] of Object.entries(extrasList)) {
                let selection = "";
                document.getElementById("extraL" + index).innerText = extraKey;

                const dice = document.getElementById("extraD" + index).getAttribute("data-rarity");
                for (let i = 0; i < extra.length; i++) {

                    let disabled = "disabled";
                    if (dice >= extra[i].rarity) disabled = "";
                    selection += viewController.buildExtra(
                        "misc" + index,
                        specieKey,
                        i,
                        extra[i].elements[0].file,
                        extra[i].rarity,
                        disabled
                    );

                }
                let fieldId = "extra" + index;
                document.getElementById(fieldId).innerHTML = selection;
                document.querySelector("input[name='misc" + index + "']").checked = true;
                document.getElementById("extra" + index).style.display = "block";
                document.getElementById("extraL" + index).style.display = "block";
                document.getElementById("extraD" + index).style.display = "block";

                this.changeExtra(index);
                index++;
            }

        })();
    }

    /**
     * the user changed an extra
     * @param index  the index of the changed extra
     */
    changeExtra(index) {
        const species = document.querySelector("input[name='species']:checked").value;
        const extraLabel = document.getElementById("extraL" + index);
        const extraValue = document.querySelector("input[name='misc" + index + "']:checked").value;
        const extras = getExtra(
            species,
            extraLabel.innerText
        )[extraValue];

        if (extras) {
            loadJSON("./" + species + "/" + extras.elements[0].file, showExtra, extras);
        }

        /**
         * show the graphics for an extra element
         * @param svgElements
         * @param extras
         */
        function showExtra(svgData, extras) {
            let parser = new DOMParser();
            let svgDoc = parser.parseFromString(svgData, "image/svg+xml");
            const svgMisc = svgDoc.firstChild;

            let viewBox = svgMisc.getAttribute("viewBox").split(" ");

            let groupId = extraLabel.innerText;
            let svgGroup = document.getElementById(groupId);

            if (svgGroup !== null) {
                svgGroup.innerHTML = '';
                let elements = extras.elements;

                if (extras.rarity != 0)
                for (let i = 0; i < elements.length; i++) {
                    let svgElement = svgMisc.cloneNode(true);
                    svgElement.setAttribute("width", viewBox[2]);
                    svgElement.setAttribute("height", viewBox[3]);
                    let child = svgElement.getElementsByTagName("g")[0];
                    child.setAttribute("transform", elements[i].transform)
                    svgGroup.appendChild(svgElement);
                }
            }

        }
    }
}