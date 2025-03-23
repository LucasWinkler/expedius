import { Search } from "lucide-react";
import { memo } from "react";
import { cn } from "@/lib/utils";

interface SearchIconProps {
  className?: string;
}

export const SearchIcon = memo(({ className }: SearchIconProps = {}) => (
  <Search
    data-testid="search-icon"
    className={cn(
      "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors duration-200 ease-in-out",
      className,
    )}
  />
));

SearchIcon.displayName = "SearchIcon";
