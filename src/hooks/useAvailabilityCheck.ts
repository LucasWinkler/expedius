import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import type { ZodSchema } from "zod";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type AvailabilityType = "username" | "list/name";

interface UseAvailabilityCheckOptions<T extends FieldValues> {
  type: AvailabilityType;
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  schema: ZodSchema;
  debounceMs?: number;
  initialValue?: string;
}

export const useAvailabilityCheck = <T extends FieldValues>({
  type,
  form,
  fieldName,
  schema,
  debounceMs = 500,
  initialValue,
}: UseAvailabilityCheckOptions<T>) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkAvailability = useDebouncedCallback(async (value: string) => {
    if (value === initialValue) {
      setIsAvailable(true);
      form.clearErrors(fieldName);
      return;
    }

    const validation = schema.safeParse(value);
    if (!validation.success) {
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch(
        `/api/check/${type}?${type === "username" ? "username" : "name"}=${value}`,
      );
      const data = await response.json();
      setIsAvailable(data.available);

      if (!data.available) {
        const label = type === "username" ? "Username" : "List name";
        form.setError(fieldName, { message: `${label} is already taken` });
      } else {
        form.clearErrors(fieldName);
      }
    } catch {
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, debounceMs);

  return {
    isChecking,
    isAvailable,
    checkAvailability,
  };
};
