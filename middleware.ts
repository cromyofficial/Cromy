import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

const ADMIN_LOGIN_PATH = "/admin/login";

async function isValidAdminToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) return false;
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export default clerkMiddleware(async (_auth, req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== ADMIN_LOGIN_PATH) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !(await isValidAdminToken(token))) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = ADMIN_LOGIN_PATH;
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
