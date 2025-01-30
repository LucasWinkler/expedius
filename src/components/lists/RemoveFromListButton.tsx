import { Button } from "@/components/ui/button";
import { useRemoveFromList } from "@/hooks/useSavedPlaces";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface RemoveFromListButtonProps {
  placeId: string;
  listId: string;
}

export const RemoveFromListButton = ({
  placeId,
  listId,
}: RemoveFromListButtonProps) => {
  const { mutate: removePlace, isPending } = useRemoveFromList(listId);

  const handleRemove = () => {
    removePlace(placeId, {
      onError: (error) => {
        toast.error("Failed to remove place from list", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      },
    });
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className="size-8 bg-background/80 backdrop-blur hover:bg-background/90"
      onClick={handleRemove}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <X className="size-4" />
      )}
      <span className="sr-only">Remove from list</span>
    </Button>
  );
};
