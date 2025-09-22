import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
const PUBLIC_PATHS = ["/", "/login", "/verify", "/favicon.ico", "/robots.txt"];

export async function middleware(request: NextRequest) {
  // Add your middleware logic here
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p)) return NextResponse.next();

  // hanya proteksi area berikut:
  const protectedPrefixes = ["/space", "/you"];
  const protectedRoute = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (!protectedRoute) return NextResponse.next();

  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets|api).*)"],
};
