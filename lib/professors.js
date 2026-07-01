/** LaudaturPro — AI-professorit aineittain. */

export const PROFESSOR_GROUPS = [
  {
    id: "matematiikka",
    title: "Matematiikka",
    professors: [
      {
        id: "matikka-pitka",
        role: "Pitkä matematiikka",
        bio: "Derivaatat, integraalit, funktiot ja todistusvalinnan pisteytys yo-tasolla.",
        initials: "MP",
        accent: "from-blue-600 to-indigo-800",
      },
      {
        id: "matikka-lyhyt",
        role: "Lyhyt matematiikka",
        bio: "Prosentit, funktiot, tilastot ja todennäköisyys selkeästi.",
        initials: "ML",
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
        role: "Äidinkieli",
        bio: "Kirjoitelmat, tekstianalyysi ja esseetekniikka yo-kokeeseen.",
        initials: "ÄK",
        accent: "from-violet-600 to-purple-800",
      },
      {
        id: "englanti",
        role: "Englanti",
        bio: "Kielioppi, sanasto, luetunymmärtäminen ja kirjoitelmat.",
        initials: "EN",
        accent: "from-rose-600 to-red-800",
      },
      {
        id: "ruotsi",
        role: "Ruotsi",
        bio: "Toinen kotimainen kieli — rakenteet, sanasto ja yo-koetyyppiset tehtävät.",
        initials: "RU",
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
        role: "Fysiikka",
        bio: "Mekaniikka, sähkö ja aaltoliike — teoria ja laskurutiinit.",
        initials: "FY",
        accent: "from-cyan-600 to-teal-800",
      },
      {
        id: "kemia",
        role: "Kemia",
        bio: "Stökiometria, happo-pohja ja orgaaninen kemia.",
        initials: "KE",
        accent: "from-emerald-600 to-green-800",
      },
      {
        id: "biologia",
        role: "Biologia",
        bio: "Solu, ekologia ja evoluutio — muistilistat ja koesimulaatiot.",
        initials: "BI",
        accent: "from-lime-600 to-green-800",
      },
      {
        id: "historia",
        role: "Historia",
        bio: "Aikajänteet, lähdekritiikki ja yo-koetyyppiset esseet.",
        initials: "HI",
        accent: "from-orange-600 to-amber-800",
      },
      {
        id: "psykologia",
        role: "Psykologia",
        bio: "Kognitio, kehityspsykologia ja tutkimusmetodit.",
        initials: "PS",
        accent: "from-fuchsia-600 to-pink-800",
      },
    ],
  },
];

export const ALL_PROFESSORS = PROFESSOR_GROUPS.flatMap((g) =>
  g.professors.map((p) => ({ ...p, group: g.title }))
);
