/** Asiakaspalautteet, etusivun karuselli (5 kpl, 3 kerrallaan). */

export const TESTIMONIAL_COUNT = 100;

export const TESTIMONIALS = [
  {
    id: "juho",
    name: "Juho M.",
    initials: "JM",
    accent: "from-blue-500 to-indigo-700",
    text: "Toimi hyvin koulun materiaalin lisänä. Kirjan tehtävien loputtua täältä löytyi lisää yo-tasoista treeniä.",
  },
  {
    id: "elias",
    name: "Elias R.",
    initials: "ER",
    accent: "from-cyan-500 to-blue-800",
    text: "Kertausharjoitukset oli just sopivan haastavia. Matikka parani selvästi. Suosittelen.",
  },
  {
    id: "emma",
    name: "Emma T.",
    initials: "ET",
    accent: "from-rose-500 to-pink-700",
    text: "Hyvä paketti syksyn yo-kirjoituksiin. Sai tarvittavan treenin ennen kokeita.",
  },
  {
    id: "aino",
    name: "Aino K.",
    initials: "AK",
    accent: "from-emerald-500 to-teal-700",
    text: "Selkeät selitykset ja hyvät tehtävät. Hinta-laatusuhde erinomainen. Pääsin tavoitteeseen kevään 2026 kokeissa.",
  },
  {
    id: "saara",
    name: "Saara L.",
    initials: "SL",
    accent: "from-violet-500 to-purple-700",
    text: "Kätevä kun kaikki aineet samassa paikassa. Matikka ja fysiikka parani selvästi. Hyvä treeni yo-kokeisiin.",
  },
];

/** Näytettävät kortit per sivu (desktop). */
export const TESTIMONIALS_PER_PAGE = 3;

export function testimonialPages(items = TESTIMONIALS, perPage = TESTIMONIALS_PER_PAGE) {
  const pages = [];
  for (let i = 0; i < items.length; i += perPage) {
    pages.push(items.slice(i, i + perPage));
  }
  return pages;
}
