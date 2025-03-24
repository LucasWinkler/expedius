"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchButtonIconProps {
  onClick: () => void;
}

export const SearchButtonIcon = ({ onClick }: SearchButtonIconProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
      aria-label="Search places"
    >
      <Search className="h-5 w-5" />
      <span className="sr-only">Search</span>
    </Button>
  );
};
