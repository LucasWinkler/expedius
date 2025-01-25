"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, MapPin, LogIn, UserPlus, LogOut } from "lucide-react";
import { NavLink } from "./nav-link";
import type { Session } from "@/lib/auth-client";
import { useState } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { signOut } from "@/lib/auth-client";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

type MobileNavProps = {
  session: Session | null;
  isPending: boolean;
};

export const MobileNav = ({ session, isPending }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto flex md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
          <VisuallyHidden.Root>Menu</VisuallyHidden.Root>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetTitle className="text-left text-lg font-bold">PoiToGo</SheetTitle>
        <SheetDescription className="text-left">
          Discover and save your favourite places
        </SheetDescription>
        <div className="mt-8 flex flex-col gap-2">
          {isPending ? (
            <>
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </>
          ) : session?.user ? (
            <>
              <NavLink
                href={`/u/${session.user.username}`}
                icon={MapPin}
                label="My Lists"
                onClick={() => setIsOpen(false)}
                className="w-full justify-start"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  void signOut();
                  setIsOpen(false);
                }}
                className="h-9 w-full justify-start text-destructive hover:text-destructive [@media(hover:hover)]:hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-full justify-start"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href="/auth/sign-in" className="flex items-center gap-2">
                  <LogIn className="size-4" />
                  <span>Sign in</span>
                </Link>
              </Button>
              <Button
                size="sm"
                className="h-9 w-full justify-start"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href="/auth/sign-up" className="flex items-center gap-2">
                  <UserPlus className="size-4" />
                  <span>Sign up</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
