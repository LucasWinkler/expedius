"use client";

import copyTextToClipboard from "@uiw/copy-to-clipboard";
import type { DbUser } from "@/server/types/db";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ProfileStats,
  ProfileActions,
  ProfileAvatar,
  ProfileInfo,
  ProfileEditDialog,
} from "@/components/profile";

interface ProfileHeaderProps {
  user: DbUser;
  isOwnProfile: boolean;
  totalLists: number;
  totalLikes: number;
}

export const ProfileHeader = ({
  user,
  isOwnProfile,
  totalLists,
  totalLikes,
}: ProfileHeaderProps) => {
  const [editingUser, setEditingUser] = useState<DbUser | null>(null);
  const router = useRouter();

  const handleEditSuccess = async (updatedUser: DbUser) => {
    if (updatedUser.username !== user.username) {
      router.push(`/u/${updatedUser.username}`);
    } else {
      router.refresh();
    }
  };

  const handleShare = () => {
    try {
      copyTextToClipboard(
        `${window.location.origin}${window.location.pathname}`,
      );
      toast.success("Link copied to clipboard", { duration: 1500 });
    } catch {
      toast.error("Failed to copy link to clipboard");
    }
  };

  return (
    <header>
      <div
        className="relative h-48 w-full"
        style={{
          backgroundColor: user.colour || "hsl(var(--muted))",
        }}
      >
        {isOwnProfile && (
          <div className="container mx-auto flex justify-end gap-2 px-4 pt-6 md:max-w-3xl">
            <ProfileActions
              colour={user.colour}
              onEdit={() => setEditingUser(user)}
              onShare={handleShare}
            />
          </div>
        )}
      </div>

      <div className="container relative mx-auto -mt-24 flex flex-col items-center px-4 md:max-w-3xl">
        <ProfileAvatar
          image={user.image}
          name={user.name}
          username={user.username}
        />
        <ProfileInfo name={user.name} username={user.username} />
        {user.bio && (
          <p className="mt-4 text-center text-muted-foreground">{user.bio}</p>
        )}
        <ProfileStats
          totalLists={totalLists}
          totalLikes={totalLikes}
          username={user.username}
        />
      </div>

      {editingUser && (
        <ProfileEditDialog
          user={editingUser}
          onOpenChange={() => setEditingUser(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </header>
  );
};
