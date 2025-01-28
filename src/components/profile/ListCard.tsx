"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, MoreHorizontal, Edit, Trash, Loader2 } from "lucide-react";
import type { DbListWithPlacesCount } from "@/server/db/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn, shouldUseWhiteText } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProxiedImage } from "@/components/ui/ProxiedImage";
import { useImageColour } from "@/hooks/useImageColour";
import { Badge } from "../ui/badge";

interface ListCardProps {
  list: DbListWithPlacesCount;
  isOwnProfile: boolean;
  username: string;
  showPrivacyBadge?: boolean;
  onEdit: (list: DbListWithPlacesCount) => void;
  onDelete: (list: DbListWithPlacesCount) => void;
}

export const ListCard = ({
  list,
  isOwnProfile,
  username,
  showPrivacyBadge = false,
  onEdit,
  onDelete,
}: ListCardProps) => {
  const { imageLoaded, setImageLoaded } = useImageColour(list.image);

  // const useWhiteText = list.image
  //   ? (imageColour?.isDark ?? true)
  //   : shouldUseWhiteText(list.colour);

  return (
    <div className="group relative">
      <Link className="block" href={`/u/${username}/lists/${list.id}`}>
        <Card className="relative h-40 overflow-hidden transition-all duration-200 ease-out group-hover:shadow-lg">
          <div
            className={cn("absolute inset-0")}
            style={{ backgroundColor: list.colour }}
          />

          {list.image && (
            <>
              <ProxiedImage
                src={list.image}
                alt={list.name}
                fill
                className={cn(
                  "object-cover",
                  !imageLoaded && "opacity-0",
                  "transition-opacity duration-300",
                )}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={75}
                onLoad={() => setImageLoaded(true)}
              />
              {imageLoaded && <div className="absolute inset-0 bg-black/10" />}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2
                    className={cn(
                      "size-6 animate-spin",
                      shouldUseWhiteText(list.colour)
                        ? "text-white/70"
                        : "text-black/70",
                    )}
                  />
                </div>
              )}
            </>
          )}

          <CardHeader className="relative flex h-full flex-col justify-between p-4">
            <div className="flex items-start justify-between gap-2">
              <CardTitle
                className={cn(
                  "line-clamp-2 flex-1 text-lg font-bold leading-tight drop-shadow-sm",
                  "text-white",
                  // useWhiteText ? "text-white" : "text-black",
                )}
              >
                {list.name}gasg asgas gasg asgasg
              </CardTitle>

              {isOwnProfile && (
                <div onClick={(e) => e.preventDefault()}>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className={cn(
                          "size-10 bg-white/20 text-white shadow-md backdrop-blur-md transition-all duration-200 ease-out hover:bg-white/30 active:scale-90 [&_svg]:size-5",
                        )}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          onEdit(list);
                        }}
                      >
                        <Edit className="mr-2 size-4" />
                        Edit List
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          onDelete(list);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 size-4" />
                        Delete List
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "flex items-center rounded-md px-2 py-1",
                  "bg-white/20 text-white shadow-md backdrop-blur-md",
                )}
              >
                <MapPin className="mr-1 size-3" />
                <span>{list._count.savedPlaces}</span>
              </div>

              {showPrivacyBadge && (
                <Badge
                  variant="secondary"
                  className="h-5 bg-white/20 text-xs font-normal text-white shadow-md backdrop-blur-md hover:bg-white/20"
                >
                  {list.isPublic ? "Public" : "Private"}
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
};
export default ListCard;
