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
