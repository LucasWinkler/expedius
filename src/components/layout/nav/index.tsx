"use client";

import { useSession } from "@/lib/auth-client";
import { MobileNav } from "./mobile-nav";
import { DesktopNav } from "./desktop-nav";

export const Nav = () => {
  const { data, isPending } = useSession();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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
