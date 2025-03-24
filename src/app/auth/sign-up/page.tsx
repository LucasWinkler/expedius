import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/SignUpForm";
import AuthLoading from "../loading";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Sign up",
  description:
    "Create a Expedius account to start saving your favorite places and creating custom lists.",
  canonicalUrlRelative: "/auth/sign-up",
});

const SignUpPage = async () => {
  return (
    <Suspense fallback={<AuthLoading />}>
      <SignUpForm />
    </Suspense>
  );
};

export default SignUpPage;
