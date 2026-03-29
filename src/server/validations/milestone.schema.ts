import { z } from "zod";

export const updateMilestoneStatusSchema = z
  .object({
    status: z
      .enum(["pending", "in_progress", "completed", "approved", "rejected"])
      .describe(
        "New status for the milestone. State meanings: 'pending' = not yet started; 'in_progress' = actively being worked on; 'completed' = work is done and submitted for review; 'approved' = reviewer has accepted the deliverable and payment can be released; 'rejected' = reviewer has rejected the deliverable — a reason must be provided.",
      ),
    reason: z
      .string()
      .optional()
      .describe(
        "Explanation for the status change. Required when status is 'rejected' so the contractor understands what needs to be corrected. Optional for all other status transitions.",
      ),
  })
  .refine(
    (data) => {
      if (data.status === "rejected" && !data.reason) {
        return false;
      }
      return true;
    },
    {
      message: "Reason is required when status is Rejected",
      path: ["reason"],
    },
  )
  .describe(
    "Request body for updating a contract milestone's status. A reason is mandatory when rejecting a milestone; optional for all other transitions.",
  );

export type UpdateMilestoneStatusInput = z.infer<
  typeof updateMilestoneStatusSchema
>;
