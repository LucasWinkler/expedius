import { NoResult } from "../places/NoResult";

type FeaturedSectionErrorProps = {
  title: string;
  isError: boolean;
};

export const FeaturedSectionError = ({
  title,
  isError,
}: FeaturedSectionErrorProps) => {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      <NoResult isError={isError} />
    </section>
  );
};

export default FeaturedSectionError;
