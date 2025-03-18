import { PublicProfileData } from "@/server/types/profile";
import { ProfilePrivateView } from "./ProfilePrivateView";
import users from "@/server/data/users";
import { notFound } from "next/navigation";
import { profileParamsSchema } from "@/lib/validations/profile";
import { Suspense } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { z } from "zod";
import { ProfileHeaderSkeleton } from "./ProfileHeaderSkeleton";
import { ProfileViewSkeleton } from "./ProfileViewSkeleton";
import { ProfileView } from "./ProfileView";

export const ProfilePageContent = async ({
  params,
}: {
  params: z.infer<typeof profileParamsSchema>;
}) => {
  const profile = await users.queries.getProfile(params);
  if (!profile) {
    notFound();
  }

  if ("type" in profile && profile.type === "private") {
    return <ProfilePrivateView username={profile.username} />;
  }

  const publicProfile = profile as PublicProfileData;

  return (
    <>
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <ProfileHeader
          user={publicProfile.user}
          isOwnProfile={publicProfile.isOwnProfile}
          totalLists={publicProfile.lists.metadata.totalItems}
          totalLikes={publicProfile.totalLikes}
        />
      </Suspense>

      <Suspense fallback={<ProfileViewSkeleton />}>
        <ProfileView
          username={publicProfile.user.username}
          isOwnProfile={publicProfile.isOwnProfile}
        />
      </Suspense>
    </>
  );
};
