import type { CategoryGroup } from "@/types/categories";

export type CategoryPurpose = "primary" | "secondary" | "contextual";

export type PlaceType = {
  id: string;
  name: string;
  baseWeight?: number;
  imageUrl?: string;
};

export const CATEGORY_GROUPS: Record<string, CategoryGroup> = {
  restaurants: {
    id: "restaurants",
    title: "Restaurants",
    query: "restaurants",
    purpose: "primary",
    imageUrl: undefined,
    types: [
      {
        id: "restaurant",
        name: "Restaurants",
        baseWeight: 30,
        imageUrl: undefined,
      },
      {
        id: "fast_food_restaurant",
        name: "Fast Food",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "japanese_restaurant",
        name: "Japanese Food",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "italian_restaurant",
        name: "Italian Food",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "mexican_restaurant",
        name: "Mexican Food",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "chinese_restaurant",
        name: "Chinese Food",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "indian_restaurant",
        name: "Indian Food",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "thai_restaurant",
        name: "Thai Food",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "vietnamese_restaurant",
        name: "Vietnamese Food",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "korean_restaurant",
        name: "Korean Food",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "mediterranean_restaurant",
        name: "Mediterranean Food",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "greek_restaurant",
        name: "Greek Food",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "spanish_restaurant",
        name: "Spanish Food",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "french_restaurant",
        name: "French Food",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "steak_house",
        name: "Steakhouse",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "seafood_restaurant",
        name: "Seafood",
        baseWeight: 10,
        imageUrl: undefined,
      },
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
    imageUrl: undefined,
    types: [
      { id: "cafe", name: "Cafes", baseWeight: 25, imageUrl: undefined },
      {
        id: "coffee_shop",
        name: "Coffee Shops",
        baseWeight: 15,
        imageUrl: undefined,
      },
      {
        id: "tea_house",
        name: "Tea Houses",
        baseWeight: 10,
        imageUrl: undefined,
      },
      { id: "bakery", name: "Bakeries", baseWeight: 10, imageUrl: undefined },
      {
        id: "breakfast_restaurant",
        name: "Breakfast Spots",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "brunch_restaurant",
        name: "Brunch",
        baseWeight: 10,
        imageUrl: undefined,
      },
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
    imageUrl: undefined,
    types: [
      { id: "bakery", name: "Bakeries", baseWeight: 10, imageUrl: undefined },
      {
        id: "ice_cream_shop",
        name: "Ice Cream",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "chocolate_shop",
        name: "Chocolate Shops",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "chocolate_factory",
        name: "Chocolate Factories",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "dessert_shop",
        name: "Dessert Shops",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "dessert_restaurant",
        name: "Dessert Restaurants",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "confectionery",
        name: "Confectioneries",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "candy_store",
        name: "Candy Stores",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "donut_shop",
        name: "Donut Shops",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "acai_shop",
        name: "Açaí Shops",
        baseWeight: 10,
        imageUrl: undefined,
      },
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
    imageUrl: undefined,
    types: [
      { id: "bar", name: "Bars", baseWeight: 10, imageUrl: undefined },
      {
        id: "wine_bar",
        name: "Wine Bars",
        baseWeight: 10,
        imageUrl: undefined,
      },
      { id: "pub", name: "Pubs", baseWeight: 10, imageUrl: undefined },
      {
        id: "night_club",
        name: "Night Clubs",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "bar_and_grill",
        name: "Bar & Grills",
        baseWeight: 10,
        imageUrl: undefined,
      },
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
    imageUrl: undefined,
    types: [
      { id: "park", name: "Parks", baseWeight: 10, imageUrl: undefined },
      {
        id: "national_park",
        name: "National Parks",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "state_park",
        name: "State Parks",
        baseWeight: 10,
        imageUrl: undefined,
      },
      { id: "garden", name: "Gardens", baseWeight: 10, imageUrl: undefined },
      {
        id: "botanical_garden",
        name: "Botanical Gardens",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "cycling_park",
        name: "Cycling Parks",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "dog_park",
        name: "Dog Parks",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "wildlife_park",
        name: "Wildlife Parks",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "wildlife_refuge",
        name: "Wildlife Refuges",
        baseWeight: 10,
        imageUrl: undefined,
      },
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
    imageUrl: undefined,
    types: [
      { id: "beach", name: "Beaches", baseWeight: 10, imageUrl: undefined },
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

  hiking: {
    id: "hiking",
    title: "Hiking",
    query: "hiking",
    purpose: "primary",
    imageUrl: undefined,
    types: [
      {
        id: "hiking_area",
        name: "Hiking Areas",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "off_roading_area",
        name: "Off-Roading Areas",
        baseWeight: 10,
        imageUrl: undefined,
      },
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
    imageUrl: undefined,
    types: [
      { id: "museum", name: "Museums", baseWeight: 10, imageUrl: undefined },
      {
        id: "art_gallery",
        name: "Art Galleries",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "art_studio",
        name: "Art Studios",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "cultural_center",
        name: "Cultural Centers",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "planetarium",
        name: "Planetariums",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "aquarium",
        name: "Aquariums",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "cultural_landmark",
        name: "Cultural Landmarks",
        baseWeight: 10,
        imageUrl: undefined,
      },
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
    imageUrl: undefined,
    types: [
      {
        id: "monument",
        name: "Monuments",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "historical_landmark",
        name: "Historical Landmarks",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "historical_place",
        name: "Historical Places",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "observation_deck",
        name: "Observation Decks",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "tourist_attraction",
        name: "Tourist Attractions",
        baseWeight: 10,
        imageUrl: undefined,
      },
      { id: "plaza", name: "Plazas", baseWeight: 10, imageUrl: undefined },
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
    imageUrl: undefined,
    types: [
      {
        id: "movie_theater",
        name: "Movie Theaters",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "concert_hall",
        name: "Concert Halls",
        baseWeight: 10,
        imageUrl: undefined,
      },
      { id: "theater", name: "Theaters", baseWeight: 10, imageUrl: undefined },
      {
        id: "performing_arts_theater",
        name: "Performing Arts Theaters",
        baseWeight: 10,
        imageUrl: undefined,
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
    imageUrl: undefined,
    types: [
      {
        id: "bowling_alley",
        name: "Bowling",
        baseWeight: 10,
        imageUrl: undefined,
      },
      { id: "karaoke", name: "Karaoke", baseWeight: 10, imageUrl: undefined },
      { id: "arcade", name: "Arcades", baseWeight: 10, imageUrl: undefined },
      {
        id: "game_store",
        name: "Game Stores",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "pool_hall",
        name: "Pool Halls",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "billiards",
        name: "Billiards",
        baseWeight: 10,
        imageUrl: undefined,
      },
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
    imageUrl: undefined,
    types: [
      {
        id: "amusement_park",
        name: "Amusement Parks",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "water_park",
        name: "Water Parks",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "theme_park",
        name: "Theme Parks",
        baseWeight: 10,
        imageUrl: undefined,
      },
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
    imageUrl: undefined,
    types: [{ id: "zoo", name: "Zoos", baseWeight: 10, imageUrl: undefined }],
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
    imageUrl: undefined,
    types: [
      { id: "gym", name: "Gyms", baseWeight: 10, imageUrl: undefined },
      {
        id: "fitness_center",
        name: "Fitness Centers",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "swimming_pool",
        name: "Swimming Pools",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "yoga_studio",
        name: "Yoga Studios",
        baseWeight: 10,
        imageUrl: undefined,
      },
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
    imageUrl: undefined,
    types: [
      { id: "stadium", name: "Stadiums", baseWeight: 10, imageUrl: undefined },
      {
        id: "sports_complex",
        name: "Sports Complexes",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "golf_course",
        name: "Golf Courses",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "ice_skating_rink",
        name: "Ice Skating Rinks",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "athletic_field",
        name: "Athletic Fields",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "skateboard_park",
        name: "Skateboard Parks",
        baseWeight: 10,
        imageUrl: undefined,
      },
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
    imageUrl: undefined,
    types: [
      { id: "spa", name: "Spas", baseWeight: 10, imageUrl: undefined },
      {
        id: "wellness_center",
        name: "Wellness Centers",
        baseWeight: 10,
        imageUrl: undefined,
      },
      { id: "yoga_studio", name: "Yoga", baseWeight: 10, imageUrl: undefined },
      { id: "massage", name: "Massage", baseWeight: 10, imageUrl: undefined },
      { id: "sauna", name: "Saunas", baseWeight: 10, imageUrl: undefined },
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
    imageUrl: undefined,
    types: [
      { id: "church", name: "Churches", baseWeight: 5, imageUrl: undefined },
      {
        id: "hindu_temple",
        name: "Hindu Temples",
        baseWeight: 5,
        imageUrl: undefined,
      },
      { id: "mosque", name: "Mosques", baseWeight: 5, imageUrl: undefined },
      {
        id: "synagogue",
        name: "Synagogues",
        baseWeight: 5,
        imageUrl: undefined,
      },
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
    imageUrl: undefined,
    types: [
      {
        id: "shopping_mall",
        name: "Shopping Malls",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "department_store",
        name: "Department Stores",
        baseWeight: 10,
        imageUrl: undefined,
      },
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
    imageUrl: undefined,
    types: [
      { id: "market", name: "Markets", baseWeight: 10, imageUrl: undefined },
      {
        id: "farmer_market",
        name: "Farmer's Markets",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "flea_market",
        name: "Flea Markets",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "convenience_store",
        name: "Convenience Stores",
        baseWeight: 10,
        imageUrl: undefined,
      },
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
    imageUrl: undefined,
    types: [
      {
        id: "clothing_store",
        name: "Clothing Stores",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "jewelry_store",
        name: "Jewelry Stores",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "book_store",
        name: "Book Stores",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "gift_shop",
        name: "Gift Shops",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "electronics_store",
        name: "Electronics Stores",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "home_goods_store",
        name: "Home Goods",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "toy_store",
        name: "Toy Stores",
        baseWeight: 10,
        imageUrl: undefined,
      },
      {
        id: "sporting_goods_store",
        name: "Sporting Goods",
        baseWeight: 10,
        imageUrl: undefined,
      },
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

// Fallback suggestions for when no user preferences are available
export const fallbackSuggestions: CategoryGroup[] = [
  {
    id: "restaurants",
    title: "Restaurants",
    query: "restaurants",
    purpose: "primary",
    imageUrl: undefined,
    types: [
      {
        id: "restaurant",
        name: "Restaurants",
        baseWeight: 30,
        imageUrl: undefined,
      },
    ],
  },
  {
    id: "cafes",
    title: "Cafes",
    query: "cafes",
    purpose: "primary",
    imageUrl: undefined,
    types: [{ id: "cafe", name: "Cafes", baseWeight: 25, imageUrl: undefined }],
  },
  {
    id: "parks",
    title: "Parks",
    query: "parks",
    purpose: "primary",
    imageUrl: undefined,
    types: [{ id: "park", name: "Parks", baseWeight: 10, imageUrl: undefined }],
  },
  {
    id: "museums",
    title: "Museums",
    query: "museums",
    purpose: "primary",
    imageUrl: undefined,
    types: [
      { id: "museum", name: "Museums", baseWeight: 10, imageUrl: undefined },
    ],
  },
  {
    id: "shopping",
    title: "Shopping",
    query: "shopping",
    purpose: "primary",
    imageUrl: undefined,
    types: [
      {
        id: "shopping_mall",
        name: "Shopping Malls",
        baseWeight: 10,
        imageUrl: undefined,
      },
    ],
  },
  {
    id: "bakeries",
    title: "Bakeries",
    query: "bakeries",
    purpose: "primary",
    imageUrl: undefined,
    types: [
      { id: "bakery", name: "Bakeries", baseWeight: 10, imageUrl: undefined },
    ],
  },
];
