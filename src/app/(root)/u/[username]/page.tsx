import { notFound } from "next/navigation";
import type { User } from "@/server/db/schema";
import { ProfileView } from "@/components/profile/ProfileView";
import userQueries from "@/server/db/queries/user";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  if (!username) {
    notFound();
  }

  const user = await userQueries.getByUsername(params.username);
  if (!user) {
    notFound();
  }

  return <ProfileView user={user} />;
}
