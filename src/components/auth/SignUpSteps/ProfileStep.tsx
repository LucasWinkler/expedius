import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { SignUpInput } from "@/lib/validations/auth";
import { AvailabilityInput } from "@/components/ui/availability-input";
import { usernameSchema } from "@/lib/validations/user";

type ProfileStepProps = {
  form: UseFormReturn<SignUpInput>;
  isDisabled: boolean;
};

export const ProfileStep = ({ form, isDisabled }: ProfileStepProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                autoComplete="name"
                placeholder="Enter your full name"
                disabled={isDisabled}
              />
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
              <AvailabilityInput
                form={form}
                field={field}
                schema={usernameSchema}
                type="username"
                placeholder="Choose a username"
                disabled={isDisabled}
              />
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
