import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/SignUpForm";
import AuthLoading from "../loading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create a PoiToGo account to start saving your favorite places and creating custom lists.",
  openGraph: {
    title: "Sign up",
    description:
      "Create a PoiToGo account to start saving your favorite places and creating custom lists.",
  },
};

const SignUpPage = () => {
  return (
    <Suspense fallback={<AuthLoading />}>
      <SignUpForm />
    </Suspense>
  );
};

export default SignUpPage;
