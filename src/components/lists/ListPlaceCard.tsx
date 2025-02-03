import { Place } from "@/types";
import { PlaceCard, LikeButton, SaveToListButton } from "@/components/places";
import { RemoveFromListButton } from "./RemoveFromListButton";

interface ListPlaceCardProps {
  place: Place;
  listId: string;
}

export const ListPlaceCard = ({ place, listId }: ListPlaceCardProps) => {
  return (
    <PlaceCard
      place={place}
      actions={
        <div className="absolute right-6 top-6 flex flex-col gap-2">
          <LikeButton placeId={place.id} />
          <SaveToListButton placeId={place.id} />
          <RemoveFromListButton placeId={place.id} listId={listId} />
        </div>
      }
    />
  );
};
