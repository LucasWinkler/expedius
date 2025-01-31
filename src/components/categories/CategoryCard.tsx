import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface CategoryCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const CategoryCard = ({
  href,
  title,
  description,
  icon: Icon,
}: CategoryCardProps) => {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all duration-300 hover:border-primary/30"
    >
      <div className="relative z-10 flex flex-col gap-2.5">
        <div className="flex items-start gap-4">
          <Icon className="size-8 flex-shrink-0 text-muted-foreground/70 transition-colors group-hover:text-primary" />
          <h2 className="text-lg font-semibold leading-tight">{title}</h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground/70">
          {description}
        </p>
      </div>
      <div className="absolute -right-6 bottom-0 top-0 z-0 flex items-center">
        <Icon className="size-32 rotate-12 text-muted-foreground/[0.03] transition-colors group-hover:text-primary/[0.03]" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
};
