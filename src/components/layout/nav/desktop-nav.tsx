import type { ClientSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { NAV_ITEMS, USER_NAV_ITEMS } from "@/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Settings, LogOut } from "lucide-react";

type DesktopNavProps = {
  session: ClientSession | null;
  isPending: boolean;
};

export const DesktopNav = ({ session, isPending }: DesktopNavProps) => {
  return (
    <div className="flex w-full items-center">
      <Link
        href="/"
        className="mr-8 bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-lg font-extrabold tracking-tighter text-transparent transition-colors hover:from-foreground hover:via-foreground/80 hover:to-foreground/60 xl:mr-10 2xl:text-xl"
        aria-label="PoiToGo Home"
      >
        PoiToGo
      </Link>

      <nav
        className="hidden w-full items-center justify-between md:flex"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-6 xl:gap-8">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground lg:text-[0.9375rem] 2xl:text-base"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6 xl:gap-8">
          {isPending ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus-visible:outline-none">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={session.user.image ?? undefined}
                    alt={session.user.name ?? ""}
                  />
                  <AvatarFallback>
                    {session.user.name[0].toUpperCase() ??
                      session.user.username[0].toUpperCase() ??
                      "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <Link
                      href={`/users/${session.user.username}`}
                      className="text-xs text-muted-foreground"
                    >
                      @{session.user.username}
                    </Link>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {USER_NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                  <DropdownMenuItem key={label} asChild>
                    <Link
                      href={href(session.user.username)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => void signOut()}
                  className="flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-sm font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-foreground 2xl:h-10 2xl:text-base"
                asChild
              >
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
              <Button
                className="text-sm font-medium transition-all duration-200 2xl:h-10 2xl:text-base"
                asChild
              >
                <Link href="/auth/sign-up">Start exploring</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default DesktopNav;
