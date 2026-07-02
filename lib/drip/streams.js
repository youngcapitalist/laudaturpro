/** Follow-up -sekvenssit per tuote/koe. Vaihe 0 = heti quiz-jälkeen (erillinen posti). */

function quizRecap(p) {
  const parts = [
    (p.selectedLabels || []).length ? `kirjoitat: <strong>${p.selectedLabels.join(", ")}</strong>` : null,
    (p.retakeLabels || []).length ? `korotat: <strong>${p.retakeLabels.join(", ")}</strong>` : null,
    p.gradeLabel ? `kurssikeskiarvosi on <strong>${p.gradeLabel}</strong>` : null,
    p.goalLabel ? `tavoitteesi on <strong>${p.goalLabel.toLowerCase()}</strong>` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

export const DRIP_STREAMS = {
  laudaturpro: {
    id: "laudaturpro",
    brand: "LaudaturPro",
    siteUrl: "https://laudaturpro.fi",
    fromName: "LaudaturPro",
    steps: [
      // 1. Vastavuoroisuus + sitoutuminen: ilmaista arvoa ja omat vastaukset takaisin.
      {
        delayHours: 24,
        subject: (p) => `${p.personalTitle || "Yo-suunnitelmasi"} — 3 vinkkiä ensimmäiseen viikkoon`,
        headline: "Suunnitelmasi on valmis — tässä ilmaiset ensiaskeleet",
        body: (p) => {
          const recap = quizRecap(p);
          return (
            (recap
              ? `Kerroit tarkastuksessa, että ${recap}. Suunnitelmasi on rakennettu juuri näiden vastausten pohjalta — ei kenellekään muulle.<br><br>`
              : "Suunnitelmasi on rakennettu quiz-vastaustesi pohjalta — ei kenellekään muulle.<br><br>") +
            `Riippumatta siitä tilaatko mitään, tässä kolme vinkkiä, jotka toimivat heti:<br><br>` +
            `<strong>1.</strong> Aloita heikoimmasta aineesta — se tuottaa eniten pisteitä per käytetty tunti.<br>` +
            `<strong>2.</strong> Tee joka viikko vähintään yksi yo-tyylinen tehtävä aikapaineessa. Koe mittaa rutiinia, ei vain tietoa.<br>` +
            `<strong>3.</strong> Kertaa väärin menneet tehtävät 2–3 päivän päästä uudelleen — virheiden korjaus jää muistiin vahvimmin.`
          );
        },
        bullets: [
          "Teoria osa-alueittain YTL:n koerakenteen mukaan",
          "AI-professori jokaisessa aineessa, 24/7",
          "Harjoittelu selittävällä palautteella + kertausjono virheille",
          "Harkkakoe opettajan arviolla ennen oikeaa koetta",
        ],
        urgency: (p) =>
          p.priceEur
            ? `Henkilökohtainen hintasi ${p.priceEur} € on sidottu vastauksiisi — sitä ei näe kukaan muu, eikä se ole julkisesti saatavilla.`
            : null,
        cta: "Avaa minun suunnitelmani",
      },
      // 2. Johdonmukaisuus + auktoriteetti: oma tavoite ja YTL:n aikataulu.
      {
        delayHours: 48,
        subject: (p) =>
          p.goalLabel
            ? `Tavoitteesi: ${p.goalLabel.toLowerCase()} — suunnitelmasi on yhä varattuna`
            : "Suunnitelmasi on yhä varattuna sinulle",
        headline: "Sinä asetit tavoitteen — me rakensimme reitin",
        body: (p) => {
          const goal = p.goalLabel ? `<strong>${p.goalLabel.toLowerCase()}</strong>` : "parempi yo-tulos";
          return (
            `Tarkastuksessa kerroit, että tavoitteesi on ${goal}. Se ei toteudu itsestään — mutta se toteutuu suunnitelmalla, ` +
            `joka on mitoitettu lähtötasoosi ja aikatauluusi.<br><br>` +
            `Syksyn 2026 yo-koepäivät on jo vahvistettu (kokeet 14.–30.9.). Jokainen viikko ilman rakennetta on viikko, ` +
            `jonka kilpahakijat käyttävät harjoitteluun. Suunnitelmasi jakaa jäljellä olevan ajan viikkorytmiin: ` +
            `teoria → harjoittelu → harkkakoe — samassa järjestyksessä kuin YTL:n koe etenee.`
          );
        },
        bullets: [
          "Hinta perustuu quiz-vastauksiisi — et saa samaa hintaa uudelleen",
          "Aloitat heti maksun jälkeen, ei odottelua",
          "Kaikki aineesi samassa paikassa — ei useita tilauksia",
        ],
        urgency: (p) =>
          p.priceEur
            ? `⚠️ Henkilökohtainen ${p.priceEur} € -hintasi on voimassa rajoitetun ajan. Kun tarjousikkuna sulkeutuu, palaat listahintaan.`
            : "Tarjous on voimassa rajoitetun ajan.",
        cta: "Lunasta tarjoukseni",
      },
      // 3. Sosiaalinen todiste + mieltymys: samassa tilanteessa olevat.
      {
        delayHours: 96,
        subject: (p) =>
          (p.selectedLabels || []).length
            ? `Näin muut valmistautuvat samoihin kokeisiin (${p.selectedLabels[0].split(",")[0]})`
            : "Miten muut abit valmistautuvat syksyn kokeisiin?",
        headline: "Et ole ainoa, joka tähtää korkealle",
        body: (p) => {
          const savings =
            p.listPriceEur && p.priceEur && p.listPriceEur > p.priceEur ? p.listPriceEur - p.priceEur : null;
          const subjects = (p.selectedLabels || []).join(", ");
          return (
            (subjects
              ? `Samoja aineita (${subjects}) kirjoittavat opiskelijat valitsevat useimmin henkilökohtaisen paketin — `
              : "Useimmat tavoitteelliset abit valitsevat henkilökohtaisen paketin — ") +
            `syy on yksinkertainen: hajanainen materiaalin keräily ei tuota samaa tulosta kuin yksi rakennettu polku.<br><br>` +
            `Tyypillinen kuvio, jonka näemme: ensimmäisellä viikolla edistymispalkit näyttävät heikoimmat osa-alueet, ` +
            `toisella viikolla kertausjono alkaa tyhjentyä, ja harkkakokeen arvosanaestimaatti kertoo missä mennään — ` +
            `ennen kuin oikea koe sen kertoo puolestasi.<br><br>` +
            (savings
              ? `Paketissasi säästät <strong>${savings} €</strong> verrattuna aineiden ostamiseen erikseen.`
              : "")
          );
        },
        bullets: [
          "AI-professori selittää, missä menit pieleen — ei vain oikeaa vastausta",
          "Arvosanaestimaatti harkkakokeesta ennen oikeaa yo-koetta",
          "Edistymisen seuranta osa-alueittain — näet mihin aika kannattaa käyttää",
        ],
        urgency: () =>
          "Henkilökohtainen hintasi on voimassa enää rajoitetun ajan — seuraava viestimme on viimeinen.",
        cta: "Katso minun tarjoukseni",
      },
      // 4. Niukkuus: viimeinen viesti + kertaluonteinen alennus henkilökohtaisesta hinnasta.
      {
        delayHours: 168,
        rescueDiscount: 0.33,
        subject: (p) =>
          p.rescuePriceEur
            ? `Viimeinen viesti: -${p.rescuePct} % suunnitelmastasi (${p.rescuePriceEur} €)`
            : `Viimeinen muistutus — ${p.priceEur} € (tänään)`,
        headline: "Suljemme suunnitelmasi — viimeinen tarjous",
        body: (p) =>
          p.rescuePriceEur
            ? `Tämä on viimeinen viestimme — sen jälkeen suunnitelmasi ja hintasi poistuvat.<br><br>` +
              `Koska teit tarkastuksen loppuun asti, annamme kertaluonteisen <strong>-${p.rescuePct} %</strong> alennuksen ` +
              `henkilökohtaisesta hinnastasi: <strong>${p.rescuePriceEur} €</strong> (aiemmin ${p.originalPriceEur} €). ` +
              `Tätä hintaa ei saa mistään muualta, eikä sitä toisteta.<br><br>` +
              `Linkki on voimassa 7 päivää — sen jälkeen se lakkaa toimimasta ja palaat listahintaan.`
            : `Tämä on viimeinen muistutuksemme henkilökohtaisesta tarjouksestasi.<br><br>` +
              `Hintasi <strong>${p.priceEur} €</strong> perustuu testissä tekemiisi valintoihin. ` +
              `Kun suljemme tarjousikkunan, et voi enää lunastaa samaa hintaa samoilla valinnoilla.`,
        bullets: [
          "Maksat kerran — pääsy syksyn 2026 yo-kokeisiin asti",
          "Aloitat heti maksun jälkeen",
          "Peru markkinointi yhdellä klikkauksella — emme lähetä enempää viestejä",
        ],
        urgency: (p) =>
          p.rescuePriceEur
            ? `🔴 Kertaluonteinen ${p.rescuePriceEur} € -hinta on voimassa 7 päivää. Tämän jälkeen linkki ei enää toimi, emmekä lähetä uutta tarjousta.`
            : `🔴 Viimeinen mahdollisuus: ${p.priceEur} € tarjouksesi vanhenee. Tämän jälkeen linkki ei enää toimi samalla hinnalla.`,
        cta: (p) => (p.rescuePriceEur ? `Lunasta -${p.rescuePct} % nyt` : "Siirry kassalle nyt"),
      },
    ],
  },
  valintakoe_a: {
    id: "valintakoe_a",
    brand: "ValintakoeAPro",
    siteUrl: "https://valintakoea.fi",
    fromName: "Valintakoe A Pro",
    steps: valintakoeSteps("A", "tekniikkaa ja luonnontieteitä"),
  },
  valintakoe_b: {
    id: "valintakoe_b",
    brand: "ValintakoeBPro",
    siteUrl: "https://valintakoeb.fi",
    fromName: "Valintakoe B Pro",
    steps: valintakoeSteps("B", "lääke- ja terveystieteitä"),
  },
  valintakoe_c: {
    id: "valintakoe_c",
    brand: "ValintakoeCPro",
    siteUrl: "https://valintakoec.fi",
    fromName: "Valintakoe C Pro",
    steps: valintakoeSteps("C", "biologiaa ja ympäristötieteitä"),
  },
  valintakoe_e: {
    id: "valintakoe_e",
    brand: "ValintakoeEPro",
    siteUrl: "https://valintakoee.fi",
    fromName: "Valintakoe E Pro",
    steps: valintakoeSteps("E", "kasvatusalaa"),
  },
  valintakoe_f: {
    id: "valintakoe_f",
    brand: "ValintakoeFPro",
    siteUrl: "https://valintakoefpro.com",
    fromName: "Valintakoe F Pro",
    steps: valintakoeSteps("F", "kauppatieteitä"),
  },
};

function valintakoeSteps(code, fieldLabel) {
  return [
    {
      delayHours: 24,
      subject: (p) => `Valintakoe ${code} — suunnitelmasi (${p.priceEur || ""} €)`.trim(),
      headline: "Näin aloitat valmistautumisen",
      body: (p) =>
        `Testisi perusteella rakennettu valmennus kohti <strong>${fieldLabel}</strong> odottaa. ` +
        `Valintakoe ${code} on kilpailtu — systemaattinen harjoittelu erottaa hakijat, jotka pääsevät ensimmäisellä yrityksellä.<br><br>` +
        `Aloita teoriasta, siirry AI-professorin kanssa harjoittelemaan ja tee simuloituja kokeita oikeaan tempoan.`,
      bullets: (p) => [
        "Teoria ja harjoituskokeet samassa alustassa",
        "AI-professorit kehityskohteisiin",
        p?.priceEur ? `Henkilökohtainen hinta ${p.priceEur} €` : "Henkilökohtainen quiz-pohjainen hinta",
      ],
      urgency: (p) => (p.priceEur ? `Tarjouksesi ${p.priceEur} € perustuu testivastauksiisi.` : null),
      cta: "Avaa minun suunnitelmani",
    },
    {
      delayHours: 48,
      subject: (p) => `Tarjouksesi ${p.priceEur || ""} € vanhenee pian — Valintakoe ${code}`.trim(),
      headline: "Tarjous ei ole ikuisesti voimassa",
      body: () =>
        "Moni hakija odottaa liian kauan ennen kuin aloittaa valmistautumisen. " +
        "Valintakoe mittaa systemaattisuutta — ja sitä voi treenata, jos aloitat ajoissa.<br><br>" +
        "Henkilökohtainen hintasi perustuu testissä antamiisi vastauksiin. Et näe samaa hintaa uudelleen, jos suunnitelma poistuu.",
      bullets: [
        "Harjoituskokeet oikeaan koetilanteeseen",
        "Selkeä etenemispolku viikko kerrallaan",
        "Peru markkinointi yhdellä klikkauksella",
      ],
      urgency: (p) =>
        p.priceEur ? `⚠️ ${p.priceEur} € -hintasi sidottu testiin — lunasta ennen kuin se vanhenee.` : null,
      cta: "Lunasta tarjoukseni",
    },
    {
      delayHours: 96,
      subject: () => `Miksi Valintakoe ${code} -valmennus toimii?`,
      headline: "Harjoittele oikeita asioita",
      body: (p) => {
        const savings =
          p.listPriceEur && p.priceEur && p.listPriceEur > p.priceEur ? p.listPriceEur - p.priceEur : null;
        return (
          "Et tee satunnaisia tehtäviä — AI ohjaa kehityskohteisiin ja harjoituskokeet valmistavat oikeaan koetilanteeseen.<br><br>" +
          (savings ? `Paketissasi säästät arviolta <strong>${savings} €</strong> verrattuna listahintaan. ` : "") +
          `Tuhannet hakijat kilpailevat samoista paikoista — ero tulee valmistautumisesta, ei tuuristista.`
        );
      },
      bullets: [
        "AI-professori selittää virheet",
        "Teoria + harjoitus + koesimulaatiot",
        "Mentorointi ja materiaalit samassa paketissa",
      ],
      urgency: () => "Henkilökohtainen tarjous on voimassa rajoitetun ajan.",
      cta: "Katso tarjoukseni",
    },
    {
      delayHours: 168,
      subject: (p) => `Viimeinen muistutus — ${p.priceEur} € (Valintakoe ${code})`,
      headline: "Viimeinen muistutus",
      body: (p) =>
        `Tämä on viimeinen muistutuksemme.<br><br>` +
        `Tarjouksesi <strong>${p.priceEur} €</strong> on voimassa vielä hetken. ` +
        `Sen jälkeen henkilökohtaista hintaa ei voi lunastaa samoilla testivastauksilla.<br><br>` +
        `Jos ${fieldLabel} on unelmiesi ala, nyt on aika sitoutua — ei viime tingassa ennen koetta.`,
      bullets: [
        "Aloitat heti maksun jälkeen",
        "Ei piilokuluja — kertamaksu",
        "Peru markkinointi koska tahansa",
      ],
      urgency: (p) => `🔴 Viimeinen mahdollisuus: ${p.priceEur} € ennen tarjouksen sulkeutumista.`,
      cta: "Siirry kassalle",
    },
  ];
}

export function streamFromExamCode(code) {
  if (!code || typeof code !== "string") return null;
  const key = `valintakoe_${code.toLowerCase()}`;
  return DRIP_STREAMS[key] || null;
}

export function getStream(streamId) {
  return DRIP_STREAMS[streamId] || null;
}
