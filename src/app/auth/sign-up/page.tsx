import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import SignUpForm from "@/components/auth/SignUpForm";

const Loading = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[350px]">
      <Loader2 className="animate-spin" />
    </div>
  );
};

const SignUpPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <SignUpForm />
    </Suspense>
  );
};

export default SignUpPage;
