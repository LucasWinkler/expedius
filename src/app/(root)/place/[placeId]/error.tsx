"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PlaceDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const isQuotaError = error.message?.includes("Too Many Requests");

  useEffect(() => {
    if (!isQuotaError) return;

    const calculateTimeToReset = () => {
      const now = new Date();
      const pacificDate = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      );
      const tomorrow = new Date(pacificDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diffMs = tomorrow.getTime() - pacificDate.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    };

    setTimeRemaining(calculateTimeToReset());

    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeToReset());
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [isQuotaError]);

  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      {isQuotaError ? (
        <>
          <h1 className="mt-6 text-3xl font-bold">API Quota Exceeded</h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            We've reached our daily limit for Google Places API requests. The
            quota will reset at midnight Pacific Time.
          </p>
          {timeRemaining && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-amber-700">
              <Clock className="h-5 w-5" />
              <span>Resets in approximately {timeRemaining}</span>
            </div>
          )}
        </>
      ) : (
        <>
          <h1 className="mt-6 text-3xl font-bold">Something went wrong!</h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            We couldn&apos;t load the place information you&apos;re looking for.
            This might be a temporary issue.
          </p>
        </>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {!isQuotaError && (
          <Button onClick={reset} variant="default">
            Try again
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
