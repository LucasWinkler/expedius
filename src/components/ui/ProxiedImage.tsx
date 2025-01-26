"use client";

import Image, { ImageProps } from "next/image";

interface ProxiedImageProps extends Omit<ImageProps, "src"> {
  src: string;
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
  const proxiedSrc = `/api/image-proxy?url=${encodeURIComponent(src)}`;

  return (
    <Image
      src={proxiedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      {...props}
    />
  );
}
