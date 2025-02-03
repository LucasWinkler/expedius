"use client";

import { useSession } from "@/lib/auth-client";
import { DesktopNav } from "./desktop-nav";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MobileNav = dynamic(() => import("./mobile-nav"), {
  ssr: true,
  loading: () => null,
});

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
      className={`sticky top-0 z-50 h-16 w-full bg-background/95 backdrop-blur transition-[border-color,background-color] duration-200 supports-[backdrop-filter]:bg-background/60 ${
        hasScrolled ? "border-b" : "border-b border-transparent"
      }`}
      role="banner"
    >
      <div className="container mx-auto flex h-full items-center px-4">
        <DesktopNav session={data} isPending={isPending} />
        <MobileNav session={data} isPending={isPending} />
      </div>
    </header>
  );
};
