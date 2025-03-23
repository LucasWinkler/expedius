"use client";

import { Clock, X } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";

interface SearchHistoryItemProps {
  item: string;
  onSelect: () => void;
  onRemove: (e?: React.MouseEvent) => void;
}

export const SearchHistoryItem = ({
  item,
  onSelect,
  onRemove,
}: SearchHistoryItemProps) => {
  return (
    <CommandItem
      onSelect={onSelect}
      className="flex items-center justify-between"
      value={item}
      keywords={[item]}
    >
      <div className="flex items-center gap-2 truncate">
        <Clock className="size-4 shrink-0 opacity-50" />
        <span className="truncate">{item}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="ml-auto h-6 w-6 shrink-0 rounded-full p-0 hover:bg-muted"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(e);
        }}
      >
        <X className="h-3.5 w-3.5" />
        <span className="sr-only">Remove</span>
      </Button>
    </CommandItem>
  );
};
