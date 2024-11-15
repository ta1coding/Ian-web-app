### Feature Name : Player Class
**Priority:** [P0]
**Implementation Timeline:** [Day 1-2]

**Core Requirements:**
- name (P0): player's username
- coins (P0): tracks the amount of in-game currency, good to have and easy to implement but will probably have less functionality as less things should be purchasable in the first iteration
- controls (P0): key bindings for player actions, essential for core gameplay mechanics.

**Technical Components:**
- [Required component 1]
- [Required component 2]

**Simplifications:**
- car (P1): only one car selection is allowed for the MVP. no need for multiple cars or switching functionality.
- garage (P1): omitted for MVP as owning and managing multiple cars is non-essential to the core gameplay. can be implemented with a placeholder.
- boostsAvailable (P1): boost functionality can be simplified or omitted from initial development. non-essential to core gameplay


**Dependencies:**
- Car Class



### Feature Name: Car Class
**Priority:** [P0]
**Implementation Timeline:** [Day 1-2]

**Core Requirements:**
- modelName (P0): name of the car model for display and selection. easy to implement
- speed (P0): defines the maximum speed of the car; critical to core gameplay mechanics.
- acceleration (P0): Determines how quickly the car increases speed,
- braking (P0): Establishes the car's ability to decelerate

**Technical Components:**
- integrate car attributes (modelName, speed, acceleration, braking) into the gameplay physics, game engine, and user interface
- Ensure compatibility with the Player class for car selection and interaction.

**Simplifications:**
-  handling (P1): responsiveness to steering is simplified or balanced as part of the default car properties for MVP.
-  price (P1): Car pricing in coins is deferred; only one car is available for initial implementation. can be a variable but purchasing cas mechanic not introduced
- boostCharge (P1): Boost functionality is deferred or implemented in a simplified way without full mechanics.


**Dependencies:**
- Player Class



### Feature Name: Level Class
**Priority:** [P0]
**Implementation Timeline:** [Day 2-3]

**Core Requirements:**
- levelNumber (P0): single level is implemented for the MVP, serving as the base gameplay environment.
- distanceToFinish (P0): static total distance defines the goal for completing the level because only one level.
- copSpeed (P0): sets the cop car’s pursuit speed to create a basic challenge.
- timer (P0): tracks time elapsed to complete the level, important for performance evaluation that will be implemented later.
- playerPosition (P0): tracks the player's current position for level progress and interactions.

**Technical Components:**
- static level environment setup with a defined finish line and cop car logic. needs to be implemented with three.js
- basic AI for the cop car's movement based on copSpeed and playerPosition.
- timer integrated with UI for displaying elapsed time.
- coordinate system for tracking player and cop positions relative to the level layout. will be useful later for map


**Simplifications:**
- difficulty (P1): single difficulty level is implemented, without scaling options.
- starsEarned (P1): performance-based rewards (e.g., stars) deferred for later implementation.
- map (P1): Simplified level layout with no additional map complexities.

**Dependencies:**
- map



### Feature Name: Map class
**Priority:** [P0]
**Implementation Timeline:** [Day 3-4]

**Core Requirements:**
- curvature (P0): defines the road's curvature, essential for creating the gameplay's challenge and navigation.
- length (P0): specifies the total length of the map

**Technical Components:**
- Implement road curvature and length as part of the track's physical representation and gameplay mechanics. rendering
- static generation of a single map layout to match level requirements.
- generation should be also able to convert to a top down view with player and cop locatiosn for minimap

**Simplifications:**
- obstacles (P1): simplified or omitted; no additional obstacle mechanics in the MVP.
- terrainFeatures (P1): deferred; hills, curves, and other features are simplified into curvature for MVP.
- backgroundColor (P1): default color scheme used for the MVP, without dynamic variations.

**Dependencies:**
- level class
- player class



### Associated Classes and Data Structures



### Feature Name: ControlScheme Class
**Priority:** [P0]
**Implementation Timeline:** [Day 1]

**Core Requirements:**
- leftKey (P0): key assigned for moving the car left.
- rightKey (P0): Key assigned for moving the car right.

**Technical Components:**
- map leftKey and rightKey to player input for directional movement.

**Simplifications:**
- boostKey (P1): deferred as boost functionality is not essential for MVP.
- honkKey (P1): can be implemented because simple. not neccesary though

**Dependencies:**
- PlayerClass



### Feature Name: Obstacle Class
**Priority:** [P1]
**Implementation Timeline:** [Day 5]

**Core Requirements:**
- type (P1): Specifies the kind of obstacle.
- position (P1): Determines where the obstacle is located on the map.
- effect (P1): Defines the impact on the player when encountered.

**Technical Components:**
- Integrate obstacles into the map layout with simple collision detection.

**Simplifications:**
- No complex obstacle interactions for MVP; deferred to future development.

**Dependencies:**
- Interacts with the Map class for placement and the Player class for collision effects.



### Feature Name: Coordinates Class
**Priority:** [P0]
**Implementation Timeline:** [Day 1]

**Core Requirements:**
- x (P0): Horizontal position value.
- y (P0): Vertical position value.

**Technical Components:**
- Provide position tracking for objects within the game world.

**Dependencies:**
- Used by Player, Obstacle, and Level classes to track and update positions.