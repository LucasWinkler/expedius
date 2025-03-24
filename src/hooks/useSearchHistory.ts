import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "searchHistory";

/**
 * Custom hook for managing search history in local storage
 * @param maxHistoryItems Maximum number of history items to store
 * @returns Object with search history and methods to add/remove items
 */
export const useSearchHistory = (maxHistoryItems = 15) => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const loadSearchHistory = useCallback(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setSearchHistory(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Failed to parse search history:", error);
        setSearchHistory([]);
      }
    } else {
      setSearchHistory([]);
    }
  }, []);

  useEffect(() => {
    loadSearchHistory();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        loadSearchHistory();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadSearchHistory]);

  const addToHistory = useCallback(
    (query: string) => {
      if (!query || searchHistory.includes(query)) return;

      const newHistory = [
        query,
        ...searchHistory
          .filter((item) => item !== query)
          .slice(0, maxHistoryItems - 1),
      ];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setSearchHistory(newHistory);
    },
    [searchHistory, maxHistoryItems],
  );

  const removeFromHistory = useCallback(
    (query: string) => {
      const newHistory = searchHistory.filter((item) => item !== query);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setSearchHistory(newHistory);
    },
    [searchHistory],
  );

  const removeAllHistory = useCallback(
    (refresh = false) => {
      localStorage.removeItem(STORAGE_KEY);
      setSearchHistory([]);

      if (refresh) {
        loadSearchHistory();
      }
    },
    [loadSearchHistory],
  );

  return {
    searchHistory,
    addToHistory,
    removeFromHistory,
    refreshHistory: loadSearchHistory,
    removeAllHistory,
  };
};
