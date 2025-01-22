"use client";

import { BookmarkPlus } from "lucide-react";
import { Button } from "../ui/button";
import { UserList } from "@/server/db/schema";
import { toast } from "sonner";

type BookmarkButtonProps = {
  placeId: string;
  userLists?: UserList[];
};

export const BookmarkButton = ({ userLists }: BookmarkButtonProps) => {
  const isAuthenticated = !!userLists;

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save places to lists");
    }
  };

  return (
    <>
      <Button
        size="icon"
        variant="secondary"
        className="size-10 bg-white/20 text-white shadow-md backdrop-blur-md hover:bg-white/30 [&_svg]:size-5"
        onClick={handleClick}
        // disabled={isSaving}
      >
        {/* {isSaving ? <Loader2 className="animate-spin" /> : <BookmarkPlus />} */}
        <BookmarkPlus />
      </Button>
    </>
  );
};

export default BookmarkButton;
