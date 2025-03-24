export type CategoryPurpose = "primary" | "secondary" | "contextual";

export type PlaceType = {
  id: string;
  name: string;
  baseWeight?: number;
};

export type CategoryGroup = {
  id: string;
  title: string;
  query: string;
  types: PlaceType[];
  purpose: CategoryPurpose;
  weight?: number;
  metadata?: {
    timeAppropriate?: {
      morning?: boolean;
      lunch?: boolean;
      afternoon?: boolean;
      evening?: boolean;
      lateNight?: boolean;
    };
    requiresUserIntent?: boolean;
    minimumInteractionCount?: number;
  };
};

export const CATEGORY_GROUPS: Record<string, CategoryGroup> = {
  restaurants: {
    id: "restaurants",
    title: "Restaurants",
    query: "restaurants",
    purpose: "primary",
    types: [
      { id: "restaurant", name: "Restaurants", baseWeight: 30 },
      { id: "fast_food_restaurant", name: "Fast Food", baseWeight: 10 },
      { id: "japanese_restaurant", name: "Japanese Food", baseWeight: 10 },
      { id: "italian_restaurant", name: "Italian Food", baseWeight: 10 },
      { id: "mexican_restaurant", name: "Mexican Food", baseWeight: 10 },
      { id: "chinese_restaurant", name: "Chinese Food", baseWeight: 10 },
      { id: "indian_restaurant", name: "Indian Food", baseWeight: 10 },
      { id: "thai_restaurant", name: "Thai Food", baseWeight: 10 },
      { id: "vietnamese_restaurant", name: "Vietnamese Food", baseWeight: 10 },
      { id: "korean_restaurant", name: "Korean Food", baseWeight: 10 },
      {
        id: "mediterranean_restaurant",
        name: "Mediterranean Food",
        baseWeight: 10,
      },
      { id: "greek_restaurant", name: "Greek Food", baseWeight: 10 },
      { id: "spanish_restaurant", name: "Spanish Food", baseWeight: 10 },
      { id: "french_restaurant", name: "French Food", baseWeight: 10 },
      { id: "steak_house", name: "Steakhouse", baseWeight: 10 },
      { id: "seafood_restaurant", name: "Seafood", baseWeight: 10 },
    ],
    weight: 30,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: true,
      },
    },
  },

  cafes: {
    id: "cafes",
    title: "Cafes",
    query: "cafe",
    purpose: "primary",
    types: [
      { id: "cafe", name: "Cafes", baseWeight: 25 },
      { id: "coffee_shop", name: "Coffee Shops", baseWeight: 15 },
      { id: "tea_house", name: "Tea Houses", baseWeight: 10 },
      { id: "bakery", name: "Bakeries", baseWeight: 10 },
      { id: "breakfast_restaurant", name: "Breakfast Spots", baseWeight: 10 },
      { id: "brunch_restaurant", name: "Brunch", baseWeight: 10 },
    ],
    weight: 25,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: true,
      },
    },
  },

  desserts: {
    id: "desserts",
    title: "Desserts",
    query: "dessert",
    purpose: "primary",
    types: [
      { id: "bakery", name: "Bakeries", baseWeight: 10 },
      { id: "ice_cream_shop", name: "Ice Cream", baseWeight: 10 },
      { id: "chocolate_shop", name: "Chocolate Shops", baseWeight: 10 },
      { id: "chocolate_factory", name: "Chocolate Factories", baseWeight: 10 },
      { id: "dessert_shop", name: "Dessert Shops", baseWeight: 10 },
      { id: "dessert_restaurant", name: "Dessert Restaurants", baseWeight: 10 },
      { id: "confectionery", name: "Confectioneries", baseWeight: 10 },
      { id: "candy_store", name: "Candy Stores", baseWeight: 10 },
      { id: "donut_shop", name: "Donut Shops", baseWeight: 10 },
      { id: "acai_shop", name: "Açaí Shops", baseWeight: 10 },
    ],
    weight: 15,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: true,
      },
    },
  },

  bars: {
    id: "bars",
    title: "Bars",
    query: "bar",
    purpose: "primary",
    types: [
      { id: "bar", name: "Bars", baseWeight: 10 },
      { id: "wine_bar", name: "Wine Bars", baseWeight: 10 },
      { id: "pub", name: "Pubs", baseWeight: 10 },
      { id: "night_club", name: "Night Clubs", baseWeight: 10 },
      { id: "bar_and_grill", name: "Bar & Grills", baseWeight: 10 },
    ],
    weight: 10,
    metadata: {
      timeAppropriate: {
        morning: false,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: true,
      },
    },
  },

  parks: {
    id: "parks",
    title: "Parks",
    query: "park",
    purpose: "primary",
    types: [
      { id: "park", name: "Parks", baseWeight: 10 },
      { id: "national_park", name: "National Parks", baseWeight: 10 },
      { id: "state_park", name: "State Parks", baseWeight: 10 },
      { id: "garden", name: "Gardens", baseWeight: 10 },
      { id: "botanical_garden", name: "Botanical Gardens", baseWeight: 10 },
      { id: "cycling_park", name: "Cycling Parks", baseWeight: 10 },
      { id: "dog_park", name: "Dog Parks", baseWeight: 10 },
      { id: "wildlife_park", name: "Wildlife Parks", baseWeight: 10 },
      { id: "wildlife_refuge", name: "Wildlife Refuges", baseWeight: 10 },
    ],
    weight: 20,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: false,
      },
    },
  },

  beaches: {
    id: "beaches",
    title: "Beaches",
    query: "beach",
    purpose: "primary",
    types: [{ id: "beach", name: "Beaches", baseWeight: 10 }],
    weight: 15,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: false,
      },
    },
  },

  hiking: {
    id: "hiking",
    title: "Hiking",
    query: "hiking",
    purpose: "primary",
    types: [
      { id: "hiking_area", name: "Hiking Areas", baseWeight: 10 },
      { id: "off_roading_area", name: "Off-Roading Areas", baseWeight: 10 },
    ],
    weight: 10,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: false,
        lateNight: false,
      },
    },
  },

  museums: {
    id: "museums",
    title: "Museums",
    query: "museum",
    purpose: "primary",
    types: [
      { id: "museum", name: "Museums", baseWeight: 10 },
      { id: "art_gallery", name: "Art Galleries", baseWeight: 10 },
      { id: "art_studio", name: "Art Studios", baseWeight: 10 },
      { id: "cultural_center", name: "Cultural Centers", baseWeight: 10 },
      { id: "planetarium", name: "Planetariums", baseWeight: 10 },
      { id: "aquarium", name: "Aquariums", baseWeight: 10 },
      { id: "cultural_landmark", name: "Cultural Landmarks", baseWeight: 10 },
    ],
    weight: 20,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: false,
      },
    },
  },

  landmarks: {
    id: "landmarks",
    title: "Landmarks",
    query: "landmark",
    purpose: "primary",
    types: [
      { id: "monument", name: "Monuments", baseWeight: 10 },
      {
        id: "historical_landmark",
        name: "Historical Landmarks",
        baseWeight: 10,
      },
      { id: "historical_place", name: "Historical Places", baseWeight: 10 },
      { id: "observation_deck", name: "Observation Decks", baseWeight: 10 },
      { id: "tourist_attraction", name: "Tourist Attractions", baseWeight: 10 },
      { id: "plaza", name: "Plazas", baseWeight: 10 },
    ],
    weight: 15,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: false,
      },
    },
  },

  arts: {
    id: "arts",
    title: "Arts",
    query: "theater",
    purpose: "primary",
    types: [
      { id: "movie_theater", name: "Movie Theaters", baseWeight: 10 },
      { id: "concert_hall", name: "Concert Halls", baseWeight: 10 },
      { id: "theater", name: "Theaters", baseWeight: 10 },
      {
        id: "performing_arts_theater",
        name: "Performing Arts Theaters",
        baseWeight: 10,
      },
    ],
    weight: 15,
    metadata: {
      timeAppropriate: {
        morning: false,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: true,
      },
    },
  },

  entertainment: {
    id: "entertainment",
    title: "Entertainment",
    query: "entertainment",
    purpose: "primary",
    types: [
      { id: "bowling_alley", name: "Bowling", baseWeight: 10 },
      { id: "karaoke", name: "Karaoke", baseWeight: 10 },
      { id: "arcade", name: "Arcades", baseWeight: 10 },
      { id: "game_store", name: "Game Stores", baseWeight: 10 },
      { id: "pool_hall", name: "Pool Halls", baseWeight: 10 },
      { id: "billiards", name: "Billiards", baseWeight: 10 },
    ],
    weight: 10,
    metadata: {
      timeAppropriate: {
        morning: false,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: true,
      },
    },
  },

  amusement: {
    id: "amusement",
    title: "Amusement Parks",
    query: "amusement park",
    purpose: "primary",
    types: [
      { id: "amusement_park", name: "Amusement Parks", baseWeight: 10 },
      { id: "water_park", name: "Water Parks", baseWeight: 10 },
      { id: "theme_park", name: "Theme Parks", baseWeight: 10 },
    ],
    weight: 15,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: false,
      },
    },
  },

  zoos: {
    id: "zoos",
    title: "Zoos",
    query: "zoo",
    purpose: "primary",
    types: [{ id: "zoo", name: "Zoos", baseWeight: 10 }],
    weight: 10,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: false,
      },
    },
  },

  fitness: {
    id: "fitness",
    title: "Fitness",
    query: "gym",
    purpose: "primary",
    types: [
      { id: "gym", name: "Gyms", baseWeight: 10 },
      { id: "fitness_center", name: "Fitness Centers", baseWeight: 10 },
      { id: "swimming_pool", name: "Swimming Pools", baseWeight: 10 },
      { id: "yoga_studio", name: "Yoga Studios", baseWeight: 10 },
    ],
    weight: 10,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: false,
      },
    },
  },

  sports: {
    id: "sports",
    title: "Sports",
    query: "stadium",
    purpose: "primary",
    types: [
      { id: "stadium", name: "Stadiums", baseWeight: 10 },
      { id: "sports_complex", name: "Sports Complexes", baseWeight: 10 },
      { id: "golf_course", name: "Golf Courses", baseWeight: 10 },
      { id: "ice_skating_rink", name: "Ice Skating Rinks", baseWeight: 10 },
      { id: "athletic_field", name: "Athletic Fields", baseWeight: 10 },
      { id: "skateboard_park", name: "Skateboard Parks", baseWeight: 10 },
    ],
    weight: 10,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: false,
      },
    },
  },

  wellness: {
    id: "wellness",
    title: "Spas",
    query: "spa",
    purpose: "primary",
    types: [
      { id: "spa", name: "Spas", baseWeight: 10 },
      { id: "wellness_center", name: "Wellness Centers", baseWeight: 10 },
      { id: "yoga_studio", name: "Yoga", baseWeight: 10 },
      { id: "massage", name: "Massage", baseWeight: 10 },
      { id: "sauna", name: "Saunas", baseWeight: 10 },
    ],
    weight: 10,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: false,
      },
    },
  },

  religious: {
    id: "religious",
    title: "Places of Worship",
    query: "place of worship",
    purpose: "contextual",
    types: [
      { id: "church", name: "Churches", baseWeight: 5 },
      { id: "hindu_temple", name: "Hindu Temples", baseWeight: 5 },
      { id: "mosque", name: "Mosques", baseWeight: 5 },
      { id: "synagogue", name: "Synagogues", baseWeight: 5 },
    ],
    weight: 5,
    metadata: {
      requiresUserIntent: true,
      minimumInteractionCount: 3,
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: false,
      },
    },
  },

  malls: {
    id: "malls",
    title: "Malls",
    query: "shopping mall",
    purpose: "primary",
    types: [
      { id: "shopping_mall", name: "Shopping Malls", baseWeight: 10 },
      { id: "department_store", name: "Department Stores", baseWeight: 10 },
    ],
    weight: 15,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: false,
      },
    },
  },

  markets: {
    id: "markets",
    title: "Markets",
    query: "market",
    purpose: "primary",
    types: [
      { id: "market", name: "Markets", baseWeight: 10 },
      { id: "farmer_market", name: "Farmer's Markets", baseWeight: 10 },
      { id: "flea_market", name: "Flea Markets", baseWeight: 10 },
      { id: "convenience_store", name: "Convenience Stores", baseWeight: 10 },
    ],
    weight: 10,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: true,
      },
    },
  },

  retail: {
    id: "retail",
    title: "Retail",
    query: "store",
    purpose: "primary",
    types: [
      { id: "clothing_store", name: "Clothing Stores", baseWeight: 10 },
      { id: "jewelry_store", name: "Jewelry Stores", baseWeight: 10 },
      { id: "book_store", name: "Book Stores", baseWeight: 10 },
      { id: "gift_shop", name: "Gift Shops", baseWeight: 10 },
      { id: "electronics_store", name: "Electronics Stores", baseWeight: 10 },
      { id: "home_goods_store", name: "Home Goods", baseWeight: 10 },
      { id: "toy_store", name: "Toy Stores", baseWeight: 10 },
      { id: "sporting_goods_store", name: "Sporting Goods", baseWeight: 10 },
    ],
    weight: 15,
    metadata: {
      timeAppropriate: {
        morning: true,
        lunch: true,
        afternoon: true,
        evening: true,
        lateNight: false,
      },
    },
  },
};

