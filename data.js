/* =====================================================================
   ചരിത്ര പ്രസിദ്ധമായ കോട്ടപ്പടി തിരുനാൾ 2027 — സെന്റ് ലാസർ ചർച്ച്
   ---------------------------------------------------------------------
   വെബ്സൈറ്റിലെ എല്ലാ വിവരങ്ങളും ഈ ഫയലിൽ നിന്നാണ് വരുന്നത്.
   ഇവിടെ മാറ്റിയാൽ സൈറ്റിൽ തനിയെ മാറും.

   സമയം എഴുതേണ്ട രീതി: "18:30" (24 മണിക്കൂർ). രാത്രി 12 = "24:00"
   സമയം അറിയില്ലെങ്കിൽ t: "" എന്ന് ഇടുക.
   ===================================================================== */

window.FEAST = {
  churchName: "സെന്റ് ലാസർ ചർച്ച്",
  churchNameEn: "St. Lazarus Church",
  place: "കോട്ടപ്പടി",
  placeEn: "Kottapadi",
  diocese: "തൃശ്ശൂർ അതിരൂപത (സീറോ മലബാർ)",
  title: "ചരിത്ര പ്രസിദ്ധമായ കോട്ടപ്പടി തിരുനാൾ",
  year: 2027,
  // കൗണ്ട്ഡൗൺ: ആദ്യം കൊടിയേറ്റത്തിലേക്ക്, പിന്നെ തിരുനാളിലേക്ക്
  countdown: [
    { at: "2026-12-25T17:00", label: "കൊടിയേറ്റത്തിന്" },
    { at: "2026-12-31T17:00", label: "തിരുനാളിന്" },
  ],
  liveFrom: "2026-12-31", liveTo: "2027-01-04",
  updated: "20-11-2026",
  siteUrl: "https://keralaclassifycom-sketch.github.io/kottapadi-thirunal/",   // QR കോഡ് ഈ ലിങ്കിലേക്ക്
  mapsLink: "https://www.google.com/maps/search/?api=1&query=St+Lazarus+Church+Kottapadi",
  whatsappNumber: "918086833031",          // ലിസ്റ്റിൽ ചേർക്കാൻ
  whatsappShow: "80868 33031",
  whatsappGroup: "https://chat.whatsapp.com/DBBSOmteS5uAFUQaBGhCig",
  liveLink: "",                            // യൂട്യൂബ്/ഫേസ്ബുക്ക് ലൈവ് ലിങ്ക്
};

/* --------------------------------------------------------------
   മേളം / പരിപാടി തരങ്ങൾ
   -------------------------------------------------------------- */
window.MELAM_TYPES = {
  band:       { name: "ബാൻഡ് സെറ്റ്",  icon: "🥁", color: "#ffd60a" },
  nadaswaram: { name: "നാദസ്വരം",       icon: "🪇", color: "#22c55e" },
  chenda:     { name: "ചെണ്ടമേളം",      icon: "🪘", color: "#ff3b5c" },
  ganamela:   { name: "ഗാനമേള",         icon: "🎻", color: "#5ec8ff" },
  fireworks:  { name: "വർണ്ണമഴ",        icon: "🎇", color: "#a855f7" },
  lights:     { name: "ദീപാലങ്കാരം",    icon: "💡", color: "#ff8a00" },
  pandal:     { name: "പന്തൽ",          icon: "🎪", color: "#e4167f" },
  charity:    { name: "കാരുണ്യം",       icon: "🏥", color: "#14b8a6" },
  church:     { name: "തിരുകർമ്മം",     icon: "⛪", color: "#ffcf4a" },
};

/* --------------------------------------------------------------
   ദിവസങ്ങൾ
   events: { t: സമയം, title: ആര് ഒരുക്കുന്നു, troupe: പരിപാടി/ടീം,
             type: മുകളിലെ തരം, place: സ്ഥലം (അറിയാമെങ്കിൽ) }
   units: true ആയ ദിവസം — താഴെയുള്ള UNITS (അമ്പ്, വള) ലിസ്റ്റ് തനിയെ ചേരും
   -------------------------------------------------------------- */
