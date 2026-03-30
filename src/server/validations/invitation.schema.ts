import { z } from "zod";

export const invitationRoleEnum = z
  .enum(["admin", "hr_manager", "payroll_manager", "employee"])
  .describe(
    "Role granted to the invitee upon accepting the invitation. 'admin' = full platform access including billing and org settings; 'hr_manager' = manage employees, time-off, and contracts; 'payroll_manager' = process payroll and view financial reports; 'employee' = self-service access to payslips, time-off requests, and expenses.",
  );

export const invitationStatusEnum = z
  .enum(["pending", "accepted", "declined", "expired"])
  .describe(
    "Lifecycle status of an invitation. 'pending' = sent but not yet acted on; 'accepted' = invitee completed registration via the invite link; 'declined' = invitee explicitly rejected the invitation; 'expired' = invitation TTL elapsed before the invitee responded.",
  );

export const createInvitationSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .describe(
        "Email address of the person being invited. An invitation email with a unique sign-up link will be sent here.",
      ),
    role: invitationRoleEnum.describe(
      "The role that will be assigned to the invitee's account once they accept and complete registration.",
    ),
    message: z
      .string()
      .optional()
      .describe(
        "Optional personalised message to include in the invitation email body (e.g. a welcome note from the admin).",
      ),
  })
  .describe(
    "Request body for sending a new organisation invitation to an email address.",
  );

export const updateInvitationSchema = z
  .object({
    status: invitationStatusEnum
      .optional()
      .describe(
        "Updated status for the invitation. Typically set server-side; only use this field for admin overrides (e.g. manually expiring a pending invite).",
      ),
    message: z
      .string()
      .optional()
      .describe(
        "Updated message to be stored alongside the invitation record.",
      ),
  })
  .describe(
    "Partial update schema for an existing invitation. All fields are optional.",
  );

export const acceptInvitationSchema = z
  .object({
    token: z
      .string()
      .min(1, "Token is required")
      .describe(
        "Unique invitation token extracted from the invite URL. Single-use and time-limited. Ties the registration to a specific invitation record.",
      ),
    firstName: z
      .string()
      .min(1, "First name is required")
      .describe("Invitee's first name. Used to personalise their account."),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .describe("Invitee's last name. Used to personalise their account."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .describe(
        "Password the invitee chooses for their new account. Must be at least 8 characters. Stored as a bcrypt hash.",
      ),
  })
  .describe(
    "Payload submitted when an invitee accepts an invitation and completes account registration.",
  );

export const declineInvitationSchema = z
  .object({
    token: z
      .string()
      .min(1, "Token is required")
      .describe(
        "Unique invitation token from the invite URL. Used to identify which invitation is being declined.",
      ),
    reason: z
      .string()
      .optional()
      .describe(
        "Optional reason provided by the invitee for declining the invitation. Stored for admin visibility.",
      ),
  })
  .describe(
    "Payload submitted when an invitee explicitly declines an invitation.",
  );

export const resendInvitationSchema = z
  .object({
    invitationId: z
      .string()
      .uuid("Invalid invitation ID")
      .describe(
        "UUID of the invitation to resend. The invitation must be in 'pending' or 'expired' status to be reissued.",
      ),
  })
  .describe(
    "Request body for resending an invitation email. Generates a fresh token and resets the expiry.",
  );

export const listInvitationsSchema = z
  .object({
    status: invitationStatusEnum
      .optional()
      .describe(
        "Filter invitations by their lifecycle status. Omit to return invitations of all statuses.",
      ),
    role: invitationRoleEnum
      .optional()
      .describe(
        "Filter invitations by the role they grant. Omit to return invitations for all roles.",
      ),
    page: z.coerce
      .number()
      .min(1)
      .default(1)
      .describe(
        "1-based page number for paginated results. Defaults to 1.",
      ),
    limit: z.coerce
      .number()
      .min(1)
      .max(100)
      .default(20)
      .describe(
        "Number of invitation records to return per page. Must be between 1 and 100. Defaults to 20.",
      ),
  })
  .describe(
    "Query parameters for listing organisation invitations with optional filtering by status and role, plus pagination controls.",
  );

export const deleteInvitationSchema = z
  .object({
    invitationId: z
      .string()
      .uuid("Invalid invitation ID")
      .describe(
        "UUID of the invitation to permanently delete. Only 'pending' or 'expired' invitations may be deleted; accepted invitations cannot be removed.",
      ),
  })
  .describe(
    "Request body for permanently deleting a pending or expired invitation.",
  );

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type UpdateInvitationInput = z.infer<typeof updateInvitationSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
export type DeclineInvitationInput = z.infer<typeof declineInvitationSchema>;
export type ResendInvitationInput = z.infer<typeof resendInvitationSchema>;
export type ListInvitationsInput = z.infer<typeof listInvitationsSchema>;
export type DeleteInvitationInput = z.infer<typeof deleteInvitationSchema>;
