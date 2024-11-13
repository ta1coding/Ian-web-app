## Game Engines

1. **Phaser.js** - Very easy to use and good for 2D models
2. **Three.js** - Very great graphics, great for 3D and has some 2D elements to it.
3. **Babylon.js** - Good for both 3D and 2D graphics, simple to use, can blend 2D and 3D
4. **PIXI.js** - Great 2D visual effects game
5. **Melon.js** - Simple, easy, 2D game engine, great for arcade games and simple designs

- I would recommend using Three.js as it can handle the 3D and 2D aspects of the game, although it might be somewhat technically challenging

---

### Class: Player

This class represents the player and contains all player-related data.

**Variables:**

- `name`: String  
  Player's username.

- `car`: Car  
  The car currently selected by the player.

- `coins`: Integer  
  Amount of in-game currency the player has.

- `garage`: List<Car>  
  Collection of cars owned by the player.

- `inventory`: List<CosmeticItem>  
  List of cosmetic items (like liveries, rims, colors) the player has acquired.

- `boostsAvailable`: Integer  
  Number of boost charges available to the player.

- `controls`: ControlScheme  
  Key bindings for player actions.

---

### Class: Car

This class represents the player's car.

**Variables:**

- `modelName`: String  
  Name of the car model.

- `speed`: Float  
  Maximum speed of the car.

- `acceleration`: Float  
  How quickly the car increases speed.

- `braking`: Float  
  Effectiveness of the car's braking system.

- `handling`: Float  
  Car's responsiveness to steering inputs.

- `price`: Integer  
  Cost of the car in coins.

- `cosmetics`: Cosmetics  
  Visual customization options applied to the car.

- `boostCharge`: Float  
  Current charge level of the car's boost ability.

- `headlightsOn`: Boolean  
  Indicates whether the headlights are turned on.

---

### Class: Level

This class encapsulates all level-specific data and mechanics, including the cop car and weather.

**Variables:**

- `levelNumber`: Integer  
  Identifier for the level's sequence.

- `distanceToFinish`: Float  
  Total distance the player needs to travel to complete the level.

- `copSpeed`: Float  
  Speed at which the cop car pursues the player.

- `copCarModel`: String  
  Model name of the cop car.

- `copPosition`: Coordinates  
  Current position of the cop car.

- `weatherType`: String  
  Current weather condition (e.g., "Sunny", "Rainy").

- `visibility`: Float  
  Level of visibility affected by weather conditions.

- `isRaining`: Boolean  
  Indicates whether it is raining.

- `windshieldWipersOn`: Boolean  
  Indicates whether the windshield wipers are active.

- `timeOfDay`: String  
  Indicates whether it's day or night.

- `difficulty`: String  
  Level of challenge (e.g., "Easy", "Medium", "Hard").

- `starsEarned`: Integer  
  Number of stars awarded based on performance (0 to 3).

- `timer`: Float  
  Time taken to complete the level.

- `playerPosition`: Coordinates  
  Current position of the player's car.

- `map`: Map  
  Map object containing the layout for the level.

---

### Class: Map

This class defines the specific layout and terrain features for each level.

**Variables:**

- `curvature`: Float  
  Degree of the road's curvature.

- `length`: Float  
  Total length of the map.

- `obstacles`: List<Obstacle>  
  Obstacles present on the map.

- `terrainFeatures`: List<TerrainFeature>  
  Specific features like hills or curves.

- `backgroundColor`: String  
  Color scheme of the map (e.g., for daytime or nighttime).

---

### Associated Classes and Data Structures

#### Class: ControlScheme

Defines the player's control keys.

**Variables:**

- `leftKey`: String  
  Key assigned to move the car left.

- `rightKey`: String  
  Key assigned to move the car right.

- `boostKey`: String  
  Key assigned to activate the car's boost.

- `honkKey`: String  
  Key assigned to honk the car's horn.

- `wipersKey`: String  
  Key assigned to toggle the windshield wipers.

- `headlightsKey`: String  
  Key assigned to toggle the headlights.

---

#### Class: Cosmetics

Contains cosmetic attributes for cars.

**Variables:**

- `color`: String  
  Color of the car's body.

- `rims`: String  
  Design of the car's rims.

- `livery`: String  
  Graphics or decals applied to the car.

---

#### Class: CosmeticItem

Items that can be applied to cars for visual customization.

**Variables:**

- `name`: String  
  Name of the cosmetic item.

- `type`: String  
  Type of cosmetic (e.g., "Color", "Rims", "Livery").

- `rarity`: String  
  Rarity level of the item (e.g., "Common", "Rare").

---

#### Class: Obstacle

Represents obstacles on the map.

**Variables:**

- `type`: String  
  Kind of obstacle (e.g., "OtherCar", "Pothole", "Construction").

- `position`: Coordinates  
  Location of the obstacle on the map.

- `effect`: String  
  Impact on the player when encountered (e.g., "SlowDown", "GameOver").

---

#### Class: TerrainFeature

Represents features like curves or hills.

**Variables:**

- `type`: String  
  Feature type (e.g., "Curve", "Hill").

- `position`: Coordinates  
  Location of the feature on the map.

- `intensity`: Float  
  Severity or degree of the feature (e.g., how sharp a curve is).

---

#### Class: Coordinates

Used for positioning within the game world.

**Variables:**

- `x`: Float  
  Horizontal position value.

- `y`: Float  
  Vertical position value.
