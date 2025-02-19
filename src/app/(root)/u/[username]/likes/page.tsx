import { notFound } from "next/navigation";
import { users } from "@/server/data/users";
import { profileParamsSchema } from "@/lib/validations/profile";
import type { PublicProfileData } from "@/server/types/profile";
import { LikesView } from "@/components/likes/LikesView";
import { ProfilePrivateView } from "@/components/profile/ProfilePrivateView";

export const dynamic = "force-dynamic";
export const revalidate = 60;

interface LikesPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
}

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
      isOwnProfile={publicProfile.isOwnProfile}
      totalPages={publicProfile.likes.metadata.totalPages}
      currentPage={validated.data.page}
      totalLikes={publicProfile.likes.metadata.totalItems}
    />
  );
}
