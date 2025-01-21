import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SignInForm } from "@/components/auth/SignInForm";

const Loading = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[350px]">
      <Loader2 className="animate-spin" />
    </div>
  );
};

const SignInPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <SignInForm />
    </Suspense>
  );
};

export default SignInPage;
