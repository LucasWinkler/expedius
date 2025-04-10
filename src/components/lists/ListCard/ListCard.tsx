import {
  ListImage,
  ListActions,
  ListTitle,
  ListMetadata,
} from "@/components/lists/ListCard";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { DbListWithPlacesCount } from "@/server/types/db";
import { Loader2 } from "lucide-react";
import { shouldBeLight } from "@/lib/colour";
import { cn } from "@/lib/utils";

interface ListCardProps {
  list: DbListWithPlacesCount;
  isOwner: boolean;
  username: string;
  showPrivacyBadge?: boolean;
  onEdit: (list: DbListWithPlacesCount) => void;
  onDelete: (list: DbListWithPlacesCount) => void;
}

export const ListCard = ({
  list,
  isOwner,
  username,
  showPrivacyBadge = false,
  onEdit,
  onDelete,
}: ListCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const textColour = shouldBeLight(list.colour)
    ? "text-muted-foreground"
    : "text-background";

  return (
    <Card
      role="listitem"
      className="relative overflow-hidden border-0 bg-muted/50 transition-all duration-200 ease-out hover:shadow-md"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-background to-muted"
        style={
          {
            "--card-color": list.colour,
            backgroundImage: `linear-gradient(to bottom right, 
            rgba(var(--background), 0.97), 
            color-mix(in srgb, var(--card-color), transparent 92%)
          )`,
          } as React.CSSProperties
        }
      >
        <div
          className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:6px_6px] opacity-[0.03] ring-1 ring-inset ring-foreground/[0.03]"
          style={{ backgroundColor: list.colour }}
        />
      </div>

      <article className="relative flex flex-col xs:flex-row">
        <Link
          href={`/u/${username}/lists/${list.slug}`}
          className="relative aspect-[4/3] overflow-hidden rounded-xl p-5 xs:w-48 sm:w-60 md:w-72"
        >
          {!imageLoaded && list.image && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Loader2 className={cn("size-6 animate-spin", textColour)} />
            </div>
          )}
          <ListImage
            className="aspect-[4/3]"
            image={list.image}
            colour={list.colour}
            name={list.name}
            onLoadChange={setImageLoaded}
          />
        </Link>

        <div className="relative flex flex-1 flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/u/${username}/lists/${list.slug}`}
              className="group flex items-start gap-2"
            >
              <ListTitle name={list.name} />
            </Link>

            {isOwner && (
              <ListActions
                list={list}
                username={username}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </div>

          <ListMetadata
            placesCount={list._count.savedPlaces}
            isPublic={list.isPublic}
            showPrivacyBadge={showPrivacyBadge}
          />
        </div>
      </article>
    </Card>
  );
};
