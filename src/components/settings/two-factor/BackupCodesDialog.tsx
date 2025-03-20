"use client";

import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { BackupCodesDialogProps } from "./types";

export function BackupCodesDialog({
  isOpen,
  onOpenChange,
  backupCodes,
  is2FAEnabled,
}: BackupCodesDialogProps) {
  const copyBackupCodes = () => {
    if (backupCodes.length) {
      navigator.clipboard.writeText(backupCodes.join("\n"));
      toast.success("Backup codes copied to clipboard");
    }
  };

  if (backupCodes.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {is2FAEnabled && (
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4 w-full">
            <QrCode className="mr-2 size-4" />
            View Backup Codes
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Backup Codes</DialogTitle>
          <DialogDescription>
            Save these backup codes in a safe place. You can use them to sign in
            if you lose access to your authenticator app. Each code can only be
            used once.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 grid grid-cols-2 gap-2">
          {backupCodes.map((code, index) => (
            <div
              key={index}
              className="rounded border p-2 text-center font-mono"
            >
              {code}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={copyBackupCodes}>
            Copy Codes
          </Button>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
