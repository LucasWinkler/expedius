"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useRef, useState, useCallback, useEffect } from "react";
import { minQueryLength } from "@/constants";
import { SearchInput } from "@/components/ui/search-input";
import { useSearch } from "@/hooks/useSearch";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PLACE_FILTERS, FILTER_LABELS } from "@/constants";
import { ChevronDown, X, Clock, Search, Trash2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useClickOutside } from "@/hooks";

const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(minQueryLength, `Please enter at least ${minQueryLength} characters`),
  radius: z.number().optional(),
  minRating: z.number().optional(),
  openNow: z.boolean().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface SearchBarProps {
  className?: string;
  variant?: "simple" | "advanced";
}

export const SearchBar = ({
  className,
  variant = "simple",
}: SearchBarProps) => {
  const { query: initialQuery, updateSearchParams } = useSearch();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const { searchHistory, addToHistory, removeFromHistory, refreshHistory } =
    useSearchHistory();
  const formRef = useRef<HTMLFormElement>(null);
  const [filteredHistory, setFilteredHistory] = useState<string[]>([]);

  useClickOutside(formRef, () => {
    setIsPopupOpen(false);
  });

  const handleOpenPopup = useCallback(() => {
    refreshHistory();
    setIsPopupOpen(true);
  }, [refreshHistory]);

  const clearAllHistory = useCallback(() => {
    // Clear from localStorage directly
    localStorage.removeItem("searchHistory");
    // Refresh the history state
    refreshHistory();
  }, [refreshHistory]);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: initialQuery,
      radius: PLACE_FILTERS.RADIUS.DEFAULT,
      minRating: undefined,
      openNow: false,
    },
  });

  useEffect(() => {
    const currentValue = form.watch("query") || "";
    if (!currentValue.trim()) {
      setFilteredHistory(searchHistory);
      return;
    }

    const filtered = searchHistory.filter((item) =>
      item.toLowerCase().includes(currentValue.toLowerCase()),
    );
    setFilteredHistory(filtered);
  }, [form.watch("query"), searchHistory]);

  function onSubmit(data: SearchFormValues) {
    updateSearchParams({
      query: data.query,
      filters: {
        radius: data.radius,
        minRating: data.minRating,
        openNow: data.openNow,
      },
    });

    addToHistory(data.query);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setIsPopupOpen(false);
  }

  const handleHistoryItemClick = (query: string) => {
    form.setValue("query", query);
    form.handleSubmit(onSubmit)();
    setIsPopupOpen(false);
  };

  const handleClear = () => {
    form.setFocus("query");
    form.reset({ query: "" });
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className={cn("relative", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SearchInput
                  placeholder="Search for places..."
                  onClear={handleClear}
                  onFocus={handleOpenPopup}
                  onClick={handleOpenPopup}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isPopupOpen && searchHistory.length > 0 && (
          <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md transition-all duration-200 ease-in-out">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="size-4" />
                Recent Searches
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={clearAllHistory}
              >
                <Trash2 className="mr-1 size-3.5" />
                Clear All
              </Button>
            </div>
            <div className="scrollbar-thin max-h-60 overflow-y-auto">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => (
                  <div
                    key={index}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleHistoryItemClick(item)}
                    className="group flex select-none items-center border-b border-gray-100 bg-gray-50/40 px-4 py-2.5 transition-colors hover:bg-gray-100"
                  >
                    <div className="flex w-full items-center gap-3">
                      <Search className="size-4 text-gray-500 group-hover:text-blue-500" />
                      <span className="flex-1 truncate text-sm text-gray-700 group-hover:text-gray-900">
                        {item}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-6 shrink-0 rounded-full p-0 opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          removeFromHistory(item);
                        }}
                      >
                        <X className="size-3.5 text-gray-500 hover:text-blue-500" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-6">
                  <p className="text-sm text-gray-500">
                    No matching searches found
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {variant === "advanced" && (
          <Collapsible
            open={isFiltersOpen}
            onOpenChange={setIsFiltersOpen}
            className="mt-4"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <h2 className="text-xl font-semibold">Search Filters</h2>
              <div className="group rounded-md p-2 hover:bg-muted">
                <ChevronDown
                  className={cn(
                    "size-5 transition-transform duration-200",
                    isFiltersOpen && "rotate-180",
                  )}
                />
                <span className="sr-only">Toggle search filters</span>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="radius"
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>{FILTER_LABELS.radius}</Label>
                          <span className="text-sm text-muted-foreground">
                            {(field.value ?? PLACE_FILTERS.RADIUS.DEFAULT) /
                              1000}
                            km
                            {" • "}
                            {Math.round(
                              ((field.value ?? PLACE_FILTERS.RADIUS.DEFAULT) /
                                1000) *
                                0.621,
                            )}
                            mi
                          </span>
                        </div>
                        <Slider
                          min={PLACE_FILTERS.RADIUS.MIN}
                          max={PLACE_FILTERS.RADIUS.MAX}
                          step={PLACE_FILTERS.RADIUS.STEP}
                          value={[field.value ?? PLACE_FILTERS.RADIUS.DEFAULT]}
                          onValueChange={([value]) => field.onChange(value)}
                        />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minRating"
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>{FILTER_LABELS.rating}</Label>
                          <span className="text-sm text-muted-foreground">
                            {field.value ?? PLACE_FILTERS.RATING.MIN}★
                          </span>
                        </div>
                        <Slider
                          min={PLACE_FILTERS.RATING.MIN}
                          max={PLACE_FILTERS.RATING.MAX}
                          step={PLACE_FILTERS.RATING.STEP}
                          value={[field.value ?? PLACE_FILTERS.RATING.MIN]}
                          onValueChange={([value]) => field.onChange(value)}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="openNow"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-2 rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <Label>{FILTER_LABELS.openNow}</Label>
                        <p className="text-sm text-muted-foreground">
                          Filter out closed places from search results
                        </p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormItem>
                )}
              />
            </CollapsibleContent>
          </Collapsible>
        )}
      </form>
    </Form>
  );
};
