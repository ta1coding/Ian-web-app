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
// game.js
import * as THREE from 'three';
import Player from './player.js';
import CopCar from './copcar.js';
import TrafficCar from './trafficcar.js';
import Road from './road.js';
import InputHandler from './inputhandler.js';
import SpeechRecognitionHandler from './speechrecognition.js';
import SettingsMenu from './settingsmenu.js';
import IntroAnimation from './introanimation.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import gsap from 'gsap';

export default class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.copCar = null;
        this.trafficCars = [];
        this.trees = [];
        this.clouds = [];
        this.smokeParticles = [];
        this.score = 0;
        this.gameOver = false;
        this.playerSpeed = 0;
        this.maxSpeed = 0.6;
        this.acceleration = 0.01;
        this.deceleration = 0.02;
        this.copMaxSpeed = 0.5;
        this.copAcceleration = 0.005;
        this.copCurrentSpeed = 0;
        this.currentRotationAngle = 0;
        this.maxRotationAngle = Math.PI / 8;
        this.rotationSpeed = 0.05;
        this.lanePositions = [-3.75, -1.25, 1.25, 3.75];
        this.roadWidth = 10;
        this.roadLength = 20000;
        this.keys = {};
        this.smokeTexture = null;
        this.subtitlesEnabled = true;
        this.subtitleElement = document.getElementById('subtitle');
        this.scoreboard = document.getElementById('scoreboard');
        this.loadingScreen = document.getElementById('loading-screen');
        this.mainMenu = document.getElementById('main-menu');
        this.startButton = document.getElementById('start-button');
        this.modelLoaded = false;
        this.gameStarted = false;
        this.sirenInterval = null;
        this.sirenOn = false;
    }

    async init() {
        this.setupRenderer();
        this.setupCamera();
        this.addLighting();
        this.createProceduralSky();
        this.loadSmokeTexture();
        this.setupEventListeners();
        this.speechRecognitionHandler = new SpeechRecognitionHandler(this);
        this.settingsMenu = new SettingsMenu(this);
        this.road = new Road(this);
        this.road.createRoad();
        this.road.createHighwayLines();
        this.road.createBarriers();
        this.createEnvironment();
        await this.loadPlayerModel();
    }
    //renders the game
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }
    //sets up the user camera to follow the user's car. 
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
    }
    //adds the ambient lighting within the game to make the game more appealing. 
    addLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        this.sunLight = new THREE.DirectionalLight(0xffddaa, 1);
        this.sunLight.position.set(-50, 100, -50);
        this.scene.add(this.sunLight);

        // Sun object for visual representation
        this.sunMesh = new THREE.Mesh(
            new THREE.CircleGeometry(20, 32),
            new THREE.MeshBasicMaterial({ color: 0xffddaa, side: THREE.DoubleSide })
        );
        this.sunMesh.position.set(-100, 100, -100);
        this.scene.add(this.sunMesh);
    }
    //creates the clouds and color within the sky to make the game more visually appealing. 
    createProceduralSky() {
        const sky = new Sky();
        sky.scale.setScalar(450000);
        this.scene.add(sky);

        const skyUniforms = sky.material.uniforms;

        skyUniforms['turbidity'].value = 10;
        skyUniforms['rayleigh'].value = 2;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.8;

        const sunParameters = {
            elevation: 20,
            azimuth: 180
        };

        const phi = THREE.MathUtils.degToRad(90 - sunParameters.elevation);
        const theta = THREE.MathUtils.degToRad(sunParameters.azimuth);

        this.sunLight.position.setFromSphericalCoords(1, phi, theta);

        sky.material.uniforms['sunPosition'].value.copy(this.sunLight.position);
    }
    //used to load a smoketexture but functionality no longer works as intended.
    loadSmokeTexture() {
        const textureLoader = new THREE.TextureLoader();
        //this.smokeTexture = textureLoader.load('smoke.png'); // Ensure 'smoke.png' is in your project directory
    }
    //sets up the input handler
    setupEventListeners() {
        this.inputHandler = new InputHandler(this);
    }
    //sets up all of the trees, mountains, and clouds within the game by calling those methods.
    createEnvironment() {
        this.createTrees();
        this.createMountain();
        this.createClouds();
    }
    // creates an infinite amount of trees that spawn for as long as the user is playing the game. 
    createTrees() {
        const treeGeometry = new THREE.ConeGeometry(0.5, 2, 8);
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
        const treeMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 }); // Green color
        const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 }); // Brown color

        for (let i = 0; i < 500; i++) {
            const tree = new THREE.Group();

            const leaves = new THREE.Mesh(treeGeometry, treeMaterial);
            leaves.position.y = 1.5;
            tree.add(leaves);

            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 0.5;
            tree.add(trunk);

            tree.position.set(
                Math.random() > 0.5 ? this.roadWidth / 2 + 2 + Math.random() * 10 : -this.roadWidth / 2 - 2 - Math.random() * 10,
                0,
                -this.roadLength / 2 + Math.random() * this.roadLength
            );
            this.trees.push(tree);
            this.scene.add(tree);
        }
    }
    //creates mountains that are supposed to spawn in the background but doesn't work as intended yet. 
    createMountain() {
        const mountainGeometry = new THREE.ConeGeometry(50, 100, 32);
        const mountainMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        this.mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
        this.scene.add(this.mountain);
    }
    //creates multiple clouds by calling the createCloud method
    createClouds() {
        for (let i = 0; i < 50; i++) {
            this.createCloud();
        }
    }
    //creates realistic clouds using three.js
    createCloud() {
        const cloudGeometry = new THREE.SphereGeometry(5, 32, 32);
        const cloudMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        const cloud = new THREE.Group();

        const puff1 = new THREE.Mesh(cloudGeometry, cloudMaterial);
        const puff2 = new THREE.Mesh(cloudGeometry, cloudMaterial);
        const puff3 = new THREE.Mesh(cloudGeometry, cloudMaterial);

        puff1.position.set(-2, 0, 0);
        puff2.position.set(2, 0, 0);
        puff3.position.set(0, 1.5, 0);

        cloud.add(puff1);
        cloud.add(puff2);
        cloud.add(puff3);

        cloud.scale.setScalar(1 + Math.random() * 2);
        cloud.position.set(
            -200 + Math.random() * 400,
            30 + Math.random() * 20,
            -500 + Math.random() * 1000
        );

        this.scene.add(cloud);
        this.clouds.push(cloud);
    }
    //loads in objects required for playingthe game. this includes the user's porsche, the cop car, the traffic car and the home screen. 
    async loadPlayerModel() {
        // Show loading screen
        this.loadingScreen.style.display = 'flex';

        const fbxLoader = new FBXLoader();
        try {
            const object = await fbxLoader.loadAsync('porsche.fbx'); // Ensure 'porsche.fbx' is in your project directory
            this.player = new Player(this, object);
            this.scene.add(this.player.mesh);

            // Create cop car
            this.copCar = new CopCar(this);
            this.scene.add(this.copCar.mesh);

            // Create traffic cars
            for (let i = 0; i < 150; i++) {
                const trafficCar = new TrafficCar(this);
                this.trafficCars.push(trafficCar);
                this.scene.add(trafficCar.mesh);
            }

            this.modelLoaded = true;

            // Enable Start button and hide loading screen
            this.startButton.disabled = false;
            this.loadingScreen.style.display = 'none';
            this.mainMenu.style.display = 'flex';

            // Add event listener to Start button
            this.startButton.addEventListener('click', () => {
                if (!this.modelLoaded) {
                    alert('The car model is still loading. Please wait a moment.');
                    return;
                }
                this.mainMenu.style.display = 'none';
                this.startIntroAnimation();
            });
        } catch (error) {
            console.error('Error loading the Porsche model:', error);
            this.loadingScreen.textContent = `Error loading model: ${error.message}. Please check the file path.`;
        }
    }
    //starts the intro animation detailed in introanimation.js
    startIntroAnimation() {
        this.gameStarted = true;
        this.introAnimation = new IntroAnimation(this);
        this.introAnimation.start();
    }
    //renders the 
    animate() {
        if (this.gameOver || !this.player.mesh) return;

        requestAnimationFrame(() => this.animate());

        const deltaTime = 1;

        this.update(deltaTime);

        this.renderer.render(this.scene, this.camera);
    }

    update(deltaTime) {
        // Update player
        this.player.update(deltaTime);

        // Update cop car
        this.copCar.update(deltaTime);

        // Update traffic cars
        this.trafficCars.forEach((trafficCar) => {
            trafficCar.update(deltaTime);
        });

        // Update trees
        this.trees.forEach((tree) => {
            tree.position.z -= this.playerSpeed; // Move with the player
            if (tree.position.z < this.player.mesh.position.z - 200) {
                tree.position.z = this.player.mesh.position.z + this.roadLength / 2;
            }
        });

        // Update smoke particles
        //this.updateSmokeParticles();

        // Update camera position to follow the player
        this.camera.position.set(
            this.player.mesh.position.x,
            5,
            this.player.mesh.position.z - 10
        );
        this.camera.lookAt(this.player.mesh.position);

        // Update clouds
        this.updateClouds();

        // Update sun and mountain positions
        this.updateEnvironment();

        // Update score
        this.score += 1;
        this.scoreboard.textContent = `Score: ${this.score}`;
    }

    // updateSmokeParticles() {
    //     this.smokeParticles.forEach((particle, index) => {
    //         particle.sprite.position.add(particle.velocity);
    //         particle.sprite.material.opacity -= 0.005;
    //         particle.sprite.scale.multiplyScalar(1.01);
    //         particle.life -= 1;

    //         if (particle.life <= 0 || particle.sprite.material.opacity <= 0) {
    //             this.scene.remove(particle.sprite);
    //             this.smokeParticles.splice(index, 1);
    //         }
    //     });
    // }

    updateClouds() {
        this.clouds.forEach((cloud, index) => {
            cloud.position.z += this.playerSpeed * 0.5; // Move clouds slower than the player
            if (cloud.position.z > this.player.mesh.position.z + 500) {
                this.scene.remove(cloud);
                this.clouds.splice(index, 1);
                this.createCloud();
            }
        });
    }

    updateEnvironment() {
        this.sunMesh.position.set(
            this.player.mesh.position.x - 50,
            this.player.mesh.position.y + 80,
            this.player.mesh.position.z - 100
        );

        this.mountain.position.set(
            this.player.mesh.position.x - 100,
            -50,
            this.player.mesh.position.z - 200
        );

        // Ensure the sun always faces the camera
        this.sunMesh.lookAt(this.camera.position);
    }

    gameOverHandler(message) {
        this.gameOver = true;
        alert(message);
        //this.speechRecognitionHandler.stopSpeechRecognition();
    }

    // createSmokeParticle(position) {
    //     const material = new THREE.SpriteMaterial({
    //         map: this.smokeTexture,
    //         transparent: true,
    //         opacity: 0.5,
    //         depthWrite: false,
    //         depthTest: false,
    //         blending: THREE.AdditiveBlending
    //     });
    //     const smoke = new THREE.Sprite(material);
    //     smoke.position.copy(position);
    //     smoke.scale.set(1, 1, 1);
    //     this.scene.add(smoke);
    //     return smoke;
    // }
}
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
// main.js
import Game from './game.js';

