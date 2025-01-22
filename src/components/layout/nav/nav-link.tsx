"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type NavLinkProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: "ghost" | "default";
  className?: string;
};

export const NavLink = ({
  href,
  icon: Icon,
  label,
  onClick,
  variant = "ghost",
  className,
}: NavLinkProps) => {
  return (
    <Button
      variant={variant}
      size="sm"
      className={cn(
        "h-9 transition-colors",
        "[@media(hover:hover)]:hover:bg-accent/50",
        className,
      )}
      asChild
      onClick={onClick}
    >
      <Link href={href} className="flex items-center gap-2 text-sm font-medium">
        <Icon className="size-4" />
        <span>{label}</span>
      </Link>
    </Button>
  );
};

export default NavLink;
