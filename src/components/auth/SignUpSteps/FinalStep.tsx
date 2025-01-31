import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { FileInput } from "@/components/ui/file-input";
import { Switch } from "@/components/ui/switch";
import type { UseFormReturn } from "react-hook-form";
import type { SignUpInput } from "@/lib/validations/auth";

type FinalStepProps = {
  form: UseFormReturn<SignUpInput>;
  isDisabled: boolean;
};

export const FinalStep = ({ form, isDisabled }: FinalStepProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="image"
        render={({ field: { onChange } }) => (
          <FormItem>
            <FormLabel>Profile Picture (Optional)</FormLabel>
            <FormControl>
              <FileInput
                onChange={(files) => onChange(files)}
                onClear={() => onChange(undefined)}
                disabled={isDisabled}
                variant="square"
              />
            </FormControl>
            <FormDescription>
              Recommended size: 400x400px. Maximum size: 4MB
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isPublic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Visibility</FormLabel>
            <div className="flex items-center justify-between gap-2 rounded-lg border p-4">
              <FormDescription>
                Allow others to view your profile
              </FormDescription>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isDisabled}
                />
              </FormControl>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default FinalStep;
