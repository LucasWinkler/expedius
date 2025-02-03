export const SEARCH_SUGGESTIONS = [
  { title: "Cafes", query: "cafes" },
  { title: "Bakeries", query: "bakeries" },
  { title: "Restaurants", query: "restaurants" },
  { title: "Museums", query: "museums" },
  { title: "Shopping", query: "shopping" },
  { title: "Parks", query: "parks" },
] as const;

export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
};

export const PLACE_FILTERS = {
  RADIUS: {
    DEFAULT: 5000, // 5km radius
    MIN: 0,
    MAX: 50000,
    STEP: 1000,
    formatLabel: (value: number) => `${value / 1000}km`,
  },
  RATING: {
    MIN: 0,
    MAX: 5,
    STEP: 0.5,
    formatLabel: (value: number) => `${value}★`,
  },
} as const;

export const FILTER_LABELS = {
  radius: "Search radius",
  rating: "Minimum rating",
  openNow: "Show only open places",
} as const;
