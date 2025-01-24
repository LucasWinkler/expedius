import { getUser } from "@/server/services/profile";
import { getServerSession } from "@/server/auth/session";
import userLists from "@/server/data/userLists";
import { ListsSection } from "./ListsSection";

export const ListsContent = async ({ username }: { username: string }) => {
  const user = await getUser(username);
  if (!user || "type" in user) return null;

  const session = await getServerSession();
  const lists = await userLists.queries.getAllByUserId(user.id);
  const isOwnProfile = session?.user.id === user.id;

  return <ListsSection initialLists={lists} isOwnProfile={isOwnProfile} />;
};
