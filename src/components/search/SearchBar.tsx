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
import { minQueryLength, PLACE_FILTERS } from "@/constants";
import { SearchInput } from "@/components/ui/search-input";
import { useSearch } from "@/hooks/useSearch";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Clock, Search, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useClickOutside } from "@/hooks";
import { FilterSheet } from "@/components/explore/FilterSheet";

const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(minQueryLength, `Please enter at least ${minQueryLength} characters`),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface SearchBarProps {
  className?: string;
  variant?: "default" | "with-filters";
}

export const SearchBar = ({
  className,
  variant = "default",
}: SearchBarProps) => {
  const { query: initialQuery, updateSearchParams, filters } = useSearch();
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const {
    searchHistory,
    addToHistory,
    removeFromHistory,
    refreshHistory,
    removeAllHistory,
  } = useSearchHistory();
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
    removeAllHistory(true);
  }, [removeAllHistory]);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: initialQuery,
    },
  });

  const currentQueryValue = form.watch("query");

  const lastUrlQueryRef = useRef(initialQuery);

  useEffect(() => {
    if (initialQuery !== lastUrlQueryRef.current) {
      lastUrlQueryRef.current = initialQuery;
      form.setValue("query", initialQuery);
    }
  }, [initialQuery, form]);

  useEffect(() => {
    const currentValue = currentQueryValue || "";
    if (!currentValue.trim()) {
      setFilteredHistory(searchHistory);
      return;
    }

    const filtered = searchHistory.filter((item) =>
      item.toLowerCase().includes(currentValue.toLowerCase()),
    );
    setFilteredHistory(filtered);
  }, [currentQueryValue, searchHistory, form]);

  function onSubmit(data: SearchFormValues) {
    updateSearchParams({
      query: data.query,
      filters: variant === "with-filters" ? filters : undefined,
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
        <div className="flex items-stretch gap-3">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <SearchInput
                    placeholder={
                      variant === "with-filters"
                        ? "Search for places..."
                        : "What are you looking for?"
                    }
                    onClear={handleClear}
                    onFocus={handleOpenPopup}
                    onClick={handleOpenPopup}
                    variant={variant}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {variant === "with-filters" && (
            <FilterSheet
              className="shrink-0"
              radius={Number(filters?.radius ?? PLACE_FILTERS.RADIUS.DEFAULT)}
              minRating={Number(filters?.minRating ?? 0)}
              openNow={Boolean(filters?.openNow)}
              onApplyFilters={(newFilters) => {
                updateSearchParams({
                  query: form.getValues("query"),
                  filters: newFilters,
                });
              }}
            />
          )}
        </div>

        {isPopupOpen && searchHistory.length > 0 && (
          <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <Clock className="size-4" />
                Recent Searches
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-gray-600 hover:bg-gray-200 hover:text-gray-900"
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
                    className="group flex select-none items-center border-b border-gray-100 bg-white px-4 py-2.5 transition-colors hover:bg-gray-50/90"
                  >
                    <div className="flex w-full items-center gap-3">
                      <Search className="size-4 text-gray-500 group-hover:text-gray-700" />
                      <span className="flex-1 truncate text-sm text-gray-700 group-hover:text-gray-900">
                        {item}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-6 shrink-0 rounded-full p-0 opacity-70 transition-opacity hover:bg-gray-100 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          removeFromHistory(item);
                        }}
                      >
                        <X className="size-3.5 text-gray-600 hover:text-red-500" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center bg-white py-6">
                  <p className="text-sm text-gray-500">
                    No matching searches found
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};
