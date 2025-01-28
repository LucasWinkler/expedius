"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { ProxiedImage } from "@/components/ui/ProxiedImage";
import type { DbUser } from "@/server/db/schema";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

interface ProfileHeroProps {
  user: DbUser;
  isOwnProfile: boolean;
  totalLists: number;
}

export const ProfileHero = ({
  user,
  isOwnProfile,
  totalLists,
}: ProfileHeroProps) => {
  return (
    <div className="relative bg-background">
      {/* Cover Image - could be added later */}
      <div className="h-48 w-full bg-muted" />

      <div className="container mx-auto px-4">
        <div className="relative -mt-24 flex flex-col items-center">
          {/* Profile Image */}
          <div className="relative size-40 overflow-hidden rounded-full border-4 border-background bg-muted">
            <Avatar className="size-full">
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name ?? user.username}
              />
              <AvatarFallback>
                {user.name?.[0] ?? user.username[0]}
              </AvatarFallback>
            </Avatar>

            {/* {user.image && (
              <ProxiedImage
                src={user.image}
                alt={user.name ?? user.username}
                fill
                className="object-cover"
              />
            )} */}
          </div>

          {/* Profile Info */}
          <div className="mt-4 text-center">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>

          {/* Stats */}
          <div className="mt-6 flex gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold">{totalLists}</p>
              <p className="text-sm text-muted-foreground">Lists</p>
            </div>
            {/* Add more stats here later */}
          </div>

          {/* Actions */}
          {isOwnProfile && (
            <div className="mt-6">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 size-4" />
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
