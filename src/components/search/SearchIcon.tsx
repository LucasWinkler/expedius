import { Search } from "lucide-react";
import { memo } from "react";

export const SearchIcon = memo(() => (
  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors duration-200 ease-in-out" />
));

SearchIcon.displayName = "SearchIcon";

export default SearchIcon;
