/** Kevyt teoria + osa-alueet aineittain. */

/** Harkkakokeet — sisältö lib/exam-content.js. */
export const HARKKAKOE_OPENS = "2026-01-01";

export function isHarkkakoeOpen() {
  return true;
}

export function harkkakoeOpensLabel() {
  const d = new Date(`${HARKKAKOE_OPENS}T00:00:00+03:00`);
  return d.toLocaleDateString("fi-FI", { day: "numeric", month: "long", year: "numeric" });
}

export const SUBJECT_CONTENT = {
  "matikka-pitka": {
    code: "MAA",
    intro:
      "Pitkän matematiikan yo-valmennus osa-alueittain: teoria, harjoittelu ja AI-tuki. Rakenna osaaminen vaiheittain kohti syksyn 2026 koetta.",
    modules: [
      "Lukuteoria ja peruslaskenta",
      "Algebra ja yhtälöt",
      "Funktiot ja kuvaajat",
      "Geometria",
      "Trigonometria",
      "Lukujonot ja sarjat",
      "Tilastot ja todennäköisyys",
      "Muutosnopeus ja optimointi",
    ],
    topics: [
      { title: "Derivaatta ja ääriarvot", body: "Ketjusääntö, tangentit ja kasvun tulkinta. Yo-tehtävissä perustelu on usein puolet pisteistä." },
      { title: "Integraali", body: "Pinta-ala, perusintegraalit ja yksinkertaiset sijoitusmenetelmät ilman laskinta kun mahdollista." },
      { title: "Funktiot", body: "Polynomit, rationaalifunktiot, eksponentti ja logaritmi — määrittely- ja arvojoukot kuntoon." },
      { title: "Geometria ja trigonometria", body: "Sini- ja kosinilause, ympyrä ja trigonometriset yhtälöt yo-tasolla." },
    ],
    tips: [
      "Kirjoita välivaiheet — pisteet tulevat perustelusta.",
      "Tarkista vastaus järjellisyydellä ennen laskimen käyttöä.",
      "Harjoittele yksi osa-alue kerrallaan, älä sekoita kaikkea samaan sessioon.",
    ],
  },
  "matikka-lyhyt": {
    code: "MAB",
    intro:
      "Lyhyen matematiikan yo-koe on käytännönläheinen. Kurssi rakentaa varmat rutiinit prosentteihin, funktioihin ja tilastoihin.",
    modules: [
      "Prosentit ja verrannot",
      "Funktiot ja kuvaajat",
      "Yhtälöt arjen tilanteissa",
      "Tilastot",
      "Todennäköisyys",
      "Talouden matematiikka",
    ],
    topics: [
      { title: "Prosenttilasku", body: "Muutos, korko ja verotus. Erottele prosentti- ja prosenttiyksikkömuutos." },
      { title: "Funktiot", body: "Suora, paraabeli ja eksponentti — lue kuvaajaa ja tulkitse kontekstissa." },
      { title: "Tilastot", body: "Keskiarvo, mediaani, keskihajonta ja diagrammien lukeminen." },
      { title: "Todennäköisyys", body: "Yksinkertaiset tapahtumat ja tilastollinen päättely yo-tasolla." },
    ],
    tips: [
      "Piirrä kuvaaja kun tehtävä tuntuu epäselvältä.",
      "Kirjoita yksiköt mukaan — ne ovat osa vastausta.",
      "Tee vähintään yksi ajoitettu harjoituskoe ennen varsinaista koetta.",
    ],
  },
  aidinkieli: {
    code: "ÄI",
    intro:
      "Äidinkielen yo-valmennus: kirjoitelma, analyysi ja esseetekniikka. Teoria ja AI-palaute rakentavat varmuutta koetilanteeseen.",
    modules: [
      "Kirjoitelman rakenne",
      "Tekstianalyysi",
      "Kielioppi ja ilmaisu",
      "Kirjallisuus ja teemat",
      "Media- ja argumentaatiotekstit",
      "Kertaus ja yo-rutiinit",
    ],
    topics: [
      { title: "Kirjoitelma", body: "Johdanto, kehitys ja johtopäätös. Jokainen kappale vie argumenttia eteenpäin." },
      { title: "Tekstianalyysi", body: "Tekstilaji, puhuja, vastaanottaja — lainaukset perusteluissa." },
      { title: "Essee ja perustelu", body: "Väite, perustelut, esimerkit. Vastaa aina kysymykseen." },
      { title: "Kirjallisuus", body: "Teemat ja aikakausi kontekstissa — älä luettele pelkkää juonta." },
    ],
    tips: [
      "Varaa 5 min suunnitteluun ennen kirjoittamista.",
      "Käytä aiheen sanastoa omassa tekstissä.",
      "Pyydä AI-professorilta palautetta rakenteesta, ei vain oikeinkirjoituksesta.",
    ],
  },
  englanti: {
    code: "EN",
    intro:
      "Englannin yo-valmennus kattaa kuuntelun, luetunymmärtämisen, kieliopin ja kirjoittamisen — rutiinit jokaiseen osioon.",
    modules: [
      "Reading comprehension",
      "Grammar & vocabulary",
      "Writing tasks",
      "Listening strategies",
      "Kirjallisuus ja temaattiset tekstit",
      "Yo-koerutiinit",
    ],
    topics: [
      { title: "Reading", body: "Etsi vastaus tekstistä — merkitse avainsanat, älä arvaa." },
      { title: "Grammar", body: "Aikamuodot, artikkelit, prepositiot. Lue lause ääneen." },
      { title: "Writing", body: "Selkeä aloitus, kehitys ja lopetus. Pysy sanamäärässä." },
      { title: "Listening", body: "Lue kysymykset etukäteen. Toinen kuuntelu täsmäyksityksiin." },
    ],
    tips: [
      "Rakenna sanavarasto yo-teemojen ympärille.",
      "Kirjoita lyhyitä harjoituksia viikottain.",
      "Harjoittele AI-professorin kanssa suomeksi tai englanniksi.",
    ],
  },
  ruotsi: {
    code: "RU",
    intro:
      "Ruotsin (toinen kotimainen) yo-valmennus: ymmärtäminen, rakenteet ja yo-koetyyppiset tehtävät vaiheittain.",
    modules: [
      "Textförståelse",
      "Grammatik och ordförråd",
      "Skriftlig produktion",
      "Hörförståelse",
      "Kielioppi ja rakenteet",
      "Koevalmistautuminen",
    ],
    topics: [
      { title: "Textförståelse", body: "Lue frågorna först. Understryg nyckelord." },
      { title: "Grammatik", body: "Verb, tempus ja ordföljd yo-tasolla." },
      { title: "Skrivande", body: "Tydlig struktur ja rätt textmängd." },
      { title: "Ordförråd", body: "Vardagliga ja formella uttryck yo-tehtävissä." },
    ],
    tips: [
      "Byt till svenska päivittäin — nyheter, poddar, kort dialog.",
      "Lista vanhoja fel och rätta dem med AI-professorn.",
      "Tidsbunden skrivuppgift minst kerran kuukaudessa.",
    ],
  },
  fysiikka: {
    code: "FY",
    intro:
      "Fysiikan yo-valmennus FY1–FY8 -aiheista: teoria, laskurutiinit ja koetilanteen harjoittelu AI-tuen kera.",
    modules: [
      "Mekaniikka",
      "Lämpöoppi",
      "Sähkö ja magnetismi",
      "Aallot ja optiikka",
      "Moderni fysiikka",
      "Kokeellinen fysiikka",
    ],
    topics: [
      { title: "Mekaniikka", body: "Newtonin lait, työ, teho ja energia. Piirrä voimakuvio." },
      { title: "Sähkö", body: "Ohmin laki, sarja- ja rinnankytkentä, induktio perustasolla." },
      { title: "Aallot ja optiikka", body: "Taajuus, interferenssi, linssi- ja peilitehtävät." },
      { title: "Lämpöoppi", body: "Sisäenergia ja termodynamiikan 1. laki. Yksiköt tarkasti." },
    ],
    tips: [
      "Kaava → lukuarvot → yksiköt — aina tässä järjestyksessä.",
      "Tilannekuva ennen laskua.",
      "Harjoittele yhtä osa-aluetta kerrallaan.",
    ],
  },
  kemia: {
    code: "KE",
    intro:
      "Kemian yo-valmennus KE1–KE8 -teemoista: stökiometria, reaktiot ja orgaaninen kemia selkeästi vaiheittain.",
    modules: [
      "Ainemäärä ja laskut",
      "Atomirakenne",
      "Kemialliset sidokset",
      "Reaktiot ja stoikiometria",
      "Happo–emäskemia ja tasapaino",
      "Sähkö- ja orgaaninen kemia",
    ],
    topics: [
      { title: "Stökiometria", body: "Molimäärä, massa, rajoittava tekijä." },
      { title: "Happo ja emäs", body: "pH, neutralisaatio, puskurit." },
      { title: "Orgaaninen kemia", body: "Funktionaaliset ryhmät ja nimeäminen." },
      { title: "Redox", body: "Hapetusluvut ja puolireaktioiden tasapainotus." },
    ],
    tips: [
      "Opettele reaktiomallit ulkoa — säästä aikaa kokeessa.",
      "Tarkista atomi- ja varaustasapaino.",
      "AI-professori selittää epäselvät välivaiheet.",
    ],
  },
  biologia: {
    code: "BI",
    intro:
      "Biologian yo-valmennus: solu, ekologia, evoluutio ja fysiologia — käsitteet ja soveltaminen yo-tasolla.",
    modules: [
      "Solu ja perintöaines",
      "Ekologia ja ekosysteemit",
      "Evoluutio",
      "Ihmisen fysiologia",
      "Biotekniikka ja etiikka",
      "Koesimulaatio ja kertaus",
    ],
    topics: [
      { title: "Solu ja DNA", body: "Proteiinisynteesi ja jakautuminen — rakenne ja funktio." },
      { title: "Ekologia", body: "Ravintoketjut, kiertokulut, biodiversiteetti." },
      { title: "Evoluutio", body: "Luonnonvalinta ja adaptaatio esimerkein." },
      { title: "Fysiologia", body: "Verenkierto, hengitys, hormonit ja palautesäätely." },
    ],
    tips: [
      "Piirrä kaaviot — solu, sydän, ekosysteemi.",
      "Opi käsitteet omilla sanoilla.",
      "Yhdistä teemat (esim. evoluutio + biodiversiteetti).",
    ],
  },
  historia: {
    code: "HI",
    intro:
      "Historian yo-valmennus: aikajänteet, lähdekritiikki ja esseet — harjoittele yo-tyylistä argumentointia.",
    modules: [
      "Suomen historia",
      "Maailmanhistoria",
      "Lähdekritiikki",
      "Essee ja argumentaatio",
      "Aikakausi- ja teemakokonaisuudet",
      "Yo-koerutiinit",
    ],
    topics: [
      { title: "Aikajänteet", body: "Syy–seuraus, ei pelkkä vuosiluettelo." },
      { title: "Lähdekritiikki", body: "Kuka, milloin, miksi, kenelle?" },
      { title: "Essee", body: "Väite, perustelut, esimerkit kysymyksen mukaan." },
      { title: "Teemat", body: "Demokratia, sodat, arjen historia." },
    ],
    tips: [
      "Tee aikajanoja käsin.",
      "Käytä historiallista termistöä tarkasti.",
      "AI-professori antaa palautetta esseerakenteesta.",
    ],
  },
  psykologia: {
    code: "PS",
    intro:
      "Psykologian yo-valmennus: kognitio, kehitys, tutkimusmetodit ja soveltaminen — käsitteet ja yo-tehtävät.",
    modules: [
      "Kognitio ja muisti",
      "Kehityspsykologia",
      "Tutkimusmetodit",
      "Persoonallisuus",
      "Sosiaalipsykologia",
      "Yo-koetehtävät ja kertaus",
    ],
    topics: [
      { title: "Kognitio", body: "Muisti, havainto, päättely — klassiset kokeet." },
      { title: "Kehitys", body: "Piaget, kiintymys, moraalin kehitys." },
      { title: "Tutkimusmetodit", body: "Muuttujat, validiteetti, reliabiliteetti." },
      { title: "Soveltaminen", body: "Käytä käsitteitä esimerkeissä, älä luettele teoriaa." },
    ],
    tips: [
      "Opettele tutkimusesimerkit teorian tueksi.",
      "Vastaa kysymykseen — älä kaikkea mitä tiedät.",
      "Harjoittele käsitteiden erottelua.",
    ],
  },
  terveystieto: {
    code: "TT",
    intro:
      "Terveystiedon yo-valmennus: hyvinvointi, mielenterveys ja terveyskasvatus — käsitteet ja yo-tyyliset soveltamistehtävät.",
    modules: [
      "Hyvinvointi ja elämäntavat",
      "Mielenterveys",
      "Päihteet ja riippuvuus",
      "Seksuaaliterveys",
      "Yhteisö ja turvallisuus",
      "Yo-koetehtävät",
    ],
    topics: [
      { title: "Hyvinvointi", body: "Liikunta, ravinto, uni ja stressinhallinta kokonaisuutena." },
      { title: "Mielenterveys", body: "Tunnetaidot, tuki ja avun hakeminen — ei stigmatisointia." },
      { title: "Päihteet", body: "Riskit, vaikutukset ja päätöksenteko faktoilla." },
      { title: "Soveltaminen", body: "Tilannekuvaukset ja perustellut ratkaisut yo-tyyliin." },
    ],
    tips: [
      "Perustele vastaukset — älä vain luettele faktoja.",
      "Yhdistä käsitteet arjen esimerkkeihin.",
      "Harjoittele monivalintoja ja avoimia kysymyksiä AI-professorilla.",
    ],
  },
  yhteiskuntaoppi: {
    code: "YO",
    intro:
      "Yhteiskuntaopin yo-valmennus: yhteiskunta, talous ja politiikka — ymmärrä ilmiöt ja harjoittele yo-koetyyppisiä tehtäviä.",
    modules: [
      "Suomen yhteiskunta ja politiikka",
      "Talous ja työelämä",
      "EU ja globaali yhteiskunta",
      "Media ja vaikuttaminen",
      "Oikeus ja kansalaisuus",
      "Yo-koetehtävät",
    ],
    topics: [
      { title: "Politiikka", body: "Demokratia, vaalit, puolueet ja päätöksenteko." },
      { title: "Talous", body: "Budjetti, verotus, inflaatio ja työmarkkinat perusteina." },
      { title: "EU ja globaali", body: "Kansainväliset suhteet ja Suomen rooli." },
      { title: "Soveltaminen", body: "Aineistotehtävät, käsitteet ja perustellut näkemykset." },
    ],
    tips: [
      "Opettele keskeiset käsitteet omilla sanoilla.",
      "Harjoittele aineistotehtäviä — lue tarkasti mitä kysytään.",
      "AI-professori auttaa rakentamaan perustellun vastauksen.",
    ],
  },
};

export function getSubjectContent(subjectId) {
  return SUBJECT_CONTENT[subjectId] || null;
}
