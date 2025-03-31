import { EXAMPLE_QUERIES } from "@/constants/exampleQueries";
import Link from "next/link";
import { Fragment } from "react";

export const ExampleQueries = () => {
  return (
    <div className="mt-4 hidden flex-wrap justify-center gap-2 text-sm text-muted-foreground sm:flex">
      <span>Try:</span>
      {EXAMPLE_QUERIES.map((query, index) => (
        <Fragment key={query}>
          <span className="font-medium text-foreground">
            &ldquo;
            <Link
              href={`/explore?q=${encodeURIComponent(query)}`}
              className="hover:underline"
            >
              {query}
            </Link>
            &rdquo;
          </span>
          {index < EXAMPLE_QUERIES.length - 1 && <span>•</span>}
        </Fragment>
      ))}
    </div>
  );
};
