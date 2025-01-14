import type { User } from "@/server/db/schema";
import { ProfileHeader } from "./ProfileHeader";
import { BiographySection } from "./BiographySection";
import { ListsSection } from "./ListsSection";

type ProfileViewProps = {
  user: User;
};

export const ProfileView = ({ user }: ProfileViewProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader user={user} />

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <BiographySection bio={user.bio ?? ""} />
        </div>
        <div className="md:col-span-2">
          <ListsSection userId={user.id} />
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
