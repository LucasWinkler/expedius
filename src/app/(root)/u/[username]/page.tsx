import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProfileHeaderContent } from "@/components/profile/ProfileHeaderContent";
import { BiographyContent } from "@/components/profile/BiographyContent";
import { ListsContent } from "@/components/profile/ListsContent";
import { ProfileHeaderSkeleton } from "@/components/profile/ProfileHeaderSkeleton";
import { BiographySkeleton } from "@/components/profile/BiographySkeleton";
import { ListsSkeleton } from "@/components/profile/ListsSkeleton";
import { PrivateProfileView } from "@/components/profile/PrivateProfileView";
import { getUser } from "@/server/services/profile";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export const generateMetadata = async ({ params }: ProfilePageProps) => {
  const username = (await params).username;
  if (!username) {
    return { title: "User not found" };
  }

  const user = await getUser(username);
  if (!user) {
    return { title: "User not found | PoiToGo" };
  }

  if ("type" in user) {
    return { title: `@${user.username} (Private) | PoiToGo` };
  }

  return { title: `${user.name} (@${user.username}) | PoiToGo` };
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const username = (await params).username;
  if (!username) {
    notFound();
  }

  const user = await getUser(username);
  if (!user) {
    notFound();
  }

  if ("type" in user) {
    return <PrivateProfileView username={user.username} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <ProfileHeaderContent username={username} />
      </Suspense>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Suspense fallback={<BiographySkeleton />}>
            <BiographyContent username={username} />
          </Suspense>
        </div>
        <div className="md:col-span-2">
          <Suspense fallback={<ListsSkeleton />}>
            <ListsContent username={username} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
