import { notFound } from "next/navigation";
import { ProfileView } from "@/components/profile/ProfileView";
import { PrivateProfileView } from "@/components/profile/PrivateProfileView";
import userQueries from "@/server/db/queries/user";
import { getServerSession } from "@/lib/auth/session";
import { cache } from "react";
import type { User } from "@/server/db/schema";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

type PublicProfile = User;
type PrivateProfile = {
  username: string;
  type: "private";
};

type ProfileResponse = PublicProfile | PrivateProfile;

const getUser = cache(
  async (username: string): Promise<ProfileResponse | null> => {
    if (!username) return null;

    const user = await userQueries.getByUsername(username);
    if (!user) return null;

    const session = await getServerSession();
    const isOwnProfile = session?.user.id === user.id;

    if (!isOwnProfile && !user.isPublic) {
      return {
        username: user.username,
        type: "private",
      };
    }

    return user;
  },
);

export const generateMetadata = async ({ params }: ProfilePageProps) => {
  const username = (await params).username;
  if (!username) {
    return { title: "User not found" };
  }

  const user = await getUser(username);
  if (!user) {
    return { title: "User not found | PoiToGo" };
  }

  if ("type" in user) {
    return { title: `@${user.username} (Private) | PoiToGo` };
  }

  return { title: `${user.name} (@${user.username}) | PoiToGo` };
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const username = (await params).username;
  if (!username) {
    notFound();
  }

  const user = await getUser(username);
  if (!user) {
    notFound();
  }

  if ("type" in user) {
    return <PrivateProfileView username={user.username} />;
  }

  return <ProfileView user={user} />;
};

export default ProfilePage;
