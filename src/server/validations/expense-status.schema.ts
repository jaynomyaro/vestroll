import { z } from "zod";

const normalizeStatus = (status: string): "Approved" | "Rejected" => {
  return status.toLowerCase() === "approved" ? "Approved" : "Rejected";
};

export const UpdateExpenseStatusSchema = z
  .object({
    status: z
      .string()
      .refine(
        (value) => ["approved", "rejected"].includes(value.toLowerCase()),
        "status must be either Approved or Rejected",
      )
      .transform(normalizeStatus)
      .describe(
        "New status for the expense claim. Accepted values (case-insensitive): 'approved' or 'rejected'. Normalised to title-case ('Approved' / 'Rejected') after validation. 'Approved' = finance team has accepted the claim and it will be included in the next payout; 'Rejected' = claim was denied and will not be paid out.",
      ),
    comment: z
      .string()
      .trim()
      .max(1000, "comment cannot exceed 1000 characters")
      .optional()
      .describe(
        "Optional free-text comment from the reviewer explaining the approval or rejection decision (max 1000 characters). Visible to the employee on their expense detail page.",
      ),
  })
  .describe(
    "Request body for updating the status of a submitted expense claim. The status field is required; a comment is recommended (especially for rejections) but optional.",
  );

export type UpdateExpenseStatusInput = z.infer<typeof UpdateExpenseStatusSchema>;
