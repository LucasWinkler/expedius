import { notFound } from "next/navigation";
import { users } from "@/server/data/users";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileView } from "@/components/profile/ProfileView";
import type { PublicProfileData } from "@/server/types/profile";
import { profileParamsSchema } from "@/lib/validations/profile";
import { ProfilePrivateView } from "@/components/profile/ProfilePrivateView";
import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export const generateMetadata = async ({
  params,
}: ProfilePageProps): Promise<Metadata> => {
  const validated = profileParamsSchema.safeParse({
    username: (await params).username,
  });

  if (!validated.success) {
    return createMetadata({
      title: "Profile not found",
      description: "The PoiToGo profile you are looking for does not exist.",
    });
  }

  const profile = await users.queries.getProfileMetadata(
    validated.data.username,
  );
  if (!profile) {
    return createMetadata({
      title: "Profile not found",
      description: "The PoiToGo profile you are looking for does not exist.",
    });
  }

  const { name, username, isPublic, isOwnProfile } = profile;

  const privateProfileTitle = `Private Profile (@${username})`;
  const publicProfileTitle = `${name} (@${username})`;

  const title = isOwnProfile
    ? `${name} (@${username})`
    : isPublic
      ? publicProfileTitle
      : privateProfileTitle;

  return createMetadata({
    title,
    description: isPublic
      ? `Check out ${name}'s curated lists and favourite places on PoiToGo`
      : "This profile is private",
  });
};

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
    return <ProfilePrivateView username={profile.username} />;
  }

  const publicProfile = profile as PublicProfileData;

  return (
    <article>
      <ProfileHeader
        user={publicProfile.user}
        isOwnProfile={publicProfile.isOwnProfile}
        totalLists={publicProfile.lists.metadata.totalItems}
        totalLikes={publicProfile.totalLikes}
      />
      <ProfileView
        username={publicProfile.user.username}
        isOwnProfile={publicProfile.isOwnProfile}
      />
    </article>
  );
}
