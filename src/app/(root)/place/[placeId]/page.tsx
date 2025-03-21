import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPlaceDetails } from "@/lib/api/places";
import { PlaceDetailsView } from "@/components/place/PlaceDetailsView";
import { PlaceDetailsSkeleton } from "@/components/place/PlaceDetailsSkeleton";
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

    return createMetadata({
      title: place.displayName.text,
      description:
        place.editorialSummary?.text ??
        `Discover ${place.displayName.text} on Expedius. ${place.formattedAddress}`,
    });
  } catch {
    return createMetadata({
      title: "Place Details",
      description: "Discover amazing places on Expedius",
    });
  }
}

export default async function PlaceDetailsPage({
  params,
}: PlaceDetailsPageProps) {
  try {
    const { placeId } = await params;
    const placeDetails = await getPlaceDetails(placeId);

    return (
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<PlaceDetailsSkeleton />}>
          <PlaceDetailsView place={placeDetails} />
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error("Error fetching place details:", error);
    notFound();
  }
}
