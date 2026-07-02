import { redirect } from "next/navigation";

/** Vanha polku → quiz-first -alasivu (säilyttää UTM-parametrit). */
export default function TestiRedirectPage({ searchParams }) {
  const q = new URLSearchParams(
    Object.entries(searchParams || {}).flatMap(([k, v]) =>
      Array.isArray(v) ? v.map((item) => [k, item]) : [[k, v]]
    )
  ).toString();
  redirect(q ? `/aloita?${q}` : "/aloita");
}
