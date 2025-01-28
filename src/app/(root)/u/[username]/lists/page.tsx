import { notFound } from "next/navigation";
import { users } from "@/server/data/users";
import { profileParamsSchema } from "@/lib/validations/profile";
import type { PublicProfileData } from "@/server/types/profile";
import { ListsView } from "@/components/lists/ListsView";
import { PrivateProfileView } from "@/components/profile/PrivateProfileView";

export const dynamic = "force-dynamic";
export const revalidate = 60;

interface ListsPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function ListsPage({
  params,
  searchParams,
}: ListsPageProps) {
  const validated = profileParamsSchema.safeParse({
    username: (await params).username,
    page: (await searchParams).page,
    limit: 9,
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
      <ListsView
        lists={publicProfile.lists.items}
        username={validated.data.username}
        isOwnProfile={publicProfile.isOwnProfile}
        totalPages={publicProfile.lists.metadata.totalPages}
        currentPage={validated.data.page}
        totalLists={publicProfile.lists.metadata.totalItems}
      />
    </div>
  );
}
