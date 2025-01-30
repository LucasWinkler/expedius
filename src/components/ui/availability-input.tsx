import { Input } from "@/components/ui/input";
import { useWatch } from "react-hook-form";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { ZodSchema } from "zod";
import type {
  FieldValues,
  Path,
  UseFormReturn,
  PathValue,
  ControllerRenderProps,
} from "react-hook-form";
import {
  AvailabilityType,
  useAvailabilityCheck,
} from "@/hooks/useAvailabilityCheck";
import { useEffect } from "react";

interface AvailabilityInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  field: ControllerRenderProps<T, Path<T>>;
  schema: ZodSchema;
  type: AvailabilityType;
  placeholder?: string;
  initialValue?: string;
  disabled?: boolean;
}

export const AvailabilityInput = <T extends FieldValues>({
  form,
  field,
  schema,
  type,
  placeholder,
  initialValue,
  disabled,
}: AvailabilityInputProps<T>) => {
  const { isChecking, isAvailable, checkAvailability } = useAvailabilityCheck({
    type,
    form,
    fieldName: field.name,
    schema,
    initialValue,
  });

  const value = useWatch({
    control: form.control,
    name: field.name,
    defaultValue: "" as PathValue<T, Path<T>>,
  });

  const { isDirty } = form.getFieldState(field.name);
  const isValid = schema.safeParse(value).success;

  useEffect(() => {
    if (isDirty && isValid && !disabled) {
      void checkAvailability(value as string);
    }
  }, [value, checkAvailability, isDirty, isValid, disabled]);

  return (
    <div className="relative">
      <Input {...field} placeholder={placeholder} disabled={disabled} />
      {isDirty && !disabled && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isChecking ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : isValid && isAvailable ? (
            <CheckCircle2 className="size-4 text-green-500" />
          ) : (
            <XCircle className="size-4 text-destructive" />
          )}
        </div>
      )}
    </div>
  );
};
