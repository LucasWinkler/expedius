"use client";

import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Share2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import type { User } from "@/server/db/schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import copyTextToClipboard from "@uiw/copy-to-clipboard";

type ProfileActionsProps = {
  user: User;
};

const EditProfileDialog = lazy(() => import("./EditProfileDialog"));

export const ProfileActions = ({ user }: ProfileActionsProps) => {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isOwnProfile = session?.user.id === user.id;

  const handleEditSuccess = async (updatedUser: User) => {
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
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link to clipboard");
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
          <Edit className="mr-2 size-4" />
          Edit Profile
        </Button>
        <Button onClick={handleShare} variant="outline" size="sm">
          <Share2 className="mr-2 size-4" />
          Share
        </Button>
      </div>

      {isEditDialogOpen && (
        <Suspense fallback={null}>
          <EditProfileDialog
            user={user}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSuccess={handleEditSuccess}
          />
        </Suspense>
      )}
    </>
  ) : null;
};

export default ProfileActions;
