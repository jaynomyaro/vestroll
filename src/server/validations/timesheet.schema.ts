import { z } from "zod";

export const GetTimesheetsQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform(Number)
      .pipe(z.number().int().positive("Page must be a positive integer"))
      .describe(
        "1-based page number for paginated results. Coerced from query string. Defaults to 1.",
      ),
    limit: z
      .string()
      .optional()
      .default("12")
      .transform(Number)
      .pipe(z.number().int().min(1).max(100, "Limit must be between 1 and 100"))
      .describe(
        "Number of timesheet records per page. Coerced from query string. Between 1 and 100. Defaults to 12.",
      ),
    status: z
      .enum(["Pending", "Approved", "Rejected"])
      .optional()
      .describe(
        "Filter by review status. 'Pending' = awaiting manager review; 'Approved' = accepted for payroll; 'Rejected' = sent back for correction. Omit to return all.",
      ),
  })
  .describe(
    "Query parameters for listing timesheets with optional status filtering and pagination.",
  );

export type GetTimesheetsQuery = z.infer<typeof GetTimesheetsQuerySchema>;

export const UpdateTimesheetStatusSchema = z
  .object({
    status: z
      .enum(["approved", "rejected"])
      .describe(
        "New review decision for the timesheet. 'approved' = hours verified and queued for payroll; 'rejected' = hours disputed — employee must revise and resubmit.",
      ),
  })
  .describe(
    "Request body for a manager to approve or reject a submitted timesheet.",
  );

export type UpdateTimesheetStatusInput = z.infer<
  typeof UpdateTimesheetStatusSchema
>;
