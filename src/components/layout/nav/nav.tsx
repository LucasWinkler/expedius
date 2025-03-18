"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const DesktopNav = dynamic(
  () => import("./desktop-nav").then((mod) => mod.DesktopNav),
  {
    ssr: false,
    loading: () => null,
  },
);

const MobileNav = dynamic(
  () => import("./mobile-nav").then((mod) => mod.MobileNav),
  {
    ssr: false,
    loading: () => null,
  },
);

export const Nav = () => {
  const { data, isPending } = useSession();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 h-16 w-full bg-background transition-[border-color,background-color] duration-200 ${
        hasScrolled ? "border-b" : "border-b border-transparent"
      }`}
      role="banner"
    >
      <div className="container mx-auto flex h-full items-center px-4">
        <Link
          href="/"
          className="mr-8 bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-lg font-extrabold tracking-tighter text-transparent transition-colors hover:from-foreground hover:via-foreground/80 hover:to-foreground/60 xl:mr-10 2xl:text-xl"
          aria-label="Expedius Home"
        >
          Expedius
        </Link>
        <DesktopNav session={data} isPending={isPending} />
        <MobileNav session={data} isPending={isPending} />
      </div>
    </header>
  );
};
