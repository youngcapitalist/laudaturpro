import { Suspense } from "react";
import KiitosClient from "./KiitosClient";

export const metadata = {
  title: "Kiitos tilauksesta — LaudaturPro.fi",
};

export default function KiitosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-wash" />}>
      <KiitosClient />
    </Suspense>
  );
}
