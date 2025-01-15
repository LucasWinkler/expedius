import { notFound } from "next/navigation";
import { ProfileView } from "@/components/profile/ProfileView";
import userQueries from "@/server/db/queries/user";
import { cache } from "react";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

const getUser = cache(async (username: string) => {
  if (!username) {
    return null;
  }

  return await userQueries.getByUsername(username);
});

export const generateMetadata = async ({ params }: ProfilePageProps) => {
  const username = (await params).username;

  if (!username) {
    return { title: "User not found" };
  }

  const user = await getUser(username);
  if (!user) {
    return { title: "User not found | PoiToGo" };
  }

  return { title: `${user.name} (${user.username}) | PoiToGo` };
};

export const ProfilePage = async ({ params }: ProfilePageProps) => {
  const username = (await params).username;
  if (!username) {
    notFound();
  }

  const user = await getUser(username);
  if (!user) {
    notFound();
  }

  return <ProfileView user={user} />;
};

export default ProfilePage;
