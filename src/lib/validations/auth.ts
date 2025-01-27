import {
  maxNameLength,
  maxUsernameLength,
  minNameLength,
  minPasswordLength,
  minUsernameLength,
} from "@/constants";
import { z } from "zod";

const passwordSchema = z
  .string()
  .trim()
  .min(
    minPasswordLength,
    `Password must be at least ${minPasswordLength} characters`,
  )
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const signUpSchema = z
  .object({
    email: z.string().trim().email("Please enter a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string().trim().min(1, "Please confirm your password"),
    name: z
      .string()
      .trim()
      .min(minNameLength, `Name must be at least ${minNameLength} characters`)
      .max(maxNameLength, `Name must be less than ${maxNameLength} characters`),
    username: z
      .string()
      .trim()
      .min(
        minUsernameLength,
        `Username must be at least ${minUsernameLength} characters`,
      )
      .max(
        maxUsernameLength,
        `Username must be less than ${maxUsernameLength} characters`,
      )
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores and dashes",
      ),
    image: z
      .custom<File[]>()
      .optional()
      .refine(
        (files) => {
          if (!files?.[0]) return true;
          return files[0].size <= 4 * 1024 * 1024;
        },
        {
          message: "Image must be less than 4MB",
        },
      ),
    isPublic: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().trim().min(1, "Please enter your password"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
