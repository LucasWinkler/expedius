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
import { useEffect, useRef, useState } from "react";
import { minQueryLength } from "@/constants";
import { SearchInput } from "@/components/ui/search-input";
import { useSearch } from "@/hooks/useSearch";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PLACE_FILTERS, FILTER_LABELS } from "@/constants";
import { ChevronDown, X, Clock } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  useClickOutside(formRef, () => {
    setIsPopupOpen(false);
  });

  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: initialQuery,
      radius: PLACE_FILTERS.RADIUS.DEFAULT,
      minRating: undefined,
      openNow: false,
    },
  });

  function onSubmit(data: SearchFormValues) {
    updateSearchParams({
      query: data.query,
      filters: {
        radius: data.radius,
        minRating: data.minRating,
        openNow: data.openNow,
      },
    });

    if (!searchHistory.includes(data.query)) {
      const newHistory = [data.query, ...searchHistory.slice(0, 14)];
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      setSearchHistory(newHistory);
    }

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

  const handleRemoveHistoryItem =
    (query: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      const newHistory = searchHistory.filter((item) => item !== query);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      setSearchHistory(newHistory);
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
                  onFocus={() => setIsPopupOpen(true)}
                  onClick={() => setIsPopupOpen(true)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isPopupOpen && searchHistory.length > 0 && (
          <div className="absolute left-0 right-0 z-50 mt-2 rounded-lg border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <span className="text-sm font-medium">Recent Searches</span>
            </div>
            <ScrollArea className="flex h-[var(--radix-popover-content-available-height)] max-h-60 flex-col overflow-y-auto">
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleHistoryItemClick(item)}
                  className="flex select-none items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <div className="flex flex-auto items-center gap-4">
                    <Clock className="size-4 shrink-0 text-muted-foreground" />
                    <span className="[word-break:break-word]">{item}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="self-center rounded-full border-none p-2 hover:bg-gray-300"
                    onClick={(e) => handleRemoveHistoryItem(item)(e)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
              <ScrollBar orientation="vertical" />
            </ScrollArea>
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
