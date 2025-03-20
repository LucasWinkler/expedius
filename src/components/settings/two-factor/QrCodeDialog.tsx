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

export function QrCodeDialog({
  isOpen,
  onOpenChange,
  qrCodeUrl,
  onVerify,
  isLoading,
}: QrCodeDialogProps) {
  const [trustDevice, setTrustDevice] = useState(false);

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
    }
  }, [isOpen, form]);

  const handleSubmit = async (data: { code: string }) => {
    await onVerify(data, trustDevice);
  };

  if (!qrCodeUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code with your authenticator app (like Google
            Authenticator, Authy, or Microsoft Authenticator)
          </DialogDescription>
        </DialogHeader>

        <div className="mx-auto flex flex-col items-center space-y-6">
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
                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox
                    id="trust-device"
                    checked={trustDevice}
                    onCheckedChange={(checked: CheckedState) =>
                      setTrustDevice(checked === true)
                    }
                  />
                  <label
                    htmlFor="trust-device"
                    className="text-sm leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
