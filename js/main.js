/**
 * main script to start execution
 * @author Gimli GloinsSon
 */

let DataStore = {};  // main datastore
let Loading = 99;    // counter for loaded files

let controller;
let diceController;

/**
 * register listeners for all form elements
 */
document.addEventListener("DOMContentLoaded", () => {
    Promise.all(
        [
            import("./controller/Controller.js"),
            import("./data/DataHandler.js"),
            import("./view/DiceController.js")
        ]
    ).then(([
                Controller,
                DataHandler,
                DiceController

            ]) => {

        DataHandler.default();
        controller = new Controller.default;
        controller.init();

        diceController = new DiceController.default;
        diceController.init();
        diceController.generateDice();
        registerListeners();

    });
});



/**
 * register the event listeners
 */
function registerListeners() {
    document.getElementById("rollDice").addEventListener("click", diceController.roller);
    document.getElementById("resetDice").addEventListener("click", diceController.resetDice);

    document.getElementById("selection").addEventListener("change", controller.changeSettings);
    //document.getElementById("random").addEventListener("click", randomBunker);  TODO
    document.getElementById("btnDownload").addEventListener("click", createDownload);

    const diceList = document.getElementsByClassName("dice");
    for (let dice of diceList) {
        dice.addEventListener("dragstart", controller.dragDice);
        dice.addEventListener("drop", controller.dropDice);
        dice.addEventListener("dragover", controller.allowDrop);
    }
}

function triggerUpdate() {
    let element = document.getElementsByName("species")[0];
    element.dispatchEvent(
        new Event("change", {"bubbles": true})
    );
}

/**
 * generate a random bunker
 */
function randomBunker() {
    import("./controller/Controller.js")
        .then((module) => {
            let controller = new module.default;
            controller.randomize();
        });
}

/**
 * creates the data string to download the bunkers
 */
function createDownload() {
    let link = document.getElementById("download");
    let svg = document.getElementById("modelSVG");
    let serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    link.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    document.getElementById("link").hidden = false;

}

function snooze(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}