// introanimation.js
import gsap from 'gsap';

export default class IntroAnimation {
    constructor(game) {
        this.game = game;
        this.camera = this.game.camera;
        this.playerCar = this.game.player.mesh;
        this.copCar = this.game.copCar.mesh;
        this.subtitleElement = this.game.subtitleElement;
    }
    //this does the intro animation. This animation is just a way for the user to see the cop car and their car in action together before they have to start racing it. 
    start() {
        // Initial camera position (behind the player)
        this.camera.position.set(this.playerCar.position.x, 5, this.playerCar.position.z - 10);
        this.camera.lookAt(this.playerCar.position);

        // Create a timeline for the intro animation
        const introTimeline = gsap.timeline({
            onComplete: () => {
                // Start the game loop after the intro
                this.game.animate();
            }
        });

        // Flip around to show the cop car
        introTimeline.to(this.camera.position, {
            x: this.copCar.position.x,
            y: 5,
            z: this.copCar.position.z - 5,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                this.camera.lookAt(this.copCar.position);
            },
            onStart: () => {
                if (this.game.settingsMenu.subtitlesEnabled) {
                    this.subtitleElement.textContent = "Officer: We've got you now!";
                    this.subtitleElement.style.opacity = 1;
                }
            },
            onComplete: () => {
                // Start siren flashing
                this.game.copCar.startSiren();
            }
        });

        // Hold on the cop car for a moment
        introTimeline.to({}, {
            duration: 1,
            onStart: () => {
                if (this.game.settingsMenu.subtitlesEnabled) {
                    this.subtitleElement.textContent = "You: Not if I can help it!";
                }
            }
        });

        // Cop car starts to move towards the player
        introTimeline.to(this.copCar.position, {
            z: this.copCar.position.z + 5, // Move forward a bit
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                this.camera.lookAt(this.copCar.position);
            },
            onStart: () => {
                if (this.game.settingsMenu.subtitlesEnabled) {
                    this.subtitleElement.textContent = "";
                    this.subtitleElement.style.opacity = 0;
                }
            }
        }, "-=1"); // Overlap with previous hold

        // Pan back to the player car
        introTimeline.to(this.camera.position, {
            x: this.playerCar.position.x,
            y: 5,
            z: this.playerCar.position.z - 10,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                this.camera.lookAt(this.playerCar.position);
            },
            onComplete: () => {
                // Stop siren flashing
                this.game.copCar.stopSiren();
                // Hide subtitle if subtitles are disabled
                if (!this.game.settingsMenu.subtitlesEnabled) {
                    this.subtitleElement.style.opacity = 0;
                }
                // Start speech recognition if subtitles are enabled
                if (this.game.settingsMenu.subtitlesEnabled) {
                    this.game.speechRecognitionHandler.start();
                }
            }
        });

        // Start rendering during the intro
        this.renderIntro();
    }
    //starts the intro sequence. 
    renderIntro() {
        if (this.game.gameOver) return;
        this.game.renderer.render(this.game.scene, this.camera);
        requestAnimationFrame(() => this.renderIntro());
    }
}
