## player class:

inventory (P2): Cosmetic items (liveries, rims, colors) are deferred for future iterations.


## car class:

cosmetics (P2): Visual customization options are deferred for future iterations.
headlightsOn (P2): Headlight feature is omitted as it does not contribute to core gameplay.

## level class

copCarModel (P2): Deferred; a default cop car model will be used for MVP.
weatherType, visibility, isRaining, windshieldWipersOn, timeOfDay (P2): All weather-related features are omitted as non-essential for MVP.

## controlScheme class

wipersKey (P2): Excluded as weather features are not implemented in MVP.
headlightsKey (P2): Deferred as non-critical for initial gameplay.



#### Class: Cosmetics

Contains cosmetic attributes for cars.

**Variables:**

- `color`: String  
  Color of the car's body.

- `rims`: String  
  Design of the car's rims.

- `livery`: String  
  Graphics or decals applied to the car.

  
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