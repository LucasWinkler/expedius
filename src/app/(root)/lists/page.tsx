import { requireSession } from "@/lib/auth/session";
import { userListQueries } from "@/server/db/queries/userList";
import type { UserList, User } from "@/server/db/schema";

async function getLists(userId: User["id"]): Promise<{
  data?: UserList[];
  error?: string;
}> {
  try {
    const lists = await userListQueries.getAllByUserId(userId);
    return { data: lists };
  } catch (error) {
    console.error("Failed to fetch lists:", error);
    return { error: "Failed to load lists. Please try again later." };
  }
}

const ListsPage = async () => {
  const session = await requireSession();
  const result = await getLists(session.user.id);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">My Lists</h1>
      {result.error ? (
        <div className="mt-4 text-destructive">{result.error}</div>
      ) : result.data?.length === 0 ? (
        <p className="mt-4 text-muted-foreground">No lists found</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {result.data?.map((list) => <div key={list.id}>{list.name}</div>)}
        </div>
      )}
    </div>
  );
};

export default ListsPage;
