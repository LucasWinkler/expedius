import { notFound } from "next/navigation";
import { users } from "@/server/data/users";
import { profileParamsSchema } from "@/lib/validations/profile";
import type { PublicProfileData } from "@/server/types/profile";
import { LikesView } from "@/components/likes/LikesView";
import { ProfilePrivateView } from "@/components/profile/ProfilePrivateView";
import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 60;

interface LikesPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const generateMetadata = async ({
  params,
}: LikesPageProps): Promise<Metadata> => {
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

  const { name, isPublic, isOwnProfile } = profile;

  if (!isPublic && !isOwnProfile) {
    return createMetadata({
      title: "Private Profile",
      description: "This profile is private",
    });
  }

  const title = isOwnProfile ? "My Liked Places" : `${name}'s Liked Places`;

  return createMetadata({
    title,
    description: `View ${name}'s liked places on PoiToGo`,
  });
};

export default async function LikesPage({
  params,
  searchParams,
}: LikesPageProps) {
  const validated = profileParamsSchema.safeParse({
    username: (await params).username,
    page: (await searchParams).page,
    limit: 10,
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
    <LikesView
      likes={publicProfile.likes.items}
      username={validated.data.username}
      totalPages={publicProfile.likes.metadata.totalPages}
      currentPage={validated.data.page}
      totalLikes={publicProfile.likes.metadata.totalItems}
    />
  );
}
