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
import { useRef } from "react";
import { minQueryLength } from "@/constants";
import { SearchInput } from "../ui/search-input";
import { useSearch } from "@/hooks/useSearch";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { PLACE_FILTERS, FILTER_LABELS } from "@/constants";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const { query: initialQuery, updateSearchParams } = useSearch();

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
  }

  const handleClear = () => {
    form.reset({ query: "" });
    inputRef.current?.focus();
  };

  return (
    <Form {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SearchInput
                  placeholder="Search for places..."
                  onClear={handleClear}
                  {...field}
                />
              </FormControl>
              <FormMessage className="2xl:text-lg" />
            </FormItem>
          )}
        />

        {variant === "advanced" && (
          <div className="mt-4 space-y-6">
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
                          {(field.value ?? PLACE_FILTERS.RADIUS.DEFAULT) / 1000}
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
          </div>
        )}
      </form>
    </Form>
  );
};

export default SearchBar;
