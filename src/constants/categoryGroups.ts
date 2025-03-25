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
    imageUrl: "/categories/restaurants.jpg",
    types: [
      {
        id: "restaurant",
        name: "Restaurants",
        baseWeight: 30,
        imageUrl: "/categories/restaurants.jpg",
      },
      {
        id: "fast_food_restaurant",
        name: "Fast Food",
        baseWeight: 10,
        imageUrl: "/categories/fast-food.jpg",
      },
      {
        id: "japanese_restaurant",
        name: "Japanese Food",
        baseWeight: 10,
        imageUrl: "/categories/japanese.jpg",
      },
      {
        id: "italian_restaurant",
        name: "Italian Food",
        baseWeight: 10,
        imageUrl: "/categories/italian.jpg",
      },
      {
        id: "mexican_restaurant",
        name: "Mexican Food",
        baseWeight: 10,
        imageUrl: "/categories/mexican.jpg",
      },
      {
        id: "chinese_restaurant",
        name: "Chinese Food",
        baseWeight: 10,
        imageUrl: "/categories/chinese.jpg",
      },
      {
        id: "indian_restaurant",
        name: "Indian Food",
        baseWeight: 10,
        imageUrl: "/categories/indian.jpg",
      },
      {
        id: "thai_restaurant",
        name: "Thai Food",
        baseWeight: 10,
        imageUrl: "/categories/thai.jpg",
      },
      {
        id: "vietnamese_restaurant",
        name: "Vietnamese Food",
        baseWeight: 10,
        imageUrl: "/categories/vietnamese.jpg",
      },
      {
        id: "korean_restaurant",
        name: "Korean Food",
        baseWeight: 10,
        imageUrl: "/categories/korean.jpg",
      },
      {
        id: "mediterranean_restaurant",
        name: "Mediterranean Food",
        baseWeight: 10,
        imageUrl: "/categories/mediterranean.jpg",
      },
      {
        id: "greek_restaurant",
        name: "Greek Food",
        baseWeight: 10,
        imageUrl: "/categories/greek.jpg",
      },
      {
        id: "spanish_restaurant",
        name: "Spanish Food",
        baseWeight: 10,
        imageUrl: "/categories/spanish.jpg",
      },
      {
        id: "french_restaurant",
        name: "French Food",
        baseWeight: 10,
        imageUrl: "/categories/french.jpg",
      },
      {
        id: "steak_house",
        name: "Steakhouse",
        baseWeight: 10,
        imageUrl: "/categories/steakhouse.jpg",
      },
      {
        id: "seafood_restaurant",
        name: "Seafood",
        baseWeight: 10,
        imageUrl: "/categories/seafood.jpg",
      },
      {
        id: "bar_and_grill",
        name: "Bar & Grills",
        baseWeight: 10,
        imageUrl: "/categories/bar-and-grill.jpg",
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
    imageUrl: "/categories/cafes.jpg",
    types: [
      {
        id: "cafe",
        name: "Cafes",
        baseWeight: 25,
        imageUrl: "/categories/cafes.jpg",
      },
      {
        id: "coffee_shop",
        name: "Coffee Shops",
        baseWeight: 15,
        imageUrl: "/categories/coffee.jpg",
      },
      {
        id: "tea_house",
        name: "Tea Houses",
        baseWeight: 10,
        imageUrl: "/categories/tea.jpg",
      },
      {
        id: "bakery",
        name: "Bakeries",
        baseWeight: 10,
        imageUrl: "/categories/bakery.jpg",
      },
      {
        id: "breakfast_restaurant",
        name: "Breakfast Spots",
        baseWeight: 10,
        imageUrl: "/categories/breakfast.jpg",
      },
      {
        id: "brunch_restaurant",
        name: "Brunch",
        baseWeight: 10,
        imageUrl: "/categories/brunch.jpg",
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
    imageUrl: "/categories/desserts.jpg",
    types: [
      {
        id: "dessert_shop",
        name: "Dessert Shops",
        baseWeight: 10,
        imageUrl: "/categories/desserts.jpg",
      },
      {
        id: "bakery",
        name: "Bakeries",
        baseWeight: 10,
        imageUrl: "/categories/bakery.jpg",
      },
      {
        id: "ice_cream_shop",
        name: "Ice Cream",
        baseWeight: 10,
        imageUrl: "/categories/ice-cream.jpg",
      },
      {
        id: "chocolate_shop",
        name: "Chocolate Shops",
        baseWeight: 10,
        imageUrl: "/categories/chocolate.jpg",
      },
      {
        id: "chocolate_factory",
        name: "Chocolate Factories",
        baseWeight: 10,
        imageUrl: "/categories/chocolate.jpg",
      },
      {
        id: "dessert_restaurant",
        name: "Dessert Restaurants",
        baseWeight: 10,
        imageUrl: "/categories/desserts.jpg",
      },
      {
        id: "confectionery",
        name: "Confectioneries",
        baseWeight: 10,
        imageUrl: "/categories/chocolate.jpg",
      },
      {
        id: "candy_store",
        name: "Candy Stores",
        baseWeight: 10,
        imageUrl: "/categories/candy.jpg",
      },
      {
        id: "donut_shop",
        name: "Donut Shops",
        baseWeight: 10,
        imageUrl: "/categories/donuts.jpg",
      },
      {
        id: "acai_shop",
        name: "Açaí Shops",
        baseWeight: 10,
        imageUrl: "/categories/acai.jpg",
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
    imageUrl: "/categories/bars.jpg",
    types: [
      {
        id: "bar",
        name: "Bars",
        baseWeight: 10,
        imageUrl: "/categories/bars.jpg",
      },
      {
        id: "wine_bar",
        name: "Wine Bars",
        baseWeight: 10,
        imageUrl: "/categories/wine.jpg",
      },
      {
        id: "pub",
        name: "Pubs",
        baseWeight: 10,
        imageUrl: "/categories/pub.jpg",
      },
      {
        id: "night_club",
        name: "Night Clubs",
        baseWeight: 10,
        imageUrl: "/categories/night-club.jpg",
      },
      {
        id: "bar_and_grill",
        name: "Bar & Grills",
        baseWeight: 10,
        imageUrl: "/categories/bar-and-grill.jpg",
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
    imageUrl: "/categories/park.jpg",
    types: [
      {
        id: "park",
        name: "Parks",
        baseWeight: 10,
        imageUrl: "/categories/park.jpg",
      },
      {
        id: "national_park",
        name: "National Parks",
        baseWeight: 10,
        imageUrl: "/categories/national-park.jpg",
      },
      {
        id: "state_park",
        name: "State Parks",
        baseWeight: 10,
        imageUrl: "/categories/state-park.jpg",
      },
      {
        id: "garden",
        name: "Gardens",
        baseWeight: 10,
        imageUrl: "/categories/garden.jpg",
      },
      {
        id: "botanical_garden",
        name: "Botanical Gardens",
        baseWeight: 10,
        imageUrl: "/categories/botanical-garden.jpg",
      },
      {
        id: "cycling_park",
        name: "Cycling Parks",
        baseWeight: 10,
        imageUrl: "/categories/cycling-park.jpg",
      },
      {
        id: "dog_park",
        name: "Dog Parks",
        baseWeight: 10,
        imageUrl: "/categories/dog-park.jpg",
      },
      {
        id: "wildlife_park",
        name: "Wildlife Parks",
        baseWeight: 10,
        imageUrl: "/categories/wildlife-park.jpg",
      },
      {
        id: "wildlife_refuge",
        name: "Wildlife Refuges",
        baseWeight: 10,
        imageUrl: "/categories/wildlife-refuge.jpg",
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
    imageUrl: "/categories/beach.jpg",
    types: [
      {
        id: "beach",
        name: "Beaches",
        baseWeight: 10,
        imageUrl: "/categories/beach.jpg",
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

  hiking: {
    id: "hiking",
    title: "Hiking",
    query: "hiking",
    purpose: "primary",
    imageUrl: "/categories/hiking.jpg",
    types: [
      {
        id: "hiking_area",
        name: "Hiking Areas",
        baseWeight: 10,
        imageUrl: "/categories/hiking.jpg",
      },
      {
        id: "off_roading_area",
        name: "Off-Roading Areas",
        baseWeight: 10,
        imageUrl: "/categories/off-roading.jpg",
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
    imageUrl: "/categories/museum.jpg",
    types: [
      {
        id: "museum",
        name: "Museums",
        baseWeight: 10,
        imageUrl: "/categories/museum.jpg",
      },
      {
        id: "art_gallery",
        name: "Art Galleries",
        baseWeight: 10,
        imageUrl: "/categories/art-gallery.jpg",
      },
      {
        id: "art_studio",
        name: "Art Studios",
        baseWeight: 10,
        imageUrl: "/categories/art-studio.jpg",
      },
      {
        id: "cultural_center",
        name: "Cultural Centers",
        baseWeight: 10,
        imageUrl: "/categories/cultural-center.jpg",
      },
      {
        id: "planetarium",
        name: "Planetariums",
        baseWeight: 10,
        imageUrl: "/categories/planetarium.jpg",
      },
      {
        id: "aquarium",
        name: "Aquariums",
        baseWeight: 10,
        imageUrl: "/categories/aquarium.jpg",
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
    imageUrl: "/categories/cultural-landmark.jpg",
    types: [
      {
        id: "cultural_landmark",
        name: "Cultural Landmarks",
        baseWeight: 10,
        imageUrl: "/categories/cultural-landmark.jpg",
      },
      {
        id: "monument",
        name: "Monuments",
        baseWeight: 10,
        imageUrl: "/categories/monument.jpg",
      },
      {
        id: "historical_landmark",
        name: "Historical Landmarks",
        baseWeight: 10,
        imageUrl: "/categories/historical-landmark.jpg",
      },
      {
        id: "historical_place",
        name: "Historical Places",
        baseWeight: 10,
        imageUrl: "/categories/historical-place.jpg",
      },
      {
        id: "observation_deck",
        name: "Observation Decks",
        baseWeight: 10,
        imageUrl: "/categories/observation-deck.jpg",
      },
      {
        id: "tourist_attraction",
        name: "Tourist Attractions",
        baseWeight: 10,
        imageUrl: "/categories/tourist-attraction.jpg",
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

  arts: {
    id: "arts",
    title: "Arts",
    query: "theater",
    purpose: "primary",
    imageUrl: "/categories/theater.jpg",
    types: [
      {
        id: "movie_theater",
        name: "Movie Theaters",
        baseWeight: 10,
        imageUrl: "/categories/movie-theater.jpg",
      },
      {
        id: "concert_hall",
        name: "Concert Halls",
        baseWeight: 10,
        imageUrl: "/categories/concert-hall.jpg",
      },
      {
        id: "theater",
        name: "Theaters",
        baseWeight: 10,
        imageUrl: "/categories/theater.jpg",
      },
      {
        id: "performing_arts_theater",
        name: "Performing Arts Theaters",
        baseWeight: 10,
        imageUrl: "/categories/theater.jpg",
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
    imageUrl: "/categories/arcade.jpg",
    types: [
      {
        id: "movie_theater",
        name: "Movie Theaters",
        baseWeight: 10,
        imageUrl: "/categories/movie-theater.jpg",
      },
      {
        id: "bowling_alley",
        name: "Bowling",
        baseWeight: 10,
        imageUrl: "/categories/bowling.jpg",
      },
      {
        id: "karaoke",
        name: "Karaoke",
        baseWeight: 10,
        imageUrl: "/categories/karaoke.jpg",
      },
      {
        id: "arcade",
        name: "Arcades",
        baseWeight: 10,
        imageUrl: "/categories/arcade.jpg",
      },
      {
        id: "game_store",
        name: "Game Stores",
        baseWeight: 10,
        imageUrl: "/categories/game.jpg",
      },
      {
        id: "pool_hall",
        name: "Pool Halls",
        baseWeight: 10,
        imageUrl: "/categories/pool-hall.jpg",
      },
      {
        id: "billiards",
        name: "Billiards",
        baseWeight: 10,
        imageUrl: "/categories/pool-hall.jpg",
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
    imageUrl: "/categories/amusement-park.jpg",
    types: [
      {
        id: "amusement_park",
        name: "Amusement Parks",
        baseWeight: 10,
        imageUrl: "/categories/amusement-park.jpg",
      },
      {
        id: "water_park",
        name: "Water Parks",
        baseWeight: 10,
        imageUrl: "/categories/water-park.jpg",
      },
      {
        id: "theme_park",
        name: "Theme Parks",
        baseWeight: 10,
        imageUrl: "/categories/theme-park.jpg",
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
      {
        id: "plaza",
        name: "Shopping Plazas",
        baseWeight: 10,
        imageUrl: "/categories/plaza.jpg",
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
      {
        id: "plaza",
        name: "Shopping Plazas",
        baseWeight: 10,
        imageUrl: "/categories/plaza.jpg",
      },
      {
        id: "game_store",
        name: "Game Stores",
        baseWeight: 10,
        imageUrl: "/categories/game.jpg",
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
