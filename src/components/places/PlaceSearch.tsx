"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebouncedCallback } from "use-debounce";

type Place = {
  place_id: string;
  name: string;
  formatted_address: string;
};

export const PlaceSearch = ({
  onSelect,
}: {
  onSelect: (place: Place) => void;
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback(async (search: string) => {
    if (!search) return;
    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/places/search?q=${encodeURIComponent(search)}`,
      );
      const data = await res.json();
      setResults(data.results);
    } catch (error) {
      console.error("Failed to search places:", error);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      debouncedSearch(value);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (place: Place) => {
    setQuery(place.name);
    setOpen(false);
    onSelect(place);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {query || "Search for a place..."}
          <Search className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Search places..."
            value={query}
            onValueChange={handleSearch}
          />
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <CommandEmpty>No places found.</CommandEmpty>
              <CommandGroup>
                {results.map((place) => (
                  <CommandItem
                    key={place.place_id}
                    value={place.place_id}
                    onSelect={() => handleSelect(place)}
                  >
                    <div className="flex flex-col">
                      <span>{place.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {place.formatted_address}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
