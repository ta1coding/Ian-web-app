# Project Choice: Web Game Design

## Game Title: Escape the Cops!

### Define the Purpose

In this game, you will be in a speedy car on the highway, running away from a cop car that is trying to catch you. If you get caught by the car, you lose the game. There are different levels with increasing difficulty as the cop car gets progressively faster, and you can also increase your car to be faster, move more quickly, or brake more quickly as you earn more coins.

### Target Audience

- **Age**: This game will be targeted at those aged 13-25.
- **Interests**:
  - People who drive cars fast or are into racing/car driving.
  - Another part of the game is having a smooth design so that the game is satisfying to play even for those that don’t care about cars.

## Conceptualizing the Design

### Core Features

#### Car Movement

- The car that the user is driving will move left and right based on the press of the left and right keys.
- This game is all in third-person and shown from a bird’s-eye view.

#### Level Progression

- The user will finish each level once they drive a certain distance (1 mile, 1.5 miles, etc.).
- Once the user finishes the level, they will be able to progress to the next level, which will entail a faster police car that will catch up to the user more quickly, and more challenging weather (detailed below).
- levels will be randomized in terms of when and where cars + other obstacles appear, however the curvature + weather + cop speed will stay constant for a specific level.

#### Map Behavior + Weather

- **Beginner Levels**: The map is bright and dry.
- **Progressive Levels**:
  - Weather gets more challenging. For example, after a certain number of levels, it starts to rain, making it more difficult for the user to see, requiring windshield wipers, and slowing down movement.
  - There will also be nighttime modes where headlights are necessary to see clearly.
  - The map will curve in harder levels, making it tougher for the user to stay on course.

#### Cop Behavior

- As levels progress, the automated cop speeds up, aiming to catch the player. If the cop car catches up, the round is failed.

#### Level Completion Behavior

- At the end of each level, users earn coins and a rating out of 3 stars based on their speed in completing the level.

#### Coin Collection

- The more stars earned, the more coins awarded.

#### Car Market

- Players can use coins to buy better cars. Cars will get progressively more expensive but also faster, more agile, and with better braking.
- Without upgrades, progressing becomes more challenging as the cop car gets faster.
- Players can also upgrade their car’s abilities.

#### Worldwide Competition

- In addition to levels, a worldwide mode offers endless gameplay, where difficulty increases over time with worsening weather and more obstacles.
- With this, their is a worldlwide leaderboard showing top scores.

### User Flow

#### Homescreen

- Simple with buttons for Start, Settings, Garage, and Instructions.

#### Garage

- Users can select a car from their garage and scroll through options using the left and right arrow keys.
- Users will have the ability to also buy randomized loot boxes that will give you cosmetics of different rarities (e.g. livery, rims, color, etc.)

#### The First Few Seconds

- The player starts with a gap ahead of the cop car, shown by the cop starting slightly behind on-screen.

#### Level Completion Screen

- Options: Home, Play Next Level, and Garage.

### Interactive Elements

- **Honk**: Forces the driver in front to move aside if safe.
- **Windshield Wipers**: Used during rain; screen blurs progressively, requiring frequent wiper use.
- **Headlights**: Needed for night mode; brighten visibility.
- **Boosts**: Use the space bar to speed up the player’s car. Your boost level charges within the level.
- **Position Map**: Small, translucent map at the top right shows the player’s and cop’s relative positions.
- **Timer**: Displays completion time for each level.

### Mechanics

#### Barriers + Obstacles

- Other cars on the road move more slowly than the player’s car. Collisions cause a game loss.
- Additional obstacles like potholes (slow the player briefly) and construction areas appear in later levels.

### Aesthetics

#### Visual Style

- Warm + futuristic, offering smooth visuals and a positive vibe to keep players engaged.
- Cars look realistic yet futuristic, with recognizable design elements to entice purchases.
- The road appears to move beneath the car, enhancing immersion.

#### Terrain Features

- Rainy levels show visual wetness/raindrops on-screen.
- Night levels are dark until headlights illuminate the area around the car.

#### Typography

- Lato for its warmth and readability. Bold text on the homescreen.

#### Color Scheme

- **Daytime**: Autumn colors (red, orange, yellow).
- **Nighttime/Rain**: Darkish blue surroundings.

#### Layout

- Gameplay screen is mostly clear, with minimal UI elements: map (top left), pause (top right), speed (bottom right).
- The start screen features moving cars in the background, with the "Play Now" button as the main focus.