// Helper function to find which category group a place type belongs to
export function findCategoryGroupForType(
  placeType: string,
): CategoryGroup | null {
  for (const [, group] of Object.entries(CATEGORY_GROUPS)) {
    for (const type of group.types) {
      if (type.id === placeType) {
        return group;
      }
    }
  }
  return null;
}

// Helper function to get primary category groups
export function getPrimaryCategoryGroups(): CategoryGroup[] {
  return Object.values(CATEGORY_GROUPS).filter(
    (group) => group.purpose === "primary",
  );
}

// Helper function to get contextual category groups
export function getContextualCategoryGroups(): CategoryGroup[] {
  return Object.values(CATEGORY_GROUPS).filter(
    (group) => group.purpose === "contextual",
  );
}

// Helper function to get related types within a category
export function getRelatedTypesInCategory(
  categoryGroup: CategoryGroup,
  userPreferences: { placeType: string; count: number }[],
): PlaceType[] {
  // Get types the user has interacted with in this category
  const userTypes = new Set(
    userPreferences
      .filter((pref) =>
        categoryGroup.types.some((t) => t.id === pref.placeType),
      )
      .map((pref) => pref.placeType),
  );

  // If user has interacted with any type in this category,
  // suggest other types from the same category
  if (userTypes.size > 0) {
    return categoryGroup.types.filter((type) => !userTypes.has(type.id));
  }

  return [];
}

