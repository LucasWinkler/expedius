import { Suspense } from "react";
import { SignInForm } from "@/components/auth/SignInForm";
import AuthLoading from "../loading";

const SignInPage = () => {
  return (
    <Suspense fallback={<AuthLoading />}>
      <SignInForm />
    </Suspense>
  );
};

export default SignInPage;
