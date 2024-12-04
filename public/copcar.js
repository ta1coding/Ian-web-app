// copcar.js
import * as THREE from 'three';

export default class CopCar {
    constructor(game) {
        this.game = game;
        this.mesh = this.createCopCar();
        this.mesh.position.set(0, 0.5, -15);
        this.copMaxSpeed = this.game.copMaxSpeed;
        this.copAcceleration = this.game.copAcceleration;
        this.copCurrentSpeed = 0;
        this.sirenOn = false;
        this.sirenInterval = null;
    }
    // creates the cop car on the map, including it's body and it's position on the mpal. 
    createCopCar() {
        const carGroup = new THREE.Group();

        // Main body
        const bodyGeometry = new THREE.BoxGeometry(1.5, 0.5, 3);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        carGroup.add(body);

        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        const wheels = [];
        for (let i = 0; i < 4; i++) {
            wheels[i] = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheels[i].rotation.z = Math.PI / 2;
        }
        wheels[0].position.set(-0.7, 0.3, 1.3); // Front-left
        wheels[1].position.set(0.7, 0.3, 1.3); // Front-right
        wheels[2].position.set(-0.7, 0.3, -1.3); // Back-left
        wheels[3].position.set(0.7, 0.3, -1.3); // Back-right

        wheels.forEach((wheel) => carGroup.add(wheel));

        // Siren
        this.siren = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.2, 0.2),
            new THREE.MeshBasicMaterial({ color: 0x000000 })
        );
        this.siren.position.set(0, 1, 0);
        carGroup.add(this.siren);

        return carGroup;
    }
    // accelerates cop car and moves cop car towards the player to try and catch te player. 
    update(deltaTime) {
        // Increase cop car speed gradually up to its max speed
        if (this.copCurrentSpeed < this.copMaxSpeed) {
            this.copCurrentSpeed += this.copAcceleration;
        } else {
            this.copCurrentSpeed = this.copMaxSpeed;
        }

        // Move the cop car towards the player
        const copDirection = new THREE.Vector3();
        copDirection.subVectors(this.game.player.mesh.position, this.mesh.position).normalize();
        this.mesh.position.addScaledVector(copDirection, this.copCurrentSpeed);

        // Collision detection with player
        const distanceToPlayer = this.mesh.position.distanceTo(this.game.player.mesh.position);
        if (distanceToPlayer < 2) {
            this.game.gameOverHandler('You were caught by the cops! Game Over!');
        }
    }
    //starts it's siren
    startSiren() {
        this.sirenInterval = setInterval(() => this.toggleSiren(), 200);
    }
    //stops the siren
    stopSiren() {
        clearInterval(this.sirenInterval);
        this.siren.material.color.set(0x000000);
    }
    //switches the color of the siren when the siren is on. 
    toggleSiren() {
        this.sirenOn = !this.sirenOn;
        this.siren.material.color.set(this.sirenOn ? 0xff0000 : 0x000000);
    }
}
