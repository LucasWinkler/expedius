"use client";

import { ProfileHeader } from "./ProfileHeader";
import { BiographySection } from "./BiographySection";
import { ListsSection } from "./ListsSection";
import { useLists } from "@/hooks/useLists";
import { DbUser } from "@/server/db/schema";

interface ProfileViewProps {
  user: DbUser;
  isOwnProfile: boolean;
}

export const ProfileView = ({ user, isOwnProfile }: ProfileViewProps) => {
  const { data: lists } = useLists();

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        listCount={lists?.items.length ?? 0}
      />

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <BiographySection bio={user.bio ?? ""} />
        </div>
        <div className="md:col-span-2">
          <ListsSection isOwnProfile={isOwnProfile} />
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
