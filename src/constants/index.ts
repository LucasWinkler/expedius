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
  { title: "Restaurants", query: "restaurants" },
  { title: "Cafes & Bakeries", query: "cafe bakery" },
  { title: "Museums", query: "museums" },
  { title: "Shopping", query: "shopping" },
  { title: "Tourist Attractions", query: "tourist attractions" },
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
