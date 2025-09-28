import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicRoutes = ["/", "/login", "/verify", "/splash", "/onboarding"];

  const isPublicRoute = publicRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );

  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/splash", req.url));
  }

  if (
    user &&
    (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/splash")
  ) {
    const { data: profile } = await supabase
      .from("Profile")
      .select("display_name, username")
      .eq("id", user.id)
      .single();

    if (profile?.display_name && profile?.username) {
      return NextResponse.redirect(new URL("/space", req.url));
    } else {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
