import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Reset Password",
  description: "Create a new password for your account",
  canonicalUrlRelative: "/auth/reset-password",
});

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
