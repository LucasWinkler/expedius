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
      className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground md:[&_svg]:size-5"
      aria-label="Search places"
    >
      <Search />
      <span className="sr-only">Search</span>
    </Button>
  );
};
