"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { codeSchema, type QrCodeDialogProps } from "./types";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function QrCodeDialog({
  isOpen,
  onOpenChange,
  qrCodeUrl,
  onVerify,
  isLoading,
}: QrCodeDialogProps) {
  const [trustDevice, setTrustDevice] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [secretKey, setSecretKey] = useState("");

  const form = useForm({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setTrustDevice(false);
      setShowManualEntry(false);
    }
  }, [isOpen, form]);

  useEffect(() => {
    if (qrCodeUrl) {
      // Extract the secret from the TOTP URI
      // Format: otpauth://totp/Label:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Label&algorithm=SHA1&digits=6&period=30
      try {
        const match = qrCodeUrl.match(/secret=([A-Z0-9]+)/i);
        if (match && match[1]) {
          setSecretKey(match[1]);
        }
      } catch (error) {
        console.error("Failed to extract secret key from QR code URL", error);
      }
    }
  }, [qrCodeUrl]);

  const handleSubmit = async (data: { code: string }) => {
    await onVerify(data, trustDevice);
  };

  const copySecretToClipboard = () => {
    if (secretKey) {
      navigator.clipboard.writeText(secretKey);
      toast.success("Secret key copied to clipboard");
    }
  };

  if (!qrCodeUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set up Authenticator</DialogTitle>
          <DialogDescription>
            {showManualEntry
              ? "Enter this key manually in your authenticator app"
              : "Scan this QR code with your authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator)"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full flex-col items-center space-y-6">
          {!showManualEntry ? (
            <>
              <div className="rounded-lg border border-border bg-white p-2">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    qrCodeUrl,
                  )}`}
                  alt="2FA QR Code"
                  width={200}
                  height={200}
                />
              </div>

              <Button
                variant="link"
                type="button"
                onClick={() => setShowManualEntry(true)}
                className="w-auto"
              >
                Can&apos;t scan the code?
              </Button>
            </>
          ) : (
            <>
              <div className="w-full space-y-2">
                <div className="text-sm font-medium">Secret Key:</div>
                <div className="flex items-start gap-2">
                  <code className="flex-grow break-all rounded bg-muted px-2 py-1 font-mono text-sm">
                    {secretKey}
                  </code>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={copySecretToClipboard}
                    className="flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Enter this key into your authenticator app when prompted.
                </div>
              </div>

              <Button
                variant="link"
                type="button"
                onClick={() => setShowManualEntry(false)}
                className="w-auto"
              >
                Go back to QR code
              </Button>
            </>
          )}

          <div className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-start space-x-2 pt-4">
                  <Checkbox
                    id="trust-device"
                    checked={trustDevice}
                    onCheckedChange={(checked: CheckedState) =>
                      setTrustDevice(checked === true)
                    }
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="trust-device"
                    className="text-sm text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Trust this device for 60 days (won&apos;t need 2FA codes on
                    this device)
                  </label>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
