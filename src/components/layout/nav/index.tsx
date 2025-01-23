"use client";

import { useSession } from "@/lib/auth-client";
import { MobileNav } from "./mobile-nav";
import { DesktopNav } from "./desktop-nav";
import { useEffect, useState } from "react";

export const Nav = () => {
  const { data, isPending } = useSession();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-background/95 backdrop-blur transition-[border-color] duration-200 supports-[backdrop-filter]:bg-background/60 ${
        hasScrolled ? "border-b" : "border-b border-transparent"
      }`}
      role="banner"
    >
      <div className="container mx-auto flex h-14 items-center px-4">
        <DesktopNav session={data} isPending={isPending} />
        <MobileNav session={data} isPending={isPending} />
      </div>
    </header>
  );
};

export default Nav;
