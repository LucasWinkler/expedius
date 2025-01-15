import { notFound } from "next/navigation";
import { ProfileView } from "@/components/profile/ProfileView";
import userQueries from "@/server/db/queries/user";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export const ProfilePage = async (props: ProfilePageProps) => {
  const params = await props.params;
  if (!params?.username) {
    notFound();
  }

  const user = await userQueries.getByUsername(params.username);
  if (!user) {
    notFound();
  }

  return <ProfileView user={user} />;
};

export default ProfilePage;
