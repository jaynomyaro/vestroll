import { z } from "zod";

export const GetEmployeesQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform(Number)
      .pipe(z.number().int().positive("Page must be a positive integer"))
      .describe(
        "1-based page number for paginated results. Passed as a query string and coerced to an integer. Defaults to 1.",
      ),
    limit: z
      .string()
      .optional()
      .default("12")
      .transform(Number)
      .pipe(z.number().int().min(1).max(100, "Limit must be between 1 and 100"))
      .describe(
        "Number of employee records to return per page. Passed as a query string and coerced to an integer. Must be between 1 and 100. Defaults to 12.",
      ),
    search: z
      .string()
      .optional()
      .default("")
      .describe(
        "Free-text search query to filter employees by name or email. Case-insensitive. Defaults to an empty string (no filter).",
      ),
    status: z
      .enum(["Active", "Inactive"])
      .optional()
      .describe(
        "Filter employees by account status. 'Active' = currently employed and able to log in; 'Inactive' = offboarded or suspended. Omit to return all statuses.",
      ),
    type: z
      .enum(["Freelancer", "Contractor"])
      .optional()
      .describe(
        "Filter employees by engagement type. 'Freelancer' = project-based independent worker; 'Contractor' = fixed-term or ongoing contracted worker. Omit to return all types.",
      ),
  })
  .describe(
    "Query parameters for the list-employees endpoint. Supports free-text search, status/type filtering, and pagination.",
  );

export type GetEmployeesQuery = z.infer<typeof GetEmployeesQuerySchema>;
