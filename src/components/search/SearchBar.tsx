"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useRef } from "react";
import SearchIcon from "./SearchIcon";
import ClearButton from "./ClearButton";
import SearchButton from "./SearchButton";
import { minQueryLength } from "@/constants";

const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(minQueryLength, `Please enter at least ${minQueryLength} characters`),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export const SearchBar = ({ initialQuery = "" }: { initialQuery?: string }) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: initialQuery,
    },
  });

  function onSubmit(data: SearchFormValues) {
    const newUrl = data.query
      ? `/discover?q=${encodeURIComponent(data.query)}`
      : "/discover";

    if (newUrl !== window.location.pathname + window.location.search) {
      router.push(newUrl, { scroll: false });
    }
  }

  const handleClear = () => {
    form.reset({ query: "" });
    inputRef.current?.focus();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <SearchIcon />
                  <Input
                    placeholder="Search for places..."
                    className="w-full rounded-full border-muted-foreground/20 bg-white py-6 pl-12 pr-32 shadow-sm transition-all duration-300 ease-out hover:border-muted-foreground/30 hover:shadow-md focus:border-muted-foreground/40 focus:shadow-lg"
                    {...field}
                    ref={inputRef}
                  />
                  {field.value && <ClearButton onClick={handleClear} />}
                  <SearchButton />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SearchBar;
