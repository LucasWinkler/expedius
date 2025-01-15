import Link from "next/link";
import { SignInForm } from "@/components/auth/SignInForm";
import { Home, Search } from "lucide-react";

export const SignInPage = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to sign in to your account
        </p>
      </div>
      <SignInForm />
      <div className="flex flex-col space-y-4">
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/sign-up"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-foreground"
          >
            <Home className="h-3 w-3" />
            Home
          </Link>
          <Link
            href="/discover"
            className="flex items-center gap-1 hover:text-foreground"
          >
            <Search className="h-3 w-3" />
            <span>Discover</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
