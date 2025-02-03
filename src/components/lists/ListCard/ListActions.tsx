"use client";

import { Edit, ExternalLink, Trash } from "lucide-react";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type { DbUser, DbListWithPlacesCount } from "@/server/types/db";

interface ListActionsProps {
  list: DbListWithPlacesCount;
  username: DbUser["username"];
  onEdit: (list: DbListWithPlacesCount) => void;
  onDelete: (list: DbListWithPlacesCount) => void;
}

export const ListActions = ({
  list,
  username,
  onEdit,
  onDelete,
}: ListActionsProps) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="-mr-2 size-8 text-muted-foreground hover:text-foreground [&_svg]:size-4"
      >
        <MoreHorizontal />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem asChild>
        <Link href={`/u/${username}/lists/${list.slug}`}>
          <ExternalLink className="mr-2 size-4" />
          Open List
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onEdit(list)}>
        <Edit className="mr-2 size-4" />
        Edit List
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => onDelete(list)}
        className="text-destructive focus:text-destructive"
      >
        <Trash className="mr-2 size-4" />
        Delete List
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
