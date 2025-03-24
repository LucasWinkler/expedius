export type ScreenSize =
  | "mobile"
  | "desktop"
  | "tablet"
  | "largeDesktop"
  | "extraLargeDesktop";

export type Position = {
  top: string;
  left?: string;
  right?: string;
};

export type Size = {
  width: string;
  height: string;
};

export type Destination = {
  id: string;
  category: string;
  location: string;
  image: string;
  rotation: number;
  initialPosition: {
    desktop: Position;
    tablet?: Position;
    largeDesktop?: Position;
    extraLargeDesktop?: Position;
  };
  size: {
    desktop: Size;
    tablet?: Size;
    largeDesktop?: Size;
    extraLargeDesktop?: Size;
  };
  parallaxFactor: number;
  zIndex: number;
};