window.DAYS = [
  {
    id: "dec25", date: "2026-12-25", color: "#e4167f",
    name: "കൊടിയേറ്റം", sub: "തിരുനാൾ കൊടിയേറ്റം",
    events: [
      { t: "", title: "തിരുനാൾ കൊടിയേറ്റം", troupe: "", type: "church", place: "പള്ളി മുറ്റം", highlight: true },
    ],
  },
  {
    id: "dec31", date: "2026-12-31", color: "#5ec8ff",
    name: "ഗാനമേള", sub: "വർഷാവസാന രാവ്",
    events: [
      { club: "kos", t: "", title: "KINGS OF SOUTH", troupe: "പാല കമ്മ്യൂണിക്കേഷൻ ഗാനമേള", type: "ganamela", place: "", highlight: true },
    ],
  },
  {
    id: "jan1", date: "2027-01-01", color: "#ff3b5c",
    name: "നില പന്തൽ & ദീപക്കാഴ്ച", sub: "പുതുവത്സര ദിനം",
    events: [
      { club: "kpk", t: "", title: "കോട്ടപ്പടി പ്രവാസി കൂട്ടായ്മ (K.P.K U.A.E)", troupe: "അതിഗംഭീര രൂപക്കൂട് നില പന്തൽ — ഭാരത് പന്തൽ വർക്ക്സ് ചെറുതുരുത്തി", type: "pandal", place: "", highlight: true },
      { club: "kcc", t: "", title: "കോട്ടപ്പടി സെലിബ്രേഷൻ കമ്മിറ്റി (കെ.സി.സി)", troupe: "Alappuzha Blue Diamonds 2.0", type: "ganamela", place: "" },
      { club: "kcc", t: "", title: "കോട്ടപ്പടി സെലിബ്രേഷൻ കമ്മിറ്റി (കെ.സി.സി)", troupe: "പ്രദക്ഷിണവീഥി ദീപാലങ്കാരം", type: "lights", place: "പ്രദക്ഷിണവീഥി" },
      { club: "sehion", t: "", title: "SEHION FEST (സെഹിയോൻ കുടുംബ കൂട്ടായ്മ)", troupe: "യുവജന പോർക്കുളം", type: "lights", place: "" },
      { club: "westgate", t: "", title: "വെസ്റ്റ്ഗേറ്റ് ക്ലബ്ബ് കോട്ടപ്പടി", troupe: "പ്രദക്ഷിണവീഥി ദീപാലങ്കാരം", type: "lights", place: "പ്രദക്ഷിണവീഥി" },
      { club: "kos", t: "", title: "KINGS OF SOUTH", troupe: "തിരുനാൾ വീഥി ദീപാലങ്കാരം", type: "lights", place: "തിരുനാൾ വീഥി" },
    ],
  },
  {
    id: "jan2", date: "2027-01-02", color: "#ffd60a", units: true,
    name: "അമ്പ് – വള എഴുന്നള്ളിപ്പ്", sub: "21 യൂണിറ്റുകൾ · ബാൻഡ് മേളം",
    events: [
      { club: "stories", t: "", title: "കോട്ടപ്പടി സ്റ്റോറീസ് കമ്മിറ്റി ഒരുക്കുന്ന രാപകൽ തിരുനാൾ", troupe: "GRACE MUSIC BAND TVM · AMEN MUSIC BAND TVM", type: "band", place: "", highlight: true },
    ],
  },
  {
    id: "jan3", date: "2027-01-03", color: "#3b82f6",
    name: "ബാൻഡ് മേളം & വർണ്ണമഴ", sub: "ക്ലബ്ബുകളുടെ ബാൻഡ് · വെടിക്കെട്ട്",
    events: [
      { club: "macksolz", t: "", title: "MACKSOLZ KOTTAPPADI", troupe: "NEW VOICE PALA", type: "band", place: "" },
      { club: "blackorpz", t: "", title: "BLACKORPZ KOTTAPADI", troupe: "RAGADEEPAM MUNDATHIKODE", type: "band", place: "" },
      { club: "radox", t: "", title: "RADOX KOTTAPADI", troupe: "YOUNG STARS THIRUVANANTHAPURAM", type: "band", place: "" },
      { club: "szfest", t: "", title: "SZ FEST", troupe: "VOICE OF PALAKKAD", type: "band", place: "" },
      { club: "stories", t: "", title: "കോട്ടപ്പടി സ്റ്റോറീസ് — രാപകൽ തിരുനാൾ 2027", troupe: "GRACE MUSIC BAND TVM (അച്ഛനും പിള്ളേരും)", type: "band", place: "", highlight: true },
      { club: "teasers", t: "", title: "TEASERS KOTTAPADI", troupe: "ST. MARY'S VARANDARAPPILLY", type: "band", place: "" },
      { club: "cb", t: "19:00", title: "Christian Brothers Kottapadi", troupe: "അതിഗംഭീര വർണ്ണവിസ്മയം", type: "fireworks", place: "", highlight: true },
      { club: "westgate", t: "", title: "വെസ്റ്റ്ഗേറ്റ് ക്ലബ്ബ് കോട്ടപ്പടി", troupe: "വർണ്ണമഴ", type: "fireworks", place: "", highlight: true },
      { club: "palliyangadi", t: "", title: "ടീം പള്ളിയങ്ങാടി കോട്ടപ്പടി", troupe: "നന്മ 2027", type: "charity", place: "" },
    ],
  },
  {
    id: "jan4", date: "2027-01-04", color: "#22c55e",
    name: "തിരുനാൾ സമാപനം", sub: "വിവരങ്ങൾ ഉടൻ",
    events: [
      { t: "", title: "പരിപാടികളുടെ വിവരങ്ങൾ ഉടൻ ചേർക്കും", troupe: "", type: "church", place: "" },
    ],
  },
];

