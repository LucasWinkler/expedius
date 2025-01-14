"use client";

import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r md:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src="/logo.svg" alt="Logo" className="mr-2 h-6 w-6" />
          PoiToGo
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Discover and collect your favorite local spots.
            </p>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center">{children}</div>
    </div>
  );
};

export default AuthLayout;
