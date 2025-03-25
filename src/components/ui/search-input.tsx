import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, ArrowRight } from "lucide-react";
import { forwardRef } from "react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  variant?: "default" | "with-filters";
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, variant = "default", ...props }, ref) => {
    const showSearchButton = variant === "default";

    return (
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 z-[1] size-[18px] -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={ref}
          value={value}
          className={cn(
            "h-[52px] rounded-full border-muted-foreground/20 bg-white pl-11 text-sm shadow-sm transition-all duration-300 ease-out hover:border-muted-foreground/30 hover:shadow-md focus-visible:border-primary focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-primary 2xl:h-[60px] 2xl:text-lg",
            value
              ? showSearchButton
                ? "pr-20 md:pr-24"
                : "pr-12"
              : showSearchButton
                ? "pr-12"
                : null,
            className,
          )}
          {...props}
        />
        <div
          className={cn(
            "absolute right-3 top-1/2 flex -translate-y-1/2 items-center",
            showSearchButton ? "gap-2" : "gap-1",
          )}
        >
          {value && onClear && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full p-0 hover:bg-muted"
              onClick={onClear}
            >
              <X className="size-4 text-muted-foreground" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
          {showSearchButton && (
            <Button
              type="submit"
              size="icon"
              className="size-8 rounded-full bg-primary p-0 text-primary-foreground shadow-sm transition-all hover:bg-primary hover:shadow-md active:scale-95"
            >
              <ArrowRight className="size-4" />
              <span className="sr-only">Search</span>
            </Button>
          )}
        </div>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