/* --------------------------------------------------------------
   ജനുവരി 2 — യൂണിറ്റുകളിൽ നിന്നുള്ള അമ്പ്, വള എഴുന്നള്ളിപ്പുകൾ
   from / to : എഴുന്നള്ളിപ്പ് സമയം
   type      : band / nadaswaram / chenda
   start     : എഴുന്നള്ളിപ്പ് തുടങ്ങുന്ന സ്ഥലം (അറിയാമെങ്കിൽ എഴുതുക)
   via       : വഴിയിലെ പ്രധാന സ്ഥലങ്ങൾ ["സ്ഥലം 1", "സ്ഥലം 2"] (അറിയാമെങ്കിൽ)
   path      : 3D മാപ്പിലെ വഴി [[x,z],...] — ഇല്ലെങ്കിൽ ഏകദേശ വഴി തനിയെ വരച്ചുകൊള്ളും
   -------------------------------------------------------------- */
window.UNITS = [
  { n: "സെഹിയോൻ ഫെസ്റ്റ്",   from: "18:00", to: "24:00", type: "band",       troupe: "അച്ഛനും പിള്ളേരും (Grace Music Band TVM)" },
  { n: "ജോർദ്ദാൻ",            from: "13:00", to: "17:00", type: "band",       troupe: "ആമേൻ മ്യൂസിക് ബാൻഡ് തിരുവനന്തപുരം" },
  { n: "കർമ്മൽ",              from: "08:30", to: "12:30", type: "band",       troupe: "ന്യൂ വോയിസ് പട്ടാമ്പി" },
  { n: "ബെത് സെയ്ദാ",        from: "09:00", to: "13:00", type: "band",       troupe: "മെലഡി വോയിസ് തിരൂർ" },
  { n: "ടീം ഏദൻ",            from: "14:00", to: "24:00", type: "band",       troupe: "നാദം മ്യൂസിക് ബാൻഡ് കോഴിക്കോട്" },
  { n: "സിയോൺ",              from: "17:30", to: "24:00", type: "band",       troupe: "ആമേൻ മ്യൂസിക് ബാൻഡ് തിരുവനന്തപുരം" },
  { n: "മോറിയ",               from: "08:30", to: "13:00", type: "band",       troupe: "ന്യൂ രാഗം തിരൂർ" },
  { n: "ഇസ്രായേൽ",           from: "13:30", to: "24:00", type: "band",       troupe: "ന്യൂ സംഗീത് തിരൂർ" },
  { n: "നായിം",               from: "14:30", to: "24:00", type: "band",       troupe: "ഡോൺ ബോസ്കോ കൊച്ചി" },
  { n: "ബത് ലേഹം",           from: "13:00", to: "17:00", type: "band",       troupe: "ആമേൻ മ്യൂസിക് ബാൻഡ് തിരുവനന്തപുരം" },
  { n: "ടൗൺ വള",              from: "14:00", to: "24:00", type: "band",       troupe: "ജെസ്ന മ്യൂസിക് ബാൻഡ് തിരുവനന്തപുരം" },
  { n: "ജെറുസേലം",            from: "08:30", to: "12:30", type: "band",       troupe: "ഡ്രീംസ് ഓഫ് ഏഞ്ചൽ തിരുവനന്തപുരം" },
  { n: "സീനായ്",              from: "08:30", to: "12:30", type: "band",       troupe: "ഡിവൈൻ മ്യൂസിക് ബാൻഡ് തിരുവനന്തപുരം" },
  { n: "ബെഥനി",               from: "08:30", to: "12:30", type: "band",       troupe: "സംഗീത മേലഡൂർ" },
  { n: "താബോർ",               from: "08:30", to: "12:30", type: "band",       troupe: "റോയൽ വോയിസ് അമ്പല്ലൂർ" },
  { n: "കഫർണ്ണാം",            from: "13:30", to: "17:00", type: "band",       troupe: "റോയൽ വോയിസ് അമ്പല്ലൂർ" },
  { n: "മമ്മിയൂർ ദേശം",       sub: "കാന, നസ്രത്ത്, ഗലീലി", from: "09:00", to: "17:00", type: "band", troupe: "GRACE MUSIC BAND TVM" },
  { n: "തിബേരിയൂസ്",          from: "14:30", to: "24:00", type: "nadaswaram", troupe: "ഗുരുവായൂർ നാദലയം — രവിചന്ദ്രൻ നാദസ്വരം–തകിൽ സംഘം" },
  { n: "എമ്മാവൂസ്",           from: "17:00", to: "24:00", type: "nadaswaram", troupe: "കോട്ടപ്പടി ഉണ്ണിക്കുട്ടൻ & ടീം" },
  { n: "ഗാഗുൽത്താ",           from: "17:00", to: "22:00", type: "chenda",     troupe: "നിഖിൽ പാവറട്ടി & ടീം" },
  { n: "യൂദയ",                from: "09:00", to: "16:00", type: "chenda",     troupe: "നിഖിൽ പാവറട്ടി & ടീം" },
];

