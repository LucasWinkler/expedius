"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, MoreHorizontal, Edit, Trash, Loader2 } from "lucide-react";
import type { UserList } from "@/server/db/schema";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, shouldUseWhiteText, getImageAverageColor } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useRef } from "react";
import { DeleteListDialog } from "./DeleteListDialog";
import { EditListDialog } from "./EditListDialog";

// Cache for image colors to avoid recalculating
const imageColorCache = new Map<string, { color: string; isDark: boolean }>();

type ListCardProps = {
  list: UserList;
  onEdit: (list: UserList) => void;
  onDelete: () => Promise<void>;
  showActions?: boolean;
  showPrivacyBadge?: boolean;
  placesCount?: number;
  priority?: boolean;
};

// Custom hook for handling image color analysis
const useImageColor = (imageUrl: string | null) => {
  const [imageColor, setImageColor] = useState<{
    color: string;
    isDark: boolean;
  } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(!imageUrl);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!imageUrl) {
      setImageColor(null);
      setImageLoaded(true);
      return;
    }

    // Check cache first
    const cached = imageColorCache.get(imageUrl);
    if (cached) {
      setImageColor(cached);
      return;
    }

    // Always set image as not loaded when URL changes
    setImageLoaded(false);

    getImageAverageColor(imageUrl)
      .then((result) => {
        if (!isMounted.current) return;
        imageColorCache.set(imageUrl, result);
        setImageColor(result);
      })
      .catch((error) => {
        console.error("Error analyzing image color:", error);
        if (!isMounted.current) return;
        setImageColor(null);
      });
  }, [imageUrl]);

  return {
    imageColor,
    imageLoaded,
    setImageLoaded,
  };
};

export const ListCard = ({
  list,
  showActions,
  onEdit,
  onDelete,
  placesCount = 0,
  showPrivacyBadge,
  priority = false,
}: ListCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { imageColor, imageLoaded, setImageLoaded } = useImageColor(list.image);

  // Simple calculation, no need for useMemo
  const useWhiteText = list.image
    ? (imageColor?.isDark ?? true) // Default to white text while loading
    : shouldUseWhiteText(list.colour);

  return (
    <div className="group relative">
      <Link href={`/list/${list.id}`} className="block">
        <Card
          className={cn(
            "relative h-40 overflow-hidden transition-all duration-200 ease-out",
            "hover:scale-[1.02] hover:shadow-lg hover:shadow-foreground/5",
            "active:scale-[0.98]",
          )}
        >
          <div
            className={cn("absolute inset-0")}
            style={{ backgroundColor: list.colour }}
          />

          {list.image && (
            <>
              <Image
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
                priority={priority || list.isDefault}
                onLoad={() => setImageLoaded(true)}
              />
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
            <div className="flex items-start justify-between">
              <CardTitle
                className={cn(
                  "line-clamp-2 flex-1 text-lg font-bold leading-tight drop-shadow-sm",
                  useWhiteText ? "text-white" : "text-black",
                )}
              >
                {list.name}
              </CardTitle>

              {showActions && (
                <div onClick={(e) => e.preventDefault()}>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className={cn(
                          "ml-2 h-8 w-8 shrink-0",
                          useWhiteText
                            ? "bg-white/20 text-white hover:bg-white/30"
                            : "bg-black/20 text-black hover:bg-black/30",
                        )}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="mr-2 size-4" />
                        Edit List
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-destructive focus:text-destructive"
                        disabled={list.isDefault}
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
                  "flex items-center rounded-md px-2 py-1 text-sm",
                  useWhiteText
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-black/20 text-black hover:bg-black/30",
                )}
              >
                <MapPin className="mr-1 size-3" />
                <span className="drop-shadow-sm">{placesCount}</span>
              </div>

              {showPrivacyBadge && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "h-5 text-xs font-normal",
                    useWhiteText
                      ? "bg-white/20 text-white hover:bg-white/30"
                      : "bg-black/20 text-black hover:bg-black/30",
                  )}
                >
                  {list.isPublic ? "Public" : "Private"}
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>
      </Link>

      <EditListDialog
        list={list}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={onEdit}
      />

      <DeleteListDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        listName={list.name}
        onDelete={onDelete}
      />
    </div>
  );
};

export default ListCard;
