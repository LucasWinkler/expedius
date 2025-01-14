import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { User } from "@/server/db/schema";
import { ListCard } from "./ListCard";
import { userListQueries } from "@/server/db/queries/userList";
import ListsClient from "./ListsClient";

type ListsSectionProps = {
  userId: User["id"];
};

export const ListsSection = async ({ userId }: ListsSectionProps) => {
  const lists = await userListQueries.getListsByUserId(userId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Place Lists</CardTitle>
        <ListsClient userId={userId} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
          {lists.length === 0 && (
            <p className="col-span-2 py-8 text-center text-muted-foreground">
              No lists created yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListsSection;
