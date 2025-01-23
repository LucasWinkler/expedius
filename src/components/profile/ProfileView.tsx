import type { User } from "@/server/db/schema";
import userLists from "@/server/data/userLists";
import { ProfileHeader } from "./ProfileHeader";
import { BiographySection } from "./BiographySection";
import { ListsSection } from "./ListsSection";
import { getServerSession } from "@/server/auth/session";

type ProfileViewProps = {
  user: User;
};

export const ProfileView = async ({ user }: ProfileViewProps) => {
  const session = await getServerSession();
  const lists = await userLists.queries.getAllByUserId(user.id);
  const isOwnProfile = session?.user.id === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        listCount={lists.length}
      />

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <BiographySection bio={user.bio ?? ""} />
        </div>
        <div className="md:col-span-2">
          <ListsSection initialLists={lists} isOwnProfile={isOwnProfile} />
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
