import { LucideIcon, ListPlus, Bookmark, Share2, Compass } from "lucide-react";

export interface HomeFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const HOME_FEATURES: HomeFeature[] = [
  {
    title: "Create Lists",
    description: "Organize places into custom collections for easy access.",
    icon: ListPlus,
  },
  {
    title: "Save Favourites",
    description: "Keep track of places you love and want to visit.",
    icon: Bookmark,
  },
  {
    title: "Share Places",
    description: "Share your discoveries with friends and family.",
    icon: Share2,
  },
  {
    title: "Personalized Discovery",
    description: "Find places tailored to your preferences and time of day.",
    icon: Compass,
  },
];
