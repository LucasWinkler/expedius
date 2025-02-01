import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/SignUpForm";
import AuthLoading from "../loading";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Sign up",
  description:
    "Create a PoiToGo account to start saving your favorite places and creating custom lists.",
});

const SignUpPage = () => {
  return (
    <Suspense fallback={<AuthLoading />}>
      <SignUpForm />
    </Suspense>
  );
};

export default SignUpPage;
