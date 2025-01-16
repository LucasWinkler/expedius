import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { FileInput } from "@/components/ui/file-input";
import type { UseFormReturn } from "react-hook-form";
import type { SignUpInput } from "@/lib/validations/auth";

type ImageStepProps = {
  form: UseFormReturn<SignUpInput>;
  isUploading: boolean;
};

export const ImageStep = ({ form, isUploading }: ImageStepProps) => {
  return (
    <FormField
      control={form.control}
      name="image"
      render={({ field: { onChange } }) => (
        <FormItem>
          <FormLabel>Profile Image (Optional)</FormLabel>
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
  );
};
