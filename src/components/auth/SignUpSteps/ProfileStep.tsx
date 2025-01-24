import { useState, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useWatch } from "react-hook-form";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { checkUsernameAvailability } from "@/server/actions/user";
import { z } from "zod";
import type { UseFormReturn } from "react-hook-form";
import type { SignUpInput } from "@/lib/validations/auth";

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be less than 30 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, underscores and dashes",
  );

type ProfileStepProps = {
  form: UseFormReturn<SignUpInput>;
};

export const ProfileStep = ({ form }: ProfileStepProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const username = useWatch({
    control: form.control,
    name: "username",
    defaultValue: "",
  });

  const checkUsername = useDebouncedCallback(async (value: string) => {
    const validationResult = usernameSchema.safeParse(value);
    if (!validationResult.success) {
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    try {
      const { available } = await checkUsernameAvailability(value);
      setIsAvailable(available);
      if (!available) {
        form.setError("username", {
          message: "Username is already taken",
        });
      }
    } catch {
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, 500);

  useEffect(() => {
    void checkUsername(username);
  }, [username, checkUsername]);

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <div className="relative">
                <Input {...field} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isChecking ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  ) : isAvailable ? (
                    <CheckCircle2 className="size-4 text-green-500" />
                  ) : (
                    <XCircle className="size-4 text-destructive" />
                  )}
                </div>
              </div>
            </FormControl>
            <FormDescription>
              This will be your unique identifier
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
