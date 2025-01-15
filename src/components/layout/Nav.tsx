"use client";

import { Suspense } from "react";
import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { UserMenu } from "./UserMenu";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";

const NavLinksSkeleton = () => (
  <div className="flex items-center space-x-6">
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-4 w-20" />
  </div>
);

export const Nav = () => {
  const { data, isPending } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 font-bold">
            PoiToGo
          </Link>
          <Suspense fallback={<NavLinksSkeleton />}>
            <NavLinks user={data?.user} />
          </Suspense>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <UserMenu user={data?.user} isPending={isPending} />
        </div>
      </div>
    </header>
  );
};

export default Nav;
