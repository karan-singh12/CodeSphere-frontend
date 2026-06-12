import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Protect projects and workspace routes
  const isProtectedRoute =
    pathname.startsWith("/workspace") || pathname.startsWith("/projects");

  if (isProtectedRoute && !token) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect signed-in users away from auth routes
  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isAuthRoute && token) {
    const projectsUrl = new URL("/projects", request.url);
    return NextResponse.redirect(projectsUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/workspace/:path*",
    "/projects/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
export default proxy;
