import { notFound } from "next/navigation";
import { users } from "@/server/data/users";
import { lists } from "@/server/data/lists";
import {
  profileListsParamsSchema,
  profileParamsSchema,
} from "@/lib/validations/profile";
import { ProfilePrivateView } from "@/components/profile/ProfilePrivateView";
import { ListView } from "@/components/lists/ListView";
import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { getServerSession } from "@/server/auth/session";

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

  const { name, isPublic, isOwner } = profile;

  if (!isPublic && !isOwner) {
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

  if (!list.isPublic && !isOwner) {
    return createMetadata({
      title: "Private List",
      description: "This list is private",
    });
  }

  const title = isOwner
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
  const validated = profileListsParamsSchema.safeParse({
    username: (await params).username,
    page: (await searchParams).page,
    limit: 10,
  });
  if (!validated.success) {
    notFound();
  }

  const user = await users.queries.getByUsername(validated.data.username);
  if (!user) {
    notFound();
  }

  const session = await getServerSession();
  const isOwner = session?.user.id === user.id;

  if (!user.isPublic && !isOwner) {
    return <ProfilePrivateView username={user.username} />;
  }

  const list = await lists.queries.getBySlug((await params).slug, user.id);
  if (!list || (!list.isPublic && !isOwner)) {
    notFound();
  }

  return (
    <ListView
      list={list}
      username={validated.data.username}
      isOwner={isOwner}
      currentPage={validated.data.page}
    />
  );
}
