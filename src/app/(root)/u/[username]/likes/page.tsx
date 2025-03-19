import { notFound } from "next/navigation";
import { users } from "@/server/data/users";
import {
  profileLikesParamsSchema,
  profileParamsSchema,
} from "@/lib/validations/profile";
import { LikesView } from "@/components/likes/LikesView";
import { ProfilePrivateView } from "@/components/profile/ProfilePrivateView";
import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { likes } from "@/server/data/likes";
import { getLikesWithPlaceDetails } from "@/server/services/likes";
import { getServerSession } from "@/server/auth/session";

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

  const title = isOwner ? "My Liked Places" : `${name}'s Liked Places`;

  return createMetadata({
    title,
    description: `View ${name}'s liked places on Expedius`,
  });
};

export default async function LikesPage({
  params,
  searchParams,
}: LikesPageProps) {
  const validated = profileLikesParamsSchema.safeParse({
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

  const paginatedLikes = await likes.queries.getPaginatedLikes(user.id, {
    page: validated.data.page,
    limit: validated.data.limit,
  });

  const likesWithPlaceDetails = await getLikesWithPlaceDetails(user.id);

  return (
    <LikesView
      likes={likesWithPlaceDetails}
      username={validated.data.username}
      totalPages={paginatedLikes.metadata.totalPages}
      currentPage={validated.data.page}
      totalLikes={paginatedLikes.metadata.totalItems}
    />
  );
}
