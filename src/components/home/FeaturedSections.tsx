"use client";

import { useEffect, useState, useTransition } from "react";
import FeaturedSection from "./FeaturedSection";
import { FeaturedSectionError } from "./FeaturedSectionError";
import { FEATURED_SECTIONS } from "@/constants";
import { searchPlacesClient } from "@/lib/search";
import { useLocation } from "@/context/LocationContext";
import type { Place } from "@/types";
import { FeaturedSectionSkeleton } from "./FeaturedSectionSkeleton";
import { useSession } from "@/lib/auth-client";
import { UserListForPlaceCard } from "@/server/data/userLists";

const FeaturedSections = () => {
  const { coords, isLoading: isLoadingLocation } = useLocation();
  const { data: session } = useSession();
  const [userLists, setLists] = useState<UserListForPlaceCard[]>([]);

  const [sectionPlaces, setSectionPlaces] = useState<Record<string, Place[]>>(
    {},
  );
  const [isPending, startTransition] = useTransition();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (session?.user.id) {
      fetch("/api/lists/user")
        .then((res) => res.json())
        .then((data) => {
          setLists(data.lists);
        });
    }
  }, [session]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const searchResults = await Promise.all(
          FEATURED_SECTIONS.map(({ query }) =>
            searchPlacesClient(query, 5, coords),
          ),
        );

        const placesBySection = searchResults.reduce<Record<string, Place[]>>(
          (acc, data, index) => {
            const query = FEATURED_SECTIONS[index].query;

            if (data?.places) {
              acc[query] = data.places;
            }

            return acc;
          },
          {},
        );

        startTransition(() => {
          setSectionPlaces(placesBySection);
          setIsInitialLoad(false);
        });
      } catch (error) {
        console.error("Failed to fetch featured sections:", error);
        setIsInitialLoad(false);
      }
    };

    if (!isLoadingLocation) {
      fetchResults();
    }
  }, [coords, isLoadingLocation]);

  if (isInitialLoad || isPending) {
    return <FeaturedSectionSkeleton />;
  }

  return (
    <div className="space-y-12">
      {FEATURED_SECTIONS.map(({ title, query, emptyMessage }) => {
        const places = sectionPlaces[query];

        if (!places || places.length === 0) {
          return (
            <FeaturedSectionError
              key={title}
              title={title}
              emptyMessage={emptyMessage}
            />
          );
        }

        return (
          <FeaturedSection
            key={title}
            title={title}
            places={places}
            userLists={userLists}
          />
        );
      })}
    </div>
  );
};

export default FeaturedSections;
