import { betterAuth } from "better-auth";
import { authConfig } from "@/server/auth/config";

export const auth = betterAuth(authConfig);
