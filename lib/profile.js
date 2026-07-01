async function adminFetch(path, options = {}) {
  const supaUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (!supaUrl || !supaKey) return null;
  const base = supaUrl.replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
  const res = await fetch(`${base}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supaKey,
      Authorization: `Bearer ${supaKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) return null;
  if (res.status === 204) return true;
  return res.json();
}

/** Luo profiles-rivi jos puuttuu (jaettu Supabase muiden kurssien kanssa). */
export async function ensureUserProfile(user) {
  if (!user?.id) return;
  const existing = await adminFetch(`profiles?user_id=eq.${user.id}&select=user_id&limit=1`);
  if (Array.isArray(existing) && existing.length > 0) return;

  await adminFetch("profiles", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      user_id: user.id,
      free_questions_used: 0,
      first_name: user.user_metadata?.first_name || null,
    }),
  });
}

export async function getProfile(userId) {
  const rows = await adminFetch(`profiles?user_id=eq.${userId}&select=first_name,subscription_tier&limit=1`);
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

export async function updateProfileName(userId, firstName) {
  const name = typeof firstName === "string" ? firstName.trim() : "";
  const updated = await adminFetch(`profiles?user_id=eq.${userId}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ first_name: name || null }),
  });
  if (!updated) {
    await adminFetch("profiles", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ user_id: userId, first_name: name || null, free_questions_used: 0 }),
    });
  }
}
