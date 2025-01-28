"use client";

import { useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListsInfinite } from "@/hooks/useLists";
import { ListCard } from "./ListCard";
import { Loader2 } from "lucide-react";

interface ProfileContentProps {
  username: string;
  isOwnProfile: boolean;
  bio: string | null;
}

export const ProfileContent = ({
  username,
  isOwnProfile,
  bio,
}: ProfileContentProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useListsInfinite(username);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allLists = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Bio */}
      {bio && (
        <div className="mb-8">
          <p className="whitespace-pre-wrap text-muted-foreground">{bio}</p>
        </div>
      )}

      {/* Content Tabs */}
      <Tabs defaultValue="lists">
        <TabsList className="mb-8">
          <TabsTrigger value="lists">Lists</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>

        <TabsContent value="lists">
          {status === "pending" ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : status === "error" ? (
            <div className="py-8 text-center text-muted-foreground">
              Error loading lists
            </div>
          ) : (
            <div className="space-y-4">
              {allLists.map((list) => (
                <ListCard
                  key={list.id}
                  list={list}
                  username={username}
                  isOwnProfile={isOwnProfile}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  showPrivacyBadge
                />
              ))}

              <div ref={loadMoreRef} className="h-8 w-full">
                {hasNextPage ? (
                  isFetchingNextPage ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex justify-center py-4">
                      <span className="text-sm text-muted-foreground">
                        Scroll for more lists
                      </span>
                    </div>
                  )
                ) : allLists.length > 0 ? (
                  <div className="flex justify-center py-4">
                    <span className="text-sm text-muted-foreground">
                      No more lists to load
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="likes">{/* Likes content here */}</TabsContent>
      </Tabs>
    </div>
  );
};
