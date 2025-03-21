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
      desktop: { top: "15%", right: "20%" },
      tablet: { top: "15%", right: "12%" },
    },
    size: {
      desktop: { width: "200px", height: "150px" },
      tablet: { width: "170px", height: "130px" },
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
      desktop: { top: "45%", left: "18%" },
      tablet: { top: "40%", left: "8%" },
    },
    size: {
      desktop: { width: "220px", height: "150px" },
      tablet: { width: "180px", height: "130px" },
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
      desktop: { top: "18%", left: "18%" },
      tablet: { top: "18%", left: "10%" },
    },
    size: {
      desktop: { width: "180px", height: "140px" },
      tablet: { width: "160px", height: "120px" },
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
      desktop: { top: "60%", right: "18%" },
      tablet: { top: "62%", right: "9%" },
    },
    size: {
      desktop: { width: "230px", height: "160px" },
      tablet: { width: "180px", height: "130px" },
    },
    parallaxFactor: 0.2,
    zIndex: 1,
  },
];

export const ParallaxDestinations = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [screenSize, setScreenSize] = useState<
    "mobile" | "tablet" | "large" | "desktop"
  >("desktop");

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setScreenSize("mobile");
      } else if (window.innerWidth < 1536) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
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

      const cards = containerRef.current.querySelectorAll(
        ".destination-card-wrapper",
      );
      const scrollY = window.scrollY;

      cards.forEach((card, index) => {
        const dest = destinations[index];
        if (dest) {
          const factor =
            screenSize !== "desktop"
              ? dest.parallaxFactor * 0.7
              : dest.parallaxFactor;
          const yMove = scrollY * -factor;
          (card as HTMLElement).style.transform = `translateY(${yMove}px)`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hoveredCard, screenSize]);

  useEffect(() => {
    const preventDragStart = (e: Event) => {
      e.preventDefault();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("dragstart", preventDragStart);
    }

    return () => {
      if (container) {
        container.removeEventListener("dragstart", preventDragStart);
      }
    };
  }, []);

  const preventDefaultBehavior = (e: React.MouseEvent | React.DragEvent) => {
    e.preventDefault();
  };

  if (screenSize === "mobile") {
    return (
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-muted/90" />
        <div className="bg-grid-white absolute inset-0 bg-[size:100px_100px] opacity-5" />
      </div>
    );
  }

  const getAnimationClass = (id: string) => {
    switch (id) {
      case "eiffel-tower":
        return "animate-float-rotate-1";
      case "cafes":
        return "animate-float-rotate-2";
      case "museums":
        return "animate-float-rotate-3";
      case "restaurants":
        return "animate-float-rotate-4";
      case "parks":
        return "animate-float-rotate-1";
      default:
        return "animate-float-rotate-1";
    }
  };

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
      aria-hidden="true"
      onDragStart={preventDefaultBehavior}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/30" />

      {destinations.map((dest, index) => (
        <div
          key={dest.id}
          className={`destination-card-wrapper transition-opacity duration-500 ${isMounted ? "opacity-100" : "opacity-0"}`}
          style={{
            transitionDelay: `${index * 50}ms`,
            position: "absolute",
            top:
              screenSize === "tablet" && dest.initialPosition.tablet
                ? dest.initialPosition.tablet.top
                : dest.initialPosition.desktop.top,
            left:
              (screenSize === "tablet" || screenSize === "large") &&
              dest.initialPosition.tablet?.left
                ? dest.initialPosition.tablet.left
                : dest.initialPosition.desktop.left,
            right:
              (screenSize === "tablet" || screenSize === "large") &&
              dest.initialPosition.tablet?.right
                ? dest.initialPosition.tablet.right
                : dest.initialPosition.desktop.right,
            zIndex: hoveredCard === dest.id ? 10 : dest.zIndex,
          }}
        >
          <div
            className={`destination-card select-none overflow-hidden rounded-2xl opacity-75 shadow-md transition-all duration-300 ease-out hover:opacity-90 hover:shadow-lg ${getAnimationClass(dest.id)}`}
            style={{
              width:
                screenSize !== "desktop" && dest.size.tablet
                  ? dest.size.tablet.width
                  : dest.size.desktop.width,
              height:
                screenSize !== "desktop" && dest.size.tablet
                  ? dest.size.tablet.height
                  : dest.size.desktop.height,
              animationDelay: `${index * 0.3}s`,
            }}
            onMouseEnter={() => setHoveredCard(dest.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onDragStart={preventDefaultBehavior}
            onMouseDown={preventDefaultBehavior}
            onContextMenu={preventDefaultBehavior}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="relative h-full w-full select-none">
              <Image
                src={dest.image}
                alt={`${dest.location}`}
                fill
                className="select-none object-cover"
                sizes={
                  screenSize === "tablet" && dest.size.tablet
                    ? dest.size.tablet.width
                    : dest.size.desktop.width
                }
                priority
                draggable="false"
                onDragStart={preventDefaultBehavior}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
              <div
                className="absolute bottom-0 left-0 select-none p-3 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] transition-transform duration-300"
                style={{
                  transform:
                    hoveredCard === dest.id
                      ? "translateY(-3px)"
                      : "translateY(0)",
                }}
              >
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
      ))}
    </div>
  );
};
