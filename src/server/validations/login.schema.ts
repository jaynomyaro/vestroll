import { z } from "zod";

export const LoginSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email format")
      .trim()
      .toLowerCase()
      .describe(
        "Registered email address of the user. Automatically trimmed and lower-cased before lookup. Used as the primary account identifier.",
      ),
    password: z
      .string()
      .min(1, "Password is required")
      .describe(
        "Account password. Compared against the stored bcrypt hash. Must be non-empty.",
      ),
    rememberMe: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "When true, the server issues a long-lived refresh token (e.g. 30 days) instead of the default short-lived one (e.g. 24 hours). Defaults to false.",
      ),
  })
  .describe(
    "Request body for the email/password login endpoint. On success the server returns a short-lived access token and a refresh token.",
  );

export type LoginInput = z.infer<typeof LoginSchema>;
