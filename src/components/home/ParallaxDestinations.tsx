"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { destinations } from "@/constants/destinations";
import type { ScreenSize } from "@/types/destinations";
import {
  getScreenSize,
  calculateParallaxOffsets,
  getAnimationClass,
  createPositionStyle,
} from "@/utils/destinations";

export const ParallaxDestinations = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [screenSize, setScreenSize] = useState<ScreenSize>("desktop");
  const [parallaxOffsets, setParallaxOffsets] = useState<number[]>(() =>
    destinations.map(() => 0),
  );
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const allImagesLoaded = destinations.every((dest) => loadedImages[dest.id]);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const checkScreenSize = () => {
        setScreenSize(getScreenSize());
      };

      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (screenSize === "mobile") return;

    const timer = setTimeout(() => {
      const handleScroll = () => {
        if (!containerRef.current) return;

        const scrollY = window.scrollY;
        const parallaxFactors = destinations.map((dest) => dest.parallaxFactor);

        const newOffsets = calculateParallaxOffsets(
          parallaxFactors,
          scrollY,
          screenSize,
        );

        setParallaxOffsets(newOffsets);
      };

      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, 200);

    return () => clearTimeout(timer);
  }, [screenSize]);

  if (screenSize === "mobile") {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/30" />

      <div className="container relative mx-auto h-full px-4">
        {destinations.map((dest, index) => {
          const animationClass = getAnimationClass(dest.id);
          const positionStyle = createPositionStyle(
            dest,
            screenSize,
            index,
            parallaxOffsets[index],
          );

          return (
            <div
              key={dest.id}
              className="destination-card-wrapper transition-opacity duration-500"
              style={positionStyle}
            >
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  transform: `rotate(${dest.rotation}deg)`,
                }}
              >
                <div
                  className={`destination-card ${
                    isMounted && allImagesLoaded ? "opacity-100" : "opacity-0"
                  } ${animationClass}`}
                  style={{
                    height: "100%",
                    width: "100%",
                    animationDelay: `${index * 0.3}s`,
                    transition: "opacity 0.8s ease-in-out",
                    transitionDelay: `${index * 0.2}s`,
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-2xl opacity-85 shadow-md">
                    <Image
                      src={dest.image}
                      alt={dest.location}
                      fill
                      className="object-cover"
                      sizes={positionStyle.width?.toString()}
                      priority={false}
                      loading="lazy"
                      draggable={false}
                      onLoad={() => handleImageLoad(dest.id)}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/5" />
                    <div className="absolute bottom-0 left-0 p-3 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
                      <div className="text-xs font-medium uppercase tracking-wide opacity-95">
                        {dest.category}
                      </div>
                      <div className="text-sm font-bold !leading-tight md:text-base">
                        {dest.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
