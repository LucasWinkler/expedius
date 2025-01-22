"use client";

import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, XCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRef } from "react";

const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(5, "Please enter a search term that is at least 5 characters"),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export const SearchBar = ({ initialQuery = "" }: { initialQuery?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: initialQuery,
    },
  });

  function onSubmit(data: SearchFormValues) {
    const params = new URLSearchParams(searchParams);
    if (data.query) {
      params.set("q", data.query);
    }

    router.push(`/discover?${params.toString()}`);
  }

  const handleClear = () => {
    form.reset({ query: "" });
    inputRef.current?.focus();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full gap-2"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pizza in Austin TX"
                    className="bg-white pl-10 pr-10"
                    {...field}
                    ref={inputRef}
                  />

                  {field.value && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <XCircle className="h-4 w-4" />
                      <span className="sr-only">Clear search</span>
                    </button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Search</Button>
      </form>
    </Form>
  );
};

export default SearchBar;
