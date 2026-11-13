import { Suspense } from "react";
import PeruutaClient from "./PeruutaClient";

export default function PeruutaPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-wash flex items-center justify-center">
          <p className="text-navy/70">Ladataan…</p>
        </main>
      }
    >
      <PeruutaClient />
    </Suspense>
  );
}
