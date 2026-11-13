/**
 * Harjoitustehtäväpankki — monivalinnat selityksineen aineittain.
 * Jokainen tehtävä on kiinteä (ei AI-generoitu), jotta edistyminen ja
 * kertausjono toimivat luotettavasti. AI-professori täydentää rajattomasti.
 */

/**
 * @typedef {Object} PracticeQuestion
 * @property {string} id
 * @property {string} subject
 * @property {string} module
 * @property {string} question
 * @property {string[]} options
 * @property {number} correctIndex
 * @property {string} explanation
 */

/** @type {Record<string, PracticeQuestion[]>} */
export const PRACTICE_QUESTIONS = {
  "matikka-pitka": [
    {
      id: "maa-q1",
      subject: "matikka-pitka",
      module: "Funktiot ja kuvaajat",
      question: "Mikä on funktion f(x) = x² − 4x + 7 pienin arvo?",
      options: ["3", "7", "2", "−4"],
      correctIndex: 0,
      explanation:
        "Huippukohta on x = −b/(2a) = 4/2 = 2. Sijoittamalla f(2) = 4 − 8 + 7 = 3. Koska a > 0, paraabeli aukeaa ylöspäin ja huippu on minimi.",
    },
    {
      id: "maa-q2",
      subject: "matikka-pitka",
      module: "Muutosnopeus ja optimointi",
      question: "Mikä on funktion f(x) = 3x² − 5x derivaatta?",
      options: ["6x − 5", "3x − 5", "6x", "x² − 5"],
      correctIndex: 0,
      explanation:
        "Potenssisääntö: D(3x²) = 6x ja D(−5x) = −5, joten f′(x) = 6x − 5. Vakiokerroin säilyy ja eksponentti putoaa kertoimeksi.",
    },
    {
      id: "maa-q3",
      subject: "matikka-pitka",
      module: "Funktiot ja kuvaajat",
      question: "Ratkaise yhtälö e^x = 5.",
      options: ["x = ln 5", "x = 5e", "x = log₁₀ 5", "x = e⁵"],
      correctIndex: 0,
      explanation:
        "Luonnollinen logaritmi on eksponenttifunktion käänteisfunktio: ottamalla ln molemmilta puolilta saadaan x = ln 5 ≈ 1,609.",
    },
    {
      id: "maa-q4",
      subject: "matikka-pitka",
      module: "Geometria",
      question: "Ympyrän säde on 3. Mikä on ympyrän pinta-ala?",
      options: ["9π", "6π", "3π", "12π"],
      correctIndex: 0,
      explanation: "Pinta-ala A = πr² = π · 3² = 9π. Kehän pituus olisi 2πr = 6π — älä sekoita kaavoja.",
    },
    {
      id: "maa-q5",
      subject: "matikka-pitka",
      module: "Trigonometria",
      question: "Mikä on sin(π/6) tarkka arvo?",
      options: ["1/2", "√3/2", "√2/2", "1"],
      correctIndex: 0,
      explanation:
        "π/6 = 30°. Muistikolmiosta sin 30° = 1/2 ja cos 30° = √3/2. Tarkat arvot kannattaa osata ulkoa yo-koetta varten.",
    },
    {
      id: "maa-q6",
      subject: "matikka-pitka",
      module: "Tilastot ja todennäköisyys",
      question: "Heitetään kahta noppaa. Millä todennäköisyydellä silmälukujen summa on 12?",
      options: ["1/36", "1/12", "1/6", "2/36"],
      correctIndex: 0,
      explanation:
        "Summa 12 syntyy vain yhdistelmällä (6,6). Mahdollisia tuloksia on 6 · 6 = 36, joten P = 1/36.",
    },
    {
      id: "maa-q7",
      subject: "matikka-pitka",
      module: "Lukujonot ja sarjat",
      question: "Aritmeettisen jonon ensimmäinen jäsen on 2 ja erotusluku 3. Mikä on jonon 10. jäsen?",
      options: ["29", "32", "27", "30"],
      correctIndex: 0,
      explanation: "aₙ = a₁ + (n − 1)d, joten a₁₀ = 2 + 9 · 3 = 29. Huomaa kerroin n − 1, ei n.",
    },
    {
      id: "maa-q8",
      subject: "matikka-pitka",
      module: "Muutosnopeus ja optimointi",
      question: "Laske määrätty integraali ∫₀¹ 2x dx.",
      options: ["1", "2", "1/2", "0"],
      correctIndex: 0,
      explanation:
        "Integraalifunktio on x². Sijoitus: 1² − 0² = 1. Määrätty integraali kertoo käyrän ja x-akselin väliin jäävän pinta-alan.",
    },
  ],

  "matikka-lyhyt": [
    {
      id: "mab-q1",
      subject: "matikka-lyhyt",
      module: "Prosentit ja verrannot",
      question: "Tuotteen hinta 80 € nousee 25 %. Mikä on uusi hinta?",
      options: ["100 €", "105 €", "95 €", "110 €"],
      correctIndex: 0,
      explanation: "Korotus: 80 € · 1,25 = 100 €. Kerroinmenetelmä (1 + p/100) on nopein tapa prosenttilaskuissa.",
    },
    {
      id: "mab-q2",
      subject: "matikka-lyhyt",
      module: "Prosentit ja verrannot",
      question: "Puolueen kannatus nousi 20 prosentista 25 prosenttiin. Kuinka paljon kannatus kasvoi?",
      options: ["5 prosenttiyksikköä", "5 prosenttia", "25 prosenttia", "20 prosenttiyksikköä"],
      correctIndex: 0,
      explanation:
        "Prosenttilukujen erotus ilmaistaan prosenttiyksikköinä: 25 − 20 = 5 prosenttiyksikköä. Suhteellinen kasvu olisi 5/20 = 25 %.",
    },
    {
      id: "mab-q3",
      subject: "matikka-lyhyt",
      module: "Funktiot ja kuvaajat",
      question: "Mikä on suoran y = 2x + 1 kulmakerroin?",
      options: ["2", "1", "1/2", "−1"],
      correctIndex: 0,
      explanation:
        "Suoran yhtälössä y = kx + b kulmakerroin on k eli x:n kerroin. Tässä k = 2: kun x kasvaa yhdellä, y kasvaa kahdella.",
    },
    {
      id: "mab-q4",
      subject: "matikka-lyhyt",
      module: "Tilastot",
      question: "Mikä on lukujen 2, 3, 3, 8, 14 mediaani?",
      options: ["3", "6", "8", "5"],
      correctIndex: 0,
      explanation:
        "Mediaani on suuruusjärjestykseen asetetun aineiston keskimmäinen arvo. Viidestä luvusta keskimmäinen (3. luku) on 3.",
    },
    {
      id: "mab-q5",
      subject: "matikka-lyhyt",
      module: "Todennäköisyys",
      question: "Kolikkoa heitetään kaksi kertaa. Millä todennäköisyydellä saadaan kaksi kruunaa?",
      options: ["1/4", "1/2", "1/3", "3/4"],
      correctIndex: 0,
      explanation:
        "Riippumattomien tapahtumien todennäköisyydet kerrotaan: 1/2 · 1/2 = 1/4. Vaihtoehdot ovat KK, KL, LK, LL.",
    },
    {
      id: "mab-q6",
      subject: "matikka-lyhyt",
      module: "Talouden matematiikka",
      question: "1000 € talletetaan 5 % vuosikorolla. Paljonko tilillä on kahden vuoden kuluttua (korkoa korolle)?",
      options: ["1102,50 €", "1100,00 €", "1050,00 €", "1105,00 €"],
      correctIndex: 0,
      explanation:
        "Korkoa korolle: 1000 · 1,05² = 1102,50 €. Ilman koronkorkoa saataisiin vain 1100 € — toisena vuonna korkoa kertyy myös ensimmäisen vuoden korolle.",
    },
    {
      id: "mab-q7",
      subject: "matikka-lyhyt",
      module: "Prosentit ja verrannot",
      question: "3 kg omenoita maksaa 12 €. Paljonko maksaa 5 kg samaan kilohintaan?",
      options: ["20 €", "18 €", "15 €", "24 €"],
      correctIndex: 0,
      explanation: "Kilohinta 12/3 = 4 €/kg, joten 5 kg maksaa 5 · 4 = 20 €. Suoraan verrannollisuus: hinta kasvaa samassa suhteessa.",
    },
    {
      id: "mab-q8",
      subject: "matikka-lyhyt",
      module: "Funktiot ja kuvaajat",
      question: "Mikä on funktion f(x) = −x² + 4x suurin arvo?",
      options: ["4", "2", "0", "8"],
      correctIndex: 0,
      explanation:
        "Huippu on kohdassa x = −b/(2a) = −4/(−2) = 2 ja f(2) = −4 + 8 = 4. Koska a < 0, paraabeli aukeaa alaspäin ja huippu on maksimi.",
    },
  ],

  aidinkieli: [
    {
      id: "ak-q1",
      subject: "aidinkieli",
      module: "Media- ja argumentaatiotekstit",
      question: "Kirjoittaja vetoaa lukijan tunteisiin kuvaamalla koskettavan yksittäistapauksen. Mistä vaikuttamisen keinosta on kyse?",
      options: ["Paatos", "Eetos", "Logos", "Ironia"],
      correctIndex: 0,
      explanation:
        "Paatos tarkoittaa tunteisiin vetoamista. Eetos rakentaa kirjoittajan uskottavuutta ja logos vetoaa järkeen esimerkiksi tilastoilla.",
    },
    {
      id: "ak-q2",
      subject: "aidinkieli",
      module: "Tekstianalyysi",
      question: "\"Elämä on matka.\" Mikä kielikuva ilmauksessa on?",
      options: ["Metafora", "Vertaus", "Personifikaatio", "Hyperbola"],
      correctIndex: 0,
      explanation:
        "Metafora rinnastaa asiat ilman kuin-sanaa. Vertaus olisi \"elämä on kuin matka\". Personifikaatio inhimillistää elottoman, hyperbola liioittelee.",
    },
    {
      id: "ak-q3",
      subject: "aidinkieli",
      module: "Kielioppi ja ilmaisu",
      question: "Mikä virke on oikein pilkutettu?",
      options: [
        "Hän kertoi, että koe siirtyy viikolla.",
        "Hän kertoi että, koe siirtyy viikolla.",
        "Hän kertoi että koe, siirtyy viikolla.",
        "Hän, kertoi että koe siirtyy viikolla.",
      ],
      correctIndex: 0,
      explanation:
        "Että-sivulause erotetaan päälauseesta pilkulla, ja pilkku tulee ennen että-sanaa — ei sen jälkeen.",
    },
    {
      id: "ak-q4",
      subject: "aidinkieli",
      module: "Kirjoitelman rakenne",
      question: "Mikä on toimivan tekstikappaleen keskeisin periaate?",
      options: [
        "Yksi pääajatus per kappale",
        "Vähintään kymmenen virkettä per kappale",
        "Kappale alkaa aina sitaatilla",
        "Kappaleessa ei saa olla sivulauseita",
      ],
      correctIndex: 0,
      explanation:
        "Kappale rakentuu yhden pääajatuksen ympärille: ydinvirke ja sitä tukevat perustelut. Pituus ei ratkaise, sisällön yhtenäisyys ratkaisee.",
    },
    {
      id: "ak-q5",
      subject: "aidinkieli",
      module: "Tekstianalyysi",
      question: "Mikä seuraavista on tyypillinen mielipidekirjoituksen tunnusmerkki?",
      options: [
        "Kirjoittaja esittää väitteen ja perustelee sen",
        "Teksti etenee kronologisesti tapahtumasta toiseen",
        "Teksti kuvaa vain faktoja ilman kannanottoa",
        "Kertoja on fiktiivinen hahmo",
      ],
      correctIndex: 0,
      explanation:
        "Mielipidekirjoituksen ydin on väite (teesi) ja sen perustelu. Uutinen raportoi faktoja, ja fiktiivinen kertoja kuuluu kaunokirjallisuuteen.",
    },
    {
      id: "ak-q6",
      subject: "aidinkieli",
      module: "Kertaus ja yo-rutiinit",
      question: "Miten aineistoon viitataan lukutaidon kokeessa parhaiten?",
      options: [
        "Lyhyt lainaus tai epäsuora viittaus + oma tulkinta",
        "Kopioidaan pitkiä katkelmia sellaisenaan",
        "Aineistoa ei tarvitse mainita, kunhan analysoi",
        "Viitataan vain tekstin otsikkoon",
      ],
      correctIndex: 0,
      explanation:
        "Hyvä vastaus yhdistää täsmällisen tekstiviittauksen ja oman analyysin. Pelkkä referointi tai kopiointi ei osoita tulkintataitoa.",
    },
    {
      id: "ak-q7",
      subject: "aidinkieli",
      module: "Kielioppi ja ilmaisu",
      question: "Mikä seuraavista kirjoitetaan yhteen?",
      options: ["jokapäiväinen", "sitä paitsi", "ennen kaikkea", "sen sijaan"],
      correctIndex: 0,
      explanation:
        "\"Jokapäiväinen\" on vakiintunut yhdysadjektiivi. Sen sijaan \"sitä paitsi\", \"ennen kaikkea\" ja \"sen sijaan\" kirjoitetaan erikseen.",
    },
    {
      id: "ak-q8",
      subject: "aidinkieli",
      module: "Tekstianalyysi",
      question: "Kirjoittaja toteaa: \"Onpa taas loistava idea sulkea kirjastot säästösyistä.\" Mikä sävykeino on kyseessä?",
      options: ["Ironia", "Paatos", "Alkusointu", "Metonymia"],
      correctIndex: 0,
      explanation:
        "Ironiassa sanotaan päinvastaista kuin tarkoitetaan — \"loistava idea\" tarkoittaa tässä huonoa ideaa. Sävyn tunnistaminen on lukutaidon kokeen ydintaitoja.",
    },
  ],

  englanti: [
    {
      id: "en-q1",
      subject: "englanti",
      module: "Grammar & vocabulary",
      question: "Choose the correct form: \"She ___ in Helsinki since 2019.\"",
      options: ["has lived", "lives", "lived", "is living"],
      correctIndex: 0,
      explanation:
        "Since 2019 viittaa ajanjaksoon, joka jatkuu yhä → present perfect (has lived). Imperfekti (lived) vaatisi päättyneen ajan, esim. \"in 2019\".",
    },
    {
      id: "en-q2",
      subject: "englanti",
      module: "Grammar & vocabulary",
      question: "Choose the correct preposition: \"I'm very interested ___ marine biology.\"",
      options: ["in", "of", "about", "for"],
      correctIndex: 0,
      explanation: "Interested saa aina preposition in: interested in something. Prepositiot kannattaa opetella sanan yhteydessä.",
    },
    {
      id: "en-q3",
      subject: "englanti",
      module: "Grammar & vocabulary",
      question: "What does \"reluctant\" mean?",
      options: ["haluton", "innokas", "huolimaton", "luotettava"],
      correctIndex: 0,
      explanation:
        "Reluctant = haluton, vastahakoinen: \"He was reluctant to answer.\" Innokas olisi eager, luotettava reliable.",
    },
    {
      id: "en-q4",
      subject: "englanti",
      module: "Grammar & vocabulary",
      question: "Choose the correct article: \"She studies at ___ university in Turku.\"",
      options: ["a", "an", "the", "—"],
      correctIndex: 0,
      explanation:
        "University alkaa konsonanttiäänteellä /juː/, joten artikkeli on a — ei an. Artikkeli valitaan ääntämyksen, ei kirjoitusasun mukaan.",
    },
    {
      id: "en-q5",
      subject: "englanti",
      module: "Grammar & vocabulary",
      question: "Complete the third conditional: \"If I ___ about the exam, I would have studied more.\"",
      options: ["had known", "knew", "would know", "have known"],
      correctIndex: 0,
      explanation:
        "Kolmas konditionaali (mennyt, toteutumaton): If + past perfect (had known), päälauseessa would have + partisiippi.",
    },
    {
      id: "en-q6",
      subject: "englanti",
      module: "Reading comprehension",
      question: "Choose the correct indirect question: \"Could you tell me ___?\"",
      options: [
        "where the station is",
        "where is the station",
        "where does the station be",
        "the station is where",
      ],
      correctIndex: 0,
      explanation:
        "Epäsuorassa kysymyksessä käytetään suoraa sanajärjestystä: where the station is. Käänteinen järjestys (where is...) kuuluu vain suoraan kysymykseen.",
    },
    {
      id: "en-q7",
      subject: "englanti",
      module: "Grammar & vocabulary",
      question: "What does the phrasal verb \"put off\" mean in \"They put off the meeting\"?",
      options: ["lykätä", "peruuttaa", "aloittaa", "lopettaa"],
      correctIndex: 0,
      explanation: "Put off = lykätä, siirtää myöhemmäksi. Peruuttaa olisi call off — nämä kaksi sekoittuvat usein.",
    },
    {
      id: "en-q8",
      subject: "englanti",
      module: "Writing tasks",
      question: "Choose the correct passive form: \"The report ___ by the committee last week.\"",
      options: ["was written", "is written", "wrote", "has written"],
      correctIndex: 0,
      explanation:
        "Last week vaatii imperfektin, ja passiivi muodostetaan be + partisiippi: was written. Aktiivissa komitea olisi subjekti: the committee wrote.",
    },
  ],

  ruotsi: [
    {
      id: "ru-q1",
      subject: "ruotsi",
      module: "Grammatik och ordförråd",
      question: "Välj rätt ordföljd: \"Igår ___ till Åbo.\"",
      options: ["åkte jag", "jag åkte", "åker jag", "jag åker"],
      correctIndex: 0,
      explanation:
        "Kun päälause alkaa ajanmääreellä (igår), verbi tulee toiseksi ja subjekti sen jälkeen: Igår åkte jag. Tämä käänteinen sanajärjestys on yo-kokeen klassikko.",
    },
    {
      id: "ru-q2",
      subject: "ruotsi",
      module: "Grammatik och ordförråd",
      question: "Vad är preteritum av verbet \"köpa\"?",
      options: ["köpte", "köpade", "köpt", "köper"],
      correctIndex: 0,
      explanation: "Köpa taipuu: köper – köpte – köpt. Preteriti (imperfekti) on köpte; köpt on supiini (har köpt).",
    },
    {
      id: "ru-q3",
      subject: "ruotsi",
      module: "Grammatik och ordförråd",
      question: "Välj rätt form: \"___ hus är stort.\"",
      options: ["Vårt", "Vår", "Våra", "Vårs"],
      correctIndex: 0,
      explanation: "Hus on ett-suku, joten possessiivi on vårt (vårt hus). Vår kuuluu en-sanoille ja våra monikolle.",
    },
    {
      id: "ru-q4",
      subject: "ruotsi",
      module: "Grammatik och ordförråd",
      question: "Välj rätt preposition: \"Vi träffas ___ sommaren.\"",
      options: ["på", "i", "om", "vid"],
      correctIndex: 0,
      explanation: "Vuodenajoista käytetään prepositiota på: på sommaren, på vintern. Kuukausista käytetään i: i juni.",
    },
    {
      id: "ru-q5",
      subject: "ruotsi",
      module: "Grammatik och ordförråd",
      question: "Välj rätt adjektivform: \"ett ___ hus\"",
      options: ["stort", "stor", "stora", "store"],
      correctIndex: 0,
      explanation: "Ett-sanan jälkeen adjektiivi saa t-päätteen: ett stort hus. En-sana: en stor bil, monikko: stora hus.",
    },
    {
      id: "ru-q6",
      subject: "ruotsi",
      module: "Grammatik och ordförråd",
      question: "Välj rätt pronomen: \"Hon tog ___ väska och gick.\"",
      options: ["sin", "hennes", "sina", "hans"],
      correctIndex: 0,
      explanation:
        "Sin viittaa lauseen subjektiin: hon tog sin väska = hän otti oman laukkunsa. Hennes tarkoittaisi jonkun toisen naisen laukkua.",
    },
    {
      id: "ru-q7",
      subject: "ruotsi",
      module: "Textförståelse",
      question: "Vad betyder \"förbättra\"?",
      options: ["parantaa", "huonontaa", "valmistella", "verrata"],
      correctIndex: 0,
      explanation: "Förbättra = parantaa, tehdä paremmaksi (bättre = parempi). Huonontaa olisi försämra.",
    },
    {
      id: "ru-q8",
      subject: "ruotsi",
      module: "Grammatik och ordförråd",
      question: "Välj rätt bisatsordföljd: \"Jag stannar hemma eftersom jag ___ tid.\"",
      options: ["inte har", "har inte", "inte haft", "har ej inte"],
      correctIndex: 0,
      explanation:
        "Sivulauseessa (eftersom, att, om...) kieltosana tulee ennen verbiä: eftersom jag inte har tid. Päälauseessa järjestys olisi har inte.",
    },
  ],

  fysiikka: [
    {
      id: "fy-q1",
      subject: "fysiikka",
      module: "Mekaniikka",
      question: "Kappaleen massa on 2,0 kg ja kiihtyvyys 3,0 m/s². Kuinka suuri kokonaisvoima kappaleeseen vaikuttaa?",
      options: ["6,0 N", "1,5 N", "5,0 N", "0,67 N"],
      correctIndex: 0,
      explanation: "Newtonin II laki: F = ma = 2,0 kg · 3,0 m/s² = 6,0 N. Muista yksiköt: 1 N = 1 kg·m/s².",
    },
    {
      id: "fy-q2",
      subject: "fysiikka",
      module: "Mekaniikka",
      question: "Juoksija etenee 100 m ajassa 10 s tasaisella vauhdilla. Mikä on hänen nopeutensa?",
      options: ["10 m/s", "100 m/s", "1000 m/s", "0,1 m/s"],
      correctIndex: 0,
      explanation: "Keskinopeus v = s/t = 100 m / 10 s = 10 m/s. Se on noin 36 km/h.",
    },
    {
      id: "fy-q3",
      subject: "fysiikka",
      module: "Mekaniikka",
      question: "Millä kaavalla lasketaan kappaleen potentiaalienergia painovoimakentässä?",
      options: ["E = mgh", "E = ½mv²", "E = Pt", "E = UI"],
      correctIndex: 0,
      explanation:
        "Potentiaalienergia E = mgh (massa · putoamiskiihtyvyys · korkeus). ½mv² on liike-energia — nämä kaksi kannattaa erottaa selkeästi.",
    },
    {
      id: "fy-q4",
      subject: "fysiikka",
      module: "Sähkö ja magnetismi",
      question: "Vastuksen resistanssi on 10 Ω ja sen läpi kulkee 2,0 A virta. Mikä on jännite vastuksen yli?",
      options: ["20 V", "5,0 V", "12 V", "0,2 V"],
      correctIndex: 0,
      explanation: "Ohmin laki: U = RI = 10 Ω · 2,0 A = 20 V.",
    },
    {
      id: "fy-q5",
      subject: "fysiikka",
      module: "Sähkö ja magnetismi",
      question: "Laitteen jännite on 230 V ja virta 2,0 A. Mikä on laitteen teho?",
      options: ["460 W", "115 W", "232 W", "46 W"],
      correctIndex: 0,
      explanation: "Sähköteho P = UI = 230 V · 2,0 A = 460 W.",
    },
    {
      id: "fy-q6",
      subject: "fysiikka",
      module: "Aallot ja optiikka",
      question: "Aallon jaksonaika on 0,5 s. Mikä on aallon taajuus?",
      options: ["2 Hz", "0,5 Hz", "5 Hz", "0,2 Hz"],
      correctIndex: 0,
      explanation: "Taajuus on jaksonajan käänteisluku: f = 1/T = 1/0,5 s = 2 Hz.",
    },
    {
      id: "fy-q7",
      subject: "fysiikka",
      module: "Lämpöoppi",
      question: "Mitä suure c tarkoittaa lämpöopin kaavassa Q = cmΔT?",
      options: ["Ominaislämpökapasiteettia", "Lämpötilaa", "Lämpömäärää", "Massaa"],
      correctIndex: 0,
      explanation:
        "c on ominaislämpökapasiteetti: energia, joka tarvitaan lämmittämään 1 kg ainetta 1 asteella. Vedellä c ≈ 4,19 kJ/(kg·°C).",
    },
    {
      id: "fy-q8",
      subject: "fysiikka",
      module: "Mekaniikka",
      question: "Kappale putoaa vapaasti levosta. Kuinka suuri sen nopeus on 2,0 sekunnin kuluttua? (g = 9,8 m/s², ilmanvastus jätetään huomiotta)",
      options: ["≈ 20 m/s", "≈ 9,8 m/s", "≈ 4,9 m/s", "≈ 39 m/s"],
      correctIndex: 0,
      explanation: "Vapaassa pudotuksessa v = gt = 9,8 m/s² · 2,0 s = 19,6 ≈ 20 m/s.",
    },
  ],

  kemia: [
    {
      id: "ke-q1",
      subject: "kemia",
      module: "Ainemäärä ja laskut",
      question: "Mikä on veden (H₂O) moolimassa? (M(H) = 1,0 g/mol, M(O) = 16,0 g/mol)",
      options: ["18,0 g/mol", "17,0 g/mol", "16,0 g/mol", "20,0 g/mol"],
      correctIndex: 0,
      explanation: "M(H₂O) = 2 · 1,0 + 16,0 = 18,0 g/mol. Moolimassa on alkuaineiden moolimassojen summa kaavan mukaisesti.",
    },
    {
      id: "ke-q2",
      subject: "kemia",
      module: "Happo–emäskemia ja tasapaino",
      question: "Liuoksen vetyionikonsentraatio on [H⁺] = 10⁻³ mol/l. Mikä on liuoksen pH?",
      options: ["3", "−3", "11", "10"],
      correctIndex: 0,
      explanation: "pH = −log[H⁺] = −log(10⁻³) = 3. Liuos on hapan (pH < 7).",
    },
    {
      id: "ke-q3",
      subject: "kemia",
      module: "Reaktiot ja stoikiometria",
      question: "Tasapainota reaktio: __H₂ + O₂ → __H₂O. Mitkä kertoimet puuttuvat?",
      options: ["2 ja 2", "1 ja 1", "2 ja 1", "1 ja 2"],
      correctIndex: 0,
      explanation:
        "Tasapainotettu yhtälö on 2H₂ + O₂ → 2H₂O: molemmilla puolilla 4 vetyatomia ja 2 happiatomia.",
    },
    {
      id: "ke-q4",
      subject: "kemia",
      module: "Kemialliset sidokset",
      question: "Millainen sidos on natriumkloridissa (NaCl)?",
      options: ["Ionisidos", "Kovalenttinen sidos", "Metallisidos", "Vetysidos"],
      correctIndex: 0,
      explanation:
        "Metalli (Na) luovuttaa elektronin epämetallille (Cl) → syntyy ioneja, joita sähköinen vetovoima sitoo. Kovalenttinen sidos syntyy epämetallien välille.",
    },
    {
      id: "ke-q5",
      subject: "kemia",
      module: "Ainemäärä ja laskut",
      question: "Kuinka monta moolia on 36 g vettä? (M(H₂O) = 18 g/mol)",
      options: ["2,0 mol", "0,5 mol", "1,0 mol", "18 mol"],
      correctIndex: 0,
      explanation: "n = m/M = 36 g / 18 g/mol = 2,0 mol. Tämä peruskaava on yo-kokeen laskujen ydin.",
    },
    {
      id: "ke-q6",
      subject: "kemia",
      module: "Sähkö- ja orgaaninen kemia",
      question: "Mitä hapettuminen tarkoittaa elektronien näkökulmasta?",
      options: [
        "Aine luovuttaa elektroneja",
        "Aine vastaanottaa elektroneja",
        "Aine luovuttaa protoneja",
        "Aine vastaanottaa neutroneja",
      ],
      correctIndex: 0,
      explanation:
        "Hapettuminen = elektronien luovutus, pelkistyminen = vastaanotto. Muistisääntö: LEO (Luovuttaa Elektroneja = Oxidation).",
    },
    {
      id: "ke-q7",
      subject: "kemia",
      module: "Sähkö- ja orgaaninen kemia",
      question: "Mikä funktionaalinen ryhmä on tunnusomainen alkoholeille?",
      options: ["Hydroksyyliryhmä (−OH)", "Karboksyyliryhmä (−COOH)", "Aminoryhmä (−NH₂)", "Karbonyyliryhmä (C=O)"],
      correctIndex: 0,
      explanation:
        "Alkoholeissa on −OH-ryhmä (esim. etanoli C₂H₅OH). Karboksyyliryhmä kuuluu karboksyylihapoille ja aminoryhmä amiineille.",
    },
    {
      id: "ke-q8",
      subject: "kemia",
      module: "Ainemäärä ja laskut",
      question: "0,50 mol ainetta liuotetaan veteen niin, että liuoksen tilavuus on 2,0 l. Mikä on konsentraatio?",
      options: ["0,25 mol/l", "1,0 mol/l", "0,50 mol/l", "4,0 mol/l"],
      correctIndex: 0,
      explanation: "c = n/V = 0,50 mol / 2,0 l = 0,25 mol/l.",
    },
  ],

  biologia: [
    {
      id: "bi-q1",
      subject: "biologia",
      module: "Solu ja perintöaines",
      question: "Millä solunjakautumistavalla sukusolut syntyvät?",
      options: ["Meioosilla", "Mitoosilla", "Sytokineesillä", "Replikaatiolla"],
      correctIndex: 0,
      explanation:
        "Meioosissa kromosomimäärä puolittuu (2n → n), mikä on välttämätöntä sukusoluille. Mitoosi tuottaa kaksi identtistä somaattista solua.",
    },
    {
      id: "bi-q2",
      subject: "biologia",
      module: "Solu ja perintöaines",
      question: "Mitkä ovat fotosynteesin lähtöaineet?",
      options: [
        "Hiilidioksidi ja vesi",
        "Glukoosi ja happi",
        "Happi ja typpi",
        "Glukoosi ja vesi",
      ],
      correctIndex: 0,
      explanation:
        "Fotosynteesi: 6CO₂ + 6H₂O + valoenergia → C₆H₁₂O₆ + 6O₂. Lähtöaineet ovat hiilidioksidi ja vesi; glukoosi ja happi ovat tuotteita.",
    },
    {
      id: "bi-q3",
      subject: "biologia",
      module: "Evoluutio",
      question: "Mikä on luonnonvalinnan perusmekanismi?",
      options: [
        "Ympäristöön parhaiten sopeutuneet lisääntyvät tehokkaimmin",
        "Yksilöt sopeutuvat tahdonalaisesti ympäristöön",
        "Kaikki yksilöt lisääntyvät yhtä tehokkaasti",
        "Hankitut ominaisuudet periytyvät suoraan",
      ],
      correctIndex: 0,
      explanation:
        "Luonnonvalinnassa parhaiten sopeutuneet jättävät enemmän jälkeläisiä, jolloin edulliset perinnölliset ominaisuudet yleistyvät. Hankittujen ominaisuuksien periytyminen on lamarckismia, ei nykykäsitys.",
    },
    {
      id: "bi-q4",
      subject: "biologia",
      module: "Ekologia ja ekosysteemit",
      question: "Mitä tarkoittaa laji, joka on ravintoketjussa tuottaja?",
      options: [
        "Yhteyttävä eliö, esim. kasvi",
        "Kasvinsyöjä",
        "Petoeläin",
        "Hajottaja",
      ],
      correctIndex: 0,
      explanation:
        "Tuottajat (kasvit, levät) sitovat auringon energian yhteyttämällä. Kuluttajat (kasvin- ja lihansyöjät) käyttävät tuottajien energiaa, hajottajat pilkkovat kuollutta ainesta.",
    },
    {
      id: "bi-q5",
      subject: "biologia",
      module: "Solu ja perintöaines",
      question: "Ihmisen perimässä on normaalisti montako kromosomia somaattisessa solussa?",
      options: ["46", "23", "48", "92"],
      correctIndex: 0,
      explanation:
        "Somaattisissa soluissa on 46 kromosomia (23 paria). Sukusoluissa on 23 kromosomia, jotta hedelmöityksessä palataan 46:een.",
    },
    {
      id: "bi-q6",
      subject: "biologia",
      module: "Ihmisen fysiologia",
      question: "Mikä elin säätelee verensokeria erittämällä insuliinia?",
      options: ["Haima", "Maksa", "Munuainen", "Kilpirauhanen"],
      correctIndex: 0,
      explanation:
        "Haiman Langerhansin saarekkeiden beetasolut erittävät insuliinia, joka laskee verensokeria. Maksa varastoi glukoosia glykogeeninä insuliinin ohjaamana.",
    },
    {
      id: "bi-q7",
      subject: "biologia",
      module: "Solu ja perintöaines",
      question: "Mikä on DNA:n emäsparisääntö?",
      options: [
        "A–T ja G–C",
        "A–G ja C–T",
        "A–C ja G–T",
        "A–U ja G–C",
      ],
      correctIndex: 0,
      explanation:
        "DNA:ssa adeniini pariutuu tymiinin kanssa (A–T) ja guaniini sytosiinin kanssa (G–C). A–U esiintyy vain RNA:ssa.",
    },
    {
      id: "bi-q8",
      subject: "biologia",
      module: "Ekologia ja ekosysteemit",
      question: "Miksi energia vähenee siirryttäessä ravintoketjussa ylöspäin?",
      options: [
        "Osa energiasta kuluu eliöiden aineenvaihduntaan ja vapautuu lämpönä",
        "Energia katoaa kokonaan jokaisella tasolla",
        "Ylemmät eliöt eivät tarvitse energiaa",
        "Energia muuttuu takaisin auringonvaloksi",
      ],
      correctIndex: 0,
      explanation:
        "Vain noin 10 % energiasta siirtyy trofiatasolta seuraavalle; loput kuluu soluhengitykseen ja vapautuu lämpönä. Siksi ravintoketjut ovat lyhyitä.",
    },
  ],

  historia: [
    {
      id: "hi-q1",
      subject: "historia",
      module: "Suomen historia",
      question: "Minä vuonna Suomi itsenäistyi?",
      options: ["1917", "1918", "1809", "1906"],
      correctIndex: 0,
      explanation:
        "Suomi julistautui itsenäiseksi 6.12.1917. Vuonna 1809 Suomesta tuli autonominen suuriruhtinaskunta, ja 1918 käytiin sisällissota.",
    },
    {
      id: "hi-q2",
      subject: "historia",
      module: "Maailmanhistoria",
      question: "Mikä tapahtuma käynnisti ensimmäisen maailmansodan 1914?",
      options: [
        "Itävallan arkkiherttua Franz Ferdinandin murha Sarajevossa",
        "Saksan hyökkäys Puolaan",
        "Venäjän vallankumous",
        "Versailles'n rauha",
      ],
      correctIndex: 0,
      explanation:
        "Franz Ferdinandin murha kesäkuussa 1914 laukaisi suurvaltaliittoutumien ketjureaktion. Saksan hyökkäys Puolaan (1939) aloitti toisen maailmansodan.",
    },
    {
      id: "hi-q3",
      subject: "historia",
      module: "Lähdekritiikki",
      question: "Mikä kysymys on olennaisin lähdekritiikissä?",
      options: [
        "Kuka lähteen laati, milloin ja mihin tarkoitukseen",
        "Kuinka pitkä lähde on",
        "Onko lähde suomen- vai englanninkielinen",
        "Onko lähde painettu vai käsinkirjoitettu",
      ],
      correctIndex: 0,
      explanation:
        "Lähdekritiikissä arvioidaan tekijää, ajankohtaa, tarkoitusta ja näkökulmaa — ne kertovat lähteen luotettavuudesta ja mahdollisesta tarkoitushakuisuudesta.",
    },
    {
      id: "hi-q4",
      subject: "historia",
      module: "Maailmanhistoria",
      question: "Mitä kylmä sota tarkoitti?",
      options: [
        "Yhdysvaltain ja Neuvostoliiton jännitteistä kilpailua ilman suoraa sotaa",
        "Sotaa arktisilla alueilla",
        "Ensimmäisen maailmansodan alkuvaihetta",
        "Talvisotaa Suomen ja Neuvostoliiton välillä",
      ],
      correctIndex: 0,
      explanation:
        "Kylmä sota (n. 1947–1991) oli suurvaltojen ideologinen, poliittinen ja sotilaallinen vastakkainasettelu ilman suoraa aseellista konfliktia niiden välillä.",
    },
    {
      id: "hi-q5",
      subject: "historia",
      module: "Suomen historia",
      question: "Mikä sota käytiin Suomen ja Neuvostoliiton välillä 1939–1940?",
      options: ["Talvisota", "Jatkosota", "Lapin sota", "Sisällissota"],
      correctIndex: 0,
      explanation:
        "Talvisota käytiin 30.11.1939–13.3.1940. Jatkosota oli 1941–1944 ja Lapin sota 1944–1945 Saksaa vastaan.",
    },
    {
      id: "hi-q6",
      subject: "historia",
      module: "Maailmanhistoria",
      question: "Mikä oli teollisen vallankumouksen keskeinen muutos 1700–1800-luvuilla?",
      options: [
        "Koneellinen tuotanto ja tehdasteollisuus",
        "Maatalouden loppuminen",
        "Kaupungistumisen pysähtyminen",
        "Kaupankäynnin kieltäminen",
      ],
      correctIndex: 0,
      explanation:
        "Teollinen vallankumous siirsi tuotannon käsityöstä koneelliseen tehdastuotantoon (esim. höyrykone), mikä kiihdytti kaupungistumista ja muutti yhteiskuntarakennetta.",
    },
    {
      id: "hi-q7",
      subject: "historia",
      module: "Essee ja argumentaatio",
      question: "Mikä on historian esseessä vahvan argumentin tunnusmerkki?",
      options: [
        "Väite perustellaan konkreettisilla esimerkeillä ja syy-seuraussuhteilla",
        "Luetellaan mahdollisimman monta vuosilukua",
        "Kerrotaan tapahtumat vain aikajärjestyksessä",
        "Esitetään oma mielipide ilman perusteluja",
      ],
      correctIndex: 0,
      explanation:
        "Hyvä historiaessee perustelee väitteet esimerkeillä ja osoittaa syy-seuraussuhteita — ei pelkkää tapahtumien luettelointia tai perustelematonta mielipidettä.",
    },
    {
      id: "hi-q8",
      subject: "historia",
      module: "Suomen historia",
      question: "Minä vuonna Suomi liittyi Euroopan unioniin?",
      options: ["1995", "1991", "2000", "1917"],
      correctIndex: 0,
      explanation:
        "Suomi liittyi EU:hun 1.1.1995 kansanäänestyksen jälkeen. Euro otettiin käyttöön käteisenä 2002.",
    },
  ],

  psykologia: [
    {
      id: "ps-q1",
      subject: "psykologia",
      module: "Tutkimusmetodit",
      question: "Kokeessa tutkitaan unen vaikutusta muistiin. Mikä on riippumaton muuttuja?",
      options: ["Unen määrä", "Muistisuoritus", "Koehenkilön ikä", "Testin pituus"],
      correctIndex: 0,
      explanation:
        "Riippumaton muuttuja on se, jota tutkija manipuloi (unen määrä). Riippuva muuttuja on mitattava tulos (muistisuoritus).",
    },
    {
      id: "ps-q2",
      subject: "psykologia",
      module: "Kognitio ja muisti",
      question: "Mihin työmuistin kapasiteetti tyypillisesti rajoittuu kerrallaan?",
      options: [
        "Muutamaan yksikköön (noin 4–7)",
        "Rajattomaan määrään",
        "Yhteen asiaan",
        "Sataan yksikköön",
      ],
      correctIndex: 0,
      explanation:
        "Työmuisti käsittelee vain muutamaa asiaa kerrallaan (klassinen arvio 7±2, uudempi noin 4). Ryhmittely (chunking) auttaa muistamaan enemmän.",
    },
    {
      id: "ps-q3",
      subject: "psykologia",
      module: "Kehityspsykologia",
      question: "Kuka kehitti kognitiivisen kehityksen vaiheteorian?",
      options: ["Jean Piaget", "Sigmund Freud", "Ivan Pavlov", "B. F. Skinner"],
      correctIndex: 0,
      explanation:
        "Piaget kuvasi lapsen ajattelun kehitysvaiheet (esim. sensomotorinen, konkreettisten operaatioiden vaihe). Pavlov ja Skinner tutkivat oppimista, Freud psykodynamiikkaa.",
    },
    {
      id: "ps-q4",
      subject: "psykologia",
      module: "Kognitio ja muisti",
      question: "Mitä klassinen ehdollistuminen tarkoittaa?",
      options: [
        "Neutraali ärsyke liitetään reaktioon toistuvan yhdistämisen kautta",
        "Käyttäytymistä vahvistetaan palkkiolla",
        "Oppiminen tapahtuu mallia matkimalla",
        "Muisti tallentaa tietoa pysyvästi",
      ],
      correctIndex: 0,
      explanation:
        "Klassisessa ehdollistumisessa (Pavlov) neutraali ärsyke alkaa laukaista reaktion, kun se on toistuvasti yhdistetty luontaiseen ärsykkeeseen. Palkkio-oppiminen on operanttia ehdollistumista.",
    },
    {
      id: "ps-q5",
      subject: "psykologia",
      module: "Tutkimusmetodit",
      question: "Miksi kontrolliryhmä on tärkeä kokeessa?",
      options: [
        "Se antaa vertailukohdan, johon koeryhmän tuloksia verrataan",
        "Se kaksinkertaistaa otoskoon",
        "Se korvaa tilastollisen analyysin",
        "Se takaa, että tulos on aina merkitsevä",
      ],
      correctIndex: 0,
      explanation:
        "Kontrolliryhmä ei saa käsittelyä, joten sen avulla nähdään, johtuuko koeryhmän muutos todella manipuloidusta muuttujasta eikä muista tekijöistä.",
    },
    {
      id: "ps-q6",
      subject: "psykologia",
      module: "Sosiaalipsykologia",
      question: "Mitä ryhmäajattelu (groupthink) tarkoittaa?",
      options: [
        "Yhtenäisyyden tavoittelu heikentää kriittistä arviointia ryhmässä",
        "Ryhmä tekee aina parempia päätöksiä kuin yksilö",
        "Jokainen ryhmän jäsen ajattelee täysin itsenäisesti",
        "Ryhmässä ei synny mielipide-eroja koskaan",
      ],
      correctIndex: 0,
      explanation:
        "Ryhmäajattelussa yksimielisyyden paine tukahduttaa eriävät näkemykset, mikä voi johtaa huonoihin päätöksiin, koska vaihtoehtoja ei arvioida kriittisesti.",
    },
    {
      id: "ps-q7",
      subject: "psykologia",
      module: "Persoonallisuus",
      question: "Mihin aivojen osaan liitetään erityisesti tunteiden, kuten pelon, käsittely?",
      options: ["Mantelitumake (amygdala)", "Pikkuaivot", "Näköaivokuori", "Aivolisäke"],
      correctIndex: 0,
      explanation:
        "Mantelitumake on keskeinen tunteiden, erityisesti pelon ja uhkan, käsittelyssä. Pikkuaivot säätelevät liikkeitä ja tasapainoa.",
    },
    {
      id: "ps-q8",
      subject: "psykologia",
      module: "Tutkimusmetodit",
      question: "Mitä tarkoittaa tutkimuksen reliabiliteetti?",
      options: [
        "Mittauksen toistettavuutta ja johdonmukaisuutta",
        "Sitä, mittaako tutkimus oikeaa asiaa",
        "Otoksen kokoa",
        "Tutkimuksen eettisyyttä",
      ],
      correctIndex: 0,
      explanation:
        "Reliabiliteetti = tulosten johdonmukaisuus ja toistettavuus. Validiteetti puolestaan kertoo, mittaako tutkimus juuri sitä, mitä on tarkoitus.",
    },
  ],

  terveystieto: [
    {
      id: "tt-q1",
      subject: "terveystieto",
      module: "Hyvinvointi ja elämäntavat",
      question: "Mikä kuvaa parhaiten terveyden kokonaisvaltaista määritelmää (WHO)?",
      options: [
        "Fyysinen, psyykkinen ja sosiaalinen hyvinvointi, ei vain sairauden puuttuminen",
        "Pelkästään sairauksien puuttuminen",
        "Hyvä fyysinen kunto",
        "Kyky käydä töissä",
      ],
      correctIndex: 0,
      explanation:
        "WHO määrittelee terveyden fyysisen, psyykkisen ja sosiaalisen hyvinvoinnin tilaksi — ei pelkäksi sairauden puuttumiseksi. Tämä on terveystiedon peruskäsite.",
    },
    {
      id: "tt-q2",
      subject: "terveystieto",
      module: "Mielenterveys",
      question: "Mikä on suojaava tekijä mielenterveydelle?",
      options: [
        "Läheiset ihmissuhteet ja sosiaalinen tuki",
        "Jatkuva univaje",
        "Pitkittynyt yksinäisyys",
        "Krooninen stressi",
      ],
      correctIndex: 0,
      explanation:
        "Suojaavat tekijät (esim. sosiaalinen tuki, hallinnan tunne) vahvistavat mielenterveyttä. Univaje, yksinäisyys ja krooninen stressi ovat kuormittavia riskitekijöitä.",
    },
    {
      id: "tt-q3",
      subject: "terveystieto",
      module: "Hyvinvointi ja elämäntavat",
      question: "Kuinka paljon UKK-instituutin liikuntasuositus suosittaa nuorille reipasta liikuntaa viikossa?",
      options: [
        "Vähintään useita tunteja, päivittäin liikettä",
        "Kerran kuukaudessa",
        "Vain kilpaurheilijoille",
        "Liikuntaa ei suositella nuorille",
      ],
      correctIndex: 0,
      explanation:
        "Nuorille suositellaan liikuntaa monipuolisesti ja päivittäin (useita tunteja viikossa). Säännöllinen liikunta tukee sekä fyysistä että psyykkistä hyvinvointia.",
    },
    {
      id: "tt-q4",
      subject: "terveystieto",
      module: "Päihteet ja riippuvuus",
      question: "Mikä kuvaa fyysistä riippuvuutta?",
      options: [
        "Elimistö on tottunut aineeseen ja reagoi vieroitusoirein ilman sitä",
        "Halu käyttää ainetta vain sosiaalisissa tilanteissa",
        "Aineen käyttö ei aiheuta mitään muutoksia",
        "Riippuvuus on aina pelkästään psyykkistä",
      ],
      correctIndex: 0,
      explanation:
        "Fyysisessä riippuvuudessa elimistö on mukautunut aineeseen, ja käytön lopettaminen aiheuttaa vieroitusoireita. Psyykkinen riippuvuus on pakonomaista halua käyttää.",
    },
    {
      id: "tt-q5",
      subject: "terveystieto",
      module: "Hyvinvointi ja elämäntavat",
      question: "Miksi riittävä uni on tärkeää oppimiselle?",
      options: [
        "Uni vahvistaa muistijälkiä ja palauttaa aivoja",
        "Uni ei vaikuta oppimiseen",
        "Uni heikentää muistia",
        "Vähäinen uni parantaa keskittymistä",
      ],
      correctIndex: 0,
      explanation:
        "Unen aikana muistijäljet vahvistuvat (konsolidaatio) ja aivot palautuvat. Univaje heikentää keskittymistä, muistia ja mielialaa.",
    },
    {
      id: "tt-q6",
      subject: "terveystieto",
      module: "Yhteisö ja turvallisuus",
      question: "Mitä ehkäisevä terveydenhuolto tarkoittaa?",
      options: [
        "Sairauksien ennaltaehkäisyä ja terveyden edistämistä",
        "Vain jo syntyneiden sairauksien hoitoa",
        "Pelkkää lääkehoitoa",
        "Sairaalahoitoa akuuteissa tilanteissa",
      ],
      correctIndex: 0,
      explanation:
        "Ehkäisevä terveydenhuolto (esim. neuvolat, rokotukset, terveystarkastukset) pyrkii estämään sairauksia ja edistämään terveyttä ennen ongelmien syntyä.",
    },
    {
      id: "tt-q7",
      subject: "terveystieto",
      module: "Mielenterveys",
      question: "Mikä on rakentava tapa käsitellä stressiä?",
      options: [
        "Tunnistaa kuormitus ja käyttää palauttavia keinoja, kuten liikuntaa ja lepoa",
        "Kieltää stressi kokonaan",
        "Lisätä jatkuvaa valvomista",
        "Vetäytyä kaikista ihmissuhteista",
      ],
      correctIndex: 0,
      explanation:
        "Rakentava stressinhallinta yhdistää kuormituksen tunnistamisen ja palauttavat keinot (lepo, liikunta, sosiaalinen tuki). Välttäminen ja eristäytyminen pahentavat tilannetta.",
    },
    {
      id: "tt-q8",
      subject: "terveystieto",
      module: "Yhteisö ja turvallisuus",
      question: "Mikä on terveyserojen keskeinen taustatekijä yhteiskunnassa?",
      options: [
        "Sosioekonominen asema (koulutus, tulot, ammatti)",
        "Pelkkä sattuma",
        "Ainoastaan perimä",
        "Asuinpaikan sääolot",
      ],
      correctIndex: 0,
      explanation:
        "Sosioekonominen asema on vahvasti yhteydessä terveyteen: koulutus, tulot ja ammatti vaikuttavat elintapoihin, palveluihin ja elinajanodotteeseen.",
    },
  ],

  yhteiskuntaoppi: [
    {
      id: "yo-q1",
      subject: "yhteiskuntaoppi",
      module: "Suomen yhteiskunta ja politiikka",
      question: "Kuinka monta kansanedustajaa Suomen eduskunnassa on?",
      options: ["200", "100", "150", "300"],
      correctIndex: 0,
      explanation: "Eduskunnassa on 200 kansanedustajaa, jotka valitaan neljän vuoden välein suhteellisilla vaaleilla.",
    },
    {
      id: "yo-q2",
      subject: "yhteiskuntaoppi",
      module: "Talous ja työelämä",
      question: "Mitä inflaatio tarkoittaa?",
      options: [
        "Yleisen hintatason nousua ja rahan ostovoiman heikkenemistä",
        "Hintojen laskua",
        "Työttömyyden kasvua",
        "Valtion velan vähenemistä",
      ],
      correctIndex: 0,
      explanation:
        "Inflaatiossa hintataso nousee, jolloin samalla rahalla saa vähemmän. Hintojen lasku on deflaatiota.",
    },
    {
      id: "yo-q3",
      subject: "yhteiskuntaoppi",
      module: "Suomen yhteiskunta ja politiikka",
      question: "Mikä on eduskunnan keskeisin tehtävä?",
      options: [
        "Säätää lait ja päättää valtion budjetista",
        "Johtaa poliisia",
        "Toimia tuomioistuimena",
        "Nimittää presidentin",
      ],
      correctIndex: 0,
      explanation:
        "Eduskunta käyttää lainsäädäntövaltaa ja päättää valtion taloudesta. Tuomiovalta kuuluu riippumattomille tuomioistuimille (vallan kolmijako-oppi).",
    },
    {
      id: "yo-q4",
      subject: "yhteiskuntaoppi",
      module: "Talous ja työelämä",
      question: "Mitä bruttokansantuote (BKT) mittaa?",
      options: [
        "Maassa tuotettujen tavaroiden ja palvelujen kokonaisarvoa",
        "Valtion velan määrää",
        "Väestön kokonaismäärää",
        "Työttömien lukumäärää",
      ],
      correctIndex: 0,
      explanation:
        "BKT mittaa tietyn ajanjakson aikana tuotettujen lopputuotteiden ja palvelujen arvoa. Se on keskeinen talouskasvun mittari.",
    },
    {
      id: "yo-q5",
      subject: "yhteiskuntaoppi",
      module: "Oikeus ja kansalaisuus",
      question: "Mihin perustuu vallan kolmijako-oppi?",
      options: [
        "Lainsäädäntö-, toimeenpano- ja tuomiovallan erottamiseen",
        "Puolueiden lukumäärään",
        "Kuntien itsehallintoon",
        "Verotuksen tasoon",
      ],
      correctIndex: 0,
      explanation:
        "Montesquieun kolmijako-opissa valta jaetaan lainsäädäntö- (eduskunta), toimeenpano- (hallitus) ja tuomiovaltaan (tuomioistuimet), jotta valta ei keskity.",
    },
    {
      id: "yo-q6",
      subject: "yhteiskuntaoppi",
      module: "EU ja globaali yhteiskunta",
      question: "Mikä on Euroopan keskuspankin (EKP) päätehtävä?",
      options: [
        "Ylläpitää euroalueen hintavakautta",
        "Kerätä jäsenmaiden verot",
        "Päättää jäsenmaiden budjeteista",
        "Johtaa EU:n ulkopolitiikkaa",
      ],
      correctIndex: 0,
      explanation:
        "EKP vastaa euroalueen rahapolitiikasta ja pyrkii hintavakauteen (inflaatiotavoite lähellä 2 %). Se ei kerää veroja eikä päätä kansallisista budjeteista.",
    },
    {
      id: "yo-q7",
      subject: "yhteiskuntaoppi",
      module: "Media ja vaikuttaminen",
      question: "Mitä lähdekriittisyys tarkoittaa mediaa käytettäessä?",
      options: [
        "Tiedon luotettavuuden ja alkuperän arviointia",
        "Kaikkien uutisten pitämistä totuutena",
        "Vain otsikoiden lukemista",
        "Sosiaalisen median välttämistä",
      ],
      correctIndex: 0,
      explanation:
        "Lähdekriittisyys tarkoittaa tiedon alkuperän, tarkoituksen ja luotettavuuden arviointia — erityisen tärkeää sosiaalisen median ja disinformaation aikakaudella.",
    },
    {
      id: "yo-q8",
      subject: "yhteiskuntaoppi",
      module: "Talous ja työelämä",
      question: "Mitä progressiivinen verotus tarkoittaa?",
      options: [
        "Veroprosentti kasvaa tulojen kasvaessa",
        "Kaikki maksavat saman euromäärän",
        "Veroprosentti laskee tulojen kasvaessa",
        "Vain yritykset maksavat veroa",
      ],
      correctIndex: 0,
      explanation:
        "Progressiivisessa verotuksessa suurituloiset maksavat suuremman osuuden tuloistaan veroa. Suomen ansiotuloverotus on progressiivista ja tasaa tuloeroja.",
    },
  ],
};

/** @param {string} subjectId */
export function getPracticeQuestions(subjectId) {
  return PRACTICE_QUESTIONS[subjectId] ?? [];
}

/** @param {string} subjectId @param {string} questionId */
export function getPracticeQuestion(subjectId, questionId) {
  return getPracticeQuestions(subjectId).find((q) => q.id === questionId) ?? null;
}

export function subjectHasPractice(subjectId) {
  return getPracticeQuestions(subjectId).length > 0;
}

/** Aineen osa-alueet (modules) tehtävistä. */
export function practiceModules(subjectId) {
  const set = new Set(getPracticeQuestions(subjectId).map((q) => q.module));
  return [...set];
}
