// inputhandler.js
export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.game.keys = {}; // Initialize the keys object in the game instance
        this.init();
    }
    //determines when a key is pressed and when a key is no longer being pressed. This allows us to understand in real time what keys are being pressed and when. 
    init() {
        document.addEventListener('keydown', (event) => {
            this.game.keys[event.key] = true;
        });
        document.addEventListener('keyup', (event) => {
            this.game.keys[event.key] = false;
        });
    }
}
