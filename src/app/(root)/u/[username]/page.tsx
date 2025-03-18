import { notFound } from "next/navigation";
import { users } from "@/server/data/users";
import { profileParamsSchema } from "@/lib/validations/profile";
import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { ProfilePageContent } from "@/components/profile/ProfilePageContent";

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
      ? `Check out ${name}'s curated lists and favourite places on Expedius`
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

  return (
    <article className="flex min-h-screen flex-col items-center">
      <ProfilePageContent params={validated.data} />
    </article>
  );
}
