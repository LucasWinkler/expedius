import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sparkles, Moon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  query: string;
  imageUrl: string;
  className?: string;
  index?: number;
  isExploration?: boolean;
  isNightSuggestion?: boolean;
}

export function CategoryCard({
  title,
  query,
  imageUrl,
  className,
  index = -1,
  isExploration = false,
  isNightSuggestion = false,
}: CategoryCardProps) {
  return (
    <Link
      href={`/explore?q=${encodeURIComponent(query)}`}
      scroll={false}
      className={cn(
        "group relative block aspect-[4/3] overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.98]",
        (isExploration || isNightSuggestion) &&
          "shadow-[0_4px_12px_rgba(var(--primary),0.3)] before:absolute before:inset-0 before:z-10 before:animate-border-shimmer-fast before:rounded-lg before:bg-[linear-gradient(90deg,hsl(var(--primary)/0.5)_0%,hsl(var(--primary)/0.55)_20%,hsl(var(--primary)/0.8)_50%,hsl(var(--primary)/0.55)_80%,hsl(var(--primary)/0.5)_100%)] before:bg-[length:200%_100%] after:absolute after:inset-[3px] after:z-10 after:rounded-lg after:bg-background hover:shadow-[0_4px_16px_rgba(var(--primary),0.4)] hover:before:bg-[linear-gradient(90deg,hsl(var(--primary)/0.55)_0%,hsl(var(--primary)/0.6)_20%,hsl(var(--primary)/0.85)_50%,hsl(var(--primary)/0.6)_80%,hsl(var(--primary)/0.55)_100%)]",
        className,
      )}
    >
      <div className="absolute inset-[3px] z-20 overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority={index >= 0 && index < 3}
          sizes="(min-width: 1280px) 384px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className={cn(
            "object-cover transition-transform duration-300",
            "group-hover:scale-110",
            isExploration &&
              !isNightSuggestion &&
              "brightness-[1.02] contrast-[1.02]",
            isNightSuggestion && "brightness-[0.95] contrast-[1.05]",
          )}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300",
            "group-hover:opacity-[0.85]",
            isExploration && !isNightSuggestion && "from-black/70",
            isNightSuggestion &&
              "from-[rgba(30,30,60,0.75)] via-[rgba(30,30,60,0.3)]",
          )}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-30 p-4 transition-transform duration-300 ease-out group-hover:-translate-y-1">
        <div className="flex items-center gap-2">
          {isNightSuggestion && (
            <Moon className="size-4 animate-soft-pulse text-blue-300" />
          )}
          {isExploration && !isNightSuggestion && (
            <Sparkles className="size-4 animate-soft-pulse text-primary" />
          )}
          <h3
            className={cn(
              "text-lg font-semibold text-white transition-opacity duration-300",
              "group-hover:opacity-[0.95]",
              isExploration &&
                !isNightSuggestion &&
                "text-primary-foreground drop-shadow-sm",
              isNightSuggestion && "text-blue-100 drop-shadow-sm",
            )}
          >
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
