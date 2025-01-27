import { memo } from "react";
import { Button } from "../ui/button";

export const SearchButton = memo(() => (
  <Button className="absolute right-0 top-0 h-full rounded-l-none rounded-r-full px-4 py-2 text-sm transition-all duration-200 ease-out hover:pl-5 hover:pr-5">
    Search
  </Button>
));

SearchButton.displayName = "SearchButton";

export default SearchButton;
