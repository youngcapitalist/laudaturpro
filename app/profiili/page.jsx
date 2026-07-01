import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase/server";
import { getProfile } from "../../lib/profile";
import { getAccessibleSubjectIds } from "../../lib/access";
import { LaudaturNav, LaudaturFooter } from "../components/LaudaturChrome";
import ProfileForm from "./ProfileForm";
import { checkoutUrl } from "../config/site";

export const metadata = {
  title: "Profiili — LaudaturPro",
  robots: { index: false },
};

async function getAccessRows(email) {
  const supaUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (!supaUrl || !supaKey) return [];
  const base = supaUrl.replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
  const now = new Date().toISOString();
  const res = await fetch(
    `${base}/rest/v1/laudatur_access?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&access_until=gte.${now}&select=product_id,product_name,access_until&order=access_until.desc`,
    {
      headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}` },
      cache: "no-store",
    }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function ProfiiliPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/kirjaudu?next=/profiili");

  const profile = await getProfile(user.id);
  const accessRows = await getAccessRows(user.email);
  const subjectIds = await getAccessibleSubjectIds(user.email);
  const hasAccess = subjectIds.length > 0;

  return (
    <main className="min-h-screen bg-slate-wash">
      <LaudaturNav />
      <section className="mx-auto max-w-lg px-5 py-14 md:px-8">
        <h1 className="font-heading text-3xl font-extrabold text-navy">Profiili</h1>
        <p className="mt-2 text-sm text-navy/70">Sama tili kuin muissa kursseissasi — kirjautuminen sähköpostilinkillä.</p>

        <div className="mt-8">
          <ProfileForm email={user.email} initialName={profile?.first_name} />
        </div>

        <div className="mt-8 rounded-card border border-line bg-white p-6 shadow-card">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">LaudaturPro-pääsy</p>
          {hasAccess ? (
            <>
              <p className="mt-3 text-sm text-navy/75">Sinulla on aktiivinen kurssipääsy.</p>
              <ul className="mt-4 space-y-2 text-sm text-navy">
                {accessRows.map((row) => (
                  <li key={`${row.product_id}-${row.access_until}`} className="flex justify-between gap-4">
                    <span className="font-semibold">{row.product_name || row.product_id}</span>
                    <span className="text-navy/50">
                      {new Date(row.access_until).toLocaleDateString("fi-FI")}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/kurssi"
                className="mt-6 inline-flex rounded-pill bg-gold px-6 py-3 text-sm font-bold text-navy"
              >
                Avaa kurssit
              </Link>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-navy/75">
                Ei aktiivista tilausta. Kokeile AI-professoria ilmaiseksi tai tilaa kurssi.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/#kurssit" className="rounded-pill border border-line px-5 py-2.5 text-sm font-bold text-navy">
                  Kokeile ainetta
                </Link>
                <a href={checkoutUrl("laudatur-pro")} className="rounded-pill bg-navy px-5 py-2.5 text-sm font-bold text-gold">
                  Tilaa Laudatur Pro
                </a>
              </div>
            </>
          )}
        </div>
      </section>
      <LaudaturFooter />
    </main>
  );
}
