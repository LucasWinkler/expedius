"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

const QUOTA_WARNING_KEY = "quota-warning-dismissed";

export const QuotaWarningDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [resetTime, setResetTime] = useState("");

  useEffect(() => {
    setIsMounted(true);

    const calculateResetTime = () => {
      const now = new Date();
      const pacificDate = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      );
      const tomorrow = new Date(pacificDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const resetTimeFormatted = tomorrow.toLocaleString("en-US", {
        timeZone: userTimezone,
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZoneName: "short",
      });

      return resetTimeFormatted;
    };

    setResetTime(calculateResetTime());

    const hasSeenWarning = localStorage.getItem(QUOTA_WARNING_KEY) === "true";

    if (!hasSeenWarning) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(QUOTA_WARNING_KEY, "true");
  };

  if (!isMounted) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="flex flex-col items-center sm:items-start">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <AlertDialogTitle className="text-lg font-semibold text-amber-600">
            API Quota Limitations
          </AlertDialogTitle>
          <AlertDialogDescription
            className="pt-2 text-muted-foreground"
            asChild
          >
            <div>
              <p className="mb-2">
                Please be aware that we&apos;re currently using the free tier of
                Google Cloud APIs, which has daily usage limits.
              </p>
              <p className="mb-2">
                If you experience any of the following issues, it may be due to
                reaching our daily quota:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Search functionality not returning results</li>
                <li>Place details not loading</li>
                <li>Images not displaying</li>
              </ul>
              <p className="mt-2">
                The service will automatically reset at midnight Pacific Time
                each day <strong>({resetTime} your local time)</strong>. We
                appreciate your understanding while we operate under these
                limitations.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 sm:justify-center">
          <AlertDialogAction onClick={handleClose}>
            I understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuotaWarningDialog;
