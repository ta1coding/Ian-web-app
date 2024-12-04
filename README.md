# app
Escape the Cop Game
"Escape the Cop" is a 3D racing game developed using Three.js. The player controls a car trying to escape from a pursuing cop car while navigating through traffic on an endless highway.

- escape the cop game utilizes subtitles to ensure that you can understand what is going on around you while you are playing the game


Project Structure
index.html
The main HTML file that sets up the canvas and includes all scripts.

main.js
The entry point of the application; it initializes the game.

game.js
Manages the overall game logic and coordinates all components.

player.js
Defines the player's car and its behavior.

copcar.js
Defines the cop car that chases the player.

trafficcar.js
Defines the behavior of traffic cars on the road.

road.js
Creates the road and environmental elements like lines and barriers.

inputhandler.js
Handles user input for controlling the player's car.

speechrecognition.js
Manages speech recognition for subtitles (optional feature).

settingsmenu.js
Manages the game settings menu.

introanimation.js
Manages the introductory animation sequence before the game starts.

assets/
Directory containing models and textures (ensure your assets like porsche.fbx are placed here).

Key Parts of the Code
Game Initialization (game.js)
Game Class
Initializes the scene, camera, renderer, and loads all necessary models and assets. It sets up the environment, lighting, and starts the game loop.

Methods:

init(): Sets up the renderer, camera, lights, and event listeners.
animate(): The main game loop that updates and renders the scene.
Player Controls (player.js)
Player Class
Manages the player's car, including movement, acceleration, and rotation based on user input.

Methods:

update(deltaTime): Updates the player's position and handles input.
handleInput(): Captures and processes keyboard input for car controls.
Cop Car Behavior (copcar.js)
CopCar Class
Controls the cop car's pursuit logic, including speed adjustments and collision detection with the player.

Methods:

update(deltaTime): Moves the cop car towards the player and checks for collision.
startSiren(), stopSiren(), toggleSiren(): Manages the cop car's siren effects.
Traffic Car Behavior (trafficcar.js)
TrafficCar Class
Manages traffic cars' behaviors, including movement towards the player, lane changes, and collision avoidance.

Methods:

update(deltaTime): Updates the traffic car's position and handles lane changes.
updateTurnSignals(): Manages the visual representation of turn signals.
Environment Setup (road.js)
Road Class
Creates the road, highway lines, and barriers to simulate the driving environment.

Methods:

createRoad(): Generates the road surface.
createHighwayLines(): Adds lane dividers.
createBarriers(): Places barriers along the sides of the road.
User Input (inputhandler.js)
InputHandler Class
Captures keyboard events to control the player's car.

Methods:

init(): Sets up event listeners for keydown and keyup events.

Speech Recognition (speechrecognition.js)
SpeechRecognitionHandler Class
Handles speech recognition to display subtitles based on in-game dialogue (optional feature).

Methods:

start(): Begins speech recognition.
stop(): Stops speech recognition.
Settings Menu (settingsmenu.js)
SettingsMenu Class
Manages the display and functionality of the game's settings menu, including toggling subtitles.

Methods:

init(): Initializes settings menu event listeners.
Intro Animation (introanimation.js)
IntroAnimation Class
Manages the introductory sequence that sets the scene before gameplay begins.

Methods:

start(): Initiates the intro animation.
renderIntro(): Renders frames during the intro sequence.
Special Instructions and Tools
ES6 Modules
The project uses ES6 modules (import and export statements). Because of browser security restrictions (CORS policy), you must run the project through a local web server rather than opening the index.html file directly.
Three.js
Three.js is used for rendering 3D graphics. It is imported via CDN links in index.html using an import map.
GSAP (GreenSock Animation Platform)
GSAP is utilized for animations, particularly for the intro sequence. It's included via CDN.
Assets
Ensure all asset files like models and textures are correctly placed in the assets/ directory.
Update paths in the code if your asset directory differs.
Speech Recognition
The speech recognition feature relies on the Web Speech API, which is best supported in Google Chrome.
Microphone access is required; make sure to allow it when prompted.

- How to add 3d models:
Use a service like meshy to generate the model, and then download it as an fbx document. That will allow it to be easily used in the game. 

- how to run the game:
Open a live server (as normal) and run in browser. Microphone feature will only work in browser with microphone acess. 