Class: Game (P0)
This class manages the overall game, coordinating all components.

Variables:

scene: THREE.Scene
The main scene of the game.

camera: THREE.Camera
The camera viewing the scene.

renderer: THREE.Renderer
The renderer displaying the scene.

player: Player
The player's car instance.

copCar: CopCar
The cop car chasing the player.

trafficCars: List<TrafficCar>
The traffic cars on the road.

road: Road
The road and environment.

keys: Object
Tracks the state of user input keys.

score: Integer
The player's score.

gameOver: Boolean
Indicates if the game is over.

settingsMenu: SettingsMenu
Manages game settings.

speechRecognitionHandler: SpeechRecognitionHandler
Handles speech recognition for subtitles.

subtitleElement: DOM Element
Displays subtitles on the screen.

Methods:

init(): (P0)
Initializes the game.

loadPlayerModel(): (P0)
Loads the player's car model.

startIntroAnimation(): (P0)
Starts the game's intro animation.

animate(): (P0)
The main game loop, updates and renders the game.

update(deltaTime): (P0)
Updates the game state each frame.

gameOverHandler(message): (P0)
Handles the game over state.

Class: Player (P0)
This class represents the player's car and its behavior.

Variables:

game: Game
Reference to the main game instance.

mesh: THREE.Mesh
The 3D model of the player's car.

playerSpeed: Float
The current speed of the player's car.

maxSpeed: Float
The maximum speed the player's car can reach.

acceleration: Float
How quickly the player's car accelerates.

deceleration: Float
How quickly the player's car decelerates.

currentRotationAngle: Float
The current rotation angle of the car.

maxRotationAngle: Float
The maximum rotation angle when turning.

rotationSpeed: Float
The speed at which the car rotates when turning.

Methods:

update(deltaTime): (P0)
Updates the player's position and state.

handleInput(): (P0)
Handles user input to control the car.

activateBoost(): (P1)
Activates a speed boost for a short duration.

toggleWindshieldWipers(): (P2)
Toggles the windshield wipers on or off.

toggleHeadlights(): (P2)
Toggles the car's headlights.

Class: CopCar (P0)
This class represents the cop car chasing the player.

Variables:

game: Game
Reference to the main game instance.

mesh: THREE.Mesh
The 3D model of the cop car.

copMaxSpeed: Float
The maximum speed of the cop car.

copAcceleration: Float
How quickly the cop car accelerates.

copCurrentSpeed: Float
The current speed of the cop car.

siren: THREE.Mesh
The siren light on the cop car.

sirenOn: Boolean
Indicates whether the siren is active.

Methods:

update(deltaTime): (P0)
Updates the cop car's position and behavior.

startSiren(): (P1)
Activates the cop car's siren.

stopSiren(): (P1)
Deactivates the cop car's siren.

toggleSiren(): (P1)
Toggles the siren light on and off.

Class: TrafficCar (P0)
This class represents the traffic cars on the road.

Variables:

game: Game
Reference to the main game instance.

mesh: THREE.Mesh
The 3D model of the traffic car.

lane: Float
The current lane position of the traffic car.

speed: Float
The speed at which the traffic car moves.

maxSpeed: Float
The maximum speed the traffic car can reach.

targetLane: Float
The lane the traffic car is moving towards.

laneChangeCooldown: Float
Cooldown before the car can change lanes again.

turnSignal: String
Indicates if the car is signaling a lane change.

Methods:

update(deltaTime): (P0)
Updates the traffic car's position and behavior.

updateTurnSignals(): (P0)
Updates the traffic car's turn signals.

Class: Road (P0)
This class represents the road and environment setup.

Variables:

game: Game
Reference to the main game instance.

scene: THREE.Scene
The main scene of the game.

roadWidth: Float
The width of the road.

roadLength: Float
The length of the road.

Methods:

createRoad(): (P0)
Creates the road mesh.

createHighwayLines(): (P0)
Creates the highway lines on the road.

createBarriers(): (P0)
Creates the barriers along the road.

Class: InputHandler (P0)
This class handles user input for the game.

Variables:

game: Game
Reference to the main game instance.
Methods:

init(): (P0)
Initializes event listeners for keyboard input.
Class: SpeechRecognitionHandler (P1)
This class handles speech recognition for subtitles.

Variables:

game: Game
Reference to the main game instance.

recognition: SpeechRecognition
The speech recognition object.

Methods:

init(): (P1)
Initializes speech recognition.

start(): (P1)
Starts speech recognition.

stop(): (P1)
Stops speech recognition.

Class: SettingsMenu (P0)
This class handles the settings menu logic.

Variables:

game: Game
Reference to the main game instance.

subtitlesEnabled: Boolean
Indicates whether subtitles are enabled.

Methods:

init(): (P0)
Initializes the settings menu.
Class: IntroAnimation (P0)
This class manages the intro animation sequence.

Variables:

game: Game
Reference to the main game instance.

camera: THREE.Camera
The camera used in the game.

playerCar: THREE.Mesh
The player's car mesh.

copCar: THREE.Mesh
The cop car mesh.

subtitleElement: DOM Element
Displays subtitles on the screen.

Methods:

start(): (P0)
Starts the intro animation.

renderIntro(): (P0)
Renders the intro animation frames.

Class: Garage (P1)
This class represents the player's garage where cars are stored.

Variables:

cars: List<Car>
List of cars owned by the player.

selectedCar: Car
The car currently selected for use.

Methods:

addCar(car): (P1)
Adds a new car to the garage.

selectCar(car): (P1)
Selects a car from the garage.

Class: Upgrades (P2)
This class handles car upgrades and customizations.

Variables:

availableUpgrades: List<UpgradeItem>
List of available upgrades.
Methods:

applyUpgrade(car, upgrade): (P2)
Applies an upgrade to a car.
Class: Weather (P2)
This class manages weather conditions in the game.

Variables:

currentWeather: String
The current weather condition (e.g., "Sunny", "Rainy").

visibility: Float
The level of visibility affected by weather.

isRaining: Boolean
Indicates if it is raining.

Methods:

updateWeather(): (P2)
Updates the weather conditions over time.

applyWeatherEffects(): (P2)
Applies weather effects to the game environment.

Class: RoadTerrain (P1)
This class represents different terrains on the road.

Variables:

type: String
Type of terrain (e.g., "Asphalt", "Gravel").

friction: Float
Friction coefficient affecting car handling.

Methods:

applyTerrainEffects(car): (P1)
Modifies car behavior based on terrain.
Associated Classes and Data Structures
Class: ControlScheme (P0)
Defines the player's control keys.

Variables:

leftKey: String
Key assigned to move the car left.

rightKey: String
Key assigned to move the car right.

accelerateKey: String
Key assigned to accelerate the car.

brakeKey: String
Key assigned to brake the car.

boostKey: String (P1)
Key assigned to activate the car's boost.

wipersKey: String (P2)
Key assigned to toggle the windshield wipers.

headlightsKey: String (P2)
Key assigned to toggle the headlights.

Class: UpgradeItem (P2)
Represents an upgrade that can be applied to a car.

Variables:

name: String
Name of the upgrade.

type: String
Type of upgrade (e.g., "Engine", "Tires").

effect: Object
The effect of the upgrade on car stats.

Additional Methods to Implement
In Class: Player
toggleWindshieldWipers(): (P2)
Toggles the windshield wipers.

toggleHeadlights(): (P2)
Toggles the headlights.

In Class: Game
updateWeatherEffects(): (P2)
Updates game visuals based on weather.