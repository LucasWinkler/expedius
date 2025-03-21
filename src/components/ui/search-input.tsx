import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ClearButton, SearchIcon, SearchButton } from "@/components/search";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, className, value, ...props }, ref) => {
    return (
      <div className="relative">
        <SearchIcon />
        <Input
          ref={ref}
          className={cn(
            "w-full rounded-full border-muted-foreground/20 bg-white py-6 pl-12 pr-32 shadow-sm transition-all duration-300 ease-out hover:border-muted-foreground/30 hover:shadow-md focus-visible:border-blue-500 focus-visible:shadow-lg focus-visible:ring-blue-500 2xl:py-7 2xl:pl-14 2xl:pr-36 2xl:text-lg",
            className,
          )}
          value={value}
          {...props}
        />
        {value && <ClearButton onClick={onClear} />}
        <SearchButton />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
