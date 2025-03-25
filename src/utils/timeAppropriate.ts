import type { TimeOfDay } from "@/lib/suggestions";

/**
 * Map of time periods to place types that are inappropriate during those times
 * This is used for fine-grained filtering of specific place types beyond category-level filtering
 */
export const timeInappropriateTypes: Record<TimeOfDay, string[]> = {
  morning: [
    // Nightlife venues
    "night_club",
    "bar",
    "pub",
    "wine_bar",
    "cocktail_bar",
    "hookah_bar",
    "karaoke",
    "billiards",
    "pool_hall",
  ],

  lunch: [
    // Typically nightlife venues
    "night_club",
  ],

  afternoon: [
    // Typically nightlife venues
    "night_club",
  ],

  evening: [
    // Nothing specifically inappropriate in the evening
  ],

  lateNight: [
    // Breakfast/Coffee related
    "brunch_restaurant",
    "breakfast_restaurant",
    "cafe",
    "coffee_shop",
    "tea_house",
    "bakery",

    // Outdoor activities
    "hiking_area",
    "off_roading_area",
    "beach",
    "park",
    "national_park",
    "state_park",
    "garden",
    "botanical_garden",
    "dog_park",
    "wildlife_park",
    "wildlife_refuge",
    "cycling_park",

    // Shopping
    "shopping_mall",
    "department_store",
    "clothing_store",
    "jewelry_store",
    "book_store",
    "gift_shop",
    "electronics_store",
    "home_goods_store",
    "toy_store",
    "sporting_goods_store",
    "plaza",
    "market",
    "farmer_market",
    "flea_market",

    // Attractions typically closed at night
    "zoo",
    "museum",
    "art_gallery",
    "art_studio",
    "aquarium",
    "cultural_center",
    "planetarium",
    "cultural_landmark",
    "monument",
    "historical_landmark",
    "historical_place",
    "observation_deck",
    "tourist_attraction",

    // Fitness and wellness
    "gym",
    "fitness_center",
    "swimming_pool",
    "yoga_studio",
    "spa",
    "wellness_center",
    "massage",
    "sauna",

    // Sports venues
    "stadium",
    "sports_complex",
    "golf_course",
    "ice_skating_rink",
    "athletic_field",
    "skateboard_park",

    // Theme parks and zoos
    "amusement_park",
    "water_park",
    "theme_park",

    // Religious places
    "church",
    "hindu_temple",
    "mosque",
    "synagogue",
  ],
};

/**
 * Check if a specific place type is appropriate for the given time of day
 */
export function isTypeAppropriateForTime(
  type: string,
  timeOfDay: TimeOfDay,
): boolean {
  return !timeInappropriateTypes[timeOfDay]?.includes(type);
}
