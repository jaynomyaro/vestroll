import { z } from "zod";

export const ListTransactionsSchema = z
  .object({
    page: z.coerce
      .number()
      .int()
      .min(1)
      .default(1)
      .describe(
        "1-based page number for paginated results. Defaults to 1 (the first page).",
      ),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .describe(
        "Number of transactions to return per page. Must be between 1 and 100. Defaults to 10.",
      ),
    asset: z
      .string()
      .optional()
      .describe(
        "Filter transactions by asset ticker or identifier (e.g. 'USD', 'USDC', 'BTC'). Omit to return all assets.",
      ),
    status: z
      .enum(["Pending", "Failed", "Successful"])
      .optional()
      .describe(
        "Filter transactions by processing status. 'Pending' = awaiting confirmation; 'Failed' = could not be completed; 'Successful' = fully settled. Omit to return all statuses.",
      ),
    type: z
      .string()
      .optional()
      .describe(
        "Filter transactions by type (e.g. 'payment', 'withdrawal', 'deposit'). Omit to return all types.",
      ),
  })
  .describe(
    "Query parameters for listing transactions with optional filtering by asset, status, and type, plus pagination controls.",
  );

export type ListTransactionsInput = z.infer<typeof ListTransactionsSchema>;
