import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/server/utils/api-response";
import { AppError, ValidationError } from "@/server/utils/errors";
import { AuthUtils } from "@/server/utils/auth";
import { invitationService } from "@/server/services/invitation.service";
import { deleteInvitationSchema } from "@/server/validations/invitation.schema";

/**
 * @swagger
 * /invitations/delete:
 *   delete:
 *     summary: Delete organization invitation
 *     description: Delete an invitation (cannot delete accepted invitations)
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
 *                 description: ID of the invitation to delete
 *     responses:
 *       200:
 *         description: Invitation deleted successfully
 *       400:
 *         description: Cannot delete accepted invitations
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Invitation not found
 */
export async function DELETE(req: NextRequest) {
  try {
    const { user } = await AuthUtils.authenticateRequest(req);

    if (!user.organizationId) {
      throw new AppError("User not associated with an organization", 403);
    }

    const body = await req.json();
    const validatedBody = deleteInvitationSchema.safeParse(body);

    if (!validatedBody.success) {
      throw new ValidationError(
        "Invalid request body",
        validatedBody.error.flatten().fieldErrors as Record<string, unknown>,
      );
    }

    await invitationService.deleteInvitation(validatedBody.data.invitationId);

    return ApiResponse.success(
      { message: "Invitation deleted successfully" },
      "Invitation deleted successfully"
    );
  } catch (error) {
    if (error instanceof AppError) {
      return ApiResponse.error(error.message, error.statusCode, error.errors);
    }

    console.error("[Delete Invitation Error]", error);
    return ApiResponse.error("Internal server error", 500);
  }
}
