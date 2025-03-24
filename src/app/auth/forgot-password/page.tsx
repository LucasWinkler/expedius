import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Forgot Password",
  description: "Reset your password",
  canonicalUrlRelative: "/auth/forgot-password",
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
