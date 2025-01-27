"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
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

const minQueryLength = 2;
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
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors duration-200 ease-in-out" />
                  <Input
                    placeholder="Search for places..."
                    className="w-full rounded-full border-muted-foreground/20 bg-white py-6 pl-12 pr-32 shadow-lg transition-all duration-300 ease-out hover:border-muted-foreground/30 hover:shadow-xl focus:border-muted-foreground/40 focus:shadow-xl"
                    {...field}
                    ref={inputRef}
                  />
                  {field.value && (
                    <Button
                      type="button"
                      onClick={handleClear}
                      variant="ghost"
                      size="icon"
                      className="absolute right-[5.5rem] top-1/2 -translate-y-1/2 p-0 text-muted-foreground transition-all duration-200 ease-out hover:scale-110 hover:text-foreground"
                    >
                      <XCircle className="h-4 w-4" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  )}
                  <Button className="absolute right-0 top-0 h-full rounded-l-none rounded-r-full px-4 py-2 text-sm transition-all duration-200 ease-out hover:pl-5 hover:pr-5">
                    Search
                  </Button>
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