// Helper function to get specific type suggestions based on user preferences
export function getSpecificTypeSuggestions(
  userPreferences: { placeType: string; count: number }[],
  maxSuggestions: number = 5,
): CategoryGroup[] {
  const suggestions: CategoryGroup[] = [];
  const typeCounts = new Map<string, number>();
  const categoryInteractions = new Map<string, number>();
  const userTypes = new Set(userPreferences.map((pref) => pref.placeType));

  // Count occurrences of each type and category
  userPreferences.forEach((pref) => {
    typeCounts.set(
      pref.placeType,
      (typeCounts.get(pref.placeType) || 0) + pref.count,
    );

    const group = findCategoryGroupForType(pref.placeType);
    if (group) {
      categoryInteractions.set(
        group.id,
        (categoryInteractions.get(group.id) || 0) + pref.count,
      );
    }
  });

  // First, add specific type suggestions for highly interacted types
  for (const [type, count] of typeCounts.entries()) {
    const group = findCategoryGroupForType(type);
    if (group && count >= (group.metadata?.minimumInteractionCount || 0)) {
      const typeInfo = group.types.find((t) => t.id === type);
      if (typeInfo) {
        suggestions.push({
          id: `${group.id}_${type}`,
          title: typeInfo.name,
          query: typeInfo.name.toLowerCase(),
          purpose: "primary",
          types: [typeInfo],
          weight: typeInfo.baseWeight || group.weight || 10,
        });
      }
    }
  }

  // Then, add related type suggestions for categories with high interaction
  for (const [categoryId, count] of categoryInteractions.entries()) {
    const group = CATEGORY_GROUPS[categoryId];
    if (group && count >= 2) {
      // Lower threshold to 2 interactions
      const relatedTypes = getRelatedTypesInCategory(group, userPreferences);
      if (relatedTypes.length > 0) {
        // Create a suggestion for each related type
        relatedTypes.forEach((type) => {
          suggestions.push({
            id: `${group.id}_${type.id}`,
            title: type.name,
            query: type.name.toLowerCase(),
            purpose: "primary",
            types: [type],
            weight: type.baseWeight || group.weight || 10,
          });
        });
      }
    }
  }

  // Sort by weight and take top suggestions
  return suggestions
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .slice(0, maxSuggestions);
}

