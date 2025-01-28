import { notFound } from "next/navigation";
import { users } from "@/server/data/users";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { PrivateProfileView } from "@/components/profile/PrivateProfileView";
import type { PublicProfileData } from "@/server/types/profile";
import { profileParamsSchema } from "@/lib/validations/profile";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const validated = profileParamsSchema.safeParse({
    username: (await params).username,
  });

  if (!validated.success) {
    notFound();
  }

  const profile = await users.queries.getProfile(validated.data);

  if (!profile) {
    notFound();
  }

  if ("type" in profile && profile.type === "private") {
    return <PrivateProfileView username={profile.username} />;
  }

  const publicProfile = profile as PublicProfileData;

  return (
    <>
      <ProfileHero
        user={publicProfile.user}
        isOwnProfile={publicProfile.isOwnProfile}
        totalLists={Number(publicProfile.lists.metadata.totalItems)}
      />
      <ProfileContent
        username={validated.data.username}
        isOwnProfile={publicProfile.isOwnProfile}
        bio={publicProfile.user.bio}
      />
    </>
  );
}
