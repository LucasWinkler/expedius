"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Destination = {
  id: string;
  category: string;
  location: string;
  image: string;
  rotation: number;
  initialPosition: {
    desktop: {
      top: string;
      left?: string;
      right?: string;
    };
    tablet?: {
      top: string;
      left?: string;
      right?: string;
    };
    largeDesktop?: {
      top: string;
      left?: string;
      right?: string;
    };
  };
  size: {
    desktop: {
      width: string;
      height: string;
    };
    tablet?: {
      width: string;
      height: string;
    };
    largeDesktop?: {
      width: string;
      height: string;
    };
  };
  parallaxFactor: number;
  zIndex: number;
};

const destinations: Destination[] = [
  {
    id: "eiffel-tower",
    category: "Landmarks",
    location: "Eiffel Tower",
    image: "/assets/destinations/eiffel-tower.jpg",
    rotation: -2,
    initialPosition: {
      desktop: { top: "15%", right: "5%" },
      tablet: { top: "15%", right: "2%" },
      largeDesktop: { top: "15%", right: "8%" },
    },
    size: {
      desktop: { width: "200px", height: "150px" },
      tablet: { width: "170px", height: "130px" },
      largeDesktop: { width: "220px", height: "165px" },
    },
    parallaxFactor: 0.16,
    zIndex: 2,
  },
  {
    id: "cafes",
    category: "Cafés",
    location: "Local Coffee Shops",
    image: "/assets/destinations/cafe.jpg",
    rotation: 3,
    initialPosition: {
      desktop: { top: "45%", left: "5%" },
      tablet: { top: "40%", left: "2%" },
      largeDesktop: { top: "45%", left: "8%" },
    },
    size: {
      desktop: { width: "220px", height: "150px" },
      tablet: { width: "180px", height: "130px" },
      largeDesktop: { width: "240px", height: "165px" },
    },
    parallaxFactor: 0.24,
    zIndex: 1,
  },
  {
    id: "museums",
    category: "Museums",
    location: "Art Galleries",
    image: "/assets/destinations/museum.jpg",
    rotation: -2.5,
    initialPosition: {
      desktop: { top: "18%", left: "5%" },
      tablet: { top: "18%", left: "2%" },
      largeDesktop: { top: "18%", left: "8%" },
    },
    size: {
      desktop: { width: "180px", height: "140px" },
      tablet: { width: "160px", height: "120px" },
      largeDesktop: { width: "200px", height: "155px" },
    },
    parallaxFactor: 0.12,
    zIndex: 3,
  },
  {
    id: "restaurants",
    category: "Dining",
    location: "Top Restaurants",
    image: "/assets/destinations/restaurant.jpg",
    rotation: 2,
    initialPosition: {
      desktop: { top: "60%", right: "5%" },
      tablet: { top: "62%", right: "2%" },
      largeDesktop: { top: "60%", right: "8%" },
    },
    size: {
      desktop: { width: "230px", height: "160px" },
      tablet: { width: "180px", height: "130px" },
      largeDesktop: { width: "250px", height: "175px" },
    },
    parallaxFactor: 0.2,
    zIndex: 1,
  },
];

