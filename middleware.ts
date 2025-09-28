import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  try {
    const supabase = createMiddlewareClient({ req, res });

    // Get current session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.error("Middleware auth error:", error);
    }

    const publicRoutes = ["/", "/login", "/verify", "/splash", "/onboarding"];

    const isPublicRoute = publicRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route),
    );

    if (!session && !isPublicRoute) {
      const redirectUrl = new URL("/splash", req.url);
      console.log("Redirecting unauthenticated user to splash");
      return NextResponse.redirect(redirectUrl);
    }

    if (
      session &&
      (req.nextUrl.pathname === "/login" ||
        req.nextUrl.pathname === "/splash" ||
        req.nextUrl.pathname === "/onboarding")
    ) {
      try {
        const { data: profile } = await supabase
          .from("Profile")
          .select("displayName, username")
          .eq("userId", session.user.id)
          .single();

        if (profile?.displayName && profile?.username) {
          console.log("User has complete profile, redirecting to /space");
          return NextResponse.redirect(new URL("/space", req.url));
        } else {
          if (req.nextUrl.pathname !== "/onboarding") {
            console.log("User profile incomplete, redirecting to /you");
            return NextResponse.redirect(new URL("/you", req.url));
          }
        }
      } catch (profileError) {
        console.error("Error checking profile:", profileError);
      }
    }

    return res;
  } catch (error) {
    console.error("Middleware error:", error);
    return res;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
