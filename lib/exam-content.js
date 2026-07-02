/**
 * Harkkakokeet — yo-tyyliset koesimulaatiot aineittain.
 * Kaikki pohjatekstit ovat synteettisiä (ei tekijänoikeudellista materiaalia).
 */

/** @typedef {"lukutaito"|"kirjoitustaito"|"esseevastaus"|"soveltava"|"laskutehtava"} ExamTaskType */

/**
 * @typedef {Object} ExamTask
 * @property {string} id
 * @property {string} subject
 * @property {ExamTaskType} type
 * @property {string} title
 * @property {string} [sourceMaterial]
 * @property {string} assignment
 * @property {number} maxPoints
 * @property {number} [timeMinutes]
 */

/** @type {Record<string, ExamTask[]>} */
export const HARKKAKOKEET = {
  aidinkieli: [
    {
      id: "ak-lt-1",
      subject: "aidinkieli",
      type: "lukutaito",
      title: "Tekstin 1 analyysi — some ja demokratia",
      timeMinutes: 45,
      maxPoints: 30,
      sourceMaterial: `TEKSTI 1

Julkaistu lehdessä Kolumni 14.3.2026. Kirjoittaja: Sanna Lehtovaara, yhteiskuntatutkija.

Some ei ole demokratian vihollinen — se on sen peili

Kun avaan puhelimen aamulla, näen saman keskustelun kolmessa eri muodossa: uutisotsikko, kommenttiketju ja lyhyt video. Moni väittää, että sosiaalinen media repii yhteiskuntaa hajalle. Olen tutkinut nuorten poliittista osallistumista viisi vuotta, ja näkemäni ei tue yksinkertaista tarinaa.

Ensinnäkin some madaltaa kynnyksen osallistua. Kukaan ei vaadi sinua marssimaan eduskuntatalon eteen, jotta voit esittää kysymyksen päättäjälle. Live-lähetyksissä kansalaiset saavat äänen, jota perinteinen media ei aina välitä. Demokratia ei ole vain vaalihuoneissa tapahtuvaa — se on myös arjen keskustelua.

Toiseksi algoritmit toistavat todellisuutta, jota jo elämme. Jos kaveripiiri jakaa samoja näkemyksiä, syöte vahvistaa niitä. Syy ei ole pelkästään teknologiassa vaan siinä, että ihmiset haluavat kuulla vahvistusta omille ajatuksilleen. Syyttää algoritmia on helpompaa kuin tunnistaa oma vastuu tiedon lähteistä.

Kolmanneksi some paljastaa valtajakoja. Kun poliitikko julkaisee lyhyen videon, vastaukset kertovat heti, ketkä kokevat itsensä kuulluiksi ja ketkä sivuutetuiksi. Tämä on epämukavaa, mutta läpinäkyvää. Hiljaiset huoneet eivät poistu — ne vain siirtyvät näkyvämmälle näyttämölle.

En väitä, että kaikki on hyvin. Vihapuhe, häirintä ja väärän tiedon leviäminen ovat todellisia ongelmia. Ne vaativat sääntelyä, median lukutaitoa ja koulutusta. Mutta ratkaisu ei ole palata aikaan, jolloin muutama toimitus päätti, mitä kansalaisten kannattaa tietää.

Demokratia selviää, jos opetamme nuorille kyseenalaistamista, emme pelkäämistä. Some on työkalu. Sen käyttö kertoo enemmän meistä kuin algoritmeista.`,
      assignment:
        "Analysoi tekstin 1 argumentaatiota ja vaikuttamisen keinoja. Kuvaa, miten kirjoittaja rakentaa näkemyksensä somesta ja demokratiasta. Arvioi, miten tehokkaasti hän perustelee väitteensä ja miten hän käsittelee vastaväitteitä. Viittaa tehtävässä tekstiin.",
    },
    {
      id: "ak-lt-2",
      subject: "aidinkieli",
      type: "lukutaito",
      title: "Tekstin 2 analyysi — ilmastopolitiikka ja vastuu",
      timeMinutes: 45,
      maxPoints: 30,
      sourceMaterial: `TEKSTI 2

Uutinen. Toimitus: Päivän sähkö 8.5.2026.

Hallitus esittää hiilineutraaliutta 2040 — kunnat vaativat selkeämpiä ohjeita

Valtioneuvosto julkaisi tänään esityksen, jonka mukaan Suomi tähtää hiilineutraaliuteen vuoteen 2040 viidellä vuodella aiemmin kuin aiemmin linjattiin. Esityksessä korostetaan sähköistämistä, maankäytön hiilinieluja ja teollisuuden vähähiilisyyttä.

— Me emme voi odottaa, että jokainen kunta keksii oman ratkaisunsa, sanoo ympäristöministeri Laura Mäkinen tiedotustilaisuudessa. — Ilmastotavoitteet ovat yhteisiä, mutta toteutus vaatii paikallista osaamista.

Suomen Kuntaliitto tyytyväinen ei ole. Järjestön mukaan esitys jättää epäselväksi, kuka maksaa uudet investoinnit joukkoliikenteeseen ja lähienergiaan.

— Päättäjät puhuvat tavoitteista, mutta budjetit eivät seuraa perässä, kommentoi Kuntaliiton puheenjohtaja Mikko Rantanen.

Tutkija Elina Sorvari Helsingin yliopistosta huomauttaa, että ilmastopolitiikka on myös viestintäkysymys.

— Kun uutinen julkaistaan samaan aikaan kuin sähkölaskujen nousu puhututtaa, kansalaiset kokevat ristiriidan. Luottamus syntyy ennustettavuudesta, hän sanoo.

Oppositio vaatii kustannusarvioita ennen eduskuntakäsittelyä. Hallituspuolueet korostavat, että viivyttely tarkoittaa kalliimpia ratkaisuja myöhemmin.

Eduskunta käsittelee esityksen syksyllä.`,
      assignment:
        "Analysoi tekstin 2 tekstilajia, lähettäjää ja vastaanottajaa. Kuvaa, miten eri toimijoiden näkemykset asettuvat uutiseen. Arvioi, miten uutinen rakentaa ilmastopolitiikasta kuvan ja mitä vaikuttamisen keinoja tekstissä käytetään. Viittaa tehtävässä tekstiin.",
    },
    {
      id: "ak-lt-3",
      subject: "aidinkieli",
      type: "lukutaito",
      title: "Tekstin 3 analyysi — kaupunkitarina",
      timeMinutes: 45,
      maxPoints: 30,
      sourceMaterial: `TEKSTI 3

Katkelma novellista Lumen alla (2024). Kirjoittaja: fiktiivinen teos.

Hän seisoi ratikkalaiturilla ja laski hengityksen höyryjä, vaikka tiesi, ettei kellon osoittama aika muuttuisi siten. Puhelin värähti — äiti kysyi, oliko hän jo ehtinyt ajatella asuntoa. Hän vastasi lyhyesti, kuten aina, ja katsoi samalla junan valoja, jotka kasvoivat pimeästä kuin ajatus, jota ei halua lopettaa.

Kaupunki ei ollut enää vieras. Se oli paikka, jossa hän oppi tunnistamaan omat askeleensa katukivestä. Silti jokainen aamu tuntui alulta, jossa joku odotti vastausta, jota hän ei vielä osannut muotoilla. Ystävä oli sanonut, että aikuistuminen on sitä, että huomaa kaipaavansa hiljaisuutta enemmän kuin oikeassa olemista.

Kun ratikka pysähtyi, ovi avautui hitaasti. Sisällä istui mies, joka luki kirjaa ilman, että nosti katsettaan. Hän astui sisään ja valitsi paikan ikkunan vierestä. Kaupunki liikkui ulkopuolella, mutta hän pysyi paikallaan — kuin teksti, joka odottaa seuraavaa virkettä.`,
      assignment:
        "Analysoi tekstin 3 kerrontaa, hahmojen asemointia ja teemoja. Kuvaa, miten kertoja ja päähenkilön tilanne rakentuvat. Arvioi, miten teksti käsittelee aikuistumista ja valintoja. Viittaa tehtävässä tekstiin ja käytä kirjallisuusanalyysin käsitteitä.",
    },
    {
      id: "ak-kt-1",
      subject: "aidinkieli",
      type: "kirjoitustaito",
      title: "Essee — yksilön vastuu ympäristökriisissä",
      timeMinutes: 90,
      maxPoints: 60,
      assignment: `Kirjoita essee aiheesta: Yksilön vastuu ympäristökriisissä.

Esseen tulee olla johdonmukainen, perusteltu ja kielellisesti huolellinen. Rakenna teksti johdannolla, kehityksellä ja johtopäätöksellä.

Voit hyödyntää seuraavia näkökulmia:
— kulutusvalinnat ja arjen teot
— järjestelmätason ratkaisut vs. yksilön mahdollisuudet
— sukupolvien välinen oikeudenmukaisuus
— toivo, uupumus ja ilmastotunteet
— koulutuksen ja tiedon rooli`,
    },
    {
      id: "ak-kt-2",
      subject: "aidinkieli",
      type: "kirjoitustaito",
      title: "Essee — teknologian vaikutus ihmiskuvaan",
      timeMinutes: 90,
      maxPoints: 60,
      assignment: `Kirjoita essee aiheesta: Teknologian vaikutus ihmiskuvaan.

Esseen tulee olla johdonmukainen, perusteltu ja kielellisesti huolellinen. Rakenna teksti johdannolla, kehityksellä ja johtopäätöksellä.

Voit hyödyntää seuraavia näkökulmia:
— tekoäly ja luovuus
— sosiaalinen media ja identiteetti
— työelämän muutos ja osaaminen
— yksityisyys ja valvonta
— ihmisen ainutlaatuisuus teknistyvässä maailmassa`,
    },
    {
      id: "ak-kt-3",
      subject: "aidinkieli",
      type: "kirjoitustaito",
      title: "Essee — luottamus yhteiskunnassa",
      timeMinutes: 90,
      maxPoints: 60,
      assignment: `Kirjoita essee aiheesta: Luottamus yhteiskunnassa.

Esseen tulee olla johdonmukainen, perusteltu ja kielellisesti huolellinen. Rakenna teksti johdannolla, kehityksellä ja johtopäätöksellä.

Voit hyödyntää seuraavia näkökulmia:
— media ja tiedon luotettavuus
— poliittinen päätöksenteko ja läpinäkyvyys
— eriarvoisuus ja kokemus eriarvoisuudesta
— yhteisöllisyys ja yksinäisyys
— nuorten luottamus tulevaisuuteen`,
    },
  ],

  "matikka-pitka": [
    {
      id: "maa-1",
      subject: "matikka-pitka",
      type: "laskutehtava",
      title: "Derivaatta ja optimointi",
      timeMinutes: 60,
      maxPoints: 24,
      assignment: `Tehtävä 1. (12 p)

Funktio f(x) = x³ − 6x² + 9x + 1 on määritelty kaikilla reaaliluvuilla.

a) Laske f′(x) ja f″(x).
b) Määritä funktion kasvu- ja vähenemisvälit.
c) Määritä funktion paikalliset ääriarvot.

Tehtävä 2. (12 p)

Suorakulmion piiri on 40 m. Muuttujan x avulla ilmaistu sivun pituus on x metriä ja vastakkaisen sivun pituus on (20 − x) metriä, missä 0 < x < 20.

a) Muodosta suorakulmion pinta-alan A(x) lauseke.
b) Määritä pinta-alan suurin mahdollinen arvo ja kerro, millä x:n arvolla se saavutetaan.
c) Tulkitse vastaus geometrisesti.`,
    },
  ],

  "matikka-lyhyt": [
    {
      id: "mab-1",
      subject: "matikka-lyhyt",
      type: "laskutehtava",
      title: "Prosentit ja funktiot",
      timeMinutes: 60,
      maxPoints: 24,
      assignment: `Tehtävä 1. (12 p)

Tuotteen hinta nousee 15 prosenttia. Uusi hinta on 138 €.

a) Laske tuotteen hinta ennen korotusta.
b) Kuinka monta prosenttia hinta pitäisi laskea, jotta se palaisi alkuperäiseen hintaan? Perustele laskusi.

Tehtävä 2. (12 p)

Funktio f(x) = −0,5x² + 4x + 1 kuvaa heitetyn pallon korkeutta metriinä aikana x sekuntia, kun 0 ≤ x ≤ 9.

a) Millä hetkellä pallo on korkeimmillaan?
b) Kuinka korkealle pallo nousee?
c) Kuinka kauan pallo on vähintään 5 metrin korkeudessa?`,
    },
  ],

  englanti: [
    {
      id: "en-1",
      subject: "englanti",
      type: "esseevastaus",
      title: "Reading and writing — technology and learning",
      timeMinutes: 90,
      maxPoints: 99,
      sourceMaterial: `TEXT

Adapted for practice purposes. Original synthetic material.

Many schools have introduced AI tools to support learning. Supporters argue that personalised feedback helps students who struggle in large classes. Critics worry that students may rely on generated answers instead of developing their own thinking.

A recent survey of 1,200 Finnish upper secondary students found that 68 percent had used an AI tool for schoolwork at least once. However, only 29 percent felt confident they could evaluate whether an AI answer was accurate.

Teacher Anna Bergström says the key is guidance: "Students need to learn when AI is a tutor and when it is a shortcut they should avoid."

The debate continues as universities update their assessment policies.`,
      assignment: `A. Reading comprehension (30 p)

Answer in English using complete sentences. Refer to the text.

1. What benefits and risks of AI in education are mentioned?
2. What did the survey reveal about students' use of AI?
3. How does Anna Bergström describe the role of teachers?

B. Writing task (69 p)

Write a text of 350–500 words in English on one of the following topics:
— Should schools limit students' use of AI tools? Why or why not?
— How can technology support learning without replacing independent thinking?

Your text should have a clear introduction, development and conclusion.`,
    },
  ],

  ruotsi: [
    {
      id: "ru-1",
      subject: "ruotsi",
      type: "esseevastaus",
      title: "Läsning och skrivning — hållbarhet i vardagen",
      timeMinutes: 90,
      maxPoints: 99,
      sourceMaterial: `TEXT (övningsmaterial)

Allt fler unga försöker minska sin klimatpåverkan i vardagen. Enligt en fiktiv undersökning från 2026 uppger 54 procent av gymnasieeleverna att de försöker välja mer hållbara transportmedel, men bara 21 procent tycker att det är lätt att få tillräcklig information om produkters miljöpåverkan.

— Det är svårt att veta vad som verkligen gör skillnad, säger elev Sara Lindholm. — Man vill göra rätt, men marknadsföringen är förvirrande.

Forskaren Johan Ekman påpekar att individens val är viktiga, men att systemförändringar krävs för större effekt.`,
      assignment: `A. Läsförståelse (30 p)

Svara på svenska med fullständiga meningar. Använd texten som stöd.

1. Vad visar undersökningen om ungas hållbarhetsbeteende?
2. Varför tycker Sara Lindholm att det är svårt att göra hållbara val?
3. Hur skiljer sig Johan Ekmans syn från enbart individuellt ansvar?

B. Skrivuppgift (69 p)

Skriv en text på 300–450 ord på svenska om ämnet: Hållbarhet i vardagen — individens möjligheter och begränsningar.

Texten ska ha en tydlig inledning, ett utvecklat resonemang och en avslutning.`,
    },
  ],

  fysiikka: [
    {
      id: "fy-1",
      subject: "fysiikka",
      type: "laskutehtava",
      title: "Liike ja voimat",
      timeMinutes: 60,
      maxPoints: 24,
      assignment: `Tehtävä 1. (8 p)

Kivi heitetään suoraan ylöspäin nopeudella 12 m/s. Ilmanvastusta ei huomioida. Painovoiman kiihtyvyys on 9,8 m/s².

a) Kuinka korkealle kivi nousee?
b) Kuinka kauan kivi on ilmassa ennen kuin se palaa heitto korkeudelle?

Tehtävä 2. (8 p)

Laatikko, jonka massa on 5,0 kg, vedetään tasaisella pöydällä vaakasuoralla voimalla 20 N. Kitkakerroin on 0,30.

a) Laske kitkavoima.
b) Määritä laatikon kiihtyvyys.

Tehtävä 3. (8 p)

Selitä omin sanoin, miten Newtonin kolmas laki liittyy voima- ja vastavoimapariin. Anna esimerkki arjen tilanteesta.`,
    },
  ],

  kemia: [
    {
      id: "ke-1",
      subject: "kemia",
      type: "laskutehtava",
      title: "Stökiometria ja happo–pohja",
      timeMinutes: 60,
      maxPoints: 24,
      assignment: `Tehtävä 1. (12 p)

Kalsiumkarbonaatti (CaCO₃) hajoaa kuumennettaessa:

CaCO₃(s) → CaO(s) + CO₂(g)

a) Laske, kuinka monta molia hiilidioksidia muodostuu, kun 25,0 g kalsiumkarbonaattia hajoaa täysin.
b) Laske hiilidioksidin tilavuus normaaliolosuhteissa (22,4 l/mol).

Tehtävä 2. (12 p)

Happoliuoksen pH on 2,50.

a) Laske vetyioni- pitoisuus [H⁺].
b) Selitä, miten happo ja emäs reagoivat veden autoprotolyysin kautta.
c) Arvioi, onko liuos voimakas vai heikko happo, ja perustele lyhyesti.`,
    },
  ],

  biologia: [
    {
      id: "bi-1",
      subject: "biologia",
      type: "esseevastaus",
      title: "Evoluutio ja lajien sopeutuminen",
      timeMinutes: 60,
      maxPoints: 24,
      assignment: `Tehtävä 1. (12 p)

Selitä luonnonvalinnan periaate ja kuvaa, miten se johtaa lajien sopeutumiseen ympäristöönsä. Käytä esimerkkinä joko bakteerien antibioottiresistenssiä tai saalistajan ja saaliin välistä vuorovaikutusta.

Tehtävä 2. (12 p)

Metsäekosysteemin monimuotoisuus on vähentynyt Suomessa useista syistä.

a) Nimeä kaksi ihmisen toimintaan liittyvää syytä monimuotoisuuden vähenemiseen.
b) Selitä, miten monimuotoisuuden väheneminen vaikuttaa ekosysteemin vakauteen.
c) Ehdota yksi kestävä toimenpide monimuotoisuuden suojelemiseksi.`,
    },
  ],

  historia: [
    {
      id: "hi-1",
      subject: "historia",
      type: "esseevastaus",
      title: "Toisen maailmansodan jälkeinen Eurooppa",
      timeMinutes: 60,
      maxPoints: 24,
      assignment: `Tehtävä 1. (12 p)

Kuvaa lyhyesti, miten toinen maailmansota muutti Euroopan valtiollista ja taloudellista tilannetta vuosina 1945–1950. Viittaa vähintään kahteen keskeiseen ilmiöön (esim. kylmä sota, jälleenrakennus, kansainväliset järjestöt).

Tehtävä 2. (12 p)

Historioitsija väittää: "Rauhan rakentaminen ei ollut vain sopimuksia, vaan myös arjen uudelleenjärjestämistä."

a) Avaa väitettä esimerkkien avulla.
b) Arvioi, miten lähdekriittinen lähestymistapa auttaa arvioimaan väitettä.
c) Muodosta oma, perusteltu näkemyksesi.`,
    },
  ],

  psykologia: [
    {
      id: "ps-1",
      subject: "psykologia",
      type: "soveltava",
      title: "Tutkimusasetelma ja kognitio",
      timeMinutes: 60,
      maxPoints: 24,
      assignment: `Tehtävä 1. (12 p)

Tutkimuksessa haluttiin selvittää, vaikuttaako unen määrä muistisuoritukseen. Koehenkilöt jaettiin kahteen ryhmään: toinen nukkui 8 tuntia, toinen 5 tuntia. Seuraavana päivänä he suorittivat sanalistamuistitehtävän.

a) Mikä on riippumaton ja mikä riippuva muuttuja?
b) Nimeä yksi mahdollinen häiriömuuttuja ja selitä, miten se voisi vääristää tuloksia.
c) Ehdota yksi tapa parantaa asetelman sisäistä validiteettia.

Tehtävä 2. (12 p)

Selitä lyhyesti työmuistin käsite ja kuvaa, miten se liittyy oppimiseen yo-valmistautumisessa. Anna käytännön esimerkki.`,
    },
  ],

  terveystieto: [
    {
      id: "tt-1",
      subject: "terveystieto",
      type: "esseevastaus",
      title: "Mielenterveys ja arjen hyvinvointi",
      timeMinutes: 60,
      maxPoints: 24,
      assignment: `Tehtävä 1. (12 p)

Selitä, mitä tarkoitetaan mielenterveydellä ja miten se eroaa mielenterveyshäiriöstä. Käytä käsitteitä suojaavat ja kuormittavat tekijät.

Tehtävä 2. (12 p)

Nuorten stressi on yleistä opiskelupaineiden vuoksi.

a) Kuvaa kaksi biologista tai psykososiaalista mekanismia, joiden kautta pitkäaikainen stressi voi vaikuttaa hyvinvointiin.
b) Ehdota kolme konkreettista keinoa, joilla opiskelija voi tukea omaa jaksamistaan ennen yo-kokeita.
c) Perustele, miksi apua kannattaa hakea ajoissa.`,
    },
  ],

  yhteiskuntaoppi: [
    {
      id: "yo-1",
      subject: "yhteiskuntaoppi",
      type: "esseevastaus",
      title: "Hyvinvointivaltio ja eriarvoisuus",
      timeMinutes: 60,
      maxPoints: 24,
      assignment: `Tehtävä 1. (12 p)

Selitä käsitteet hyvinvointivaltio, verotus ja julkiset palvelut. Kuvaa, miten ne liittyvät toisiinsa suomalaisessa yhteiskunnassa.

Tehtävä 2. (12 p)

Aihe: Eriarvoisuus Suomessa

a) Kuvaa kaksi mittaria tai ilmiötä, joiden avulla eriarvoisuutta voidaan tarkastella.
b) Arvioi, miten koulutus vaikuttaa tasa-arvoon ja yhteiskunnalliseen liikkuvuuteen.
c) Muodosta perusteltu näkemys siitä, mitä haasteita hyvinvointivaltio kohtaa tulevina vuosikymmeninä.`,
    },
  ],
};

export const EXAM_TYPE_LABELS = {
  lukutaito: "Lukutaidon koe",
  kirjoitustaito: "Kirjoitustaidon koe",
  esseevastaus: "Esseevastaus",
  soveltava: "Soveltava tehtävä",
  laskutehtava: "Laskutehtävä",
};

/** @param {string} subjectId */
export function getHarkkakoeTasks(subjectId) {
  return HARKKAKOKEET[subjectId] ?? [];
}

/** @param {string} subjectId @param {string} taskId */
export function getHarkkakoeTask(subjectId, taskId) {
  return getHarkkakoeTasks(subjectId).find((t) => t.id === taskId) ?? null;
}

/** @param {string} subjectId */
export function subjectHasHarkkakoe(subjectId) {
  return getHarkkakoeTasks(subjectId).length > 0;
}

/** Kokonaispistemäärä aineen harkkakokeissa. */
export function harkkakoeTotalPoints(subjectId) {
  return getHarkkakoeTasks(subjectId).reduce((sum, t) => sum + t.maxPoints, 0);
}
