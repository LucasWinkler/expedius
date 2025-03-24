import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  query: string;
  imageUrl: string;
  className?: string;
  index?: number;
}

export function CategoryCard({
  title,
  query,
  imageUrl,
  className,
  index = -1,
}: CategoryCardProps) {
  return (
    <Link
      href={`/explore?q=${encodeURIComponent(query)}`}
      scroll={false}
      className={cn(
        "group relative block aspect-[4/3] overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.98]",
        className,
      )}
    >
      <Image
        src={imageUrl}
        alt={title}
        fill
        priority={index >= 0 && index < 3}
        sizes="(min-width: 1280px) 384px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-[0.85]" />
      <div className="absolute inset-x-0 bottom-0 p-4 transition-transform duration-300 ease-out group-hover:-translate-y-1">
        <h3 className="text-lg font-semibold text-white transition-opacity duration-300 group-hover:opacity-[0.95]">
          {title}
        </h3>
      </div>
    </Link>
  );
}
