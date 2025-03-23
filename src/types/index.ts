import { LikeStatuses } from "@/lib/api/types";

import type { DbListWithPlacesCount } from "@/server/types/db";

export * from "./pagination";

// API/External types
export type PlacePhoto = {
  name: string;
  widthPx: number;
  heightPx: number;
  googleMapsUri: string;
  flagContentUri: string;
  authorAttributions: Array<{
    displayName: string;
    photoUri?: string;
    uri: string;
  }>;
};

export type Place = {
  id: string;
  formattedAddress: string;
  rating?: number;
  priceLevel?: string;
  userRatingCount?: number;
  displayName: {
    text: string;
    languageCode: string;
  };
  photos?: PlacePhoto[];
  image?: {
    url: string;
    blurDataURL: string;
    height: number;
    width: number;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
};

export type PlaceDetails = Place & {
  currentOpeningHours?: {
    openNow: boolean;
    periods: {
      open: {
        day: number;
        hour: number;
        minute: number;
      };
      close: {
        day: number;
        hour: number;
        minute: number;
      };
    }[];
    weekdayDescriptions?: string[];
    nextCloseTime?: string;
  };
  websiteUri?: string;
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  priceRange?: {
    startPrice: {
      currencyCode: string;
      units: string;
    };
    endPrice: {
      currencyCode: string;
      units: string;
    };
  };
  editorialSummary?: {
    text: string;
    languageCode: string;
  };
  reviews?: {
    name: string;
    relativePublishTimeDescription: string;
    rating: number;
    text: {
      text: string;
      languageCode: string;
    };
    authorAttribution: {
      displayName: string;
      uri: string;
      photoUri?: string;
    };
    googleMapsUri: string;
  }[];
  paymentOptions?: {
    acceptsCreditCards?: boolean;
    acceptsDebitCards?: boolean;
    acceptsCashOnly?: boolean;
    acceptsNfc?: boolean;
  };
  parkingOptions?: {
    freeParking?: boolean;
    paidParking?: boolean;
    streetParking?: boolean;
    valetParking?: boolean;
  };
  dineIn?: boolean;
  takeout?: boolean;
  delivery?: boolean;
  curbsidePickup?: boolean;
  reservable?: boolean;
  servesBreakfast?: boolean;
  servesLunch?: boolean;
  servesDinner?: boolean;
  servesBrunch?: boolean;
  servesCoffee?: boolean;
  outdoorSeating?: boolean;
  liveMusic?: boolean;
  menuForChildren?: boolean;
  restroom?: boolean;
  goodForWatchingSports?: boolean;
  servesDessert?: boolean;
  servesVegetarianFood?: boolean;
  servesBeer?: boolean;
  servesWine?: boolean;
  primaryTypeDisplayName: string;
  types: string[];
  googleMapsLinks: {
    directionsUri: string;
    placeUri: string;
    writeReviewUri: string;
    reviewsUri: string;
    photosUri: string;
  };
  accessibilityOptions?: {
    wheelchairAccessibleParking?: boolean;
    wheelchairAccessibleEntrance?: boolean;
  };
  pureServiceAreaBusiness?: boolean;
  businessStatus: string;
  utcOffsetMinutes?: number;
  nextCloseTime?: string;
};

// Business/Domain types
export interface List {
  id: string;
  userId: string;
  name: string;
  description?: string;
  image?: string;
  colour: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedPlace {
  id: string;
  listId: string;
  placeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface Like {
  id: string;
  userId: string;
  placeId: string;
  createdAt: Date;
  updatedAt: Date;
  place?: Place;
}

// API Response types
export interface PlaceSearchResponse {
  places: Place[];
  likeStatuses: LikeStatuses;
  userLists: DbListWithPlacesCount[];
  nextPageToken?: string;
}

export interface ListResponse {
  list: List;
  savedPlaces: SavedPlace[];
}

export interface LikeResponse {
  liked: boolean;
}

export interface ListForPlaceCard {
  id: List["id"];
  name: List["name"];
  userId: List["userId"];
  isSelected?: boolean;
}
