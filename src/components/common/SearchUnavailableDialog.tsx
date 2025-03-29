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
import { AlertTriangle } from "lucide-react";

// Midnight Pacific on April 1st
const TARGET_DATE = new Date("2025-04-01T07:00:00Z");

export const SearchUnavailableDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);

    if (new Date() >= TARGET_DATE) {
      return;
    }

    const hasSeenDialog = sessionStorage.getItem("search-notice-seen");
    if (!hasSeenDialog) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const updateTimeLeft = () => {
      const now = new Date();
      if (now >= TARGET_DATE) {
        setIsOpen(false);
        return;
      }

      const diff = TARGET_DATE.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("search-notice-seen", "true");
  };

  if (!isMounted || !timeLeft) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="flex flex-col items-center sm:items-start">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-lg font-semibold text-red-600">
            Limited Functionality Available
          </AlertDialogTitle>
          <AlertDialogDescription
            className="pt-2 text-muted-foreground"
            asChild
          >
            <div>
              <p className="mb-2">
                Due to billing issues, our search functionality is temporarily
                unavailable. This affects:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Searching for places</li>
                <li>Viewing place details</li>
                <li>Viewing saved places and likes</li>
              </ul>
              <p className="mt-2">
                You can still access your account and view your existing lists,
                but most features are unavailable until service is restored on{" "}
                <strong>April 1st, 2025 at midnight Pacific time</strong>.
              </p>
              <div className="mt-4 rounded-lg bg-muted p-3 text-center">
                <p className="text-sm font-medium">Time remaining:</p>
                <p className="mt-1 text-lg font-semibold">
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
                  {timeLeft.seconds}s
                </p>
              </div>
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

export default SearchUnavailableDialog;
