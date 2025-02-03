"use client";

import { Button } from "@/components/ui/button";
import { LogOut, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import type { ClientSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type AuthButtonsProps = {
  user: ClientSession["user"] | null | undefined;
  isPending: boolean;
  onAction?: () => void;
  isMobile?: boolean;
};

export const AuthButtons = ({
  user,
  isPending,
  onAction,
  isMobile,
}: AuthButtonsProps) => {
  if (isPending) {
    return (
      <>
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-9", isMobile && "w-full justify-start")}
          asChild
        >
          <Link href="/auth/sign-in" className="flex items-center gap-2">
            <LogIn className="size-4" />
            <span>Sign in</span>
          </Link>
        </Button>
        <Button
          size="sm"
          className={cn("h-9", isMobile && "w-full justify-start")}
          asChild
        >
          <Link href="/auth/sign-up" className="flex items-center gap-2">
            <UserPlus className="size-4" />
            <span>Sign up</span>
          </Link>
        </Button>
      </>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        void signOut();
        onAction?.();
      }}
      className={cn(
        "h-9 transition-colors",
        "text-destructive hover:text-destructive",
        "[@media(hover:hover)]:hover:bg-destructive/10",
        isMobile && "w-full justify-start",
        !isMobile && "ml-auto",
      )}
    >
      <LogOut className="mr-2 size-4" />
      <span>Sign out</span>
    </Button>
  );
};

export default AuthButtons;