// Helper function to check if current time is critical
function isTimeCritical(hour: number): boolean {
  // Critical times: 7-10am (breakfast), 11:30am-2pm (lunch), 6-8pm (dinner)
  return (
    (hour >= 7 && hour < 10) ||
    (hour >= 11.5 && hour < 14) ||
    (hour >= 18 && hour < 20)
  );
}

// Helper function to get exploration suggestions within categories
export function getCategoryExplorationSuggestions(
  userPreferences: { placeType: string; count: number }[],
  excludeIds: Set<string>,
  maxSuggestions: number = 5,
  currentHour: number = new Date().getHours(),
): CategoryGroup[] {
  const suggestions: CategoryGroup[] = [];
  const userTypes = new Set(userPreferences.map((pref) => pref.placeType));
  const userCategories = new Set(
    userPreferences
      .map((pref) => findCategoryGroupForType(pref.placeType)?.id)
      .filter((id): id is string => id !== null),
  );

  // Check if we should include random exploration (10% chance during non-critical times)
  const shouldIncludeRandom =
    !isTimeCritical(currentHour) &&
    Math.random() < 0.1 &&
    userPreferences.length >= 10; // Only after user has established preferences

  // For each category the user has interacted with
  for (const categoryId of userCategories) {
    const group = CATEGORY_GROUPS[categoryId];
    if (!group || excludeIds.has(group.id)) continue;

    // Get types the user hasn't interacted with in this category
    const unexploredTypes = group.types.filter(
      (type) => !userTypes.has(type.id),
    );

    if (unexploredTypes.length > 0) {
      // Randomly select up to 2 types from this category
      const selectedTypes = unexploredTypes
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      selectedTypes.forEach((type) => {
        suggestions.push({
          id: `${group.id}_${type.id}`,
          title: type.name,
          query: type.name.toLowerCase(),
          purpose: "primary",
          types: [type],
          weight: type.baseWeight || group.weight || 10,
        });
      });
    }
  }

  // If we should include random exploration, add one random category
  if (shouldIncludeRandom) {
    const allCategories = Object.values(CATEGORY_GROUPS).filter(
      (group) => !excludeIds.has(group.id) && !userCategories.has(group.id),
    );

    if (allCategories.length > 0) {
      const randomCategory =
        allCategories[Math.floor(Math.random() * allCategories.length)];
      const randomType =
        randomCategory.types[
          Math.floor(Math.random() * randomCategory.types.length)
        ];

      suggestions.push({
        id: `${randomCategory.id}_${randomType.id}`,
        title: randomType.name,
        query: randomType.name.toLowerCase(),
        purpose: "primary",
        types: [randomType],
        weight: randomType.baseWeight || randomCategory.weight || 10,
      });
    }
  }

  return suggestions.slice(0, maxSuggestions);
}

