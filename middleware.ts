// middleware.ts
import { NextResponse } from "next/server";
import { verifyToken } from "../src/app/lib/jwt";

export async function middleware(req: Request) {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/admin")) {
    const cookieHeader = req.headers.get("cookie") || "";
    console.log("Middleware sees cookies:", cookieHeader);

    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const payload: any = await verifyToken(token);

    if (!payload?.id) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ✅ Token is valid, let user proceed
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
