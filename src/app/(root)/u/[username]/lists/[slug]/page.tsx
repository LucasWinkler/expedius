import { notFound } from "next/navigation";
import { users } from "@/server/data/users";
import { lists } from "@/server/data/lists";
import { profileParamsSchema } from "@/lib/validations/profile";
import { ProfilePrivateView } from "@/components/profile/ProfilePrivateView";
import { ListView } from "@/components/lists/ListView";
import type { PublicProfileData } from "@/server/types/profile";
import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 60;

interface ListPageProps {
  params: Promise<{ username: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const generateMetadata = async ({
  params,
}: ListPageProps): Promise<Metadata> => {
  const validated = profileParamsSchema.safeParse({
    username: (await params).username,
  });

  if (!validated.success) {
    return createMetadata({
      title: "Profile not found",
      description: "The Expedius profile you are looking for does not exist.",
    });
  }

  const profile = await users.queries.getProfileMetadata(
    validated.data.username,
  );
  if (!profile) {
    return createMetadata({
      title: "Profile not found",
      description: "The Expedius profile you are looking for does not exist.",
    });
  }

  const { name, isPublic, isOwnProfile } = profile;

  if (!isPublic && !isOwnProfile) {
    return createMetadata({
      title: "Private Profile",
      description: "This profile is private",
    });
  }

  const user = await users.queries.getByUsername(validated.data.username);
  if (!user) {
    return createMetadata({
      title: "Profile not found",
      description: "The Expedius profile you are looking for does not exist.",
    });
  }

  const list = await lists.queries.getBySlug((await params).slug, user.id);

  if (!list) {
    return createMetadata({
      title: "List not found",
      description: "The list you are looking for does not exist.",
    });
  }

  if (!list.isPublic && !isOwnProfile) {
    return createMetadata({
      title: "Private List",
      description: "This list is private",
    });
  }

  const title = isOwnProfile
    ? `My List: ${list.name}`
    : `${name}'s List: ${list.name}`;

  return createMetadata({
    title,
    description:
      list.description || `View ${name}'s list "${list.name}" on Expedius`,
  });
};

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
