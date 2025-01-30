export * from "./queryKeys";

export const defaultListName = "Saved Places";

export const listColourPresets = [
  "oklch(0.7 0.24 270)",
  "oklch(0.6 0.25 230)",
  "oklch(0.7 0.25 30)",
  "oklch(0.65 0.25 140)",
  "oklch(0.6 0.28 0)",
  "oklch(0.6 0.26 300)",
  "oklch(0.7 0.2 190)",
  "oklch(0.75 0.22 90)",
  "oklch(0.65 0.25 60)",
];

export const SEARCH_SUGGESTIONS = [
  { title: "Cafes", query: "cafes" },
  { title: "Bakeries", query: "bakeries" },
  { title: "Restaurants", query: "restaurants" },
  { title: "Museums", query: "museums" },
  { title: "Shopping", query: "shopping" },
  { title: "Parks", query: "parks" },
] as const;

export const FEATURED_SECTIONS = [
  {
    title: "Places to Eat",
    query: "restaurants",
    emptyMessage: "No restaurants found nearby",
  },
  {
    title: "Explore & Discover",
    query: "attractions points of interest",
    emptyMessage: "No attractions found nearby",
  },
  {
    title: "Parks & Nature",
    query: "parks",
    emptyMessage: "No outdoor spaces found nearby",
  },
] as const;

export const minPasswordLength = 8;
export const minUsernameLength = 3;
export const maxUsernameLength = 30;
export const minNameLength = 2;
export const maxNameLength = 50;
export const minQueryLength = 2;

export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
};

export const RATE_LIMIT_PREFIX = "ratelimit:" as const;
