"use client";

import { toast } from "sonner";
import { Share2 } from "lucide-react";
import { Navigation } from "lucide-react";
import type { PlaceDetails } from "@/types";
import { Button } from "../ui/button";
import { LikeButton, SaveToListButton } from "../places";
import { useEffect, useState } from "react";
import Link from "next/link";

interface PlaceDetailsActionsProps {
  id: PlaceDetails["id"];
  displayName: PlaceDetails["displayName"];
  editorialSummary: PlaceDetails["editorialSummary"];
  googleMapsLinks: PlaceDetails["googleMapsLinks"];
}

export const PlaceDetailsActions = ({
  id,
  displayName,
  editorialSummary,
  googleMapsLinks,
}: PlaceDetailsActionsProps) => {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(Boolean(navigator?.share));
  }, []);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: displayName.text,
      text:
        editorialSummary?.text ?? `Check out ${displayName.text} on Expedius`,
      url: shareUrl,
    };

    try {
      if (canShare) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3 md:gap-4">
      <Button
        variant="default"
        size="sm"
        className="col-span-2 sm:col-span-1"
        asChild
      >
        <Link
          href={googleMapsLinks.directionsUri}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Navigation className="mr-1.5 h-4 w-4" />
          Directions
        </Link>
      </Button>

      <div className="col-span-2 grid grid-cols-3 gap-2 sm:col-span-1 sm:flex sm:flex-wrap sm:items-center">
        <LikeButton placeId={id} variant="outline" size="sm" />
        <SaveToListButton placeId={id} variant="outline" size="sm" />
        <Button
          className="hover:bg-muted/40 hover:text-primary"
          variant="outline"
          size="sm"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};
