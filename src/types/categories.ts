export type CategoryPurpose = "primary" | "secondary" | "contextual";

export type PlaceType = {
  id: string;
  name: string;
  baseWeight?: number;
  imageUrl?: string;
};

export type CategoryGroup = {
  id: string;
  title: string;
  query: string;
  types: PlaceType[];
  purpose: CategoryPurpose;
  weight?: number;
  imageUrl?: string;
  metadata?: {
    timeAppropriate?: {
      morning?: boolean;
      lunch?: boolean;
      afternoon?: boolean;
      evening?: boolean;
      lateNight?: boolean;
    };
    requiresUserIntent?: boolean;
    minimumInteractionCount?: number;
    isNightSuggestion?: boolean;
    isRandomExploration?: boolean;
  };
};
