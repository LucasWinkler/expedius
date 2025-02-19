import { notFound } from "next/navigation";
import { users } from "@/server/data/users";
import { lists } from "@/server/data/lists";
import { profileParamsSchema } from "@/lib/validations/profile";
import { ProfilePrivateView } from "@/components/profile/ProfilePrivateView";
import { ListView } from "@/components/lists/ListView";
import type { PublicProfileData } from "@/server/types/profile";

export const dynamic = "force-dynamic";
export const revalidate = 60;

interface ListPageProps {
  params: Promise<{ username: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function ListPage({
  params,
  searchParams,
}: ListPageProps) {
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

  const list = await lists.queries.getBySlug(
    (await params).slug,
    publicProfile.user.id,
  );

  if (!list) {
    notFound();
  }

  if (!list.isPublic && !publicProfile.isOwnProfile) {
    notFound();
  }

  return (
    <ListView
      list={list}
      username={validated.data.username}
      isOwnProfile={publicProfile.isOwnProfile}
      currentPage={validated.data.page}
    />
  );
}
