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
        isExploration &&
          !isNightSuggestion &&
          "shadow-[0_4px_12px_rgba(59,130,246,0.3)] before:absolute before:inset-0 before:z-10 before:animate-border-shimmer-fast before:rounded-lg before:bg-[linear-gradient(90deg,rgba(59,130,246,0.5)_0%,rgba(59,130,246,0.55)_20%,rgba(59,130,246,0.8)_50%,rgba(59,130,246,0.55)_80%,rgba(59,130,246,0.5)_100%)] before:bg-[length:200%_100%] after:absolute after:inset-[3px] after:z-10 after:rounded-lg after:bg-background hover:shadow-[0_4px_16px_rgba(59,130,246,0.4)] hover:before:bg-[linear-gradient(90deg,rgba(59,130,246,0.55)_0%,rgba(59,130,246,0.6)_20%,rgba(59,130,246,0.85)_50%,rgba(59,130,246,0.6)_80%,rgba(59,130,246,0.55)_100%)]",
        isNightSuggestion &&
          "shadow-[0_4px_12px_rgba(125,125,235,0.3)] before:absolute before:inset-0 before:z-10 before:animate-border-shimmer-fast before:rounded-lg before:bg-[linear-gradient(90deg,rgba(125,125,235,0.35)_0%,rgba(125,125,235,0.4)_20%,rgba(125,125,235,0.6)_50%,rgba(125,125,235,0.4)_80%,rgba(125,125,235,0.35)_100%)] before:bg-[length:200%_100%] after:absolute after:inset-[3px] after:z-10 after:rounded-lg after:bg-background hover:shadow-[0_4px_16px_rgba(125,125,235,0.4)] hover:before:bg-[linear-gradient(90deg,rgba(125,125,235,0.4)_0%,rgba(125,125,235,0.45)_20%,rgba(125,125,235,0.65)_50%,rgba(125,125,235,0.45)_80%,rgba(125,125,235,0.4)_100%)]",
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
            isExploration && !isNightSuggestion && "brightness-100",
            isNightSuggestion && "brightness-95",
          )}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/50 from-10% via-black/10 via-50% to-transparent transition-all duration-300",
            "group-hover:opacity-60",
            isExploration &&
              !isNightSuggestion &&
              "from-[rgba(30,60,120,0.4)] from-10% via-[rgba(30,60,120,0.1)] via-50% to-transparent",
            isNightSuggestion &&
              "from-[rgba(125,125,235,0.35)] from-10% via-[rgba(125,125,235,0.1)] via-50% to-transparent",
          )}
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300",
            "group-hover:opacity-90",
            isExploration &&
              !isNightSuggestion &&
              "from-[rgba(30,60,120,0.7)] to-transparent",
            isNightSuggestion && "from-[rgba(125,125,235,0.6)] to-transparent",
          )}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-30 p-4 transition-all duration-300 ease-out group-hover:-translate-y-1">
        <div className="flex items-center gap-2">
          {isNightSuggestion && (
            <Moon
              className={cn(
                "size-[18px]",
                "text-indigo-100",
                "drop-shadow-[0_0_6px_rgba(129,140,248,0.7)]",
                "transition-all duration-300",
                "group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]",
              )}
              strokeWidth={2.5}
            />
          )}
          {isExploration && !isNightSuggestion && (
            <Sparkles
              className={cn(
                "size-[18px]",
                "text-blue-100",
                "drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]",
                "transition-all duration-300",
                "group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]",
              )}
              strokeWidth={2.5}
            />
          )}
          <h3
            className={cn(
              "text-lg font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300",
              "group-hover:opacity-100",
            )}
          >
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
