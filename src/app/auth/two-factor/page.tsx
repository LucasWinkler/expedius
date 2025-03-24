import { Suspense } from "react";
import { TwoFactorForm } from "@/components/auth/TwoFactorForm";
import AuthLoading from "../loading";
import { createMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";
import { getServerSession } from "@/server/auth/session";

export const metadata = createMetadata({
  title: "Two-factor authentication",
  description:
    "Verify your identity with two-factor authentication to access your account.",
  canonicalUrlRelative: "/auth/two-factor",
});

const TwoFactorPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) => {
  const session = await getServerSession();
  const { callbackUrl } = await searchParams;

  if (session) {
    redirect(callbackUrl || "/");
  }

  return (
    <Suspense fallback={<AuthLoading />}>
      <TwoFactorForm callbackURL={callbackUrl} />
    </Suspense>
  );
};

export default TwoFactorPage;
