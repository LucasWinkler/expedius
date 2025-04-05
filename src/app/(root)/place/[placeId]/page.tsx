import { getPlaceDetails } from "@/lib/api/places";
import { PlaceDetailsView } from "@/components/place/PlaceDetailsView";
import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { redirect } from "next/navigation";

interface PlaceDetailsPageProps {
  params: Promise<{ placeId: string }>;
}

export async function generateMetadata({
  params,
}: PlaceDetailsPageProps): Promise<Metadata> {
  try {
    const { placeId } = await params;
    const place = await getPlaceDetails(placeId);

    if (!place) {
      return createMetadata({
        title: "Place not found",
        description: "The place you are looking for does not exist.",
        robots: { index: false, follow: false },
      });
    }

    return createMetadata({
      title: place.displayName.text,
      description:
        place.editorialSummary?.text ??
        `Discover ${place.displayName.text} on Expedius. ${place.formattedAddress}`,
      canonicalUrlRelative: `/place/${placeId}`,
    });
  } catch {
    return createMetadata({
      title: "Place not found",
      description: "The place you are looking for does not exist.",
      robots: { index: false, follow: false },
    });
  }
}

export default async function PlaceDetailsPage({
  params,
}: PlaceDetailsPageProps) {
  const { placeId } = await params;

  try {
    const placeDetails = await getPlaceDetails(placeId);

    if (!placeDetails) {
      redirect("/404");
    }

    return <PlaceDetailsView place={placeDetails} />;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("429") ||
        error.message.includes("Too Many Requests") ||
        error.message.includes("quota"))
    ) {
      throw new Error("ERROR_QUOTA_EXCEEDED");
    }

    throw error;
  }
}
