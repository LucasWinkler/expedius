"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  LogIn,
  UserPlus,
  LogOut,
  Search,
  Home,
  Grid2X2,
} from "lucide-react";
import { NavLink } from "./nav-link";
import type { ClientSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { signOut } from "@/lib/auth-client";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { USER_NAV_ITEMS } from "@/constants";

type MobileNavProps = {
  session: ClientSession | null;
  isPending: boolean;
};

export const MobileNav = ({ session, isPending }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex w-full items-center justify-end md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex w-80 flex-col p-6">
          <SheetTitle>
            <Link
              href="/"
              className="mr-8 bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-2xl font-extrabold tracking-tighter text-transparent transition-colors hover:from-foreground hover:via-foreground/80 hover:to-foreground/60 xl:mr-10"
              aria-label="Expedius Home"
              onClick={() => setIsOpen(false)}
            >
              Expedius
            </Link>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Find, organize, and share your favourite places from around the
            world
          </SheetDescription>

          <nav className="flex flex-col gap-3">
            <NavLink
              href="/"
              icon={Home}
              label="Home"
              onClick={() => setIsOpen(false)}
              className="h-11 w-full justify-start gap-3 text-base font-medium"
            />
            <NavLink
              href="/discover"
              icon={Search}
              label="Discover"
              onClick={() => setIsOpen(false)}
              className="h-11 w-full justify-start gap-3 text-base font-medium"
            />
            <NavLink
              href="/categories"
              icon={Grid2X2}
              label="Categories"
              onClick={() => setIsOpen(false)}
              className="h-11 w-full justify-start gap-3 text-base font-medium"
            />

            {isPending ? (
              <>
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </>
            ) : (
              session?.user &&
              USER_NAV_ITEMS.map(({ href, icon, label }) => (
                <NavLink
                  key={label}
                  href={href(session.user.username)}
                  icon={icon}
                  label={label}
                  onClick={() => setIsOpen(false)}
                  className="h-11 w-full justify-start gap-3 text-base font-medium"
                />
              ))
            )}
          </nav>

          <div className="mt-auto space-y-6">
            {!isPending && (
              <>
                {session?.user ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      void signOut();
                      setIsOpen(false);
                    }}
                    className="h-11 w-full justify-start gap-3 text-base font-medium text-destructive hover:text-destructive [@media(hover:hover)]:hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="h-11 w-full justify-start gap-3 text-base font-medium"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link
                        href="/auth/sign-in"
                        className="flex items-center gap-3"
                      >
                        <LogIn className="size-4" />
                        Sign in
                      </Link>
                    </Button>
                    <Button
                      className="h-11 w-full justify-start gap-3 bg-primary text-base font-medium text-primary-foreground transition-all duration-200 hover:bg-foreground hover:text-background"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link
                        href="/auth/sign-up"
                        className="flex items-center gap-3"
                      >
                        <UserPlus className="size-4" />
                        Start exploring
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Developed by{" "}
                <Link
                  href="https://github.com/lucaswinkler"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/80 underline-offset-4 hover:underline"
                >
                  Lucas Winkler
                </Link>
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
