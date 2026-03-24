import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/server/utils/api-response";
import { AppError, ValidationError } from "@/server/utils/errors";
import { AuthUtils } from "@/server/utils/auth";
import { invitationService } from "@/server/services/invitation.service";
import { resendInvitationSchema } from "@/server/validations/invitation.schema";

/**
 * @swagger
 * /invitations/resend:
 *   post:
 *     summary: Resend organization invitation
 *     description: Resend an existing invitation with a new token and extended expiry
 *     tags: [Invitations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invitationId
 *             properties:
 *               invitationId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the invitation to resend
 *     responses:
 *       200:
 *         description: Invitation resent successfully
 *       400:
 *         description: Invalid request body or invitation status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Invitation not found
 */
export async function POST(req: NextRequest) {
  try {
    const { user } = await AuthUtils.authenticateRequest(req);

    if (!user.organizationId) {
      throw new AppError("User not associated with an organization", 403);
    }

    const body = await req.json();
    const validatedBody = resendInvitationSchema.safeParse(body);

    if (!validatedBody.success) {
      throw new ValidationError(
        "Invalid request body",
        validatedBody.error.flatten().fieldErrors as Record<string, unknown>,
      );
    }

    await invitationService.resendInvitation(validatedBody.data.invitationId);

    return ApiResponse.success(
      { message: "Invitation resent successfully" },
      "Invitation resent successfully"
    );
  } catch (error) {
    if (error instanceof AppError) {
      return ApiResponse.error(error.message, error.statusCode, error.errors);
    }

    console.error("[Resend Invitation Error]", error);
    return ApiResponse.error("Internal server error", 500);
  }
}
