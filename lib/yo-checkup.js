/** Yo-valmennustarkastus — diagnostiset kysymykset (ei myyntikieltä). */

export const YO_CHECKUP_STEPS = [
  {
    id: "timeline",
    badge: "Vaihe 1 · Aikataulu",
    title: "Milloin yo-kokeesi on?",
    subtitle: "Selvitämme ensin aikataulun, jotta suunnitelma vastaa tilannettasi.",
    options: [
      { id: "fall2026", label: "Syksy 2026", hint: "Valmistautuminen on käynnissä tai alkanut." },
      { id: "spring2027", label: "Kevät 2027 tai myöhemmin", hint: "Aikaa on vielä — mutta rytmi kannattaa aloittaa ajoissa." },
      { id: "retake", label: "Yritän uudelleen / lisäkokeet", hint: "Tavoitteena parempi arvosana tai puuttuva aine." },
      { id: "unsure", label: "En ole vielä varma", hint: "Kartoitetaan vaihtoehdot yhdessä suunnitelmassa." },
    ],
  },
  {
    id: "weekly_hours",
    badge: "Vaihe 2 · Rytmi",
    title: "Paljonko ehdit harjoitella viikossa?",
    subtitle: "Realistinen rytmi auttaa arvioimaan, millaista tukea tarvitset.",
    options: [
      { id: "under3", label: "Alle 3 tuntia", hint: "Aikaa on vähän — tehokas rakenne on tärkeää." },
      { id: "3to6", label: "3–6 tuntia", hint: "Hyvä perusta säännölliselle valmistautumiselle." },
      { id: "6to10", label: "6–10 tuntia", hint: "Voit edetä nopeasti, kun suunnitelma on selkeä." },
      { id: "over10", label: "Yli 10 tuntia", hint: "Panostat paljon — tarvitset systemaattisen polun." },
    ],
  },
  {
    id: "current_feeling",
    badge: "Vaihe 3 · Tilanne",
    title: "Miltä valmistautuminen tuntuu nyt?",
    subtitle: "Kerro rehellisesti — tarkastus ei arvostele, vaan kartoittaa.",
    options: [
      { id: "ok", label: "Melko hallussa", hint: "Tarvitsen lähinnä rakennetta ja harjoitusta." },
      { id: "unsure", label: "Epävaralta tuntuu", hint: "En aina tiedä, mistä aloittaa tai mitä harjoitella." },
      { id: "stressed", label: "Stressaavaa", hint: "Aikaa tuntuu olevan liian vähän suhteessa tavoitteeseen." },
      { id: "overwhelmed", label: "Ylivoimaiselta", hint: "Liikaa aineita tai aiheita kerralla." },
    ],
  },
  {
    id: "biggest_blocker",
    badge: "Vaihe 4 · Pullonkaula",
    title: "Mikä hidastaa sinua eniten?",
    subtitle: "Tähän avulla näemme, mihin kohtaan suunnitelmassa kannattaa panostaa.",
    options: [
      { id: "theory", label: "Teoria jää hajanaiseksi", hint: "Tiedän paljon, mutta en osaa yhdistää kokonaisuudeksi." },
      { id: "practice", label: "Liian vähän yo-tyylisiä tehtäviä", hint: "Harjoittelu ei tunnu vastaavan oikeaa koetta." },
      { id: "motivation", label: "Motivaatio tai rytmi pettää", hint: "Aloitan hyvin, mutta en pysy mukana." },
      { id: "time", label: "Ajanpuute tai aikataulu", hint: "En ehdi käydä läpi kaikkea tarpeeksi." },
    ],
  },
];

export function checkupInsightLine(answers = {}) {
  const parts = [];
  const timeline = YO_CHECKUP_STEPS[0].options.find((o) => o.id === answers.timeline);
  const feeling = YO_CHECKUP_STEPS[2].options.find((o) => o.id === answers.current_feeling);
  const blocker = YO_CHECKUP_STEPS[3].options.find((o) => o.id === answers.biggest_blocker);

  if (timeline) parts.push(`Aikataulu: ${timeline.label.toLowerCase()}`);
  if (feeling) parts.push(`Tilanne: ${feeling.label.toLowerCase()}`);
  if (blocker) parts.push(`Pullonkaula: ${blocker.label.toLowerCase()}`);

  return parts.length > 0 ? parts.join(" · ") : null;
}
