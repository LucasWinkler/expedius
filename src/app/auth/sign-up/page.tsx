import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/SignUpForm";
import AuthLoading from "../loading";

const SignUpPage = () => {
  return (
    <Suspense fallback={<AuthLoading />}>
      <SignUpForm />
    </Suspense>
  );
};

export default SignUpPage;
