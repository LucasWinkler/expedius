import { notFound } from "next/navigation";
import { users } from "@/server/data/users";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileView } from "@/components/profile/ProfileView";
import { profileParamsSchema } from "@/lib/validations/profile";
import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { getServerSession } from "@/server/auth/session";
import { ProfilePrivateView } from "@/components/profile/ProfilePrivateView";

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
      description: "The Expedius profile you are looking for does not exist.",
      robots: { index: false, follow: false },
    });
  }

  const profile = await users.queries.getProfileMetadata(
    validated.data.username,
  );
  if (!profile) {
    return createMetadata({
      title: "Profile not found",
      description: "The Expedius profile you are looking for does not exist.",
      robots: { index: false, follow: false },
    });
  }

  const { name, username, isPublic, isOwner } = profile;

  const privateProfileTitle = `Private Profile (@${username})`;
  const publicProfileTitle = `${name} (@${username})`;

  const title = isOwner
    ? `${name} (@${username})`
    : isPublic
      ? publicProfileTitle
      : privateProfileTitle;

  return createMetadata({
    title,
    canonicalUrlRelative: `/u/${username}`,
    description: isPublic
      ? `Check out ${name}'s curated lists and favourite places on Expedius`
      : "This profile is private",
    robots: !isPublic && !isOwner ? { index: false, follow: true } : undefined,
  });
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const validated = profileParamsSchema.safeParse({
    username: (await params).username,
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

  const { listsCount, likesCount } = await users.queries.getListsAndLikesCount(
    user.id,
  );

  return (
    <article>
      <ProfileHeader
        user={user}
        isOwner={isOwner}
        totalLists={listsCount}
        totalLikes={likesCount}
      />
      <ProfileView username={user.username} isOwner={isOwner} />
    </article>
  );
}
