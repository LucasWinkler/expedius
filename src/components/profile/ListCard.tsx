"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MapPin, MoreHorizontal, Edit, Trash } from "lucide-react";
import type { UserList } from "@/server/db/schema";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, shouldUseWhiteText } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { DeleteListDialog } from "./DeleteListDialog";

type ListCardProps = {
  list: UserList;
  onEdit: (list: UserList) => void;
  onDelete: () => Promise<void>;
  showActions?: boolean;
  placesCount?: number;
  isDefault: boolean;
};

export const ListCard = ({
  list,
  showActions,
  onEdit,
  onDelete,
  placesCount = 0,
}: ListCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
            className={cn(
              "absolute inset-0 transition-opacity duration-200",
              imageLoaded ? "opacity-0" : "opacity-100",
            )}
            style={{ backgroundColor: list.colour }}
          />

          {/* {!list.image && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50" />
          )} */}

          {list.image && (
            <>
              <Image
                src={list.image}
                alt={list.name}
                fill
                className={cn(
                  "object-cover transition-opacity duration-200",
                  imageLoaded ? "opacity-100" : "opacity-0",
                )}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50" />
            </>
          )}

          <CardHeader className="relative flex h-full flex-col justify-between p-4">
            <div className="flex items-start justify-between">
              <CardTitle
                className={cn(
                  "line-clamp-2 flex-1 text-lg font-bold leading-tight drop-shadow-sm",
                  shouldUseWhiteText(list.colour) ? "text-white" : "text-black",
                  list.image && "text-white",
                )}
              >
                {list.name}
              </CardTitle>

              {showActions && (
                <div onClick={(e) => e.preventDefault()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className={cn(
                          "ml-2 h-8 w-8 shrink-0",
                          list.image
                            ? "bg-white/20 text-white hover:bg-white/30"
                            : shouldUseWhiteText(list.colour)
                              ? "bg-white/20 text-white hover:bg-white/30"
                              : "bg-black/20 text-black hover:bg-black/30",
                        )}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          onEdit(list);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
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
                        <Trash className="mr-2 h-4 w-4" />
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
                  list.image
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : shouldUseWhiteText(list.colour)
                      ? "bg-white/20 text-white hover:bg-white/30"
                      : "bg-black/20 text-black hover:bg-black/30",
                )}
              >
                <MapPin className="mr-1 h-3 w-3" />
                <span className="drop-shadow-sm">{placesCount}</span>
              </div>

              <Badge
                variant="secondary"
                className={cn(
                  "h-5 text-xs font-normal",
                  list.image
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : shouldUseWhiteText(list.colour)
                      ? "bg-white/20 text-white hover:bg-white/30"
                      : "bg-black/20 text-black hover:bg-black/30",
                )}
              >
                {list.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </Link>
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
