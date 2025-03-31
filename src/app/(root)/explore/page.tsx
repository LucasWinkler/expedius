import { createMetadata } from "@/lib/metadata";
import { ExploreContent } from "@/components/explore/ExploreContent";
import { Search } from "lucide-react";
import Link from "next/link";
import { RotatingExampleQueries } from "@/components/explore/RotatingExampleQueries";
import { ExampleQueries } from "@/components/explore/ExampleQueries";

export const metadata = createMetadata({
  title: "Explore Places",
  description:
    "Search for places and locations worldwide. Use filters to refine your results.",
  canonicalUrlRelative: "/explore",
});

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10 xl:max-w-7xl">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <Search className="size-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Explore Places
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Find specific places or browse popular categories. Use filters to
          refine your results.
        </p>
        <RotatingExampleQueries />
        <ExampleQueries />
      </div>
      <ExploreContent />
    </div>
  );
}
