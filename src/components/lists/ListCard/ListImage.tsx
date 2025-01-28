import { ProxiedImage } from "@/components/ui/ProxiedImage";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ListImageProps {
  className?: string;
  image?: string | null;
  colour: string;
  name: string;
  onLoadChange: (loaded: boolean) => void;
}

export const ListImage = ({
  className,
  image,
  colour,
  name,
  onLoadChange,
}: ListImageProps) => {
  const [localImageLoaded, setLocalImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setLocalImageLoaded(true);
    onLoadChange(true);
  };

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 transition-transform duration-300"
          style={{ backgroundColor: colour }}
        />

        {image && (
          <ProxiedImage
            src={image}
            alt={name}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              localImageLoaded ? "opacity-100" : "opacity-0",
            )}
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 10rem, 12rem"
            quality={75}
            onLoad={handleImageLoad}
          />
        )}
      </div>
    </div>
  );
};
