export const listColourPresets = [
  "oklch(0.6 0.25 230)", // vibrant blue
  "oklch(0.7 0.25 30)", // bright orange
  "oklch(0.65 0.25 140)", // emerald green
  "oklch(0.6 0.28 0)", // vivid red
  "oklch(0.6 0.26 300)", // rich purple
  "oklch(0.7 0.2 190)", // cyan
  "oklch(0.75 0.22 90)", // chartreuse
  "oklch(0.65 0.25 60)", // coral
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
