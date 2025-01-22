export const NoResults = ({ query }: { query: string }) => {
  return (
    <div className="mt-8 text-center text-gray-500">
      No results found for &quot;{query}&quot;
    </div>
  );
};

export default NoResults;
