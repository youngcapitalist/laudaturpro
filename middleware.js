import { NextResponse } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/" && request.nextUrl.searchParams.get("utm_source") === "paasykoe") {
    const url = request.nextUrl.clone();
    url.pathname = "/aloita";
    return NextResponse.redirect(url);
  }

  const response = await updateSession(request);

  const needsAuth = pathname.startsWith("/kurssi") || pathname === "/profiili" || pathname.startsWith("/admin");
  if (!needsAuth) return response;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return response;

  const { createServerClient } = await import("@supabase/ssr");
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value;
      },
      set() {},
      remove() {},
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/kirjaudu";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/", "/kurssi/:path*", "/profiili", "/admin/:path*"],
};
