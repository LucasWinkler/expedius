export type CategoryGroup = {
  id: string;
  title: string;
  query: string;
  types: string[];
  weight?: number; // Weight for exploration suggestions
  metadata?: {
    timeAppropriate?: {
      morning?: boolean; // 6am-11am
      lunch?: boolean; // 11am-3pm
      afternoon?: boolean; // 3pm-5pm
      evening?: boolean; // 5pm-10pm
      lateNight?: boolean; // 10pm-6am
    };
  };
};

// Group place types into logical categories for better organization and discovery
export const CATEGORY_GROUPS: Record<string, CategoryGroup> = {
  restaurants: {
    id: "restaurants",
    title: "Restaurants",
    query: "restaurants",
    types: [
      "restaurant",
      "american_restaurant",
      "asian_restaurant",
      "african_restaurant",
      "brazilian_restaurant",
      "chinese_restaurant",
      "french_restaurant",
      "greek_restaurant",
      "hamburger_restaurant",
      "indian_restaurant",
      "indonesian_restaurant",
      "italian_restaurant",
      "japanese_restaurant",
      "korean_restaurant",
      "lebanese_restaurant",
      "mediterranean_restaurant",
      "mexican_restaurant",
      "middle_eastern_restaurant",
      "pizza_restaurant",
      "seafood_restaurant",
      "spanish_restaurant",
      "steak_house",
      "thai_restaurant",
      "turkish_restaurant",
      "vietnamese_restaurant",
      "buffet_restaurant",
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
    query: "cafes",
    types: [
      "cafe",
      "coffee_shop",
      "tea_house",
      "bakery",
      "breakfast_restaurant",
      "brunch_restaurant",
      "cat_cafe",
      "dog_cafe",
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
    query: "desserts",
    types: [
      "bakery",
      "ice_cream_shop",
      "chocolate_shop",
      "chocolate_factory",
      "dessert_shop",
      "dessert_restaurant",
      "confectionery",
      "candy_store",
      "donut_shop",
      "acai_shop",
    ],
    weight: 15,
  },

  bars: {
    id: "bars",
    title: "Bars",
    query: "bars",
    types: ["bar", "wine_bar", "pub", "night_club", "bar_and_grill"],
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
    query: "parks",
    types: [
      "park",
      "national_park",
      "state_park",
      "garden",
      "botanical_garden",
      "cycling_park",
      "dog_park",
      "wildlife_park",
      "wildlife_refuge",
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
    query: "beaches",
    types: ["beach", "marina"],
    weight: 15,
  },

  hiking: {
    id: "hiking",
    title: "Hiking",
    query: "hiking trails",
    types: ["hiking_area", "off_roading_area"],
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
    query: "museums",
    types: [
      "museum",
      "art_gallery",
      "art_studio",
      "cultural_center",
      "planetarium",
      "aquarium",
      "cultural_landmark",
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
    query: "landmarks",
    types: [
      "monument",
      "historical_landmark",
      "historical_place",
      "observation_deck",
      "tourist_attraction",
      "plaza",
    ],
    weight: 15,
  },

  entertainment: {
    id: "entertainment",
    title: "Entertainment",
    query: "entertainment",
    types: [
      "movie_theater",
      "concert_hall",
      "comedy_club",
      "theater",
      "performing_arts_theater",
      "karaoke",
      "bowling_alley",
      "casino",
      "amusement_park",
      "water_park",
      "zoo",
    ],
    weight: 20,
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

  shopping: {
    id: "shopping",
    title: "Shopping",
    query: "shopping",
    types: [
      "shopping_mall",
      "department_store",
      "market",
      "clothing_store",
      "jewelry_store",
      "book_store",
      "gift_shop",
      "electronics_store",
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

  hotels: {
    id: "hotels",
    title: "Hotels",
    query: "hotels",
    types: [
      "hotel",
      "resort_hotel",
      "extended_stay_hotel",
      "motel",
      "inn",
      "bed_and_breakfast",
      "hostel",
      "guest_house",
    ],
    weight: 5,
  },

  sports: {
    id: "sports",
    title: "Sports",
    query: "sports venues",
    types: [
      "stadium",
      "sports_complex",
      "golf_course",
      "gym",
      "fitness_center",
      "swimming_pool",
      "ice_skating_rink",
      "athletic_field",
      "skateboard_park",
    ],
    weight: 10,
  },

  wellness: {
    id: "wellness",
    title: "Wellness",
    query: "wellness",
    types: ["spa", "wellness_center", "yoga_studio", "massage", "sauna"],
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

  transport: {
    id: "transport",
    title: "Transport",
    query: "transport",
    types: [
      "airport",
      "train_station",
      "bus_station",
      "ferry_terminal",
      "transit_station",
      "subway_station",
    ],
    weight: 5,
  },

  religious: {
    id: "religious",
    title: "Religious Sites",
    query: "religious sites",
    types: ["church", "hindu_temple", "mosque", "synagogue"],
    weight: 5,
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
    if (group.types.includes(placeType)) {
      return group;
    }
  }
  return null;
}

// Helper function to get category groups from a list of place types
export function getCategoryGroupsFromTypes(
  placeTypes: string[],
): CategoryGroup[] {
  const groupMap = new Map<string, CategoryGroup>();

  for (const type of placeTypes) {
    const group = findCategoryGroupForType(type);
    if (group && !groupMap.has(group.id)) {
      groupMap.set(group.id, group);
    }
  }

  return Array.from(groupMap.values());
}

export const DEFAULT_CATEGORY_GROUPS = [
  CATEGORY_GROUPS.restaurants,
  CATEGORY_GROUPS.cafes,
  CATEGORY_GROUPS.parks,
  CATEGORY_GROUPS.museums,
  CATEGORY_GROUPS.shopping,
];

export const MORNING_CATEGORY_GROUPS = [
  CATEGORY_GROUPS.cafes,
  CATEGORY_GROUPS.restaurants,
  CATEGORY_GROUPS.parks,
  CATEGORY_GROUPS.shopping,
  CATEGORY_GROUPS.museums,
];

export const LUNCH_CATEGORY_GROUPS = [
  CATEGORY_GROUPS.restaurants,
  CATEGORY_GROUPS.cafes,
  CATEGORY_GROUPS.shopping,
  CATEGORY_GROUPS.parks,
  CATEGORY_GROUPS.landmarks,
];

export const EVENING_CATEGORY_GROUPS = [
  CATEGORY_GROUPS.restaurants,
  CATEGORY_GROUPS.bars,
  CATEGORY_GROUPS.entertainment,
  CATEGORY_GROUPS.shopping,
  CATEGORY_GROUPS.landmarks,
];
