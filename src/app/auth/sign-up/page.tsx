import Link from "next/link";
import SignUpForm from "@/components/auth/SignUpForm";
import { Home, Search } from "lucide-react";

export const SignUpPage = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>
      <SignUpForm />
      <div className="flex flex-col space-y-4">
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/sign-in"
            className="hover:text-brand underline underline-offset-4"
          >
            Already have an account? Sign In
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

export default SignUpPage;
