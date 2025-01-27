"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Place } from "@/types";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import { getPriceLevelDisplay } from "@/lib/utils";
import placeImageFallback from "../../../public/place-image-fallback.webp";
import { useLists } from "@/contexts/ListsContext";

export const PlaceCard = ({
  place,
  priority = false,
}: {
  place: Place;
  priority?: boolean;
}) => {
  const { lists, refreshLists, getSelectedLists, updateSelectedLists } =
    useLists();
  const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentSelectedLists = getSelectedLists(place.id);
    setSelectedLists(currentSelectedLists);
  }, [getSelectedLists, place.id, lists]);

  const handleSelectedListsChange = (newSelectedLists: Set<string>) => {
    setSelectedLists(newSelectedLists);
    updateSelectedLists(place.id, newSelectedLists);
  };

  const renderPriceLevel = (level?: string) => getPriceLevelDisplay(level);

  return (
    <li className="group list-none">
      <Link href={`/place/${place.id}`} className="block">
        <Card className="overflow-hidden bg-muted shadow-none transition-all hover:shadow-md">
          <div className="relative m-4 overflow-hidden rounded-lg">
            {place.image ? (
              <Image
                className="aspect-[4/3] h-full w-full rounded-lg object-cover duration-200 ease-in-out group-hover:scale-105"
                src={place.image.url}
                width={place.image.width}
                height={place.image.height}
                placeholder="blur"
                blurDataURL={place.image.blurDataURL}
                alt={place.displayName.text}
                priority={priority}
              />
            ) : (
              <Image
                className="aspect-[4/3] h-full w-full rounded-lg object-cover duration-200 ease-in-out group-hover:scale-105"
                src={placeImageFallback}
                placeholder="blur"
                alt=""
                priority={priority}
              />
            )}
            <div
              className="absolute right-2 top-2 flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <LikeButton placeId={place.id} />

              <BookmarkButton
                placeId={place.id}
                userLists={lists}
                selectedLists={selectedLists}
                setSelectedLists={handleSelectedListsChange}
                onListsUpdate={refreshLists}
              />
            </div>
          </div>
          <CardHeader className="space-y-2 p-4 pb-2 pt-0">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-1 text-lg group-hover:underline group-hover:underline-offset-4">
                {place.displayName.text}
              </CardTitle>
              <span className="text-sm font-medium text-muted-foreground">
                {renderPriceLevel(place.priceLevel)}
              </span>
            </div>
            {place.rating && (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">{place.rating}</span>
                  <span className="ml-0.5 text-muted-foreground">
                    /<span className="ml-0.5">5</span>
                  </span>
                </div>
                {place.userRatingCount && (
                  <span className="text-sm text-muted-foreground">
                    ({place.userRatingCount.toLocaleString()} reviews)
                  </span>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              <span className="line-clamp-1">{place.formattedAddress}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
};
