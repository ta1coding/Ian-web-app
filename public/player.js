// player.js
import * as THREE from 'three';

export default class Player {
    constructor(game, model) {
        this.game = game;
        this.mesh = model;

        // Adjust scale and position
        this.mesh.scale.set(0.02, 0.02, 0.02);
        this.mesh.position.set(0, 0.5, 0);

        // Variables for movement and rotation
        this.currentRotationAngle = 0;
        this.maxRotationAngle = this.game.maxRotationAngle;
        this.rotationSpeed = this.game.rotationSpeed;
        this.playerSpeed = this.game.playerSpeed;
        this.maxSpeed = this.game.maxSpeed;
        this.acceleration = this.game.acceleration;
        this.deceleration = this.game.deceleration;

        // Start handling input
        this.handleInput();
    }
    // handles acceleration based on forward and backward key pressed. Updates the user's position on the road as well. 
    update(deltaTime) {
        // Existing movement and speed logic
        if (this.game.keys['ArrowUp']) {
            this.playerSpeed = Math.min(this.playerSpeed + this.acceleration, this.maxSpeed);
        } else if (this.game.keys['ArrowDown']) {
            this.playerSpeed = Math.max(this.playerSpeed - this.acceleration, -this.maxSpeed / 2);
        } else {
            if (this.playerSpeed > 0) {
                this.playerSpeed = Math.max(this.playerSpeed - this.deceleration, 0);
            } else if (this.playerSpeed < 0) {
                this.playerSpeed = Math.min(this.playerSpeed + this.deceleration, 0);
            }
        }

        // Update player car position
        this.mesh.position.z += this.playerSpeed;

        // Enforce road boundaries
        if (this.mesh.position.x < -this.game.roadWidth / 2 + 0.75)
            this.mesh.position.x = -this.game.roadWidth / 2 + 0.75;
        if (this.mesh.position.x > this.game.roadWidth / 2 - 0.75)
            this.mesh.position.x = this.game.roadWidth / 2 - 0.75;
    }
    // handles left and right movement.
    handleInput() {
        // Left movement
        if (this.game.keys['ArrowLeft']) {
            this.mesh.position.x += 0.2; // Move left

            // Rotation mechanics
            this.currentRotationAngle = Math.min(
                this.currentRotationAngle + this.rotationSpeed,
                this.maxRotationAngle
            );
            this.mesh.rotation.y = this.currentRotationAngle;
        }
        // Right movement
        else if (this.game.keys['ArrowRight']) {
            this.mesh.position.x -= 0.2; // Move right

            // Rotation mechanics
            this.currentRotationAngle = Math.max(
                this.currentRotationAngle - this.rotationSpeed,
                -this.maxRotationAngle
            );
            this.mesh.rotation.y = this.currentRotationAngle;
        }
        // Reset rotation when no movement
        else {
            if (this.currentRotationAngle > 0) {
                this.currentRotationAngle = Math.max(
                    this.currentRotationAngle - this.rotationSpeed,
                    0
                );
            } else if (this.currentRotationAngle < 0) {
                this.currentRotationAngle = Math.min(
                    this.currentRotationAngle + this.rotationSpeed,
                    0
                );
            }
            this.mesh.rotation.y = this.currentRotationAngle;
        }

        // Continuously handle input
        setTimeout(() => this.handleInput(), 16);
    }
}
