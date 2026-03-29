import { NextRequest, NextResponse } from "next/server";
import { JWTService } from "@/server/services/jwt.service";

export async function middleware(req: NextRequest) {
  const token =
    req.cookies.get("access_token")?.value ??
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (token) {
    try {
      await JWTService.verifyAccessToken(token);
      // Removed updateLastActive(userId) because it uses standard PG driver which is not edge-compatible.
    } catch {
      // invalid/expired token — let the route handler deal with it
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
