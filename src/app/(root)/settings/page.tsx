import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { getServerSession } from "@/server/auth/session";
import { cookies } from "next/headers";
import {
  DeleteAccountSection,
  EmailSection,
  PasswordSection,
  SessionsSection,
  TwoFactorSection,
} from "@/components/settings";
import { redirect } from "next/navigation";

export const metadata: Metadata = createMetadata({
  title: "Account Settings",
  description: "Manage your account settings and preferences",
});

export default async function Settings() {
  const session = await getServerSession();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!session) {
    redirect("/login?callbackUrl=/settings");
  }

  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-8">
        <EmailSection
          currentEmail={session.user.email}
          emailVerified={!!session.user.emailVerified}
        />
        <PasswordSection />
        <TwoFactorSection />
        <SessionsSection sessionToken={sessionToken} />
        <DeleteAccountSection />
      </div>
    </div>
  );
}
