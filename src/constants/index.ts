export const listColourPresets = [
  "#EF4444", // red
  "#F97316", // orange
  "#EAB308", // yellow
  "#22C55E", // green
  "#3B82F6", // blue
  "#6366F1", // indigo
  "#A855F7", // purple
  "#EC4899", // pink
  "#6B7280", // gray
];

export const SEARCH_SUGGESTIONS = [
  "Best Pizza in New York",
  "Hidden Waterfalls",
  "Local Food Markets",
] as const;

export const FEATURED_SECTIONS = [
  {
    title: "Best Rated Restaurants",
    query: "best rated restaurants near me",
    emptyMessage: "No restaurants found in your area",
  },
  {
    title: "Popular Attractions",
    query: "famous landmarks and tourist attractions near me",
    emptyMessage: "No attractions found in your area",
  },
  {
    title: "Local Parks",
    query: "popular parks near me",
    emptyMessage: "No parks found in your area",
  },
] as const;
