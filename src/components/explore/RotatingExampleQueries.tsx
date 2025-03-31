"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EXAMPLE_QUERIES } from "@/constants/exampleQueries";

export const RotatingExampleQueries = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % EXAMPLE_QUERIES.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-3 text-sm text-muted-foreground sm:hidden">
      <span>Try: </span>
      <span className="font-medium text-foreground transition-opacity duration-300">
        &ldquo;
        <Link
          href={`/explore?q=${encodeURIComponent(EXAMPLE_QUERIES[currentIndex])}`}
          className="hover:underline"
        >
          {EXAMPLE_QUERIES[currentIndex]}
        </Link>
        &rdquo;
      </span>
    </div>
  );
};
