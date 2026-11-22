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
      { t: "", title: "KINGS OF SOUTH", troupe: "പാല കമ്മ്യൂണിക്കേഷൻ ഗാനമേള", type: "ganamela", place: "", highlight: true },
    ],
  },
  {
    id: "jan1", date: "2027-01-01", color: "#ff3b5c",
    name: "നില പന്തൽ & ദീപക്കാഴ്ച", sub: "പുതുവത്സര ദിനം",
    events: [
      { t: "", title: "കോട്ടപ്പടി പ്രവാസി കൂട്ടായ്മ (K.P.K U.A.E)", troupe: "അതിഗംഭീര രൂപക്കൂട് നില പന്തൽ — ഭാരത് പന്തൽ വർക്ക്സ് ചെറുതുരുത്തി", type: "pandal", place: "", highlight: true },
      { t: "", title: "കോട്ടപ്പടി സെലിബ്രേഷൻ കമ്മിറ്റി (കെ.സി.സി)", troupe: "Alappuzha Blue Diamonds 2.0 · പ്രദക്ഷിണവീഥി ദീപാലങ്കാരം", type: "ganamela", place: "" },
      { t: "", title: "SEHION FEST (സെഹിയോൻ കുടുംബ കൂട്ടായ്മ)", troupe: "യുവജന പോർക്കുളം", type: "lights", place: "" },
      { t: "", title: "വെസ്റ്റ്ഗേറ്റ് ക്ലബ്ബ് കോട്ടപ്പടി", troupe: "പ്രദക്ഷിണവീഥി ദീപാലങ്കാരം", type: "lights", place: "പ്രദക്ഷിണവീഥി" },
      { t: "", title: "KINGS OF SOUTH", troupe: "തിരുനാൾ വീഥി ദീപാലങ്കാരം", type: "lights", place: "തിരുനാൾ വീഥി" },
    ],
  },
  {
    id: "jan2", date: "2027-01-02", color: "#ffd60a", units: true,
    name: "അമ്പ് – വള എഴുന്നള്ളിപ്പ്", sub: "21 യൂണിറ്റുകൾ · ബാൻഡ് മേളം",
    events: [
      { t: "", title: "കോട്ടപ്പടി സ്റ്റോറീസ് കമ്മിറ്റി ഒരുക്കുന്ന രാപകൽ തിരുനാൾ", troupe: "GRACE MUSIC BAND TVM · AMEN MUSIC BAND TVM", type: "band", place: "", highlight: true },
    ],
  },
  {
    id: "jan3", date: "2027-01-03", color: "#3b82f6",
    name: "ബാൻഡ് മേളം & വർണ്ണമഴ", sub: "ക്ലബ്ബുകളുടെ ബാൻഡ് · വെടിക്കെട്ട്",
    events: [
      { t: "", title: "MACKSOLZ KOTTAPPADI", troupe: "NEW VOICE PALA", type: "band", place: "" },
      { t: "", title: "BLACKORPZ KOTTAPADI", troupe: "RAGADEEPAM MUNDATHIKODE", type: "band", place: "" },
      { t: "", title: "RADOX KOTTAPADI", troupe: "YOUNG STARS THIRUVANANTHAPURAM", type: "band", place: "" },
      { t: "", title: "SZ FEST", troupe: "VOICE OF PALAKKAD", type: "band", place: "" },
      { t: "", title: "കോട്ടപ്പടി സ്റ്റോറീസ് — രാപകൽ തിരുനാൾ 2027", troupe: "GRACE MUSIC BAND TVM (അച്ഛനും പിള്ളേരും)", type: "band", place: "", highlight: true },
      { t: "", title: "TEASERS KOTTAPADI", troupe: "ST. MARY'S VARANDARAPPILLY", type: "band", place: "" },
      { t: "19:00", title: "Christian Brothers Kottapadi", troupe: "അതിഗംഭീര വർണ്ണവിസ്മയം", type: "fireworks", place: "", highlight: true },
      { t: "21:30", title: "വെസ്റ്റ്ഗേറ്റ് ക്ലബ്ബ് കോട്ടപ്പടി", troupe: "വർണ്ണമഴ", type: "fireworks", place: "", highlight: true },
      { t: "", title: "ടീം പള്ളിയങ്ങാടി കോട്ടപ്പടി", troupe: "നന്മ 2027", type: "charity", place: "" },
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
  { d: "ജനു 3 · 9:30PM", t: "വർണ്ണമഴ", i: "🎇" },
  { d: "ജനു 4", t: "സമാപനം", i: "🙏" },
];

/* --------------------------------------------------------------
   സ്പോൺസർമാർ — logo: "images/sponsors/peru.png" (ഫോൾഡറിൽ ഇടുക)
   logo "" ആണെങ്കിൽ പേര് മാത്രം കാണിക്കും. tier: "main" / "co"
   -------------------------------------------------------------- */
window.SPONSORS = [
  { name: "പ്രധാന സ്പോൺസർ", sub: "Title Sponsor", logo: "", tier: "main", link: "" },
  { name: "സ്പോൺസർ 2", sub: "Co-Sponsor", logo: "", tier: "co", link: "" },
  { name: "സ്പോൺസർ 3", sub: "Co-Sponsor", logo: "", tier: "co", link: "" },
  { name: "സ്പോൺസർ 4", sub: "Co-Sponsor", logo: "", tier: "co", link: "" },
  { name: "സ്പോൺസർ 5", sub: "Co-Sponsor", logo: "", tier: "co", link: "" },
  { name: "സ്പോൺസർ 6", sub: "Co-Sponsor", logo: "", tier: "co", link: "" },
];

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
