import { notFound } from "next/navigation";
import { users } from "@/server/data/users";
import {
  profileListsParamsSchema,
  profileParamsSchema,
} from "@/lib/validations/profile";
import { ListsView } from "@/components/lists/ListsView";
import { ProfilePrivateView } from "@/components/profile/ProfilePrivateView";
import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { getServerSession } from "@/server/auth/session";
import { lists } from "@/server/data/lists";

export const dynamic = "force-dynamic";
export const revalidate = 60;

interface ListsPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const generateMetadata = async ({
  params,
}: ListsPageProps): Promise<Metadata> => {
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

  const title = isOwner ? "My Lists" : `${name}'s Lists`;

  return createMetadata({
    title,
    description: `View ${name}'s lists on Expedius`,
  });
};

export default async function ListsPage({
  params,
  searchParams,
}: ListsPageProps) {
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

  const paginatedLists = await lists.queries.getAllByUserId(user.id, isOwner, {
    page: validated.data.page,
    limit: validated.data.limit,
  });

  return (
    <ListsView
      lists={paginatedLists.items}
      username={validated.data.username}
      isOwner={isOwner}
      totalPages={paginatedLists.metadata.totalPages}
      currentPage={validated.data.page}
      totalLists={paginatedLists.metadata.totalItems}
    />
  );
}
