import { z } from "zod";

export const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export type PasswordFormValues = z.infer<typeof passwordSchema>;

export const codeSchema = z.object({
  code: z
    .string()
    .min(6, "Code must be at least 6 characters")
    .max(6, "Code must be 6 characters"),
});

export type CodeFormValues = z.infer<typeof codeSchema>;

export interface EnableTwoFactorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEnable: (data: PasswordFormValues) => Promise<void>;
  isLoading: boolean;
}

export interface QrCodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  qrCodeUrl: string | null;
  onVerify: (data: CodeFormValues, trustDevice: boolean) => Promise<void>;
  isLoading: boolean;
}

export interface BackupCodesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  backupCodes: string[];
  is2FAEnabled: boolean;
}

export interface DisableTwoFactorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDisable: (data: PasswordFormValues) => Promise<void>;
  isLoading: boolean;
}
