/** Admin-sähköpostit pilkulla eroteltuna env-muuttujassa. */
export function adminEmails() {
  const raw = process.env.LAUDATUR_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}
