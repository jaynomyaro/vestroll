import { z } from "zod";

export const logoutSchema = z
  .object({
    refreshToken: z
      .string()
      .optional()
      .describe(
        "The JWT refresh token to be revoked on the server during logout. When provided, the token is added to the server-side denylist to prevent re-use. Omitting it performs a client-side-only logout.",
      ),
  })
  .describe(
    "Request body for the logout endpoint. Supplying the refreshToken ensures the session is fully invalidated server-side; omitting it only clears the client session.",
  );

export type LogoutInput = z.infer<typeof logoutSchema>;
