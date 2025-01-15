"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Share2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import type { User } from "@/server/db/schema";
import { useRouter } from "next/navigation";
import EditProfileDialog from "./EditProfileDialog";

type ProfileActionsProps = {
  user: User;
};

export const ProfileActions = ({ user }: ProfileActionsProps) => {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isOwnProfile = session?.user.id === user.id;

  const handleSuccess = async (updatedUser: User) => {
    if (updatedUser.username !== user.username) {
      router.push(`/u/${updatedUser.username}`);
    } else {
      router.refresh();
    }
  };

  if (isPending) return null;

  return isOwnProfile ? (
    <>
      <div className="mt-4 flex space-x-2 md:mt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      <EditProfileDialog
        user={user}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleSuccess}
      />
    </>
  ) : null;
};

export default ProfileActions;
