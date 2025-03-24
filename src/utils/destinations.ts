import type {
  Destination,
  ScreenSize,
  Position,
  Size,
} from "@/types/destinations";

/**
 * Gets the appropriate position for a destination based on screen size
 */
export const getPositionForScreenSize = (
  destination: Destination,
  screenSize: ScreenSize,
): Position => {
  if (screenSize === "tablet" && destination.initialPosition.tablet) {
    return destination.initialPosition.tablet;
  } else if (
    screenSize === "largeDesktop" &&
    destination.initialPosition.largeDesktop
  ) {
    return destination.initialPosition.largeDesktop;
  } else if (
    screenSize === "extraLargeDesktop" &&
    destination.initialPosition.extraLargeDesktop
  ) {
    return destination.initialPosition.extraLargeDesktop;
  } else {
    return destination.initialPosition.desktop;
  }
};

/**
 * Gets the appropriate size for a destination based on screen size
 */
export const getSizeForScreenSize = (
  destination: Destination,
  screenSize: ScreenSize,
): Size => {
  if (screenSize === "tablet" && destination.size.tablet) {
    return destination.size.tablet;
  } else if (screenSize === "largeDesktop" && destination.size.largeDesktop) {
    return destination.size.largeDesktop;
  } else if (
    screenSize === "extraLargeDesktop" &&
    destination.size.extraLargeDesktop
  ) {
    return destination.size.extraLargeDesktop;
  } else {
    return destination.size.desktop;
  }
};

/**
 * Creates a style object for positioning a destination
 */
export const createPositionStyle = (
  destination: Destination,
  screenSize: ScreenSize,
  index: number,
  parallaxOffset: number,
): React.CSSProperties => {
  const position = getPositionForScreenSize(destination, screenSize);
  const size = getSizeForScreenSize(destination, screenSize);

  const style: React.CSSProperties = {
    position: "absolute",
    width: size.width,
    height: size.height,
    zIndex: destination.zIndex,
    transitionDelay: `${index * 50}ms`,
    top: position.top,
    transform: `translateY(${parallaxOffset}px)`,
  };

  if (position.left) {
    style.left = position.left;
  } else if (position.right) {
    style.right = position.right;
  }

  return style;
};

/**
 * Determines the current screen size based on window width
 */
export const getScreenSize = (): ScreenSize => {
  if (typeof window === "undefined") return "desktop";

  if (window.innerWidth < 1024) {
    return "mobile";
  } else if (window.innerWidth < 1536) {
    return "tablet";
  } else if (window.innerWidth < 1920) {
    return "desktop";
  } else if (window.innerWidth < 2400) {
    return "largeDesktop";
  } else {
    return "extraLargeDesktop";
  }
};

/**
 * Calculates parallax offsets based on scroll position and screen size
 */
export const calculateParallaxOffsets = (
  parallaxFactors: number[],
  scrollY: number,
  screenSize: ScreenSize,
): number[] => {
  return parallaxFactors.map((baseFactor) => {
    let factor = baseFactor;

    // Adjust factor based on screen size
    if (screenSize === "tablet") {
      factor = baseFactor * 0.7;
    } else if (screenSize === "largeDesktop") {
      factor = baseFactor * 1.2;
    } else if (screenSize === "extraLargeDesktop") {
      factor = baseFactor * 1.5;
    }

    return scrollY * -factor;
  });
};

/**
 * Gets animation class based on destination ID
 */
export const getAnimationClass = (id: string): string => {
  if (id === "museums") {
    return "animate-float-reverse";
  } else if (id === "cafes" || id === "restaurants") {
    return "animate-float-simple-alt";
  } else {
    return "animate-float-simple";
  }
};
