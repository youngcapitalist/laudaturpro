/** Asiakaspalautteet, etusivun karuselli (6 kpl, 3 kerrallaan). */

export const TESTIMONIAL_COUNT = 100;

export const TESTIMONIALS = [
  {
    id: "saara",
    name: "Saara K.",
    initials: "SK",
    accent: "from-rose-500 to-pink-700",
    text: "En saanut derivaatoista oikein kiinni lukiossa. Täällä teoria on jaettu osiin, ja AI-professori selitti saman asian uudestaan, kunnes ymmärsin. Se on muuttanut koko matikan puolestani.",
  },
  {
    id: "juho",
    name: "Juho M.",
    initials: "JM",
    accent: "from-blue-500 to-indigo-700",
    text: "Kokeilin ensin kolme ilmaista kysymystä fysiikassa ja tilasin samana iltana. Harjoittelu etenee selkeämmin kuin satunnainen YouTube-selailu, ja tehtävät tuntuvat oikeasti valmistavan kokeeseen.",
  },
  {
    id: "aino",
    name: "Aino V.",
    initials: "AV",
    accent: "from-emerald-500 to-teal-700",
    text: "Testi ehdotti juuri oikeaa pakettia aineilleni. Hinta tuntui reilulta, kun tiesin ettei tarvinnut maksaa turhista kursseista. Sain kaiken tarvitsemani yhdellä maksulla.",
  },
  {
    id: "oskari",
    name: "Oskari T.",
    initials: "OT",
    accent: "from-amber-500 to-orange-700",
    text: "Harkkakoe ennen oikeaa yo-koetta auttoi todella paljon. Tiesin etukäteen, miltä aikaraja tuntuu, ja stressi laski selvästi ennen varsinaista koetta.",
  },
  {
    id: "venla",
    name: "Venla L.",
    initials: "VL",
    accent: "from-violet-500 to-purple-700",
    text: "Kirjoitin sekä äidinkielen että englannin. Sama alusta kaikille aineille, joten ei tarvinnut ostaa useaa eri kurssia. Käytännössä kaikki löytyi samasta paikasta.",
  },
  {
    id: "eeli",
    name: "Eeli N.",
    initials: "EN",
    accent: "from-cyan-500 to-blue-800",
    text: "AI-professori pitkässä matikassa on kuin yksityisopettaja. Pyydän uuden tehtävän aina, kun jään jumiin, enkä jää enää yksin miettimään samaa kohtaa tuntikausia.",
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
