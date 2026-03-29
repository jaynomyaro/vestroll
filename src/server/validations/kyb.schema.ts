import { z } from "zod";

const VALID_REGISTRATION_TYPES = [
  "Limited Liability Company (LLC)",
  "Corporation",
  "Partnership",
  "Sole Proprietorship",
  "Limited Partnership (LP)",
  "Limited Liability Partnership (LLP)",
  "S Corporation",
  "Non-Profit Corporation",
  "Professional Corporation",
  "Other",
] as const;

export const KybSubmitSchema = z
  .object({
    registrationType: z
      .enum(VALID_REGISTRATION_TYPES, {
        message: "Invalid business registration type",
      })
      .describe(
        "Legal structure of the business being verified. Determines applicable KYB compliance rules and document requirements. Accepted values: 'Limited Liability Company (LLC)', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Limited Partnership (LP)', 'Limited Liability Partnership (LLP)', 'S Corporation', 'Non-Profit Corporation', 'Professional Corporation', 'Other'.",
      ),
    registrationNo: z
      .string()
      .min(1, "Registration number is required")
      .max(100, "Registration number is too long")
      .trim()
      .regex(
        /^[A-Z0-9][A-Z0-9\-\/]{1,98}[A-Z0-9]$/i,
        "Registration number must contain only letters, numbers, hyphens, or slashes (e.g. 12345678, AB-123456)",
      )
      .describe(
        "Official registration number issued by the government authority that incorporated the business (e.g. Companies House number, EIN, CRN). Letters, digits, hyphens, and slashes only. Max 100 characters.",
      ),
  })
  .describe(
    "Know Your Business (KYB) submission payload. Captures the business's legal structure and official registration number for identity verification. Supporting documents (certificate of incorporation, etc.) are uploaded separately via multipart form.",
  );

export type KybSubmitInput = z.infer<typeof KybSubmitSchema>;

export const KYB_FILE_CONSTRAINTS = {
  maxSizeBytes: 5 * 1024 * 1024,
  allowedMimeTypes: [
    "image/png",
    "image/jpeg",
    "image/svg+xml",
    "image/gif",
    "application/pdf",
  ],
} as const;
