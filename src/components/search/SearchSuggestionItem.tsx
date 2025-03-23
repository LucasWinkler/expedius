import { Search } from "lucide-react";
import { CommandItem } from "../ui/command";

import { SEARCH_SUGGESTIONS } from "@/constants";

interface SearchSuggestionItemProps {
  suggestion: (typeof SEARCH_SUGGESTIONS)[number];
  onSelect: () => void;
}

export const SearchSuggestionItem = ({
  suggestion,
  onSelect,
}: SearchSuggestionItemProps) => {
  return (
    <CommandItem
      onSelect={onSelect}
      value={suggestion.title}
      keywords={[suggestion.query]}
    >
      <Search className="size-4 shrink-0 opacity-50" />
      <span>{suggestion.title}</span>
    </CommandItem>
  );
};
