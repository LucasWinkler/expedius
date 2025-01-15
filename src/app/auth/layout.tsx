"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { redirect } from "next/navigation";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white md:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex flex-col">
          <Link href="/" className="text-lg font-medium">
            PoiToGo
          </Link>

          <p className="text-sm text-zinc-400">Points-Of-Interest To Go</p>
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Discover and share your favourite local spots.
            </p>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center py-10">{children}</div>
    </div>
  );
};

export default AuthLayout;
