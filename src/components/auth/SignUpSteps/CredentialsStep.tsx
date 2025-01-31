import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useWatch } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { SignUpInput } from "@/lib/validations/auth";
import { PasswordRequirements } from "./PasswordRequirements";

type CredentialsStepProps = {
  form: UseFormReturn<SignUpInput>;
  isDisabled: boolean;
};

export const CredentialsStep = ({ form, isDisabled }: CredentialsStepProps) => {
  const password = useWatch({
    control: form.control,
    name: "password",
    defaultValue: "",
  });

  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                disabled={isDisabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <PasswordInput
                {...field}
                autoComplete="new-password"
                placeholder="Create a password"
                disabled={isDisabled}
              />
            </FormControl>
            <PasswordRequirements password={password} />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <PasswordInput
                {...field}
                autoComplete="new-password"
                placeholder="Confirm your password"
                disabled={isDisabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
