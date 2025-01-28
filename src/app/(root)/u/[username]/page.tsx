import { notFound } from "next/navigation";
import { users } from "@/server/data/users";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { BiographySection } from "@/components/profile/BiographySection";
import { ProfileLists } from "@/components/profile/ProfileLists";
import { PrivateProfileView } from "@/components/profile/PrivateProfileView";
import type { PublicProfileData } from "@/server/types/profile";
import { profileParamsSchema } from "@/lib/validations/profile";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const username = (await params).username;
  const profile = await users.queries.getProfileMetadata(username);

  if (!profile) {
    return {
      title: "Profile Not Found | PoiToGo",
    };
  }

  return {
    title: profile.isPublic
      ? `${profile.name} (@${profile.username}) | PoiToGo`
      : `Private Profile (${profile.username}) | PoiToGo`,
  };
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const validated = profileParamsSchema.safeParse({
    username: (await params).username,
    page: (await searchParams).page,
    limit: 6,
  });

  if (!validated.success) {
    notFound();
  }

  const profile = await users.queries.getProfile(validated.data);

  if (!profile) {
    notFound();
  }

  if ("type" in profile && profile.type === "private") {
    return <PrivateProfileView username={profile.username} />;
  }

  const publicProfile = profile as PublicProfileData;

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader
        user={publicProfile.user}
        isOwnProfile={publicProfile.isOwnProfile}
        totalLists={Number(publicProfile.lists.metadata.totalItems)}
      />

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <BiographySection bio={publicProfile.user.bio} />
        </div>
        <div className="md:col-span-2">
          <ProfileLists
            lists={publicProfile.lists.items}
            username={validated.data.username}
            isOwnProfile={publicProfile.isOwnProfile}
            totalPages={publicProfile.lists.metadata.totalPages}
            currentPage={validated.data.page}
          />
        </div>
      </div>
    </div>
  );
}
