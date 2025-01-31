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

import {
  Coffee,
  Utensils,
  Building2,
  Landmark,
  Building,
  Camera,
  Dumbbell,
  Gamepad2,
  Plane,
  Tent,
  Trees,
  ShoppingCart,
  Croissant,
  Waves,
  Mountain,
  Frame,
  Wine,
  BookOpen,
  Store,
  Clapperboard,
  Sparkles,
  Flower2,
  Home,
  Search,
  Grid2X2,
  UserCircle,
  Folders,
  FolderHeart,
} from "lucide-react";

export const HOME_CATEGORIES = [
  {
    title: "Places to Eat",
    query: "restaurants",
    icon: Utensils,
    description: "Discover local favorites and hidden gems",
  },
  {
    title: "Popular Attractions",
    query: "tourist attractions",
    icon: Camera,
    description: "Explore must-visit spots and landmarks",
  },
  {
    title: "Parks & Nature",
    query: "parks",
    icon: Trees,
    description: "Find peaceful outdoor spaces to explore",
  },
] as const;

export const ALL_CATEGORIES = [
  {
    title: "Coffee Shops",
    query: "cafe",
    icon: Coffee,
    description: "Cozy spots for coffee and conversation",
  },
  {
    title: "Restaurants",
    query: "restaurant",
    icon: Utensils,
    description: "Local eateries and dining experiences",
  },
  {
    title: "Parks",
    query: "park",
    icon: Trees,
    description: "Green spaces and urban retreats",
  },
  {
    title: "Museums",
    query: "museum",
    icon: Building2,
    description: "Art, history, and cultural exhibits",
  },
  {
    title: "Historic Sites",
    query: "historic site",
    icon: Landmark,
    description: "Landmarks and heritage locations",
  },
  {
    title: "Hotels",
    query: "hotel",
    icon: Building,
    description: "Places to stay and unwind",
  },
  {
    title: "Shopping",
    query: "shopping mall",
    icon: ShoppingCart,
    description: "Markets, malls, and boutiques",
  },
  {
    title: "Entertainment",
    query: "entertainment venue",
    icon: Gamepad2,
    description: "Fun activities and entertainment venues",
  },
  {
    title: "Fitness",
    query: "gym",
    icon: Dumbbell,
    description: "Gyms and sports facilities",
  },
  {
    title: "Travel",
    query: "transit station",
    icon: Plane,
    description: "Transportation hubs and stations",
  },
  {
    title: "Outdoor Activities",
    query: "hiking trail",
    icon: Tent,
    description: "Adventure spots and hiking trails",
  },
  {
    title: "Bakeries",
    query: "bakery",
    icon: Croissant,
    description: "Fresh pastries and artisanal breads",
  },
  {
    title: "Beaches",
    query: "beach",
    icon: Waves,
    description: "Coastal spots and waterfronts",
  },
  {
    title: "Viewpoints",
    query: "scenic viewpoint",
    icon: Mountain,
    description: "Scenic overlooks and city views",
  },
  {
    title: "Art Galleries",
    query: "art gallery",
    icon: Frame,
    description: "Contemporary and fine art spaces",
  },
  {
    title: "Nightlife",
    query: "nightclub",
    icon: Wine,
    description: "Bars, clubs, and evening venues",
  },
  {
    title: "Libraries",
    query: "library",
    icon: BookOpen,
    description: "Public libraries and reading rooms",
  },
  {
    title: "Markets",
    query: "market",
    icon: Store,
    description: "Local markets and food halls",
  },
  {
    title: "Movie Theaters",
    query: "movie theater",
    icon: Clapperboard,
    description: "Cinema venues and theaters",
  },
  {
    title: "Spas",
    query: "spa",
    icon: Sparkles,
    description: "Relaxation and wellness centers",
  },
  {
    title: "Botanical Gardens",
    query: "botanical garden",
    icon: Flower2,
    description: "Plant collections and gardens",
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

export const NAV_ITEMS = [
  {
    href: "/discover",
    icon: Search,
    label: "Discover",
  },
  {
    href: "/categories",
    icon: Grid2X2,
    label: "Categories",
  },
] as const;

export const MOBILE_NAV_ITEMS = [
  {
    href: "/",
    icon: Home,
    label: "Home",
  },
  ...NAV_ITEMS,
] as const;

export const USER_NAV_ITEMS = [
  {
    href: (username: string) => `/u/${username}/likes`,
    icon: FolderHeart,
    label: "Likes",
  },
  {
    href: (username: string) => `/u/${username}/lists`,
    icon: Folders,
    label: "Lists",
  },
  {
    href: (username: string) => `/u/${username}`,
    icon: UserCircle,
    label: "Profile",
  },
] as const;
