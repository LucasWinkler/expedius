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

export const SearchUnavailableDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const hasSeenDialog = sessionStorage.getItem("search-notice-seen");
    if (!hasSeenDialog) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("search-notice-seen", "true");
  };

  if (!isMounted) return null;

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
                <li>Liking places or adding places to lists</li>
              </ul>
              <p className="mt-2">
                You can still access your account and view your existing lists,
                but most features are unavailable until service is restored
                within <strong>7 business days</strong> from{" "}
                <strong>3/26/2025</strong>.
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

export default SearchUnavailableDialog;
