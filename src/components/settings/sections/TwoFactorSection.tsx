"use client";

import { useState } from "react";
import { SettingsSection } from "../components/SettingsSection";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { refreshUserSession } from "@/server/actions/settings";
import {
  EnableTwoFactorDialog,
  QrCodeDialog,
  BackupCodesDialog,
  DisableTwoFactorDialog,
  type PasswordFormValues,
  type CodeFormValues,
} from "../two-factor";

export function TwoFactorSection() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const [showEnableDialog, setShowEnableDialog] = useState(false);
  const [showQrCodeDialog, setShowQrCodeDialog] = useState(false);
  const [showBackupCodesDialog, setShowBackupCodesDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);

  const is2FAEnabled = session?.user?.twoFactorEnabled || false;

  async function handleEnable2FA(data: PasswordFormValues) {
    setIsLoading(true);
    try {
      const response = await authClient.twoFactor.enable({
        password: data.password,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.totpURI) {
        setQrCodeUrl(response.data.totpURI);
        if (response.data.backupCodes && response.data.backupCodes.length) {
          setBackupCodes(response.data.backupCodes);
        }
        setShowEnableDialog(false);
        setShowQrCodeDialog(true);
      }
    } catch (error) {
      toast.error("Failed to enable 2FA", {
        description: "Please check your password and try again",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyCode(data: CodeFormValues, trustDevice: boolean) {
    setIsLoading(true);
    try {
      await authClient.twoFactor.verifyTotp({
        code: data.code,
        trustDevice: trustDevice,
      });

      toast.success("Two-factor authentication enabled", {
        description: trustDevice
          ? "Your account is now secured with 2FA. This device will be trusted for 60 days."
          : "Your account is now secured with 2FA",
      });

      setShowQrCodeDialog(false);
      setShowBackupCodesDialog(true);

      await refreshUserSession();
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      if (err?.status === 400 || err?.message?.includes("code")) {
        toast.error("Invalid verification code", {
          description: "Please check the code and try again.",
        });
      } else {
        toast.error("Verification failed", {
          description: "An error occurred. Please try again later.",
        });
      }
      console.error("2FA Verification Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDisable2FA(data: PasswordFormValues) {
    setIsLoading(true);
    try {
      const response = await authClient.twoFactor.disable({
        password: data.password,
      });

      if (response.error) {
        throw new Error(response.error.code);
      }

      toast.success("Two-factor authentication disabled", {
        description: "Your account is now secured with just your password",
      });

      setShowDisableDialog(false);
      await refreshUserSession();
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("password")) {
          toast.error("Invalid password", {
            description:
              "The password you entered is incorrect. Please try again.",
          });
        } else if (error.message === "VALIDATION_ERROR") {
          toast.error("Failed to disable 2FA", {
            description: "Your password is incorrect, please try again.",
          });
        } else {
          toast.error("Failed to disable 2FA", {
            description: "An error occurred. Please try again later.",
          });
        }
      }

      console.error("2FA Disable Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SettingsSection
      title="Two-Factor Authentication (2FA)"
      description="Add an extra layer of security to your account"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Two-Factor Status</p>
            <p className="text-sm text-muted-foreground">
              {is2FAEnabled
                ? "Your account is protected with two-factor authentication"
                : "Protect your account with two-factor authentication"}
            </p>
          </div>
          <div>
            {is2FAEnabled ? (
              <DisableTwoFactorDialog
                isOpen={showDisableDialog}
                onOpenChange={setShowDisableDialog}
                onDisable={handleDisable2FA}
                isLoading={isLoading}
              />
            ) : (
              <EnableTwoFactorDialog
                isOpen={showEnableDialog}
                onOpenChange={setShowEnableDialog}
                onEnable={handleEnable2FA}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
        {is2FAEnabled && (
          <Alert variant="success">
            <Info className="size-4" />
            <AlertTitle>Your account is secured</AlertTitle>
            <AlertDescription>
              Two-factor authentication adds an additional layer of security to
              your account. When signing in, you&apos;ll need to provide a code
              from your authenticator app.
            </AlertDescription>
          </Alert>
        )}
        <QrCodeDialog
          isOpen={showQrCodeDialog}
          onOpenChange={setShowQrCodeDialog}
          qrCodeUrl={qrCodeUrl}
          onVerify={handleVerifyCode}
          isLoading={isLoading}
        />
        <BackupCodesDialog
          isOpen={showBackupCodesDialog}
          onOpenChange={setShowBackupCodesDialog}
          backupCodes={backupCodes}
          is2FAEnabled={is2FAEnabled}
        />
      </div>
    </SettingsSection>
  );
}
