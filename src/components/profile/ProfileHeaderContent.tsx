import { ProfileHeader } from "./ProfileHeader";
import type { PublicProfileData } from "@/server/types/profile";
interface ProfileHeaderContentProps {
  user: PublicProfileData["user"];
  isOwnProfile: boolean;
  lists: PublicProfileData["lists"];
}

export const ProfileHeaderContent = ({
  user,
  isOwnProfile,
  lists,
}: ProfileHeaderContentProps) => {
  return (
    <ProfileHeader
      user={user}
      isOwnProfile={isOwnProfile}
      listCount={lists.items.length}
    />
  );
};