/* --------------------------------------------------------------
   ക്ലബ്ബുകളും കമ്മിറ്റികളും
   ഓരോ ക്ലബ്ബിന്റെയും പരിപാടികൾ മുകളിലെ DAYS-ൽ  club: "id"  എന്ന്
   ചേർത്തവയിൽ നിന്ന് തനിയെ വരും.
   mono  : ബാഡ്ജിൽ കാണിക്കുന്ന ചുരുക്കപ്പേര് (2–3 അക്ഷരം)
   logo  : ക്ലബ്ബിന്റെ ലോഗോ ഉണ്ടെങ്കിൽ "images/clubs/peru.png"
   unit  : ജനുവരി 2-ലെ എഴുന്നള്ളിപ്പ് യൂണിറ്റുമായി ബന്ധമുണ്ടെങ്കിൽ യൂണിറ്റിന്റെ പേര്
   -------------------------------------------------------------- */
window.CLUBS = [
  { id: "kos",          name: "KINGS OF SOUTH",                   mono: "KoS", color: "#ffd60a", logo: "" },
  { id: "kpk",          name: "കോട്ടപ്പടി പ്രവാസി കൂട്ടായ്മ",      en: "K.P.K U.A.E", mono: "KPK", color: "#22c55e", logo: "" },
  { id: "kcc",          name: "കോട്ടപ്പടി സെലിബ്രേഷൻ കമ്മിറ്റി",   en: "K.C.C", mono: "KCC", color: "#5ec8ff", logo: "" },
  { id: "sehion",       name: "SEHION FEST",                      en: "സെഹിയോൻ കുടുംബ കൂട്ടായ്മ", mono: "SF", color: "#e4167f", logo: "", unit: "സെഹിയോൻ ഫെസ്റ്റ്" },
  { id: "westgate",     name: "വെസ്റ്റ്ഗേറ്റ് ക്ലബ്ബ് കോട്ടപ്പടി",   en: "Westgate Club", mono: "WG", color: "#a855f7", logo: "" },
  { id: "stories",      name: "കോട്ടപ്പടി സ്റ്റോറീസ്",              en: "Kottapadi Stories Committee", mono: "KS", color: "#ff8a00", logo: "" },
  { id: "macksolz",     name: "MACKSOLZ KOTTAPPADI",              mono: "MZ", color: "#ff3b5c", logo: "" },
  { id: "blackorpz",    name: "BLACKORPZ KOTTAPADI",              mono: "BZ", color: "#94a3b8", logo: "" },
  { id: "radox",        name: "RADOX KOTTAPADI",                  mono: "RX", color: "#f43f5e", logo: "" },
  { id: "szfest",       name: "SZ FEST",                          mono: "SZ", color: "#14b8a6", logo: "" },
  { id: "teasers",      name: "TEASERS KOTTAPADI",                mono: "TZ", color: "#facc15", logo: "" },
  { id: "cb",           name: "Christian Brothers Kottapadi",     mono: "CB", color: "#3b82f6", logo: "" },
  { id: "palliyangadi", name: "ടീം പള്ളിയങ്ങാടി കോട്ടപ്പടി",      en: "Team Palliyangadi", mono: "TP", color: "#10b981", logo: "" },
];

