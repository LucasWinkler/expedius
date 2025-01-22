"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { MapPin, LogOut, Search, Menu } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useState } from "react";

export const BackupNav = () => {
  const { data, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const MobileNavItems = () => (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-9 w-full justify-start transition-colors",
          "[@media(hover:hover)]:hover:bg-accent/50",
        )}
        asChild
      >
        <Link
          href="/discover"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Search className="size-4" />
          <span>Discover</span>
        </Link>
      </Button>

      {data?.user && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-full justify-start transition-colors",
            "[@media(hover:hover)]:hover:bg-accent/50",
          )}
          asChild
        >
          <Link
            href={`/u/${data.user.username}`}
            className="flex items-center gap-2"
          >
            <MapPin className="size-4" />
            <span>My Lists</span>
          </Link>
        </Button>
      )}

      {data?.user && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            void signOut();
            setIsOpen(false);
          }}
          className={cn(
            "h-9 w-full justify-start transition-colors",
            "text-destructive hover:text-destructive",
            "[@media(hover:hover)]:hover:bg-destructive/10",
          )}
        >
          <LogOut className="size-4" />
          <span>Sign out</span>
        </Button>
      )}

      {!data?.user && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-full justify-start"
            asChild
          >
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
          <Button size="sm" className="h-9 w-full justify-start" asChild>
            <Link href="/auth/sign-up">Sign up</Link>
          </Button>
        </>
      )}
    </>
  );

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="flex items-center">
          <Link
            href="/"
            className="mr-6 text-lg font-bold transition-colors hover:text-foreground/80"
            aria-label="PoiToGo Home"
          >
            PoiToGo
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:block"
            role="navigation"
            aria-label="Main navigation"
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-9 transition-colors",
                "[@media(hover:hover)]:hover:bg-accent/50",
              )}
              asChild
            >
              <Link
                href="/discover"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Search className="size-4" />
                <span>Discover</span>
              </Link>
            </Button>
          </nav>
        </div>

        {/* Desktop Right Side Navigation */}
        <div className="ml-auto hidden items-center gap-2 md:flex">
          {isPending ? (
            <>
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </>
          ) : data?.user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 transition-colors",
                  "[@media(hover:hover)]:hover:bg-accent/50",
                )}
                asChild
              >
                <Link
                  href={`/u/${data.user.username}`}
                  className="flex items-center gap-2"
                >
                  <MapPin className="size-4" />
                  <span>My Lists</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void signOut()}
                className={cn(
                  "h-9 transition-colors",
                  "text-destructive hover:text-destructive",
                  "[@media(hover:hover)]:hover:bg-destructive/10",
                )}
              >
                <LogOut className="size-4" />
                <span>Sign out</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="h-9" asChild>
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
              <Button size="sm" className="h-9" asChild>
                <Link href="/auth/sign-up">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="ml-auto md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80vw] max-w-[400px] p-4">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Access navigation links and account options
              </SheetDescription>
            </SheetHeader>
            <nav
              className="flex flex-col space-y-2"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <MobileNavItems />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default BackupNav;
