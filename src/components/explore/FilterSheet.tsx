"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PLACE_FILTERS, FILTER_LABELS } from "@/constants";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface FilterSheetProps {
  radius: number;
  minRating: number;
  openNow: boolean;
  onApplyFilters: (filters: {
    radius: number;
    minRating: number;
    openNow: boolean;
  }) => void;
  className?: string;
}

const FilterContent = ({
  localRadius,
  setLocalRadius,
  localMinRating,
  setLocalMinRating,
  localOpenNow,
  setLocalOpenNow,
  isMobile,
}: {
  localRadius: number;
  setLocalRadius: (value: number) => void;
  localMinRating: number;
  setLocalMinRating: (value: number) => void;
  localOpenNow: boolean;
  setLocalOpenNow: (value: boolean) => void;
  isMobile: boolean;
}) => (
  <div className={cn("space-y-6", isMobile && "px-4")}>
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{FILTER_LABELS.radius}</Label>
        <span className="text-sm text-muted-foreground">
          {localRadius / 1000}km • {Math.round(localRadius / 1609.34)}mi
        </span>
      </div>
      <Slider
        min={PLACE_FILTERS.RADIUS.MIN}
        max={PLACE_FILTERS.RADIUS.MAX}
        step={PLACE_FILTERS.RADIUS.STEP}
        value={[localRadius]}
        onValueChange={([value]) => setLocalRadius(value)}
        className="py-1 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-4"
      />
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{FILTER_LABELS.rating}</Label>
        <span className="text-sm text-muted-foreground">
          {localMinRating === 0 ? (
            "Any"
          ) : (
            <span className="flex items-center gap-1">
              <span className="font-medium">
                {localMinRating}
                {localMinRating < 5 && "+"}
              </span>
              <span className="text-yellow-500">★</span>
            </span>
          )}
        </span>
      </div>
      <Slider
        min={0}
        max={PLACE_FILTERS.RATING.MAX}
        step={PLACE_FILTERS.RATING.STEP}
        value={[localMinRating]}
        onValueChange={([value]) => setLocalMinRating(value)}
        className="py-1 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-4"
      />
    </div>

    <div className="flex items-center justify-between">
      <Label>{FILTER_LABELS.openNow}</Label>
      <Switch
        checked={localOpenNow}
        onCheckedChange={setLocalOpenNow}
        className="data-[state=checked]:bg-blue-600"
      />
    </div>
  </div>
);

export const FilterSheet = ({
  radius,
  minRating,
  openNow,
  onApplyFilters,
  className,
}: FilterSheetProps) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isOpen, setIsOpen] = useState(false);
  const [localRadius, setLocalRadius] = useState(radius);
  const [localMinRating, setLocalMinRating] = useState(minRating);
  const [localOpenNow, setLocalOpenNow] = useState(openNow);

  useEffect(() => {
    setLocalRadius(radius);
    setLocalMinRating(minRating);
    setLocalOpenNow(openNow);
  }, [radius, minRating, openNow]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setLocalRadius(radius);
        setLocalMinRating(minRating);
        setLocalOpenNow(openNow);
      }, 150);
    }
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      radius: localRadius,
      minRating: localMinRating,
      openNow: localOpenNow,
    });
    setIsOpen(false);
  };

  const TriggerButton = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-[52px] w-[52px] shrink-0 rounded-full bg-accent/50 p-0 text-accent-foreground transition-all duration-300 ease-out hover:bg-accent hover:text-accent-foreground 2xl:h-[60px] 2xl:w-[60px]",
        className,
      )}
    >
      <SlidersHorizontal className="size-5 2xl:size-6" />
      <span className="sr-only">Open filters</span>
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="flex items-center justify-between border-b px-4 pb-4">
            <DrawerTitle>Search Filters</DrawerTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLocalRadius(PLACE_FILTERS.RADIUS.DEFAULT);
                  setLocalMinRating(0);
                  setLocalOpenNow(false);
                }}
                className="h-8 rounded-full px-3 text-xs font-medium"
              >
                Reset
              </Button>
              <Button
                size="sm"
                onClick={handleApplyFilters}
                className="h-8 rounded-full px-3 text-xs font-medium"
              >
                Apply Filters
              </Button>
            </div>
          </DrawerHeader>
          <div className="overflow-y-auto py-6">
            <FilterContent
              localRadius={localRadius}
              setLocalRadius={setLocalRadius}
              localMinRating={localMinRating}
              setLocalMinRating={setLocalMinRating}
              localOpenNow={localOpenNow}
              setLocalOpenNow={setLocalOpenNow}
              isMobile={true}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{TriggerButton}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="space-y-1">
          <SheetTitle>Search Filters</SheetTitle>
          <SheetDescription>
            Adjust your search preferences to find exactly what you&apos;re
            looking for.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="mt-6">
            <FilterContent
              localRadius={localRadius}
              setLocalRadius={setLocalRadius}
              localMinRating={localMinRating}
              setLocalMinRating={setLocalMinRating}
              localOpenNow={localOpenNow}
              setLocalOpenNow={setLocalOpenNow}
              isMobile={false}
            />
          </div>
        </div>
        <SheetFooter className="mt-6 grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setLocalRadius(PLACE_FILTERS.RADIUS.DEFAULT);
              setLocalMinRating(0);
              setLocalOpenNow(false);
            }}
          >
            Reset
          </Button>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
