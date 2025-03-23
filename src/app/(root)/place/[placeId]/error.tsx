"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PlaceDetailsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="mt-6 text-3xl font-bold">Something went wrong!</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        We couldn&apos;t load the place information you&apos;re looking for.
        This might be a temporary issue.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
