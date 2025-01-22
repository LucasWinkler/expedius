type PlacePageProps = {
  params: Promise<{ placeId: string }>;
};

export const PlacePage = async ({ params }: PlacePageProps) => {
  const placeId = (await params).placeId;

  if (!placeId) {
    return <div>Place not found</div>;
  }

  return <div>Place with ID: {placeId}</div>;
};

export default PlacePage;
