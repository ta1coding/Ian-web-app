// trafficcar.js
import * as THREE from 'three';

export default class TrafficCar {
    constructor(game) {
        this.game = game;
        this.mesh = this.createTrafficCar();
        this.lane = this.game.lanePositions[Math.floor(Math.random() * this.game.lanePositions.length)];
        this.mesh.position.set(
            this.lane,
            0.5,
            this.game.player.mesh.position.z + 100 + Math.random() * 5000
        );
        this.speed = 0.2 + Math.random() * 0.2; // Random speed between 0.2 and 0.4
        this.maxSpeed = this.speed;
        this.targetLane = this.lane;
        this.laneChangeCooldown = 0;
        this.turnSignal = null;
    }
    //creates a traffic car 
    createTrafficCar() {
        const carGroup = new THREE.Group();

        // Main body
        const bodyGeometry = new THREE.BoxGeometry(1.5, 0.5, 3);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
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

        return carGroup;
    }
    //holds various different functions related to the movement of the traffic car. Ensures traffic cars act as traffic cars by maintaning distance, switching lanes, and trying to not collide with the user. Also generates their speed
    update(deltaTime) {
        // Move away the player
        this.mesh.position.z += this.speed * deltaTime;

        // Collision avoidance with other traffic cars
        let carAhead = false;
        let minDistance = Infinity;

        this.game.trafficCars.forEach((otherCar) => {
            if (otherCar !== this) {
                const distanceZ = this.mesh.position.z - otherCar.mesh.position.z;
                const distanceX = Math.abs(otherCar.mesh.position.x - this.mesh.position.x);

                if (distanceX < 0.5 && distanceZ > 0 && distanceZ < 10) {
                    carAhead = true;
                    minDistance = Math.min(minDistance, distanceZ);
                }
            }
        });

        // Adjust speed based on distance to car ahead
        if (carAhead) {
            const deceleration = (10 - minDistance) * 0.05 * deltaTime;
            this.speed = Math.max(this.speed - deceleration, 0);
        } else {
            this.speed = Math.min(this.speed + 0.01 * deltaTime, this.maxSpeed);
        }

        // Lane changing logic (remains the same)
        if (this.laneChangeCooldown <= 0 && Math.random() < 0.0005) {
            // Decide to change lanes
            const currentLaneIndex = this.game.lanePositions.indexOf(this.lane);
            const possibleLanes = [];

            // Check lanes on both sides
            if (currentLaneIndex > 0) possibleLanes.push(currentLaneIndex - 1);
            if (currentLaneIndex < this.game.lanePositions.length - 1) possibleLanes.push(currentLaneIndex + 1);

            // Randomly pick a possible lane
            while (possibleLanes.length > 0) {
                const newLaneIndex = possibleLanes.splice(Math.floor(Math.random() * possibleLanes.length), 1)[0];
                const targetLane = this.game.lanePositions[newLaneIndex];

                // Check if lane is clear
                let laneClear = true;
                this.game.trafficCars.forEach((otherCar) => {
                    if (otherCar !== this) {
                        const distanceZ = Math.abs(otherCar.mesh.position.z - this.mesh.position.z);
                        const distanceX = Math.abs(otherCar.mesh.position.x - targetLane);
                        if (distanceX < 0.5 && distanceZ < 10) {
                            laneClear = false;
                        }
                    }
                });

                if (laneClear) {
                    this.targetLane = targetLane;
                    this.turnSignal = targetLane > this.lane ? 'right' : 'left';
                    this.laneChangeCooldown = 500;
                    break;
                }
            }
        }

        // Apply lane change
        if (this.lane !== this.targetLane) {
            const laneDiff = this.targetLane - this.lane;
            const shift = Math.sign(laneDiff) * 0.05 * deltaTime;
            this.mesh.position.x += shift;
            this.lane += shift;
            if (Math.abs(this.lane - this.targetLane) < 0.1) {
                this.lane = this.targetLane;
                this.mesh.position.x = this.targetLane;
                this.turnSignal = null;
            }
        } else {
            this.turnSignal = null;
        }

        // Update turn signals
        this.updateTurnSignals();

        // Reduce cooldown
        if (this.laneChangeCooldown > 0) {
            this.laneChangeCooldown -= deltaTime;
        }

        // Avoid collision with the player car
        const distanceToPlayer = this.mesh.position.distanceTo(this.game.player.mesh.position);
        if (this.mesh.position.z > this.game.player.mesh.position.z && distanceToPlayer < 10) {
            if (distanceToPlayer < 5) {
                this.speed = Math.max(this.speed - 0.05 * deltaTime, 0);
            } else {
                this.speed = Math.max(this.speed - 0.02 * deltaTime, 0.1);
            }
        } else {
            this.speed = Math.min(this.speed + 0.01 * deltaTime, this.maxSpeed);
        }

        // Reset position if behind player
        if (this.mesh.position.z < this.game.player.mesh.position.z - 200) {
            this.mesh.position.z = this.game.player.mesh.position.z + 500 + Math.random() * 1000;
            this.lane = this.game.lanePositions[Math.floor(Math.random() * this.game.lanePositions.length)];
            this.targetLane = this.lane;
            this.mesh.position.x = this.lane;
            this.speed = 0.2 + Math.random() * 0.2;
            this.maxSpeed = this.speed;
        }

        // Collision detection with player car
        if (
            Math.abs(this.game.player.mesh.position.x - this.mesh.position.x) < 1.2 &&
            Math.abs(this.game.player.mesh.position.z - this.mesh.position.z) < 4
        ) {
            this.game.gameOverHandler('You crashed into a car! Game Over!');
        }
    }
    // updates the turn signals on the traffic cars. 
    updateTurnSignals() {
        if (!this.turnSignal) {
            // Remove existing signals
            if (this.leftSignal) {
                this.mesh.remove(this.leftSignal);
                this.leftSignal = null;
            }
            if (this.rightSignal) {
                this.mesh.remove(this.rightSignal);
                this.rightSignal = null;
            }
            return;
        }

        const signalColor = 0xffff00; // Yellow color for turn signals
        const signalGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.1);
        const signalMaterial = new THREE.MeshBasicMaterial({ color: signalColor });

        if (this.turnSignal === 'left') {
            if (!this.leftSignal) {
                this.leftSignal = new THREE.Mesh(signalGeometry, signalMaterial);
                this.leftSignal.position.set(-0.8, 0.5, -1.5);
                this.mesh.add(this.leftSignal);
            }
        } else if (this.turnSignal === 'right') {
            if (!this.rightSignal) {
                this.rightSignal = new THREE.Mesh(signalGeometry, signalMaterial);
                this.rightSignal.position.set(0.8, 0.5, -1.5);
                this.mesh.add(this.rightSignal);
            }
        }
    }
}