window.addEventListener('load', () => {
    const game = new Game();
    game.init();
});
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
// road.js
import * as THREE from 'three';

export default class Road {
    constructor(game) {
        this.game = game;
        this.scene = game.scene; // Correctly reference the game's scene
        this.roadWidth = 10;
        this.roadLength = 20000;

        this.createRoad();
        this.createHighwayLines();
        this.createBarriers();
    }
    // generates the road using three.js
    createRoad() {
        const roadGeometry = new THREE.PlaneGeometry(this.roadWidth, this.roadLength);
        const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2; // Lay flat
        road.position.z = 0; // Centered at z = 0
        this.scene.add(road);
    }
    //generates the highwayLines that show up on the road. Using three.js for their prebuilt visuals. 
    createHighwayLines() {
        const lineGroup = new THREE.Group();
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const lineWidth = 0.1;
        const lineLength = 5;
        const gapBetweenLines = 5;
        const numberOfLines = Math.ceil(this.roadLength / (lineLength + gapBetweenLines));
        const lanePositions = [-this.roadWidth / 4, 0, this.roadWidth / 4];

        lanePositions.forEach((xPos) => {
            for (let i = 0; i < numberOfLines; i++) {
                const lineGeometry = new THREE.PlaneGeometry(lineWidth, lineLength);
                const line = new THREE.Mesh(lineGeometry, lineMaterial);
                line.rotation.x = -Math.PI / 2;
                line.position.set(
                    xPos,
                    0.01,
                    -this.roadLength / 2 + i * (lineLength + gapBetweenLines)
                );
                lineGroup.add(line);
            }
        });
        this.scene.add(lineGroup);
    }
    // creates visual (able to be seen playing the game) and physical (blockers that prevent the car from moving past a certain point) barriers
    createBarriers() {
        const barrierGroup = new THREE.Group();
        const barrierGeometry = new THREE.BoxGeometry(0.2, 1, 5);
        const barrierMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
        const numberOfBarriers = Math.ceil(this.roadLength / 5);
        const positions = [-this.roadWidth / 2 - 0.5, this.roadWidth / 2 + 0.5];

        positions.forEach((xPos) => {
            for (let i = 0; i < numberOfBarriers; i++) {
                const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
                barrier.position.set(xPos, 0.5, -this.roadLength / 2 + i * 5);
                barrierGroup.add(barrier);
            }
        });
        this.scene.add(barrierGroup);
    }
}
// settingsmenu.js
export default class SettingsMenu {
    constructor(game) {
        this.game = game;
        this.subtitlesEnabled = true;
        this.init();
    }
    // full function is to turn on and off the subtitles within the subtitles menu. 
    init() {
        document.getElementById('settings-button').addEventListener('click', () => {
            document.getElementById('settings-menu').style.display = 'block';
        });

        document.getElementById('close-settings-button').addEventListener('click', () => {
            document.getElementById('settings-menu').style.display = 'none';
        });

        document.getElementById('subtitles-toggle').addEventListener('change', (event) => {
            this.subtitlesEnabled = event.target.checked;
            if (this.subtitlesEnabled) {
                // Request microphone permission
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then((stream) => {
                        this.game.speechRecognitionHandler.start();
                        // We don't need the stream, so stop it
                        stream.getTracks().forEach(track => track.stop());
                    })
                    .catch((err) => {
                        console.error('Microphone access denied:', err);
                        alert('Microphone access is required for subtitles.');
                        event.target.checked = false;
                        this.subtitlesEnabled = false;
                    });
            } else {
                this.game.speechRecognitionHandler.stop();
                this.game.subtitleElement.style.opacity = 0;
                this.game.subtitleElement.textContent = '';
            }
        });
    }
}
// speechrecognition.js
export default class SpeechRecognitionHandler {
    constructor(game) {
        this.game = game;
        this.recognition = null;
        this.subtitlesEnabled = true;
        this.subtitleElement = document.getElementById('subtitle');
        this.init();
    }
    //sets the speech recognition up in browser
    init() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
        } else {
            console.warn('Speech Recognition API not supported in this browser.');
        }
    }
    //starts the speech recognition, which takes in audio from the surrounding environemnt and displays the words on screen. Six words max at a time on screen. 
    start() {
        if (!this.recognition) return;
        this.recognition.start();
        this.recognition.onresult = (event) => {
            if (this.subtitlesEnabled) {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    transcript += event.results[i][0].transcript;
                }
                // Limit to last 6 words
                const words = transcript.trim().split(/\s+/);
                const lastWords = words.slice(-6).join(' ');
                this.subtitleElement.textContent = lastWords;
                this.subtitleElement.style.opacity = 1;
            }
        };
        this.recognition.onerror = (event) => {
            console.error('Speech Recognition Error:', event.error);
        };
    }
    //stops speech recognition
    stop() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}
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
