"use client";

import Image from "next/image";
import Link from "next/link";
import type { Place } from "@/types";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getPriceLevelDisplay } from "@/lib/utils";
import placeImageFallback from "../../../public/place-image-fallback.webp";

interface PlaceCardProps {
  place: Place;
  priority?: boolean;
  actions?: React.ReactNode;
  isListItem?: boolean;
}

export const PlaceCard = ({
  place,
  priority,
  actions,
  isListItem,
}: PlaceCardProps) => {
  const Comp = isListItem ? "li" : "div";
  return (
    <Comp className="group list-none">
      <Card className="relative overflow-hidden bg-muted shadow-none transition-all hover:shadow-md">
        <Link href={`/place/${place.id}`} className="block">
          <div className="relative m-4 overflow-hidden rounded-lg">
            {place.image ? (
              <Image
                className="aspect-[4/3] h-full w-full rounded-lg object-cover duration-200 ease-in-out group-hover:scale-105"
                src={place.image.url}
                width={place.image.width}
                height={place.image.height}
                placeholder={place.image.blurDataURL ? "blur" : undefined}
                blurDataURL={place.image.blurDataURL ?? undefined}
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
          </div>
          <CardHeader className="space-y-2 p-4 pb-2 pt-0">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-1 text-lg group-hover:underline group-hover:underline-offset-4">
                {place.displayName.text}
              </CardTitle>
              <span className="text-sm font-medium text-muted-foreground">
                {getPriceLevelDisplay(place.priceLevel)}
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
        </Link>
        <div className="absolute right-6 top-6 flex flex-col gap-2">
          {actions}
        </div>
      </Card>
    </Comp>
  );
};
