"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";

import { useSession } from "@/lib/auth-client";
import type {
  UserListForPlaceCard,
  ListPlaceFieldsForPlaceCard,
} from "@/server/data/userLists";

interface ListsContextType {
  likedPlaceIds: Set<string>;
  isPlaceLiked: (placeId: string) => boolean;
  updatePlaceLikeStatus: (placeId: string, liked: boolean) => void;
  isLoadingLikes: boolean;
  lists: UserListForPlaceCard[];
  refreshLists: () => Promise<void>;
  getSelectedLists: (placeId: string) => Set<string>;
  updateSelectedLists: (
    placeId: string,
    selectedLists: Set<string>,
  ) => Promise<void>;
}

const ListsContext = createContext<ListsContextType | undefined>(undefined);

export function ListsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [likedPlaceIds, setLikedPlaceIds] = useState<Set<string>>(new Set());
  const [isLoadingLikes, setIsLoadingLikes] = useState(true);
  const [lists, setLists] = useState<UserListForPlaceCard[]>([]);

  const fetchLists = useCallback(async () => {
    if (!session?.user.id) {
      setLists([]);
      setIsLoadingLikes(false);
      return;
    }

    try {
      const response = await fetch("/api/lists");
      if (!response.ok) throw new Error("Failed to fetch lists");
      const { lists: fetchedLists } = await response.json();
      setLists(fetchedLists);

      const defaultList = fetchedLists.find(
        (list: UserListForPlaceCard) => list.isDefault,
      );
      if (defaultList) {
        setLikedPlaceIds(
          new Set(
            defaultList.places.map(
              (place: ListPlaceFieldsForPlaceCard) => place.placeId,
            ),
          ),
        );
      }
      setIsLoadingLikes(false);
    } catch (error) {
      console.error("Error fetching lists:", error);
      setIsLoadingLikes(false);
    }
  }, [session?.user.id]);

  const isPlaceLiked = useCallback(
    (placeId: string) => likedPlaceIds.has(placeId),
    [likedPlaceIds],
  );

  const updatePlaceLikeStatus = useCallback(
    (placeId: string, liked: boolean) => {
      setLikedPlaceIds((prev) => {
        const newSet = new Set(prev);
        if (liked) {
          newSet.add(placeId);
        } else {
          newSet.delete(placeId);
        }
        return newSet;
      });

      setLists((prevLists) =>
        prevLists.map((list) => {
          if (!list.isDefault) return list;

          const updatedPlaces = liked
            ? [...list.places, { id: `temp-${placeId}`, placeId }]
            : list.places.filter((place) => place.placeId !== placeId);

          return {
            ...list,
            places: updatedPlaces,
          };
        }),
      );
    },
    [],
  );

  const getSelectedLists = useCallback(
    (placeId: string) => {
      const selected = new Set<string>();
      lists.forEach((list) => {
        if (list.places.some((place) => place.placeId === placeId)) {
          selected.add(list.id);
        }
      });
      return selected;
    },
    [lists],
  );

  const updateSelectedLists = useCallback(
    async (placeId: string, selectedLists: Set<string>) => {
      if (!session?.user.id) return;

      const defaultList = lists.find((list) => list.isDefault);
      if (!defaultList) return;

      const wasLiked = defaultList.places.some(
        (place) => place.placeId === placeId,
      );
      const willBeLiked = selectedLists.has(defaultList.id);

      if (wasLiked !== willBeLiked) {
        updatePlaceLikeStatus(placeId, willBeLiked);
      }

      try {
        const response = await fetch("/api/lists/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            placeId,
            selectedLists: Array.from(selectedLists),
          }),
        });

        if (!response.ok) throw new Error("Failed to update lists");
        await fetchLists();
      } catch (error) {
        if (wasLiked !== willBeLiked) {
          updatePlaceLikeStatus(placeId, wasLiked);
        }
        console.error("Error updating lists:", error);
        throw error;
      }
    },
    [session?.user.id, fetchLists, lists, updatePlaceLikeStatus],
  );

  useEffect(() => {
    void fetchLists();
  }, [fetchLists]);

  return (
    <ListsContext.Provider
      value={{
        likedPlaceIds,
        isPlaceLiked,
        updatePlaceLikeStatus,
        isLoadingLikes,
        lists,
        refreshLists: fetchLists,
        getSelectedLists,
        updateSelectedLists,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}

export const useLists = () => {
  const context = useContext(ListsContext);
  if (!context) throw new Error("useLists must be used within ListsProvider");
  return context;
};
