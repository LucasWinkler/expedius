"use client";

import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import type { Session } from "@/lib/auth-client";

type NavLinksProps = {
  user: Session["user"] | null | undefined;
};

export const NavLinks = ({ user }: NavLinksProps) => {
  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      <Link
        href="/discover"
        className="flex items-center space-x-1 transition-colors hover:text-foreground/80"
      >
        <Search className="h-4 w-4" />
        <span>Discover</span>
      </Link>
      {user ? (
        <Link
          href={`/u/${user.username}`}
          className="flex items-center space-x-1 transition-colors hover:text-foreground/80"
        >
          <MapPin className="h-4 w-4" />
          <span>My Places</span>
        </Link>
      ) : null}
    </nav>
  );
};
