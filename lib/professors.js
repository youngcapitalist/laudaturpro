/** LaudaturPro — AI-professorit aineittain (myyntisivu). */

export const PROFESSOR_GROUPS = [
  {
    id: "matematiikka",
    title: "Matematiikka",
    professors: [
      {
        id: "matikka-pitka",
        name: "Mikko Salminen",
        role: "Pitkä matematiikka",
        bio: "15 vuotta yo-matikan valmennusta. Erikoistunut derivaattoihin, integraaleihin ja todistusvalinnan pisteytykseen.",
        initials: "MS",
        accent: "from-blue-600 to-indigo-800",
      },
      {
        id: "matikka-lyhyt",
        name: "Sanna Korhonen",
        role: "Lyhyt matematiikka",
        bio: "Selittää prosentit, funktiot ja tilastot niin, että L:stä tulee C — ja C:stä B.",
        initials: "SK",
        accent: "from-sky-600 to-blue-800",
      },
    ],
  },
  {
    id: "kielet",
    title: "Kielet",
    professors: [
      {
        id: "aidinkieli",
        name: "Eeva Laitinen",
        role: "Äidinkieli",
        bio: "Entinen yo-arvioija. Kirjoitelmat, analyysi ja esseetekniikka — kaikki mitä laudaturiin tarvitaan.",
        initials: "EL",
        accent: "from-violet-600 to-purple-800",
      },
      {
        id: "englanti",
        name: "James Hart",
        role: "Englanti",
        bio: "Kieli ja kirjallisuus, kuuntelu ja luetunymmärtäminen. B2 → laudatur-polku selkeästi.",
        initials: "JH",
        accent: "from-rose-600 to-red-800",
      },
      {
        id: "ruotsi",
        name: "Anna Fors",
        role: "Ruotsi",
        bio: "Toinen kotimainen kieli ilman stressiä. Rakenteet, sanasto ja yo-koetyyppiset tehtävät.",
        initials: "AF",
        accent: "from-yellow-500 to-amber-700",
      },
    ],
  },
  {
    id: "reaali",
    title: "Reaaliaineet",
    professors: [
      {
        id: "fysiikka",
        name: "Timo Rantanen",
        role: "Fysiikka",
        bio: "Mekaniikka, sähkö ja aaltoliike yo-tasolla. Teoria + laskurutiinit kuntoon.",
        initials: "TR",
        accent: "from-cyan-600 to-teal-800",
      },
      {
        id: "kemia",
        name: "Liisa Mäkelä",
        role: "Kemia",
        bio: "Stökiometria, happo-pohja ja orgaaninen kemia — selkeät malliratkaisut.",
        initials: "LM",
        accent: "from-emerald-600 to-green-800",
      },
      {
        id: "biologia",
        name: "Petra Niemi",
        role: "Biologia",
        bio: "Ekosysteemit, solu ja evoluutio. Muistilistat ja koesimulaatiot mukana.",
        initials: "PN",
        accent: "from-lime-600 to-green-800",
      },
      {
        id: "historia",
        name: "Olli Virtanen",
        role: "Historia",
        bio: "Aikajänteet, lähdekritiikki ja yo-koetyyppiset esseet historiasta.",
        initials: "OV",
        accent: "from-orange-600 to-amber-800",
      },
      {
        id: "psykologia",
        name: "Helena Parkko",
        role: "Psykologia",
        bio: "Kognitio, kehityspsykologia ja tutkimusmetodit — tiivis ja käytännönläheinen.",
        initials: "HP",
        accent: "from-fuchsia-600 to-pink-800",
      },
    ],
  },
];

export const ALL_PROFESSORS = PROFESSOR_GROUPS.flatMap((g) =>
  g.professors.map((p) => ({ ...p, group: g.title }))
);
