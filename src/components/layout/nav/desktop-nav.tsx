import { MapPin } from "lucide-react";
import type { Session } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, UserPlus } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import Link from "next/link";
import NavLink from "./nav-link";

type DesktopNavProps = {
  session: Session | null;
  isPending: boolean;
};

export const DesktopNav = ({ session, isPending }: DesktopNavProps) => {
  return (
    <div className="flex w-full items-center">
      <Link
        href="/"
        className="mr-6 text-lg font-bold transition-colors hover:text-foreground/80"
        aria-label="PoiToGo Home"
      >
        PoiToGo
      </Link>

      <nav
        className="hidden w-full items-center justify-end md:flex"
        role="navigation"
        aria-label="Main navigation"
      >
        {isPending ? (
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        ) : session?.user ? (
          <div className="flex items-center gap-2">
            <NavLink
              href={`/u/${session.user.username}`}
              icon={MapPin}
              label="My Lists"
              className="w-full justify-start"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void signOut()}
              className="h-9 text-destructive transition-colors hover:text-destructive [@media(hover:hover)]:hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              <span>Sign out</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-9" asChild>
              <Link href="/auth/sign-in" className="flex items-center gap-2">
                <LogIn className="size-4" />
                <span>Sign in</span>
              </Link>
            </Button>
            <Button size="sm" className="h-9" asChild>
              <Link href="/auth/sign-up" className="flex items-center gap-2">
                <UserPlus className="size-4" />
                <span>Sign up</span>
              </Link>
            </Button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default DesktopNav;
