import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/server/utils/api-response";
import { AppError, ValidationError } from "@/server/utils/errors";
import { invitationService } from "@/server/services/invitation.service";
import { declineInvitationSchema } from "@/server/validations/invitation.schema";

/**
 * @swagger
 * /invitations/decline:
 *   post:
 *     summary: Decline organization invitation
 *     description: Decline an invitation to join an organization
 *     tags: [Invitations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Invitation token from email
 *               reason:
 *                 type: string
 *                 description: Optional reason for declining
 *     responses:
 *       200:
 *         description: Invitation declined successfully
 *       400:
 *         description: Invalid request body or invitation
 *       404:
 *         description: Invalid invitation token
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = declineInvitationSchema.safeParse(body);

    if (!validatedBody.success) {
      throw new ValidationError(
        "Invalid request body",
        validatedBody.error.flatten().fieldErrors as Record<string, unknown>,
      );
    }

    await invitationService.declineInvitation(
      validatedBody.data.token,
      validatedBody.data.reason
    );

    return ApiResponse.success(
      { message: "Invitation declined successfully" },
      "Invitation declined successfully"
    );
  } catch (error) {
    if (error instanceof AppError) {
      return ApiResponse.error(error.message, error.statusCode, error.errors);
    }

    console.error("[Decline Invitation Error]", error);
    return ApiResponse.error("Internal server error", 500);
  }
}
