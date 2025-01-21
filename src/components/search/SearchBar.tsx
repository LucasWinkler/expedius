"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const SearchBar = ({ initialQuery }: { initialQuery?: string }) => {
  const [query, setQuery] = useState(initialQuery || "");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/discover?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for places..."
        className="h-12 pr-12"
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-1 top-1 size-10"
      >
        <Search className="size-4" />
      </Button>
    </form>
  );
};
