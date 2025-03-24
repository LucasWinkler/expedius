import { getPlaceDetails } from "@/lib/api/places";
import { PlaceDetailsView } from "@/components/place/PlaceDetailsView";
import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";

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
  const placeDetails = await getPlaceDetails(placeId);

  return <PlaceDetailsView place={placeDetails} />;
}
