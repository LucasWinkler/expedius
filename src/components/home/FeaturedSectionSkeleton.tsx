import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </Card>
  );
};

interface FeaturedSectionSkeletonProps {
  title: string;
}

export const FeaturedSectionSkeleton = ({
  title,
}: FeaturedSectionSkeletonProps) => {
  return (
    <section className="space-y-2">
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      <div className="relative">
        <div className="-ml-2 flex md:-ml-4">
          <div className="basis-full pl-2 sm:basis-1/2 md:pl-4 lg:basis-1/3">
            <SkeletonCard />
          </div>
          <div className="hidden pl-2 sm:block sm:basis-1/2 md:pl-4 lg:basis-1/3">
            <SkeletonCard />
          </div>
          <div className="hidden pl-2 md:pl-4 lg:block lg:basis-1/3">
            <SkeletonCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSectionSkeleton;
