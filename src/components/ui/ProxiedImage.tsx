"use client";

import Image, { type ImageProps, type StaticImageData } from "next/image";

interface ProxiedImageProps extends Omit<ImageProps, "src"> {
  src: string | StaticImageData;
  priority?: boolean;
}

export function ProxiedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  ...props
}: ProxiedImageProps) {
  const proxiedSrc =
    typeof src !== "string"
      ? src
      : `/api/image-proxy?url=${encodeURIComponent(src)}`;

  return (
    <Image
      src={proxiedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
      {...props}
    />
  );
}