/* --------------------------------------------------------------
   രാപകൽ തിരുനാൾ 2027 — കോട്ടപ്പടി സ്റ്റോറീസ് ഒരുക്കുന്നത്
   ഇവിടെ പരിപാടികൾ ചേർക്കുക / മാറ്റുക. (സമയം അറിയില്ലെങ്കിൽ t: "")
   items-ലെ ഓരോ വരിയും:
     { t: "09:00", title: "പരിപാടിയുടെ പേര്", by: "ടീം / ആര്", type: "band", note: "" }
   type: band / nadaswaram / chenda / ganamela / fireworks / lights / pandal / charity / church
   logo: ലോഗോ ചിത്രം കിട്ടിയാൽ "images/rapakal-logo.png" — ഇപ്പോൾ "" (ടെക്സ്റ്റ് ലോഗോ)
   -------------------------------------------------------------- */
window.RAPAKAL = {
  show: true,
  name: "രാപകൽ",
  sub: "തിരുനാൾ 2027",
  by: "കോട്ടപ്പടി സ്റ്റോറീസ് ഒരുക്കുന്ന",
  logo: "",
  intro: "പകലും രാവും നിറയുന്ന തിരുനാൾ ആഘോഷം — ജനുവരി 2 രാവിലെ മുതൽ ജനുവരി 3 രാത്രി വരെ.",
  sessions: [
    {
      kind: "day", day: "jan2", label: "പകൽ", when: "ജനുവരി 2 · രാവിലെ",
      items: [
        { t: "", title: "ബാൻഡ് മേളം", by: "GRACE MUSIC BAND TVM", type: "band" },
        { t: "", title: "ബാൻഡ് മേളം", by: "AMEN MUSIC BAND TVM", type: "band" },
      ],
    },
    {
      kind: "night", day: "jan3", label: "രാവ്", when: "ജനുവരി 3 · രാത്രി",
      items: [
        { t: "", title: "ബാൻഡ് മേളം", by: "GRACE MUSIC BAND TVM (അച്ഛനും പിള്ളേരും)", type: "band" },
      ],
    },
  ],
  more: "കൂടുതൽ പരിപാടികൾ ഉടൻ അറിയിക്കും",
};

