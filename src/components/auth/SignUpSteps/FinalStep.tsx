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
  isUploading: boolean;
};

export const FinalStep = ({ form, isUploading }: FinalStepProps) => {
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
                disabled={isUploading}
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
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Public Profile</FormLabel>
              <FormDescription>
                Allow others to view your profile and public lists
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isUploading}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default FinalStep;
