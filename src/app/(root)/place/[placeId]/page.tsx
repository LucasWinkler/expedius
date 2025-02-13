import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPlaceDetails } from "@/lib/api/places";
import { PlaceDetailsView } from "@/components/place/PlaceDetailsView";
import { PlaceDetailsSkeleton } from "@/components/place/PlaceDetailsSkeleton";
import { getImage } from "@/lib/plaiceholder";
import { env } from "@/env";
import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

interface PlaceDetailsPageProps {
  params: Promise<{ placeId: string }>;
}

export async function generateMetadata({
  params,
}: PlaceDetailsPageProps): Promise<Metadata> {
  try {
    const { placeId } = await params;
    const place = await getPlaceDetails(placeId);

    return createMetadata({
      title: place.displayName.text,
      description:
        place.editorialSummary?.text ??
        `Discover ${place.displayName.text} on Poitogo. ${place.formattedAddress}`,
    });
  } catch {
    return createMetadata({
      title: "Place Details",
      description: "Discover amazing places on Poitogo",
    });
  }
}

export default async function PlaceDetailsPage({
  params,
}: PlaceDetailsPageProps) {
  try {
    const { placeId } = await params;
    const placeDetails = await getPlaceDetails(placeId);

    let image;
    const imageUrl = placeDetails.photos?.[0]
      ? `${env.GOOGLE_PLACES_API_BASE_URL}/${placeDetails.photos[0].name}/media?maxHeightPx=800&maxWidthPx=1200&key=${env.GOOGLE_PLACES_API_KEY}`
      : undefined;

    if (imageUrl) {
      const imageData = await getImage(imageUrl);
      image = {
        url: imageUrl,
        ...imageData,
        width: 1200,
        height: 800,
      };
    }

    return (
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<PlaceDetailsSkeleton />}>
          <PlaceDetailsView place={placeDetails} image={image} />
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error("Error fetching place details:", error);
    notFound();
  }
}