export const ParallaxDestinations = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [screenSize, setScreenSize] = useState<
    "mobile" | "desktop" | "tablet" | "largeDesktop"
  >("desktop");

  const [parallaxOffsets, setParallaxOffsets] = useState<number[]>(
    destinations.map(() => 0),
  );

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setScreenSize("mobile");
      } else if (window.innerWidth < 1536) {
        setScreenSize("tablet");
      } else if (window.innerWidth < 1920) {
        setScreenSize("desktop");
      } else {
        setScreenSize("largeDesktop");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (screenSize === "mobile") return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollY = window.scrollY;

      const newOffsets = destinations.map((dest) => {
        let factor = dest.parallaxFactor;

        if (screenSize === "tablet") {
          factor = dest.parallaxFactor * 0.7;
        } else if (screenSize === "largeDesktop") {
          factor = dest.parallaxFactor * 1.2;
        }

        return scrollY * -factor;
      });

      setParallaxOffsets(newOffsets);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [screenSize]);

  if (screenSize === "mobile") {
    return (
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-muted/90" />
        <div className="bg-grid-white absolute inset-0 bg-[size:100px_100px] opacity-5" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/30" />

      {/* Container to match the nav width */}
      <div className="container relative mx-auto h-full px-4">
        {destinations.map((dest, index) => {
          let width = dest.size.desktop.width;
          let height = dest.size.desktop.height;

          if (screenSize === "tablet" && dest.size.tablet) {
            width = dest.size.tablet.width;
            height = dest.size.tablet.height;
          } else if (screenSize === "largeDesktop" && dest.size.largeDesktop) {
            width = dest.size.largeDesktop.width;
            height = dest.size.largeDesktop.height;
          }

          const positionStyle: React.CSSProperties = {
            position: "absolute",
            width,
            height,
            zIndex: dest.zIndex,
            transitionDelay: `${index * 50}ms`,
          };

          if (screenSize === "tablet" && dest.initialPosition.tablet) {
            positionStyle.top = dest.initialPosition.tablet.top;
          } else if (
            screenSize === "largeDesktop" &&
            dest.initialPosition.largeDesktop
          ) {
            positionStyle.top = dest.initialPosition.largeDesktop.top;
          } else {
            positionStyle.top = dest.initialPosition.desktop.top;
          }

          if (dest.initialPosition.desktop.left) {
            if (screenSize === "tablet" && dest.initialPosition.tablet?.left) {
              positionStyle.left = dest.initialPosition.tablet.left;
            } else if (
              screenSize === "largeDesktop" &&
              dest.initialPosition.largeDesktop?.left
            ) {
              positionStyle.left = dest.initialPosition.largeDesktop.left;
            } else {
              positionStyle.left = dest.initialPosition.desktop.left;
            }
          } else if (dest.initialPosition.desktop.right) {
            if (screenSize === "tablet" && dest.initialPosition.tablet?.right) {
              positionStyle.right = dest.initialPosition.tablet.right;
            } else if (
              screenSize === "largeDesktop" &&
              dest.initialPosition.largeDesktop?.right
            ) {
              positionStyle.right = dest.initialPosition.largeDesktop.right;
            } else {
              positionStyle.right = dest.initialPosition.desktop.right;
            }
          }

          let animationClass = "animate-float-simple";

          if (dest.id === "museums") {
            animationClass = "animate-float-reverse";
          } else if (dest.id === "cafes") {
            animationClass = "animate-float-simple-alt";
          } else if (dest.id === "restaurants") {
            animationClass = "animate-float-simple-alt";
          }

          return (
            <div
              key={dest.id}
              className="destination-card-wrapper transition-opacity duration-500"
              style={{
                ...positionStyle,
                transform: `translateY(${parallaxOffsets[index]}px)`,
              }}
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
                    isMounted ? "opacity-100" : "opacity-0"
                  } ${animationClass}`}
                  style={{
                    height: "100%",
                    width: "100%",
                    animationDelay: `${index * 0.3}s`,
                    transition: "opacity 0.8s ease-in-out",
                    transitionDelay: `${index * 0.2}s`,
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-2xl opacity-75 shadow-md transition-all duration-300 ease-out hover:opacity-90 hover:shadow-lg">
                    <Image
                      src={dest.image}
                      alt={dest.location}
                      fill
                      className="object-cover"
                      sizes={width}
                      priority
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                    <div className="absolute bottom-0 left-0 p-3 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
                      <div className="text-xs font-medium uppercase tracking-wide opacity-95">
                        {dest.category}
                      </div>
                      <div className="text-sm font-bold leading-tight md:text-base">
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
