import { z } from "zod";

export const refreshSchema = z
  .object({
    refreshToken: z
      .string()
      .min(1, "Refresh token cannot be empty")
      .describe(
        "A valid, non-expired JWT refresh token previously issued by the server. Exchanged for a new access token / refresh token pair. Invalidated after use (token rotation).",
      ),
  })
  .describe(
    "Request body for refreshing an access token. The supplied refreshToken must not be expired or already revoked.",
  );

export type RefreshInput = z.infer<typeof refreshSchema>;