/* പെരുന്നാൾ — തുടക്കം മുതൽ ഒടുക്കം വരെ */
window.FLOW = [
  { d: "ഡിസം 25", t: "കൊടിയേറ്റം", i: "🚩" },
  { d: "ഡിസം 31", t: "ഗാനമേള", i: "🎻" },
  { d: "ജനു 1", t: "രൂപക്കൂട് നില പന്തൽ", i: "🎪" },
  { d: "ജനു 1", t: "വീഥി ദീപാലങ്കാരം", i: "💡" },
  { d: "ജനു 2", t: "അമ്പ് – വള എഴുന്നള്ളിപ്പ്", i: "🏹" },
  { d: "ജനു 2", t: "ബാൻഡ്, നാദസ്വരം, ചെണ്ട", i: "🥁" },
  { d: "ജനു 3", t: "ക്ലബ്ബുകളുടെ ബാൻഡ് മേളം", i: "🎺" },
  { d: "ജനു 3 · 7PM", t: "വർണ്ണവിസ്മയം", i: "✨" },
  { d: "ജനു 3", t: "വർണ്ണമഴ", i: "🎇" },
  { d: "ജനു 4", t: "സമാപനം", i: "🙏" },
];

/* --------------------------------------------------------------
   സ്പോൺസർമാർ — logo: "images/sponsors/peru.png" (ഫോൾഡറിൽ ഇടുക)
   logo "" ആണെങ്കിൽ പേര് മാത്രം കാണിക്കും. tier: "main" / "co"
   -------------------------------------------------------------- */
window.SPONSORS = [
  // open: true = ഒഴിവുള്ള സ്ഥലം ("നിങ്ങളുടെ ലോഗോ ഇവിടെ" — തൊട്ടാൽ പരസ്യത്തിന് വാട്ട്സാപ്പ്)
  // സ്പോൺസർ കിട്ടിയാൽ: name, logo, link ചേർത്ത് open: false ആക്കുക
  // bg: "clear" = ലോഗോ ട്രാൻസ്പാരന്റ് ആണെങ്കിൽ, വെള്ള കാർഡ് ഇല്ലാതെ സൈറ്റിന്റെ ബാക്ക്ഗ്രൗണ്ടിൽ ചേർന്നു നിൽക്കും
  { name: "പ്രധാന സ്പോൺസർ", sub: "Title Sponsor", logo: "", tier: "main", link: "", open: true },
  { name: "Motion Digital Ads", sub: "Co-Sponsor", logo: "images/sponsors/motion-digital-ads-light.png", bg: "clear", tier: "co", link: "", open: false },
  { name: "സ്പോൺസർ 3", sub: "Co-Sponsor", logo: "", tier: "co", link: "", open: true },
  { name: "സ്പോൺസർ 4", sub: "Co-Sponsor", logo: "", tier: "co", link: "", open: true },
  { name: "സ്പോൺസർ 5", sub: "Co-Sponsor", logo: "", tier: "co", link: "", open: true },
  { name: "സ്പോൺസർ 6", sub: "Co-Sponsor", logo: "", tier: "co", link: "", open: true },
];