// Helper function to get category groups from a list of types
export function getCategoryGroupsFromTypes(types: string[]): CategoryGroup[] {
  const groups = new Set<CategoryGroup>();

  types.forEach((type) => {
    const group = findCategoryGroupForType(type);
    if (group) {
      groups.add(group);
    }
  });

  return Array.from(groups);
}

// Fallback suggestions for when no user preferences are available
export const fallbackSuggestions: CategoryGroup[] = [
  {
    id: "restaurants",
    title: "Restaurants",
    query: "restaurants",
    purpose: "primary",
    types: [{ id: "restaurant", name: "Restaurants", baseWeight: 30 }],
  },
  {
    id: "cafes",
    title: "Cafes",
    query: "cafes",
    purpose: "primary",
    types: [{ id: "cafe", name: "Cafes", baseWeight: 25 }],
  },
  {
    id: "parks",
    title: "Parks",
    query: "parks",
    purpose: "primary",
    types: [{ id: "park", name: "Parks", baseWeight: 10 }],
  },
  {
    id: "museums",
    title: "Museums",
    query: "museums",
    purpose: "primary",
    types: [{ id: "museum", name: "Museums", baseWeight: 10 }],
  },
  {
    id: "shopping",
    title: "Shopping",
    query: "shopping",
    purpose: "primary",
    types: [{ id: "shopping_mall", name: "Shopping Malls", baseWeight: 10 }],
  },
  {
    id: "bakeries",
    title: "Bakeries",
    query: "bakeries",
    purpose: "primary",
    types: [{ id: "bakery", name: "Bakeries", baseWeight: 10 }],
  },
];
