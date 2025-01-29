"use client";

import copyTextToClipboard from "@uiw/copy-to-clipboard";
import type { DbUser } from "@/server/db/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProfileStats } from "./ProfileStats";
import { ProfileActions } from "./ProfileActions";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileEditDialog } from "./ProfileEditDialog";

interface ProfileHeaderProps {
  user: DbUser;
  isOwnProfile: boolean;
  totalLists: number;
}

export const ProfileHeader = ({
  user,
  isOwnProfile,
  totalLists,
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
    <div className="relative bg-background">
      <div className="h-48 w-full bg-muted">
        {/* Possible future profile image */}

        {isOwnProfile && (
          <ProfileActions
            onEdit={() => setEditingUser(user)}
            onShare={handleShare}
          />
        )}
      </div>

      <div className="container mx-auto max-w-3xl px-4">
        <div className="relative -mt-24 flex flex-col items-center">
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
            totalLikes={0}
            username={user.username}
          />
        </div>
      </div>

      {editingUser && (
        <ProfileEditDialog
          user={editingUser}
          onOpenChange={() => setEditingUser(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};