/* പരസ്യം / സ്പോൺസർഷിപ്പ് അന്വേഷണം — ഈ വാട്ട്സാപ്പ് നമ്പറിലേക്ക് */
window.ADVERTISE = {
  whatsapp: "918848576020",
  show: "+91 88485 76020",
  message: "നമസ്കാരം 🙏 കോട്ടപ്പടി തിരുനാൾ 2027 വെബ്സൈറ്റിൽ പരസ്യം ചെയ്യാൻ / സ്പോൺസർ ലോഗോ നൽകാൻ എനിക്ക് താല്പര്യമുണ്ട്. (I'd like to advertise on the Kottapadi Thirunal 2027 website.)",
};

/* --------------------------------------------------------------
   Designed, Developed & Coordinated by
   photo: "images/team/peru.jpg" — ഇല്ലെങ്കിൽ "" (ആദ്യാക്ഷരം കാണിക്കും)
   -------------------------------------------------------------- */
window.TEAM = {
  coordinators: [
    { name: "പേര് 1", role: "കോർഡിനേറ്റർ", photo: "" },
    { name: "പേര് 2", role: "കോർഡിനേറ്റർ", photo: "" },
    { name: "പേര് 3", role: "കോർഡിനേറ്റർ", photo: "" },
  ],
  designers: [
    { name: "പേര് 1", role: "Design & Development", photo: "" },
    { name: "പേര് 2", role: "Design", photo: "" },
  ],
};

window.GALLERY = [
  { src: "images/church-lights.jpg", cap: "തിരുനാൾ ദീപാലങ്കാരം" },
  { src: "images/church-day.jpg", cap: "സെന്റ് ലാസർ ചർച്ച്, കോട്ടപ്പടി" },
  { src: "images/church-golden.jpg", cap: "സ്വർണ്ണ ദീപങ്ങളിൽ പള്ളി" },
  { src: "images/light-tower.jpg", cap: "ദീപഗോപുരം" },
  { src: "images/street-lights.jpg", cap: "തിരുനാൾ വീഥി — ദീപക്കാഴ്ച" },
  { src: "images/aerial-crowd.jpg", cap: "പ്രദക്ഷിണം — ആകാശക്കാഴ്ച" },
  { src: "images/church-front.jpg", cap: "പള്ളി മുഖപ്പ്" },
];

/* --------------------------------------------------------------
   ബാൻഡ് സെറ്റ് അവതാർ — തൊട്ടാൽ പാട്ട്, വീണ്ടും തൊട്ടാൽ നിർത്തും
   songs: പാട്ടുകളുടെ ലിസ്റ്റ്. പുതിയ പാട്ട് ചേർക്കാൻ:
          1) mp3 ഫയൽ audio/ ഫോൾഡറിൽ ഇടുക
          2) താഴെ ഒരു വരി കൂടി ചേർക്കുക  { file, title, artist }
   ഒരു പാട്ടിന്റെയും ഫയൽ കിട്ടിയില്ലെങ്കിൽ ഡ്രമ്മർ സ്വന്തമായി
   ഒരു ബാൻഡ് താളം (ഡെമോ) വായിക്കും.
   ⚠️ മറ്റുള്ളവരുടെ പാട്ട്/റെക്കോർഡിംഗ് സൈറ്റിൽ ഇടാൻ അവരുടെ അനുവാദം വേണം.
   -------------------------------------------------------------- */
window.BAND_PLAYER = {
  enabled: true,
  songs: [
    { file: "audio/thinkale-poothinkale.mp3", title: "തിങ്കളേ പൂതിങ്കളേ", artist: "Voice of Palakkad bandset" },
    { file: "audio/uyirin-uyire.mp3", title: "ഉയിരിൻ ഉയിരേ", artist: "CRP Muvattupuzha bandset" },
  ],
  demoTitle: "ബാൻഡ് താളം",
  hint: "🎺 തൊട്ടാൽ ബാൻഡ് മേളം!",
};
