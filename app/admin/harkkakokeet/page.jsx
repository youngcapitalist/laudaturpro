import Link from "next/link";
import { requireAdmin } from "../../../lib/require-admin";
import AdminHarkkakokeetClient from "./AdminHarkkakokeetClient";

export const metadata = {
  title: "Harkkakokeiden arviointi | LaudaturPro Admin",
};

export default async function AdminHarkkakokeetPage() {
  const { user } = await requireAdmin();

  return (
    <main className="min-h-screen bg-slate-wash">
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-site px-6 py-4 md:px-8">
          <Link href="/kurssi" className="text-xs font-semibold text-navy/50 hover:text-navy">
            ← Takaisin kurssille
          </Link>
          <h1 className="mt-2 font-heading text-2xl font-extrabold text-navy">Harkkakokeiden arviointi</h1>
          <p className="mt-1 text-sm text-navy/65">
            Kirjautuneena: {user.email}. Arvioi opiskelijoiden vastaukset ja lähetä pisteet + kommentti.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-8">
        <AdminHarkkakokeetClient />
      </div>
    </main>
  );
}
