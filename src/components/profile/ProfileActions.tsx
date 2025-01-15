"use client";

import { Button } from "@/components/ui/button";
import { Edit, Share2, Settings } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import type { User } from "@/server/db/schema";

type ProfileActionsProps = {
  userId: User["id"];
};

export const ProfileActions = ({ userId }: ProfileActionsProps) => {
  const { data: session, isPending } = useSession();
  const isOwnProfile = session?.user.id === userId;

  if (isPending) return null;

  return isOwnProfile ? (
    <div className="mt-4 flex space-x-2 md:mt-0">
      <Button variant="outline" size="sm">
        <Edit className="mr-2 h-4 w-4" />
        Edit Profile
      </Button>
      <Button variant="outline" size="sm">
        <Settings className="mr-2 h-4 w-4" />
        Privacy
      </Button>
      <Button variant="outline" size="sm">
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>
  ) : null;
};

export default ProfileActions;
