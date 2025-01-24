import { getUser } from "@/server/services/profile";
import userLists from "@/server/data/userLists";
import { ProfileHeader } from "./ProfileHeader";

export const ProfileHeaderContent = async ({
  username,
}: {
  username: string;
}) => {
  const user = await getUser(username);
  if (!user || "type" in user) return null;
  const lists = await userLists.queries.getAllByUserId(user.id);
  const isOwnProfile = "id" in user;

  return (
    <ProfileHeader
      user={user}
      isOwnProfile={isOwnProfile}
      listCount={lists.length}
    />
  );
};
