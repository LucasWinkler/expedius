"use client";

import { useState } from "react";
import { ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveToListButtonProps {
  placeId: string;
}

export const SaveToListButton = ({ placeId }: SaveToListButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setDialogOpen(true)}
        className="h-9 w-9"
      >
        <ListPlus className="size-5" />
      </Button>
      {/* <SaveToListDialog
        placeId={placeId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      /> */}
    </>
  );
};
