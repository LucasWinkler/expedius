import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Lock, Unlock } from "lucide-react";
import type { UserList } from "@/server/db/schema";
import Link from "next/link";

type ListCardProps = {
  list: UserList;
};

export const ListCard = ({ list }: ListCardProps) => {
  return (
    <Link href={`/list/${list.id}`}>
      <Card className="group relative h-40 overflow-hidden transition-colors hover:border-primary/50">
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90"
          style={{ backgroundColor: list.colour }}
        />
        <CardHeader className="relative flex h-full flex-col justify-between">
          <div>
            <CardTitle className="line-clamp-1 text-lg">{list.name}</CardTitle>
            {list.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {list.description}
              </CardDescription>
            )}
          </div>
          <div className="flex justify-end">
            {list.isPublic ? (
              <Unlock className="text-foreground/70" size={20} />
            ) : (
              <Lock className="text-foreground/70" size={20} />
            )}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default ListCard;
