import { NextRequest, NextResponse } from "next/server";
import { JWTService } from "@/server/services/jwt.service";
import { updateLastActive } from "@/server/middleware/update-last-active.middleware";

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("access_token")?.value ??
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (token) {
    try {
      const { userId } = JWTService.verifyAccessToken(token);
      updateLastActive(userId);
    } catch {
      // invalid/expired token — let the route handler deal with it
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
