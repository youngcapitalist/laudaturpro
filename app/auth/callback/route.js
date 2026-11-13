import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ensureUserProfile } from "../../../lib/profile";
import { NextResponse } from "next/server";

function safeNextPath(raw) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/profiili";
  return raw;
}

function createSupabaseWithResponse(request, redirectPath) {
  const { origin } = new URL(request.url);
  const cookieStore = cookies();
  let response = NextResponse.redirect(`${origin}${redirectPath}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  return { supabase, response };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = safeNextPath(searchParams.get("next"));

  if (!code && !(tokenHash && type)) {
    return NextResponse.redirect(`${new URL(request.url).origin}/kirjaudu?error=auth`);
  }

  const { supabase, response } = createSupabaseWithResponse(request, next);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("auth/callback exchangeCodeForSession:", error.message);
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) await ensureUserProfile(user);
      return response;
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) {
      console.error("auth/callback verifyOtp:", error.message);
      return NextResponse.redirect(`${new URL(request.url).origin}/kirjaudu?error=auth`);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) await ensureUserProfile(user);
    return response;
  }

  return NextResponse.redirect(`${new URL(request.url).origin}/kirjaudu?error=auth`);
}
