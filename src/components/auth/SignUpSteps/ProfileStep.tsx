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

type ProfileStepProps = {
  form: UseFormReturn<SignUpInput>;
};

export const ProfileStep = ({ form }: ProfileStepProps) => {
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
              <Input {...field} />
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
