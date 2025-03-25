"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/useSearch";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { minQueryLength, SEARCH_SUGGESTIONS } from "@/constants";
import { SearchButtonIcon } from "./SearchButtonIcon";
import { SearchHistoryItem } from "./SearchItems";
import { SearchSuggestionItem } from "./SearchSuggestionItem";

const DIALOG_ANIMATION_DURATION = 200;

export const NavSearchButton = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { searchHistory, addToHistory, removeFromHistory, refreshHistory } =
    useSearchHistory();
  const router = useRouter();
  const { updateSearchParams } = useSearch();

  const clearInputWithDelay = useCallback(() => {
    setTimeout(() => {
      setValue("");
    }, DIALOG_ANIMATION_DURATION + 50);
  }, []);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);

      if (isOpen) {
        refreshHistory();
      } else {
        clearInputWithDelay();
      }
    },
    [refreshHistory, clearInputWithDelay],
  );

  // Clear input if text exists, otherwise close dialog
  const handleCloseClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (value.trim().length > 0) {
        setValue("");
        e.preventDefault();
      }
    },
    [value],
  );

  const handleSearch = (query: string) => {
    if (!query) return;

    if (query.trim().length >= minQueryLength) {
      updateSearchParams({ query });
      router.push(`/explore?q=${encodeURIComponent(query)}`);
      addToHistory(query);

      setOpen(false);
      clearInputWithDelay();
    }
  };

  const hasSearchTerm = value.trim().length > 0;

  return (
    <>
      <SearchButtonIcon onClick={() => handleOpenChange(true)} />

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        onCloseClick={handleCloseClick}
        contentClassName="max-w-[calc(100vw-2rem)] sm:max-w-lg"
        title="Search Places"
        description="Search for places, view your recent searches, or explore suggestions"
      >
        <CommandInput
          placeholder="Search for places..."
          value={value}
          onValueChange={setValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(value);
            }
          }}
        />
        <CommandList className="max-h-[300px] overflow-y-auto">
          <CommandGroup
            className={hasSearchTerm ? "visible" : "hidden"}
            heading="Search"
          >
            <CommandItem onSelect={() => handleSearch(value)}>
              <Search className="size-4 shrink-0 opacity-50" />
              Search for &quot;{value}&quot;
            </CommandItem>
          </CommandGroup>

          {searchHistory.length > 0 && (
            <>
              {hasSearchTerm && <CommandSeparator />}
              <CommandGroup heading="Recent Searches">
                {searchHistory.slice(0, 5).map((item, index) => (
                  <SearchHistoryItem
                    key={`history-${index}`}
                    item={item}
                    onSelect={() => handleSearch(item)}
                    onRemove={(e) => {
                      if (e) {
                        e.stopPropagation();
                        e.preventDefault();
                      }
                      removeFromHistory(item);
                    }}
                  />
                ))}
              </CommandGroup>
            </>
          )}

          {SEARCH_SUGGESTIONS.length > 0 && (
            <>
              {(hasSearchTerm || searchHistory.length > 0) && (
                <CommandSeparator />
              )}
              <CommandGroup heading="Suggestions">
                {SEARCH_SUGGESTIONS.map((suggestion, index) => (
                  <SearchSuggestionItem
                    key={`suggestion-${index}`}
                    suggestion={suggestion}
                    onSelect={() => handleSearch(suggestion.query)}
                  />
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
