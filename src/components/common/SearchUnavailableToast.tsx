"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export const SearchUnavailableToast = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const hasSeenToast = sessionStorage.getItem("search-notice-seen");

    if (!hasSeenToast) {
      const timer = setTimeout(() => {
        toast.error(
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />
            <div className="flex flex-col">
              <span className="font-semibold">
                Limited Functionality Available
              </span>
              <span className="text-sm text-muted-foreground">
                Our search and place viewing functionality is down due to
                billing issues. We expect to restore within 7 business days from
                3/26/2025.
              </span>
            </div>
          </div>,
          {
            duration: Infinity,
            id: "search-unavailable",
            onDismiss: () => {
              sessionStorage.setItem("search-notice-seen", "true");
            },
          },
        );
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isMounted) return null;

  return null;
};

export default SearchUnavailableToast;
