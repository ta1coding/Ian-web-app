## Game Engines

1. **Phaser.js** - Very easy to use and good for 2D models
2. **Three.js** - Very great graphics, great for 3D and has some 2D elements to it.
3. **Babylon.js** - Good for both 3D and 2D graphics, simple to use, can blend 2D and 3D
4. **PIXI.js** - Great 2D visual effects game
5. **Melon.js** - Simple, easy, 2D game engine, great for arcade games and simple designs

- I would recommend using Three.js as it can handle the 3D and 2D aspects of the game, although it might be somewhat technically challenging

---

### Class: Player - (P0/P1)

This class represents the player and contains all player-related data.

**Variables:**

- `name`: String  (P0)
  Player's username.

- `car`: Car  (P1 - doesnt need multiple cars)
  The car currently selected by the player.

- `coins`: Integer (P0)
  Amount of in-game currency the player has.

- `garage`: List<Car>  (P1)
  Collection of cars owned by the player.

- `inventory`: List<CosmeticItem>  (P2 - cosmetics can be added in future iterations)
  List of cosmetic items (like liveries, rims, colors) the player has acquired.

- `boostsAvailable`: Integer  (P1 - importnant but not requried to the core gameplay)
  Number of boost charges available to the player.

- `controls`: ControlScheme  (P0)
  Key bindings for player actions.

---

### Class: Car (P0)

This class represents the player's car.

**Variables:**

- `modelName`: String  (P0)
  Name of the car model.

- `speed`: Float  (P0)
  Maximum speed of the car.

- `acceleration`: Float  (P0)
  How quickly the car increases speed.

- `braking`: Float  (P0)
  Effectiveness of the car's braking system.

- `handling`: Float  (P1)
  Car's responsiveness to steering inputs.

- `price`: Integer  (P1)
  Cost of the car in coins.

- `cosmetics`: Cosmetics  (P2)
  Visual customization options applied to the car.

- `boostCharge`: Float  (P1)
  Current charge level of the car's boost ability.

- `headlightsOn`: Boolean  (P2)
  Indicates whether the headlights are turned on.

---

### Class: Level ()

This class encapsulates all level-specific data and mechanics, including the cop car and weather.

**Variables:**

- `levelNumber`: Integer  (P0 - but will only have 1 level on mvp)
  Identifier for the level's sequence.

- `distanceToFinish`: Float  (P0 - but static for mvp)
  Total distance the player needs to travel to complete the level.

- `copSpeed`: Float  (P0 - same)
  Speed at which the cop car pursues the player.

- `copCarModel`: String  (P2)
  Model name of the cop car.

- `copPosition`: Coordinates  (P0)
  Current position of the cop car.

- `weatherType`: String  (P2 - not neccessicary for core gameplay)
  Current weather condition (e.g., "Sunny", "Rainy").

- `visibility`: Float  (P2 - not neccessicary for core gameplay)
  Level of visibility affected by weather conditions.

- `isRaining`: Boolean  (P2 - not neccessicary for core gameplay)
  Indicates whether it is raining.

- `windshieldWipersOn`: Boolean  (P2 - not neccessicary for core gameplay)
  Indicates whether the windshield wipers are active.

- `timeOfDay`: String  (P2 - not neccessicary for core gameplay)
  Indicates whether it's day or night.

- `difficulty`: String  (P1 - not multiple levels)
  Level of challenge (e.g., "Easy", "Medium", "Hard").

- `starsEarned`: Integer  (P1 - good feature but not first to be implemented)
  Number of stars awarded based on performance (0 to 3).

- `timer`: Float  (P0)
  Time taken to complete the level.

- `playerPosition`: Coordinates  (P0)
  Current position of the player's car.

- `map`: Map  (P1)
  Map object containing the layout for the level.

---

### Class: Map (P0)

This class defines the specific layout and terrain features for each level.

**Variables:**

- `curvature`: Float  (P0)
  Degree of the road's curvature.

- `length`: Float  (P0)
  Total length of the map.

- `obstacles`: List<Obstacle>  (P1)
  Obstacles present on the map.

- `terrainFeatures`: List<TerrainFeature>  (P1)
  Specific features like hills or curves.

- `backgroundColor`: String  (P1)
  Color scheme of the map (e.g., for daytime or nighttime).

---

### Associated Classes and Data Structures

#### Class: ControlScheme (P0)

Defines the player's control keys.

**Variables:**

- `leftKey`: String  (P0)
  Key assigned to move the car left.

- `rightKey`: String  (P0)
  Key assigned to move the car right.

- `boostKey`: String  (P1)
  Key assigned to activate the car's boost.

- `honkKey`: String  (P1 - easy to implement)
  Key assigned to honk the car's horn.

- `wipersKey`: String  (P2)
  Key assigned to toggle the windshield wipers.

- `headlightsKey`: String  (P2)
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

#### Class: Obstacle (P1)

Represents obstacles on the map.

**Variables:**

- `type`: String  (P1)
  Kind of obstacle (e.g., "OtherCar", "Pothole", "Construction").

- `position`: Coordinates  (P1)
  Location of the obstacle on the map.

- `effect`: String  (P1)
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
