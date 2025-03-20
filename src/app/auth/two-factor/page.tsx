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
});

const TwoFactorPage = async ({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) => {
  const session = await getServerSession();

  if (session) {
    redirect(searchParams.callbackUrl || "/");
  }

  return (
    <Suspense fallback={<AuthLoading />}>
      <TwoFactorForm callbackURL={searchParams.callbackUrl} />
    </Suspense>
  );
};

export default TwoFactorPage;
