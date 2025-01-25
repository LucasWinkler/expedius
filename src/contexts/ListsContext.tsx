"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import type { UserListForPlaceCard } from "@/server/data/userLists";
import { useSession } from "@/lib/auth-client";

type ListsContextType = {
  lists: UserListForPlaceCard[];
  isLoading: boolean;
  refreshLists: () => Promise<void>;
  isPlaceLiked: (placeId: string) => boolean;
  isPlaceInList: (placeId: string, listId: string) => boolean;
  getSelectedLists: (placeId: string) => Set<string>;
  updateSelectedLists: (placeId: string, listIds: Set<string>) => void;
  updatePlaceLikeStatus: (placeId: string, isLiked: boolean) => void;
};

const ListsContext = createContext<ListsContextType | null>(null);

export const ListsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [lists, setLists] = useState<UserListForPlaceCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Track selected lists per place
  const [selectedListsMap, setSelectedListsMap] = useState<
    Map<string, Set<string>>
  >(new Map());

  const refreshLists = useCallback(async () => {
    if (!session?.user.id) {
      setLists([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/lists/user");
      const data = await response.json();
      if (data.lists) {
        setLists(data.lists);
        // Update selected lists map based on new data
        const newSelectedListsMap = new Map<string, Set<string>>();
        data.lists.forEach((list: UserListForPlaceCard) => {
          list.places.forEach((place) => {
            const placeId = place.placeId;
            const currentSet =
              newSelectedListsMap.get(placeId) || new Set<string>();
            currentSet.add(list.id);
            newSelectedListsMap.set(placeId, currentSet);
          });
        });
        setSelectedListsMap(newSelectedListsMap);
      }
    } catch (error) {
      console.error("Failed to fetch lists:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user.id]);

  const isPlaceLiked = useCallback(
    (placeId: string) => {
      return lists.some(
        (list) =>
          list.isDefault && list.places.some((p) => p.placeId === placeId),
      );
    },
    [lists],
  );

  const isPlaceInList = useCallback(
    (placeId: string, listId: string) => {
      const list = lists.find((l) => l.id === listId);
      return list?.places.some((p) => p.placeId === placeId) ?? false;
    },
    [lists],
  );

  const getSelectedLists = useCallback(
    (placeId: string) => {
      return selectedListsMap.get(placeId) || new Set<string>();
    },
    [selectedListsMap],
  );

  const updateSelectedLists = useCallback(
    (placeId: string, listIds: Set<string>) => {
      setSelectedListsMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(placeId, listIds);
        return newMap;
      });
    },
    [],
  );

  const updatePlaceLikeStatus = useCallback(
    (placeId: string, isLiked: boolean) => {
      // Update lists state
      setLists((currentLists) => {
        const defaultList = currentLists.find((list) => list.isDefault);
        if (!defaultList) return currentLists;

        return currentLists.map((list) => {
          if (!list.isDefault) return list;

          if (isLiked) {
            // Add place to likes list if not already present
            if (!list.places.some((p) => p.placeId === placeId)) {
              return {
                ...list,
                places: [...list.places, { id: `temp-${placeId}`, placeId }],
              };
            }
          } else {
            // Remove place from likes list
            return {
              ...list,
              places: list.places.filter((p) => p.placeId !== placeId),
            };
          }
          return list;
        });
      });

      // Update selectedListsMap state
      setSelectedListsMap((prev) => {
        const newMap = new Map(prev);
        const currentSelected = new Set(newMap.get(placeId));
        const defaultList = lists.find((list) => list.isDefault);

        if (defaultList) {
          if (isLiked) {
            currentSelected.add(defaultList.id);
          } else {
            currentSelected.delete(defaultList.id);
          }
          newMap.set(placeId, currentSelected);
        }

        return newMap;
      });
    },
    [lists],
  );

  useEffect(() => {
    refreshLists();
  }, [refreshLists]);

  return (
    <ListsContext.Provider
      value={{
        lists,
        isLoading,
        refreshLists,
        isPlaceLiked,
        isPlaceInList,
        getSelectedLists,
        updateSelectedLists,
        updatePlaceLikeStatus,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
};

export const useLists = () => {
  const context = useContext(ListsContext);
  if (!context) {
    throw new Error("useLists must be used within a ListsProvider");
  }
  return context;
};
