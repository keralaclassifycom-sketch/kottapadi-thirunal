/* ---------- തേര് മത്സരം: every samooham's LED ther drives in and stands spread round the church ground ----------
   - only three thers (the best designs), shown as തേര് 1, 2, 3 — no samooham names
   - thers park side by side with clear space (3 on desktop, 1 on a phone) — never overlapping
   - real crowd sound recorded at the Kottapadi ther malsaram (audio/ther-crowd.mp3) plays softly while you watch
   - "ഞാൻ ജഡ്ജി": the viewer walks round with the judges and gives each ther points (only their own marks, not official) */
(() => {
  const stage = document.getElementById("thStage");
  if (!stage) return;
  const cv = document.getElementById("thFx"), g = cv.getContext("2d");
  const nameEl = document.getElementById("thName"), modeEl = document.getElementById("thMode");
  const judgeEl = document.getElementById("thJudge"), sndBtn = document.getElementById("thSnd");


  // just three thers, each copied from a real one: തേര് 1 domed arch + lotus flames (photo) · തേര് 2 spiral wheels (photo) · തേര് 3 Kallettumkara
  const KINDS = [11, 12, 10], COUNT = KINDS.length;
  const KPAL = { 0: ["#ff8a1f", "#ffd23f", "#3d8bff", "#ff3fb4"], 2: ["#8a5cff", "#3dff7a", "#ff3348", "#ffd23f"], 3: ["#3dff7a", "#2ec4ff", "#ffd23f", "#ff3fb4"] };

  /* ---------- seeded random so a samooham always gets the same ther ---------- */
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)) >>> 0) / 4294967296; }
  const hash = str => [...str].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261);
  const PALS = [
    ["#3dff7a", "#ffe14a", "#ff3fb4", "#2ec4ff"], ["#ff3fb4", "#7c5cff", "#ffd60a", "#3df2ff"], ["#2ec4ff", "#ff7a1f", "#c6ff3d", "#ff3348"],
    ["#ffd60a", "#ff3348", "#3dff7a", "#ffffff"], ["#e040fb", "#3d8bff", "#ffe14a", "#3dff7a"], ["#3df2ff", "#ff3fb4", "#ffffff", "#9b5cff"],
    ["#ff8a1f", "#3dff7a", "#ff3fb4", "#ffe14a"], ["#c6ff3d", "#e040fb", "#2ec4ff", "#ffffff"]
  ];

  /* ---------- one ther = LED dots in unit space (x ≈ -0.7…0.7, base y = 0, up is +y) ----------
     eight designs modelled on the recent Kottapadi ther malsaram thers:
     0 mandala palace · 1 peacock swirl · 2 gothic arch · 3 stepped pyramid · 4 elephant · 5 lotus flames · 6 oval panels · 7 hearts */
  function design(kind) {
    const R = rng(kind * 7919 + 13), leds = [], st = .027;   // LED pitch along lines: leaves black between bulbs
    const pal = KPAL[kind] || PALS[kind % PALS.length];
    let curC = null;   // fixed real colour for the part being drawn (thers copied from a real one)
    const add = (x, y, gr) => leds.push({ x, y, g: gr, k: leds.length, c: curC });
    const line = (x0, y0, x1, y1, gr, s = st) => { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / s)); for (let i = 0; i <= n; i++) add(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, gr); };
    const path = (pts, gr, closed = true) => { for (let i = 0; i < pts.length - (closed ? 0 : 1); i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; line(a[0], a[1], b[0], b[1], gr); } };
    const inPoly = (x, y, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
    const fillPoly = (P, gr, gap = .042, skip) => { const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
      for (let y = Math.min(...ys) + gap / 2, r = 0; y < Math.max(...ys); y += gap, r++) for (let x = Math.min(...xs) + (r % 2) * gap / 2; x < Math.max(...xs); x += gap) if (inPoly(x, y, P) && !(skip && skip(x, y))) add(x, y, gr); };
    const ellPts = (cx, cy, rx, ry, n = 40, a0 = 0, a1 = 6.283) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
    const ell = (cx, cy, rx, ry, gr, fillGr) => { const P = ellPts(cx, cy, rx, ry, Math.max(12, Math.round((rx + ry) * 3.14 / st))); if (fillGr != null) fillPoly(P, fillGr); P.forEach(p => add(p[0], p[1], gr)); };
    const wheel = (cx, cy, r) => { ell(cx, cy, r, r, 4); ell(cx, cy, r * .62, r * .62, 6); ell(cx, cy, r * .22, r * .22, 7, 7);
      for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; line(cx + Math.cos(a) * r * .24, cy + Math.sin(a) * r * .24, cx + Math.cos(a) * r * .95, cy + Math.sin(a) * r * .95, i % 2 ? 2 : 6, .028); } };
    const starPts = (cx, cy, r, n = 8, inner = .5) => Array.from({ length: n * 2 }, (_, i) => { const a = i / (n * 2) * 6.283 - Math.PI / 2, rr = i % 2 ? r * inner : r; return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]; });
    const star = (cx, cy, r, n = 8, fillGr) => { const P = starPts(cx, cy, r, n); if (fillGr != null) fillPoly(P, fillGr, .03); path(P, 7); };
    const heartPts = (cx, cy, s) => Array.from({ length: 40 }, (_, i) => { const t = i / 40 * 6.283; return [cx + s * .062 * 16 * Math.sin(t) ** 3, cy + s * .062 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]; });
    const heart = (cx, cy, s, gr, fillGr) => { const P = heartPts(cx, cy, s); if (fillGr != null) fillPoly(P, fillGr, .036); path(P, gr); };
    const drop = (x, y, s, gr) => { for (let a = 0; a < 10; a++) { const q = a / 10 * 6.283; add(x + Math.sin(q) * s * .5, y + s * .6 - Math.cos(q) * s * (q < 3.14 ? 1 : .6), gr); } };
    const cross = (x, y, s = 1) => { line(x, y, x, y + .16 * s, 7); line(x - .065 * s, y + .105 * s, x + .065 * s, y + .105 * s, 7); };
    const umbrella = (x, y, s = 1) => { path(ellPts(x, y, .1 * s, .06 * s, 14, Math.PI, 0), 2, false); line(x - .1 * s, y, x + .1 * s, y, 2); for (let i = -2; i <= 2; i++) drop(x + i * .045 * s, y - .03, .02, 3); };
    const tower = (x, y, w, h) => { const P = [[x - w, y], [x + w, y], [x + w, y + h], [x, y + h + w * 1.3], [x - w, y + h]]; fillPoly(P, 9, .032); path(P, 1); star(x, y + h + w * 1.3 + .04, .03, 5); };
    const bud = (x, y, s) => { line(x, y - .14 * s, x, y, 2); const P = [[x, y + .12 * s], [x - .05 * s, y + .02 * s], [x - .03 * s, y - .02 * s], [x + .03 * s, y - .02 * s], [x + .05 * s, y + .02 * s]]; fillPoly(P, 11, .022); path(P, 3); };
    const skirt = w => { const P = [[-w, 0], [w, 0], [w, .07], [-w, .07]]; fillPoly(P, 8, .035); line(-w, .075, w, .075, 2); };
    let top = 1, focus = null;

    if (kind === 11) {                   // തേര് 1 — domed arch with lotus-flame wings (from the photo)
      const C = c => { curC = c; };
      const WHITE = "#f4f8ff", BLUE = "#3d6bff", PURPLE = "#a46bff", PINK = "#ff4fd8", GREEN = "#3dff7a", YEL = "#ffd23f", ORG = "#ff8a1f", RED = "#ff3348";
      // base band: red zigzag between white lines, green dots
      C(WHITE); line(-.62, .012, .62, .012, 2); line(-.62, .072, .62, .072, 2);
      C(RED); for (let x = -.6; x <= .6; x += .028) add(x, .025 + Math.abs(((x / .07) % 1 + 1) % 1 - .5) * .06, 9);
      C(GREEN); for (let x = -.58; x <= .6; x += .07) add(x, .042, 10);
      // lotus-flame wings: three tall petals each side, leaning out, striped in pink / purple / green / blue
      for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) {
        const bx = sd * (.27 + k * .11), h = .6 - k * .13, P = [];
        for (let i = 0; i <= 20; i++) { const tt = i / 20; P.push([bx + sd * (Math.sin(tt * Math.PI) * .07 + tt * tt * .1), .09 + tt * h]); }
        for (let i = 20; i >= 0; i--) { const tt = i / 20; P.push([bx + sd * (tt * tt * .1 - Math.sin(tt * Math.PI) * .015) - sd * .045, .09 + tt * h]); }
        for (let y = .1, r = 0; y < .09 + h; y += .028, r++) for (let x = -.64; x < .64; x += .028) if (inPoly(x, y, P)) { C([PINK, PURPLE, GREEN, BLUE][(r + k) % 4]); add(x, y, 9 + k); }
        C(WHITE); path(P, 1);
      }
      for (const sd of [-1, 1]) {   // round flower + green leaf at the foot of the wings
        const fx = sd * .35, fy = .19; C(PINK); ell(fx, fy, .085, .085, 4); C(YEL);
        for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; line(fx + Math.cos(a) * .03, fy + Math.sin(a) * .03, fx + Math.cos(a) * .07, fy + Math.sin(a) * .07, 6, .02); }
        C(ORG); ell(fx, fy, .022, .022, 7); C(GREEN); path(ellPts(sd * .46, .09, .08, .035, 14, 0, Math.PI), 4, false);
      }
      // central arch: green / blue hex columns, a ribbed yellow-orange dome, a bead wreath round the saint
      const AR = s => { const P = [[-.22 * s, .08], [-.22 * s, .55]]; for (let i = 0; i <= 20; i++) { const a = Math.PI - Math.PI * i / 20; P.push([Math.cos(a) * .22 * s, .55 + Math.sin(a) * .22 * s]); } P.push([.22 * s, .08]); return P; };
      const inner = AR(.78);
      for (let y = .09, r = 0; y < .78; y += .03, r++) for (let x = -.24 + (r % 2) * .015; x < .24; x += .03) if (inPoly(x, y, AR(1)) && !inPoly(x, y, inner)) { C(r % 3 ? GREEN : BLUE); add(x, y, 9); }
      C(PURPLE); path(AR(1.07), 1); C(WHITE); path(AR(1), 2);
      for (let i = 0; i <= 12; i++) { const a = Math.PI * i / 12; C(i % 2 ? YEL : ORG); line(Math.cos(a) * .03, .55 + Math.sin(a) * .03, Math.cos(a) * .165, .55 + Math.sin(a) * .165, 6, .022); }
      C(WHITE); path(ellPts(0, .55, .172, .172, 18, 0, Math.PI), 2, false); line(-.17, .55, .17, .55, 2);
      for (let y = .11, r = 0; y < .53; y += .036, r++) for (let x = -.15 + (r % 2) * .018; x < .16; x += .036) if (Math.hypot(x, y - .31) > .145) { C(GREEN); add(x, y, 10); }
      for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; C(i % 2 ? PINK : GREEN); ell(Math.cos(a) * .115, .31 + Math.sin(a) * .115, .016, .016, 4); }
      C("#d9e6ff"); fillPoly(ellPts(0, .31, .065, .085, 18), 13, .024); C(WHITE); ell(0, .31, .07, .09, 7);
      // crown of points above the arch, a central diamond, the flower medallion and the cross
      const CR = [[-.3, .76], [-.3, .84], [-.24, .82], [-.2, .94], [-.12, .87], [0, 1.0], [.12, .87], [.2, .94], [.24, .82], [.3, .84], [.3, .76]];
      for (let y = .77, r = 0; y < 1; y += .028, r++) for (let x = -.3; x < .3; x += .028) if (inPoly(x, y, CR) && Math.abs(x) + Math.abs(y - .87) > .1) { C((Math.round(x / .028) + r) % 2 ? RED : GREEN); add(x, y, 11); }
      C(BLUE); path(CR, 1); path([[0, .77], [.09, .87], [0, .98], [-.09, .87]], 4); C(WHITE); ell(0, .87, .025, .025, 7);
      C(PURPLE); ell(0, 1.06, .06, .06, 1); C(PINK); star(0, 1.06, .04, 6); C(GREEN); line(-.03, 1.13, .03, 1.13, 6);
      C("#ffb070"); line(0, 1.14, 0, 1.34, 7); line(-.07, 1.27, .07, 1.27, 7);
      curC = null; top = 1.34; focus = [0, .31, .14];
    } else if (kind === 12) {            // തേര് 2 — spiral wheels, rainbow arch, crowned dome (from the photo)
      const C = c => { curC = c; };
      const WHITE = "#f4f8ff", BLUE = "#3d6bff", PINK = "#ff4fd8", GREEN = "#3dff7a", YEL = "#ffd23f", ORG = "#ff8a1f", RED = "#ff3348", LIME = "#c6ff3d";
      C(GREEN); for (let x = -.6; x <= .6; x += .028) { add(x, .02, 9); add(x, .05, 9); }
      // spiral wheels stacked up each side
      const WHEELS = [[.47, .6, .14, [BLUE, WHITE, "#7c9cff", PINK]], [.51, .36, .15, [RED, PINK, "#ff9a9a", WHITE]], [.4, .16, .12, [GREEN, LIME, WHITE, PINK]]];
      for (const sd of [-1, 1]) for (const [wx, wy, R, cols] of WHEELS) {
        for (let k = 0, r = R; r > .025; r -= .028, k++) { C(cols[k % cols.length]); ell(sd * wx, wy, r, r, 4 + (k % 3)); }
        C(PINK); ell(sd * wx, wy, .018, .018, 7);
      }
      // green vines with pink lilies between the wheels and the tower
      for (const sd of [-1, 1]) { C(GREEN); const vp = []; for (let i = 0; i <= 30; i++) { const tt = i / 30; vp.push([sd * (.24 + .045 * Math.sin(tt * 9)), .08 + tt * .5]); } path(vp, 6, false);
        C(PINK); star(sd * .29, .5, .035, 5); star(sd * .27, .28, .03, 5); }
      // tower: rainbow arch with the chalice, diamond band, yellow pillars + green swirl, striped crown, scalloped dome
      C(WHITE); path([[-.2, .06], [.2, .06], [.2, .46], [-.2, .46]], 1);
      [[.17, PINK], [.14, ORG], [.11, YEL]].forEach(([r, c]) => { C(c); path(ellPts(0, .1, r, r * 1.3, 18, 0, Math.PI), 4, false); });
      C("#ffe9c4"); fillPoly(ellPts(0, .1, .07, .11, 14, 0, Math.PI).concat([[-.07, .1]]), 13, .024);
      for (let y = .37, r = 0; y < .46; y += .026, r++) for (let x = -.19; x < .2; x += .026) { C((Math.round(x / .026) + r) % 2 ? PINK : WHITE); add(x, y, 10); }
      C(WHITE); path([[-.15, .46], [.15, .46], [.15, .62], [-.15, .62]], 2);
      C(YEL); for (const px of [-.11, .11]) for (let y = .48; y < .61; y += .026) { add(px - .015, y, 11); add(px + .015, y, 11); }
      C(GREEN); const sw = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * 9, r = .008 + i * .0024; sw.push([Math.cos(a) * r, .54 + Math.sin(a) * r]); } sw.forEach(q => add(q[0], q[1], 12));
      const CRW = [[-.2, .62], [.2, .62], [.26, .7], [-.26, .7]];
      for (let y = .63, r = 0; y < .7; y += .024, r++) for (let x = -.26; x < .26; x += .026) if (inPoly(x, y, CRW)) { C(r % 2 ? WHITE : RED); add(x, y, 9); }
      C(BLUE); path(CRW, 1);
      const DM = []; for (let i = 0; i <= 24; i++) { const a = Math.PI * i / 24; DM.push([Math.cos(a) * .21, .7 + Math.sin(a) * .2 + Math.abs(Math.sin(a * 6)) * .02]); }
      for (let y = .71, r = 0; y < .92; y += .026, r++) for (let x = -.21; x < .21; x += .026) if (inPoly(x, y, DM.concat([[-.21, .7], [.21, .7]])) && Math.hypot(x, y - .79) > .05) { C((r + Math.round(x / .026)) % 3 ? GREEN : RED); add(x, y, 10); }
      C(WHITE); path(DM, 1, false); C(ORG); star(0, .79, .045, 8);
      C(WHITE); line(0, .91, 0, 1.12, 7); line(-.065, 1.05, .065, 1.05, 7);
      curC = null; top = 1.12; focus = [0, .14, .18];
    } else if (kind === 10) {                   // തേര് 3 — Kallettumkara ther, redrawn from the photo (sun arches, ray spire, starburst panels)
      const C = c => { curC = c; };
      const WHITE = "#f4f8ff", CYAN = "#3df2ff", PINK = "#ff4fd8", PURPLE = "#a46bff", YEL = "#ffd23f", GOLD = "#ffb02e", BLUE = "#3d7bff", GREEN = "#3dff7a";
      // base: rows of coloured stripes
      const SC = [PINK, CYAN, GREEN, YEL, WHITE];
      for (const [y, o] of [[.02, 0], [.05, 2], [.08, 4]]) for (let x = -.62; x <= .62; x += .026) { C(SC[(Math.floor((x + .62) / .08) + o) % SC.length]); add(x, y, 9); }
      // frame with rounded top corners; a band of yellow squiggle pattern inside the white outline
      const frame = s => { const P = [[-.62 * s, .11]], r = .26 * s; P.push([-.62 * s, .74 * s - r]);
        for (let i = 0; i <= 10; i++) { const a = Math.PI - Math.PI / 2 * i / 10; P.push([-.62 * s + r + Math.cos(a) * r, .74 * s - r + Math.sin(a) * r]); }
        for (let i = 0; i <= 10; i++) { const a = Math.PI / 2 - Math.PI / 2 * i / 10; P.push([.62 * s - r + Math.cos(a) * r, .74 * s - r + Math.sin(a) * r]); }
        P.push([.62 * s, .11]); return P; };
      const F = frame(1), Fi = frame(.88);
      for (let y = .12; y < .76; y += .026) for (let x = -.62; x < .62; x += .026) if (inPoly(x, y, F) && !inPoly(x, y, Fi) && Math.sin(x * 70) * Math.cos(y * 70) > -.25) { C(Math.sin(x * 30 + y * 20) > 0 ? YEL : GOLD); add(x, y, 10); }
      C(WHITE); path(F, 1); path(Fi, 2);
      // three sun arches: yellow half-disc, fan of rays, white rim, gold dots outside
      [[-.31, .48, .17], [0, .5, .2], [.31, .48, .17]].forEach(([cx, cy, R], ai) => {
        for (let i = 0; i <= 14; i++) { const a = Math.PI * i / 14; C([PINK, CYAN, BLUE, WHITE][(i + ai) % 4]); line(cx + Math.cos(a) * R * .4, cy + Math.sin(a) * R * .4, cx + Math.cos(a) * R * .92, cy + Math.sin(a) * R * .92, 12, .026); }
        C(YEL); fillPoly(ellPts(cx, cy, R * .32, R * .32, 12, 0, Math.PI).concat([[cx - R * .32, cy]]), 11, .022);
        C(WHITE); path(ellPts(cx, cy, R, R, 22, 0, Math.PI), 1, false);
        C(GOLD); path(ellPts(cx, cy, R * 1.12, R * 1.12, 18, 0, Math.PI), 3, false);
      });
      C(PINK); for (let x = -.5; x <= .5; x += .026) add(x, .47, 3); C(CYAN); for (let x = -.49; x <= .5; x += .026) add(x, .445, 6);
      // doorway with the saint, a ray pediment above it, diamond-chain pillars beside it
      C("#ffe9c4"); fillPoly([[-.06, .14], [.06, .14], [.06, .28], [-.06, .28]], 13, .03); C(WHITE); path([[-.09, .12], [.09, .12], [.09, .33], [-.09, .33]], 2);
      const T = [[-.13, .34], [.13, .34], [0, .44]]; for (let i = 0; i <= 8; i++) { const tx = -.12 + .24 * i / 8; C(i % 2 ? PINK : CYAN); line(0, .345, tx * .9, .345 + (.44 - .345) * (1 - Math.abs(tx) / .13) * .9, 4, .022); }
      C(WHITE); path(T, 1);
      for (const sd of [-1, 1]) { C(CYAN); line(sd * .2, .12, sd * .2, .42, 1); line(sd * .12, .12, sd * .12, .42, 1);
        for (let y = .15; y < .41; y += .06) { C((Math.round(y / .06)) % 2 ? YEL : PINK); path([[sd * .16, y - .025], [sd * .185, y], [sd * .16, y + .025], [sd * .135, y]], 4); } }
      // side panels: purple / white starburst circles on dark squares
      for (const sd of [-1, 1]) { const cx = sd * .41, cy = .24;
        C("#5a4a8a"); path([[cx - .1, cy - .1], [cx + .1, cy - .1], [cx + .1, cy + .1], [cx - .1, cy + .1]], 2);
        for (let i = 0; i < 22; i++) { const a = i / 22 * 6.283, L = .04 + (i % 3) * .015; C(i % 2 ? PURPLE : WHITE); line(cx + Math.cos(a) * .015, cy + Math.sin(a) * .015, cx + Math.cos(a) * L, cy + Math.sin(a) * L, 12, .02); } }
      // spire: blue / white ribs rising to the top, beaded edges, a fan canopy, the cross
      const apex = [0, 1.12];
      for (let k = -3; k <= 3; k++) { const bx = k * .06; C(k % 2 ? BLUE : WHITE); line(bx, .75, apex[0] + bx * .12, apex[1] - .02, 11, .024); }
      for (let y = .8; y < 1.05; y += .06) { const w = .2 * (1 - (y - .75) / .4); for (let x = -w + .03; x < w; x += .06) { C(Math.round((x + y) / .06) % 2 ? PINK : YEL); add(x, y + .015, 10); } }
      for (const sd of [-1, 1]) for (let i = 0; i <= 7; i++) { const tt = i / 7, x = sd * (.22 - .19 * tt), y = .75 + tt * .36; C(CYAN); ell(x + sd * .015, y, .016, .016, 4); }
      C(WHITE); line(-.22, .75, 0, 1.12, 1); line(.22, .75, 0, 1.12, 1);
      for (let i = 0; i <= 8; i++) { const a = Math.PI * (.15 + .7 * i / 8); C([PINK, YEL, CYAN][i % 3]); line(0, 1.12, Math.cos(a) * .08, 1.12 + Math.sin(a) * .05, 7, .02); }
      C(WHITE); line(0, 1.17, 0, 1.37, 7); line(-.07, 1.3, .07, 1.3, 7);
      curC = null; top = 1.37; focus = [0, .5, .42];
    } else if (kind === 9) {                    // തേര് 2 — modelled on the "LED frames" ther (heart sun, angels, triangles)
      const C = c => { curC = c; };
      const BLUE = "#3d6bff", PINK = "#ff3fd2", WHITE = "#f4f8ff", CYAN = "#3df2ff";
      // cyan X stand under the body
      C(CYAN); for (const o of [0, .03]) { line(-.2 + o, 0, .2 + o, .14, 6); line(.2 - o, 0, -.2 - o, .14, 6); } C(WHITE); line(-.24, .14, .24, .14, 2);
      // square body: grid of small blue cells with a pink dot in each, the sun circle in the middle
      const B = [[-.3, .15], [.3, .15], [.3, .68], [-.3, .68]];
      for (let y = .165, r = 0; y < .68; y += .029, r++) for (let x = -.285, c = 0; x < .3; x += .029, c++) {
        if (Math.hypot(x, y - .42) < .255) continue; C(r % 2 && c % 2 ? PINK : BLUE); add(x, y, r % 2 && c % 2 ? 10 : 9); }
      C(BLUE); path(B, 1);
      C(BLUE); ell(0, .42, .25, .25, 1); ell(0, .42, .135, .135, 4);
      for (let i = 0; i < 28; i++) { const a = i / 28 * 6.283; C(i % 2 ? WHITE : PINK); line(Math.cos(a) * .15, .42 + Math.sin(a) * .15, Math.cos(a) * .235, .42 + Math.sin(a) * .235, 12, .022); }
      C("#ff2f9e"); fillPoly(ellPts(0, .42, .115, .115, 30), 13, .022); C(WHITE); path(heartPts(0, .41, .05), 7);
      // side panels: tall stripes + saint picture, outer slanted zigzag panels
      for (const sd of [-1, 1]) {
        const T = [[sd * .3, .1], [sd * .45, .1], [sd * .45, .66], [sd * .3, .7]];
        for (let y = .48; y < .68; y += .028) for (let x = .31; x < .45; x += .028) if (inPoly(sd * x, y, T)) { C(Math.round(y / .028) % 2 ? PINK : WHITE); add(sd * x, y, 11); }
        C("#b8f4ff"); fillPoly(ellPts(sd * .375, .245, .045, .1, 20), 12, .028); C(CYAN); ell(sd * .375, .245, .055, .115, 4);
        C(BLUE); fillPoly([[sd * .31, .37], [sd * .44, .37], [sd * .44, .47], [sd * .31, .47]], 9, .03); path(T, 1);
        const O = [[sd * .45, .06], [sd * .57, .02], [sd * .62, .5], [sd * .49, .56]]; C(BLUE); path(O, 1);
        for (let k = 0; k < 6; k++) { const y0 = .06 + k * .08; C(k % 2 ? PINK : WHITE); line(sd * .46, y0, sd * .58, y0 + .07, 3); line(sd * .58, y0, sd * .47, y0 + .07, 3); }
        // angel blowing a trumpet, with a red music note
        const ax = sd * .5, ay = .82; C(WHITE);
        ell(ax, ay + .14, .03, .03, 2); path([[ax - .045, ay], [ax + .045, ay], [ax + .02, ay + .1], [ax - .02, ay + .1]], 2);
        path(ellPts(ax + sd * .05, ay + .1, .06, .07, 14, sd > 0 ? -.3 : Math.PI + .3, sd > 0 ? 1.9 : Math.PI - 1.9), 2, false);
        line(ax - sd * .02, ay + .13, ax - sd * .12, ay + .19, 7); ell(ax - sd * .13, ay + .195, .015, .015, 7);
        C("#ff3348"); ell(ax + sd * .1, ay + .2, .015, .012, 3); line(ax + sd * .115, ay + .2, ax + sd * .115, ay + .25, 3);
      }
      // crown: inverted grid triangle between two up-triangles, globe and cross on top
      const V = [[-.3, .97], [.3, .97], [0, .68]];
      for (let y = .7, r = 0; y < .97; y += .028, r++) for (let x = -.3; x < .3; x += .028) if (inPoly(x, y, V) && Math.abs(x) + Math.abs(y - .86) > .06) { C(r % 2 ? WHITE : PINK); add(x, y, 10); }
      C(BLUE); path(V, 1); fillPoly([[0, .8], [.055, .86], [0, .92], [-.055, .86]], 9, .02);
      for (const sd of [-1, 1]) { const Tr = [[sd * .34, .68], [sd * .03, .68], [sd * .185, .93]]; C(BLUE); fillPoly(Tr, 9, .03); path(Tr, 1);
        C(CYAN); path([[sd * .27, .71], [sd * .1, .71], [sd * .185, .85]], 4); C(PINK); ell(sd * .185, .76, .02, .02, 3); }
      C(BLUE); fillPoly(ellPts(0, .97, .085, .07, 16, 0, Math.PI).concat([[-.085, .97]]), 9, .024); C(WHITE); path(ellPts(0, .97, .085, .07, 16, 0, Math.PI), 2, false); line(-.085, .97, .085, .97, 2);
      line(0, 1.04, 0, 1.24, 7); line(-.07, 1.17, .07, 1.17, 7);
      curC = null; top = 1.24; focus = [0, .42, .25];
    } else if (kind === 8) {                    // തേര് 1 — modelled on the Kunnathangadi perunnal ther (fixed real colours)
      const C = c => { curC = c; };
      const BLUE = "#3d7bff", WHITE = "#f4f8ff";
      // striped feet + red/yellow chevron skirt + shoulder wings with rays and a green medallion
      for (const sd of [-1, 1]) {
        const F = [[sd * .42, 0], [sd * .64, 0], [sd * .64, .2], [sd * .42, .24]];
        for (let x = .435, j = 0; x < .64; x += .034, j++) { C(["#c04dff", WHITE, "#ffd23f"][j % 3]); for (let y = .02; y < .23; y += .03) if (inPoly(sd * x, y, F)) add(sd * x, y, 9); }
        C(BLUE); path(F, 1);
        const S = [[sd * .41, .24], [sd * .65, .2], [sd * .71, .37], [sd * .42, .39]];
        for (let y = .225, r = 0; y < .39; y += .028, r++) for (let x = .41; x < .72; x += .028) { if (!inPoly(sd * x, y, S)) continue; C((Math.floor(x / .056) + r) % 2 ? "#ff3348" : "#ffd23f"); add(sd * x, y, 10); }
        C(BLUE); path(S, 1);
        const Wg = [[sd * .33, .39]]; for (let i = 0; i <= 18; i++) { const a = i / 18 * Math.PI / 2; Wg.push([sd * (.33 + .37 * Math.cos(a)), .39 + .42 * Math.sin(a)]); }
        for (let y = .4; y < .81; y += .03) for (let x = .34; x < .71; x += .03) { if (!inPoly(sd * x, y, Wg) || Math.hypot(x - .52, y - .56) < .1) continue;
          const ang = Math.atan2(y - .39, x - .33); C(["#ff4fd8", WHITE, "#3d8bff"][Math.floor(ang / .2) % 3]); add(sd * x, y, 11); }
        C(BLUE); path(Wg, 1); line(sd * .33, .39, sd * .7, .39, 1);
        C("#3dff7a"); ell(sd * .52, .56, .095, .095, 4, 12); C(WHITE); wheel(sd * .52, .56, .055);
        // yellow pillar beside the arch
        C("#ffb02e"); for (let x = .27; x <= .33; x += .03) for (let y = .06; y < .74; y += .03) add(sd * x, y, 9);
      }
      // central arch in concentric rings round the saint's window
      const archP = s => { const P = [[-.26 * s, .04], [-.26 * s, .44]]; for (let i = 0; i <= 24; i++) { const a = Math.PI - Math.PI * i / 24; P.push([Math.cos(a) * .26 * s, .44 + Math.sin(a) * .27 * s]); } P.push([.26 * s, .04]); return P; };
      [[1, "#2ec4ff"], [.88, "#3355ff"], [.77, "#ff8a1f"], [.67, "#ffd23f"], [.58, "#ff6a1f"], [.5, "#3dd6ff"]].forEach(([s, c], i, arr) => {
        const inner = arr[i + 1] ? archP(arr[i + 1][0]) : null; C(c);
        fillPoly(archP(s), 12, .03, (x, y) => (inner && inPoly(x, y, inner)) || (((x) / .1) ** 2 + ((y - .3) / .15) ** 2 < 1)); });
      C("#ff3fb4"); for (let i = 0; i <= 8; i++) { const a = Math.PI * i / 8; ell(Math.cos(a) * .215, .44 + Math.sin(a) * .225, .028, .028, 4); }
      C(WHITE); path(archP(1), 1); ell(0, .3, .1, .15, 7);
      C("#4d6bff"); fillPoly(ellPts(0, .3, .085, .135, 24), 13, .026); C("#ff3348"); ell(0, .3, .04, .06, 6, 13);
      // red brick band, green band with yellow scallops, red pagoda roof with white corner flags
      const Bk = [[-.3, .72], [.3, .72], [.3, .8], [-.3, .8]]; C("#ff3348"); fillPoly(Bk, 9, .026); C(WHITE); line(-.3, .76, .3, .76, 2); for (let x = -.27; x < .3; x += .09) line(x, .72, x, .76, 2); C(BLUE); path(Bk, 1);
      const Gb = [[-.38, .8], [.38, .8], [.32, .88], [-.32, .88]]; C("#3dff7a"); fillPoly(Gb, 10, .026);
      C("#ffd23f"); for (let x = -.33; x < .34; x += .08) path(ellPts(x, .81, .03, .05, 8, 0, Math.PI), 3, false); C(BLUE); path(Gb, 1);
      const Rf = [[-.3, .88], [.3, .88], [.12, 1], [-.12, 1]]; for (let y = .89, r = 0; y < 1; y += .026, r++) for (let x = -.3; x < .3; x += .026) { if (!inPoly(x, y, Rf)) continue; C(r % 3 === 2 ? WHITE : "#ff3348"); add(x, y, 11); }
      C(BLUE); path(Rf, 1); C(WHITE); for (const sd of [-1, 1]) path([[sd * .3, .9], [sd * .36, .99], [sd * .24, .99]], 2);
      // green dome with a white wheel, cyan collar, white neon cross on a green base
      C("#3dd6ff"); ell(0, 1.01, .07, .018, 6); C("#3dff7a"); ell(0, 1.09, .075, .075, 4, 12); C(WHITE); wheel(0, 1.09, .04);
      C("#3dff7a"); line(-.035, 1.17, .035, 1.17, 6); C(WHITE); line(0, 1.17, 0, 1.36, 7); line(-.07, 1.29, .07, 1.29, 7); line(.01, 1.17, .01, 1.36, 7);
      C(BLUE); path([[-.64, 0], [-.71, .37], [-.7, .39]], 1, false); path([[.64, 0], [.71, .37], [.7, .39]], 1, false);
      curC = null; top = 1.36; focus = [0, .4, .3];
    } else if (kind === 0) {                    // mandala palace with round wings
      skirt(.66);
      const T = [[-.24, .07], [.24, .07], [.24, .66], [-.24, .66]]; fillPoly(T, 9, .042, (x, y) => Math.hypot(x, y - .37) < .2); path(T, 1); wheel(0, .37, .19);
      for (const sd of [-1, 1]) { ell(sd * .46, .4, .21, .3, 4, 10); wheel(sd * .46, .4, .1); bud(sd * .62, .82, 1); }
      ell(0, .84, .26, .17, 5, 11); star(0, .84, .1, 8, 12); bud(-.25, 1.02, .8); bud(.25, 1.02, .8);
      top = 1.02; cross(0, top); umbrella(0, top + .24);
      top += .3;
    } else if (kind === 1) {             // peacock swirl with a big star
      skirt(.62);
      for (let b = 0; b < 6; b++) { const x0 = -.15 + b * .1, x1 = .12 + b * .1, ty = 1.0 - b * .09, cx = .45 + b * .03;
        for (let o = 0; o < 4; o++) { const pts = []; for (let t = 0; t <= 1; t += .02) { const u = 1 - t; pts.push([u * u * (x0 + o * .03) + 2 * u * t * (cx + o * .02) + t * t * (x1 + o * .022), u * u * .08 + 2 * u * t * .45 + t * t * ty]); } path(pts, (b + o) % 2 ? 9 + (b % 3) : 4 + (o % 3), false); }
        drop(x1 + .02, ty + .03, .05, 3); }
      star(-.36, .42, .27, 8, 10); star(-.36, .42, .12, 8);
      top = 1.03;
    } else if (kind === 2) {             // gothic arch with star mandala and saint picture
      skirt(.62);
      const arch = s => { const a = .58 * s, h = .78 * s, c = (h * h - a * a) / (2 * a), r = a + c, th = Math.acos(-c / r), P = [[-a, .07]];   // pointed (gothic) arch from two circle arcs
        for (let i = 0; i <= 20; i++) { const q = Math.PI - (Math.PI - th) * i / 20; P.push([c + Math.cos(q) * r, .55 + Math.sin(q) * r]); }
        for (let i = 20; i >= 0; i--) { const q = Math.PI - (Math.PI - th) * i / 20; P.push([-(c + Math.cos(q) * r), .55 + Math.sin(q) * r]); }
        P.push([a, .07]); return P; };
      const A = arch(1); fillPoly(A, 9, .042, (x, y) => Math.abs(x) < .38 && y < .56); path(A, 1); path(arch(.78), 5, false);
      const Pn = [[-.38, .08], [.38, .08], [.38, .56], [-.38, .56]]; fillPoly(Pn, 10, .04, (x, y) => Math.hypot(x, y - .32) < .09); path(Pn, 4);
      star(0, .32, .22, 8); ell(0, .32, .08, .08, 7);
      for (let t = .12; t < .95; t += .16) for (const sd of [-1, 1]) { ell(sd * .66, t, .045, .045, 3); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; add(sd * .66 + Math.cos(a) * .07, t + Math.sin(a) * .07, 11); } }
      ell(0, .98, .09, .07, 6, 12); top = 1.04; cross(0, top); top += .2;
    } else if (kind === 3) {             // stepped pyramid with mini towers and chalice
      skirt(.68);
      const steps = [.66, .5, .34, .2]; steps.forEach((w, i) => { const y0 = .07 + i * .17, P = [[-w, y0], [w, y0], [w, y0 + .17], [-w, y0 + .17]]; fillPoly(P, 8 + i, .04); path(P, 4);
        for (const sd of [-1, 1]) tower(sd * (w - .04), y0 + .17, .03, .07); });
      for (const sd of [-1, 1]) { const pts = []; for (let t = 0; t <= 1; t += .02) { const u = 1 - t; pts.push([sd * (u * u * .62 + 2 * u * t * .05 + t * t * -.12), u * u * .1 + 2 * u * t * .2 + t * t * .62]); } path(pts, 5, false); }
      const C = [[-.12, .62], [.12, .62], [.05, .5], [.05, .44], [.1, .4], [-.1, .4], [-.05, .44], [-.05, .5]]; fillPoly(C, 12, .025); path(C, 7);
      ell(0, .8, .1, .1, 4, 11); top = .92; cross(0, top); top += .2;
    } else if (kind === 4) {             // elephant under an arched window
      skirt(.66);
      for (let i = 0; i <= 18; i++) { const a = Math.PI * i / 18; line(Math.cos(a) * .1, .08 + Math.sin(a) * .1, Math.cos(a) * .5, .08 + Math.sin(a) * .42, i % 2 ? 9 : 10, .03); }
      const B = [[-.3, .3], [.3, .3], [.3, .72], [-.3, .72]]; fillPoly(B, 11, .04, (x, y) => Math.hypot(x / .9, y - .52) < .24); path(B, 4);
      ell(0, .55, .13, .15, 7, 7); for (const sd of [-1, 1]) { ell(sd * .2, .56, .1, .14, 7, 7); line(sd * .05, .44, sd * .08, .36, 6); }
      const tr = []; for (let t = 0; t <= 1; t += .05) tr.push([Math.sin(t * 3) * .03, .45 - t * .2]); path(tr, 7, false);
      const Wn = [[-.12, .72], [.12, .72], [.12, .9]]; for (let i = 0; i <= 12; i++) Wn.push([.12 - .24 * i / 12, .9 + Math.sin(Math.PI * i / 12) * .12]); Wn.push([-.12, .9]); fillPoly(Wn, 12, .03); path(Wn, 1);
      for (const sd of [-1, 1]) { tower(sd * .42, .2, .045, .42); tower(sd * .6, .1, .04, .32); }
      top = 1.02; umbrella(0, top + .02); cross(0, top + .08); top += .3;
    } else if (kind === 5) {             // lotus crown with big flame leaves
      skirt(.64);
      for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) { const bx = sd * (.18 + k * .15), h = .9 - k * .22, P = [];
        for (let t = 0; t <= 1; t += .05) P.push([bx + sd * Math.sin(t * Math.PI) * .12, .08 + t * h]); for (let t = 1; t >= 0; t -= .05) P.push([bx + sd * (Math.sin(t * Math.PI) * .02 + t * .1), .08 + t * h]);
        fillPoly(P, 9, .036); path(P, 1); }
      const A = [[-.14, .08], [.14, .08], [.14, .45], [0, .62], [-.14, .45]]; fillPoly(A, 10, .035); path(A, 4);
      for (let i = 0; i < 9; i++) { const a = Math.PI * (.1 + .8 * i / 8), P = [[0, .7], [Math.cos(a) * .1 - .02, .7 + Math.sin(a) * .1], [Math.cos(a) * .2, .7 + Math.sin(a) * .2], [Math.cos(a) * .1 + .02, .7 + Math.sin(a) * .1]]; fillPoly(P, 11, .025); path(P, 3); }
      top = .95; cross(0, top); top += .2;
    } else if (kind === 6) {             // wide body with oval panels and a dome
      skirt(.68);
      const B = [[-.66, .07], [.66, .07], [.66, .64], [-.66, .64]]; const ov = [-.48, -.16, .16, .48];
      fillPoly(B, 8, .044, (x, y) => ov.some(c => ((x - c) / .12) ** 2 + ((y - .35) / .24) ** 2 < 1)); path(B, 4);
      ov.forEach((c, i) => { ell(c, .35, .12, .24, 1, 10 + (i % 2)); ell(c, .35, .15, .27, 3); });
      const D = ellPts(0, .64, .38, .26, 30, 0, Math.PI).concat([[-.38, .64]]); fillPoly(D, 11, .04); path(D, 5, false);
      [-.2, 0, .2].forEach(x => ell(x, .74, .06, .06, 6, 12)); for (const sd of [-1, 1]) wheel(sd * .6, .72, .07);
      top = .92; cross(0, top); top += .2;
    } else {                             // stepped hearts
      skirt(.66);
      [[4, .22, .62], [3, .48, .44], [2, .7, .3], [1, .88, .2]].forEach(([n, y, sz], r) => { for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * sz * 1.05; heart(x, y, sz * .55, 4, 9 + ((i + r) % 4)); } });
      for (let k = 0; k < 6; k++) for (const sd of [-1, 1]) heart(sd * (.62 - k * .07), .12 + k * .15, .07, 3);
      top = 1.05; cross(0, top); top += .2;
    }
    // controller data for the light programme: section (same colour + part), height, angle and ring round the focus circle
    const secMap = new Map();
    leds.forEach(l => {
      const key = (l.c || "") + "|" + l.g; if (!secMap.has(key)) secMap.set(key, secMap.size); l.sec = secMap.get(key);
      l.yN = l.y / top; l.keep = l.c === "#f4f8ff" && l.g === 7;            // the white cross never changes
      if (focus) { const dx = l.x - focus[0], dy = l.y - focus[1]; l.rad = Math.hypot(dx, dy) / focus[2]; l.ang = Math.atan2(dy, dx); } else { l.rad = 9; l.ang = 0; }
      const cy = top * .45; l.angC = Math.atan2(l.y - cy, l.x); l.radC = Math.min(1, Math.hypot(l.x, (l.y - cy) * .8) / (top * .6));
      l.side = l.x < -.02 ? -1 : l.x > .02 ? 1 : 0; l.rnd = (Math.sin(l.k * 12.9898) * 43758.5453) % 1;
    });
    return { leds, H: top, pal, speed: .8 + R() * .7, wmul: 1.15, nSec: secMap.size, prog: PROG[kind] || PROG.def };
  }

  /* ---------- ground layout: thers stand side by side with clear space — never overlapping ----------
     desktop / tablet: 3 at a time · phone: 1 at a time · "അടുത്ത" brings in the next group */
  let W = 0, Hh = 0, dpr = 1, small = false, N = 3, ground = 0, baseU = 60;
  const slotX = i => W * (i + .5) / N;
  function size() {
    small = stage.clientWidth < 600; const n = small ? 1 : 3;
    if (n !== N) { N = n; if (started) { thers = []; procession(); } }
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = stage.clientWidth; Hh = stage.clientHeight; cv.width = W * dpr; cv.height = Hh * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    ground = Hh * .7;
    // widest ther is 1.3 units: keep each inside its own column with a gap, and the cross + umbrella inside the top
    baseU = Math.min(W / N * .66, (ground - Hh * .07) / 1.4);
    people = []; const r = rng(99);
    for (let i = 0; i < (small ? 10 : 26); i++) people.push({ x: r() * W, y: ground + 6 + r() * Hh * .06, ph: r() * 6 });
    people.sort((a, b) => a.y - b.y);
    thers.forEach(t => { if (t.state === "parked") t.x = slotX(t.slot); });
  }
  let people = [], started = false;

  /* ---------- fleet ---------- */
  let thers = [], cur = 0, mode = 0, modeAuto = true, modeT = 0, focus = -1, focusT = 0;
  // light effects — every ther runs a different one at the same time (ther i shows effect mode + i)
  // each ther's light programme, studied from its video: [move, seconds]
  const ALL = ["rings", "orbit", "rainbow", "rise", "flash", "sweep", "swap", "star", "wave", "spin", "split", "all", "burst", "chase", "fall", "strobe", "breathe", "sparkle"];
  const order = (seed) => { const a = ALL.slice(), r = rng(seed); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const DUR = { strobe: 1.8, flash: 2.6, spin: 3.4, orbit: 3.6, sweep: 3.2, rings: 3.2, rainbow: 3.6, all: 3, burst: 2.6 };
  const progOf = seed => [["hold", 1.6]].concat(order(seed).map(m => [m, DUR[m] || 2.8]));
  const PROG = { 11: progOf(11), 12: progOf(12), 10: progOf(10), 8: progOf(8), 9: progOf(9), def: progOf(1) };
  const CUE = { hold: "തെളിഞ്ഞ്", rise: "താഴെനിന്ന് മുകളിലേക്ക്", fall: "മുകളിൽനിന്ന് താഴേക്ക്", spin: "കറങ്ങൽ", rings: "വളയങ്ങൾ", swap: "ഭാഗം മാറ്റം",
    all: "മുഴുവൻ നിറം മാറ്റം", chase: "ഓട്ടം", orbit: "ചുറ്റിയോട്ടം", sweep: "വട്ടം കറക്കം", rainbow: "മഴവില്ല്", flash: "മിന്നൽ", star: "നക്ഷത്രം",
    wave: "തിരമാല", split: "ഇടത്-വലത്", burst: "നടുവിൽനിന്ന് പൊട്ടൽ", strobe: "ഫ്ലാഷ്", breathe: "ശ്വാസം", sparkle: "വർണ്ണത്തുള്ളി" };
  let progShift = 0;   // the 💡 button jumps every ther to its next move
  function cueAt(t, now) {
    const P = t.d.prog, total = P.reduce((a, c) => a + c[1], 0);
    let tt = ((now / 1000 + t.idx * 3.7 + progShift) % total + total) % total;
    for (const [type, dur] of P) { if (tt < dur) return { type, el: tt, u: tt / dur, dur }; tt -= dur; }
    return { type: "hold", el: 0, u: 0, dur: 1 };
  }
  function nextCue() { const now = performance.now(); let best = 99; thers.forEach(t => { const c = cueAt(t, now); best = Math.min(best, c.dur - c.el); }); progShift += best + .05; }
  const MODES = ["ചേസിംഗ്", "തിരമാല", "മിന്നൽ", "നക്ഷത്രം", "നിറംമാറ്റം"];
  const COMMON = ["#ff3fd2", "#3df2ff", "#ffd23f", "#3dff7a", "#3d7bff", "#ff3348"];   // the usual ther LED colours
  const modeLabel = () => "💡 " + (thers.filter(t => t.state === "parked" && t.cue).map(t => CUE[t.cue.type]).join(" · ") || "ലൈറ്റ് പ്രോഗ്രാം");
  function makeTher(idx, slot, delay) {
    const i = idx % COUNT, name = LABEL(i);
    return { name, idx: i, d: design(KINDS[i]), slot, x: W + baseU * 1.6, state: "wait", t0: performance.now() + delay, on: 0 };
  }
  function bringSet(delay0) {   // the group starting at `cur` drives in from the right; far-left slot first
    for (let k = 0; k < N; k++) { const slot = k; thers.push(makeTher(cur + slot, slot, delay0 + (N - 1 - k) * 0 + k * 700)); }
    focus = -1; nameEl.classList.remove("on"); kick();
  }
  function procession() { thers = []; bringSet(0); }
  function nextSet(step = N) {
    thers.forEach(t => { if (t.state !== "leave") t.state = "leave"; });
    cur = (cur + step) % COUNT; bringSet(900);
  }
  const scores = new Map();   // label → points the viewer gave
  const LABEL = i => `തേര് ${i + 1}`;

  /* ---------- drawing ---------- */
  function color(t, led, now) {
    const base = led.c || t.d.pal[led.g % t.d.pal.length];
    if (led.keep) return [base, 1];
    const c = t.cue || cueAt(t, now), el = c.el, inC = led.rad <= 1.05;
    const angD = (a, b) => { const d = Math.abs(((a - b) % 6.283 + 6.283) % 6.283); return Math.min(d, 6.283 - d); };
    switch (c.type) {
      case "rise": { const lvl = Math.min(1.05, c.u * 1.35); return led.yN <= lvl ? [base, 1] : [base, .12]; }                         // fills from bottom to top
      case "fall": { const lvl = 1 - Math.min(1.05, c.u * 1.35); return led.yN >= lvl ? [base, 1] : [base, .12]; }                     // pours down from the top
      case "spin": { if (!inC) { const ph = ((led.k - el * 30) % 14 + 14) % 14; return [base, ph < 7 ? 1 : .5]; }                       // bright sector turns round the circle
        const d = angD(led.ang, el * 5); return d < .64 ? ["#ffffff", 1] : d < 1.14 ? [COMMON[Math.floor(el * 2) % 6], 1] : [base, .55]; }
      case "orbit": { const head = el * 6.5, tail = d => d < .25 ? ["#ffffff", 1] : d < 1.2 ? [COMMON[Math.floor(el * 1.5) % 6], 1 - d * .5] : [base, .3];   // a comet runs round and round
        if (inC) return led.rad > .55 ? tail(angD(led.ang, head)) : [base, .55]; return tail(angD(led.angC, -head * .7)); }
      case "sweep": { const d = angD(led.angC, el * 3.2); return d < .35 ? ["#ffffff", 1] : d < .9 ? [COMMON[Math.floor(el) % 6], 1] : [base, .35]; }   // a beam turns round the whole ther
      case "rings": { const r = inC ? led.rad * 6 : 6 + led.radC * 8, step = Math.floor(el * 4); return [COMMON[(Math.floor(r) + 600 - step) % 6], 1]; } // colour ripples ring by ring
      case "burst": { const r = inC ? led.rad * .5 : .5 + led.radC * .5, front = (el * .9) % 1.15; return Math.abs(r - front) < .12 ? ["#ffffff", 1] : r < front ? [COMMON[Math.floor(el * .9) % 6], 1] : [base, .3]; } // light bursts out from the middle
      case "swap": { const n = Math.max(3, Math.min(6, t.d.nSec)), step = Math.floor(el * 1.6); return led.sec % n === step % n ? [COMMON[step % 6], 1] : [base, 1]; }   // one part changes at a time
      case "all": { const step = Math.floor(el * 2.2); return [COMMON[(led.sec + step) % 6], 1]; }                                    // everything steps through colours together
      case "chase": { const ph = ((led.k - el * 40) % 14 + 14) % 14; return [base, ph < 6 ? 1 : .45]; }                                // lights run along every line
      case "rainbow": return [HUES[Math.floor(((led.k * 4 + el * 140 + led.y * 300) % 360 + 360) % 360 / 15)], 1];                    // rainbow rolls through
      case "wave": { const v = .5 + .5 * Math.sin(led.y * 9 - el * 4); return [base, .3 + .7 * v]; }                                   // brightness rolls upward
      case "flash": { const on = Math.floor(el * 2.5) % 3 === led.g % 3; return [on ? "#ffffff" : base, on ? 1 : .6]; }             // parts flash white in turn
      case "star": { const tw = Math.sin(led.k * 12.9898 + Math.floor(el * 8) * 78.233) > .72; return [tw ? "#ffffff" : base, tw ? 1 : .6]; } // twinkling stars
      case "sparkle": { const st = Math.floor(el * 6), h = Math.sin(led.k * 7.13 + st * 3.7); return h > .55 ? [COMMON[(led.k + st) % 6], 1] : [base, .75]; }  // colour drops jump around
      case "split": { const half = Math.floor(el * 2) % 2 ? 1 : -1; return led.side === 0 || led.side === half ? [base, 1] : [COMMON[Math.floor(el) % 6], .25]; } // left and right take turns
      case "strobe": return [Math.floor(el * 8) % 2 ? "#ffffff" : base, Math.floor(el * 8) % 2 ? 1 : .2];                             // the whole ther flashes
      case "breathe": return [base, .25 + .75 * (.5 + .5 * Math.sin(el * 4.2 - 1.57))];                                               // slow fade in and out
      default: return [base, 1];
    }
  }
  const HUES = Array.from({ length: 24 }, (_, i) => `hsl(${i * 15},100%,60%)`);
  const SPR = new Map();
  function sprite(col) {
    let c = SPR.get(col); if (c) return c;
    c = document.createElement("canvas"); c.width = c.height = 32; const x = c.getContext("2d");
    const halo = x.createRadialGradient(16, 16, 6, 16, 16, 16);
    halo.addColorStop(0, col); halo.addColorStop(1, "rgba(0,0,0,0)");
    x.globalAlpha = .16; x.fillStyle = halo; x.beginPath(); x.arc(16, 16, 16, 0, 6.283); x.fill();
    x.globalAlpha = 1; x.fillStyle = col; x.beginPath(); x.arc(16, 16, 8.6, 0, 6.283); x.fill();          // hard-edged LED
    const hi = x.createRadialGradient(15, 15, 0, 15, 15, 5); hi.addColorStop(0, "rgba(255,255,255,.95)"); hi.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = hi; x.beginPath(); x.arc(16, 16, 6, 0, 6.283); x.fill();                                    // bright centre
    SPR.set(col, c); return c;
  }
  function drawGround() {
    for (const t of thers) if (t.state === "parked" && t.on > .3) {
      const u = baseU, gl = g.createRadialGradient(t.x, ground, 0, t.x, ground, u * 1.1);
      gl.addColorStop(0, hexA(t.d.pal[0], .3 * t.on)); gl.addColorStop(1, hexA(t.d.pal[0], 0));
      g.fillStyle = gl; g.beginPath(); g.ellipse(t.x, ground, u * 1.1, u * .3, 0, 0, 6.283); g.fill();
    }
  }
  function drawPerson(x, y, s, c, raise) {
    g.fillStyle = c; g.beginPath(); g.ellipse(x, y - 9 * s, 6 * s, 9 * s, 0, 0, 6.283); g.fill();
    g.beginPath(); g.arc(x, y - 21 * s, 4.2 * s, 0, 6.283); g.fill();
    if (raise) { g.strokeStyle = c; g.lineWidth = 2.4 * s; g.beginPath(); g.moveTo(x + 4 * s, y - 14 * s); g.lineTo(x + 7 * s, y - 27 * s); g.stroke();
      g.fillStyle = "#cfe9ff"; g.fillRect(x + 5 * s, y - 33 * s, 4 * s, 6 * s); }
  }
  function drawTher(t, now) {
    const u = baseU, x = t.x, base = ground;
    const moving = t.state === "drive" || t.state === "leave", bob = moving ? Math.sin(now / 90) : 0;
    // vehicle under the ther: platform, wheels, headlights while moving
    const bw = u * .6 * t.d.wmul, bh = u * .08;
    g.fillStyle = "#0b0912"; g.fillRect(x - bw, base - bh + bob, bw * 2, bh);
    g.fillStyle = "#050409"; [-.8, -.45, .8].forEach(o => { g.beginPath(); g.arc(x + bw * o, base + bob, u * .05, 0, 6.283); g.fill(); });
    if (moving) { const hx = x - bw, hg = g.createRadialGradient(hx, base - bh, 0, hx, base - bh, u * .7); hg.addColorStop(0, "rgba(255,236,170,.4)"); hg.addColorStop(1, "rgba(255,236,170,0)"); g.fillStyle = hg; g.fillRect(hx - u * .7, base - bh - u * .7, u * 1.4, u * 1.4); }
    const judging = judge && judge.cur === t.name;
    const bright = t.on * (focus >= 0 && thers[focus] !== t ? .35 : 1) * (judge && !judging ? .4 : 1);
    if (bright > .01) {
      const dot = Math.max(1.1, Math.min(2.8, u * .0115)), y0 = base - bh + bob;
      for (const led of t.d.leds) {
        const [col, a] = color(t, led, now), fill = led.g >= 8, aa = (fill ? a * .88 : a) * bright, dd = fill ? dot * .85 : dot;
        const sz = dd * 3.3; g.globalAlpha = aa; g.drawImage(sprite(col), x + led.x * u - sz / 2, y0 - led.y * u - sz / 2, sz, sz);
      }
      g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    }
    if (judging) { g.fillStyle = "rgba(255,240,200,.07)"; g.beginPath(); g.moveTo(x, 0); g.lineTo(x - u * .75, base); g.lineTo(x + u * .75, base); g.closePath(); g.fill(); }
  }
  function drawLabel(t) {
    const u = baseU, x = t.x, base = ground, judging = judge && judge.cur === t.name;
    {
      const fs = Math.max(11, Math.min(15, u * .1)), sc = scores.get(t.name);
      g.font = `700 ${fs}px "Anek Malayalam","Noto Sans Malayalam",sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
      const label = sc != null ? `${t.name} · ⭐${sc}` : t.name, tw = g.measureText(label).width + 16, ty = base + fs * 1.4;
      const hot = thers[focus] === t || judging;
      g.fillStyle = hot ? "#ffcf4a" : "rgba(11,7,22,.85)"; roundRect(x - tw / 2, ty - fs * .8, tw, fs * 1.6, fs * .8); g.fill();
      g.fillStyle = hot ? "#2a1600" : "#fff"; g.fillText(label, x, ty + 1);
    }
  }
  function roundRect(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
  function drawCrowd(now) {
    for (const p of people) drawPerson(p.x + Math.sin(now / 1500 + p.ph) * 3, p.y, .8, "rgba(10,8,16,.9)", false);
    const n = Math.ceil(W / 24) + 2, r = rng(7);
    for (let i = 0; i < n; i++) { const x = i * 24 + r() * 8, s = 1.3 + r() * .35; drawPerson(x, Hh + 8, s, "#040308", r() < .18); }
  }

  /* ---------- loop ---------- */
  let running = false, visible = false, last = 0, allParkedAt = 0, labelT = 0;
  function kick() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); } }
  function tick(now) {
    const dt = Math.min(50, now - last); last = now;
    g.clearRect(0, 0, W, Hh);
    thers = thers.filter(t => {
      if (t.state === "wait" && now >= t.t0) t.state = "drive";
      if (t.state === "drive") {
        const tx = slotX(t.slot), d = tx - t.x, sp = Math.max(baseU * .4, Math.abs(d) * 2.2) * dt / 1000;
        t.x += Math.sign(d) * Math.min(Math.abs(d), sp); t.on = Math.max(t.on, .5);
        if (Math.abs(tx - t.x) < .5) { t.x = tx; t.state = "parked"; }
      } else if (t.state === "parked") t.on = Math.min(1, t.on + dt / 500);
      else if (t.state === "leave") { t.x -= Math.max(baseU * 1.2, W * .45) * dt / 1000; if (t.x < -baseU * 1.6) return false; }
      return true;
    });
    if (focus >= thers.length || (focus >= 0 && now - focusT > 6000)) { focus = -1; nameEl.classList.remove("on"); }
    // auto parade: after a pause the group drives off and the next samoohams come in (phone: one by one)
    const allParked = thers.length && thers.every(t => t.state === "parked");
    if (!allParked) allParkedAt = 0; else if (!allParkedAt) allParkedAt = now;
    if (small && allParked && visible && !judge && focus < 0 && now - allParkedAt > 6000) { allParkedAt = 0; nextSet(); }
    drawGround();
    thers.forEach(t => { if (t.state !== "wait") { t.cue = cueAt(t, now); drawTher(t, now); } });
    if (now - labelT > 400) { labelT = now; modeEl.textContent = modeLabel(); }
    drawCrowd(now);
    thers.forEach(t => { if (t.state === "parked") drawLabel(t); });
    if (visible || thers.some(t => t.state !== "parked")) requestAnimationFrame(tick); else running = false;
  }

  /* ---------- crowd sound (recorded at the Kottapadi ther malsaram), one sound on the page at a time ---------- */
  const amb = new Audio("audio/ther-crowd.mp3?v=2"); amb.loop = true; amb.preload = "none"; amb.volume = 0;
  let soundOn = true, ambWanted = false, fadeT = null, heard = false;
  function fadeTo(v, ms = 900) {
    clearInterval(fadeT); const v0 = amb.volume, t0 = performance.now();
    fadeT = setInterval(() => { const k = Math.min(1, (performance.now() - t0) / ms); try { amb.volume = v0 + (v - v0) * k; } catch (_) {} if (k >= 1) { clearInterval(fadeT); if (v === 0) amb.pause(); } }, 40);
  }
  function startAmb() {
    if (!soundOn || !heard) return; ambWanted = true;
    window.dispatchEvent(new CustomEvent("kp:audio", { detail: "ther" }));
    const p = amb.play(); if (p && p.catch) p.catch(() => {}); fadeTo(.55);
  }
  function stopAmb() { ambWanted = false; fadeTo(0, 500); }
  function cheer() { if (ambWanted && !amb.paused) { fadeTo(1, 300); setTimeout(() => ambWanted && fadeTo(.55, 1500), 1400); } }
  window.addEventListener("kp:audio", e => { if (e.detail !== "ther" && ambWanted) stopAmb(); });
  sndBtn.addEventListener("click", e => { e.stopPropagation(); soundOn = !soundOn; sndBtn.textContent = soundOn ? "🔊" : "🔇"; sndBtn.setAttribute("aria-pressed", soundOn); soundOn ? startAmb() : stopAmb(); });

  /* ---------- you are the judge: every samooham's ther, group by group ---------- */
  let judge = null;
  function startJudge() {
    scores.clear(); judge = { i: 0, cur: LABEL(0) };
    if (cur !== 0) { thers.forEach(t => t.state = "leave"); cur = 0; bringSet(800); }
    focus = -1; nameEl.classList.remove("on"); showJudge(); kick();
  }
  function showJudge() {
    judge.cur = LABEL(judge.i);
    judgeEl.innerHTML = `<p><b>${judge.cur}</b> · ${judge.i + 1}/${COUNT} · എത്ര പോയിന്റ്?</p>
      <div class="th-pts">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `<button data-pt="${n}">${n}</button>`).join("")}</div>
      ${judge.i >= 2 ? `<button class="th-done" data-jdone>ഇതുവരെയുള്ള ഫലം കാണുക</button>` : ""}`;
    judgeEl.classList.add("on");
  }
  function results() {
    const list = [...scores.entries()].sort((a, b) => b[1] - a[1]), medal = ["🥇", "🥈", "🥉"];
    judgeEl.innerHTML = `<p><b>🏆 നിങ്ങളുടെ വിധി</b> · ${scores.size} തേരുകൾ</p><ol>${list.slice(0, 3).map(([n, p], i) => `<li>${medal[i]} ${n} — ${p} പോയിന്റ്</li>`).join("")}</ol>
      <p class="th-note">ഇത് നിങ്ങൾ നൽകിയ മാർക്ക് മാത്രം · ഔദ്യോഗിക ഫലമല്ല</p><button data-jclose>ശരി</button>`;
    judge = null; cheer();
  }
  judgeEl.addEventListener("click", e => {
    e.stopPropagation();
    if (e.target.closest("[data-jclose]")) { judgeEl.classList.remove("on"); return; }
    if (e.target.closest("[data-jdone]") && judge) { results(); return; }
    const b = e.target.closest("[data-pt]"); if (!b || !judge) return;
    scores.set(judge.cur, +b.dataset.pt); if (+b.dataset.pt >= 8) cheer();
    judge.i++;
    if (judge.i >= COUNT) { results(); return; }
    if (judge.i >= cur + N || judge.i < cur) nextSet(judge.i - cur);   // bring the next group in
    showJudge();
  });

  window.KP_THER_DESIGN = design;   // shared with the angadi procession (ride.js)
  /* ---------- start when scrolled into view; stop drawing and sound when away ---------- */
  size();
  if (window.ResizeObserver) new ResizeObserver(() => size()).observe(stage);
  new IntersectionObserver(es => es.forEach(e => {
    visible = e.isIntersecting;
    if (visible) { if (!started) { started = true; procession(); } else kick(); }
    else if (ambWanted) stopAmb();
  }), { threshold: .2 }).observe(stage);
  new IntersectionObserver(es => es.forEach(e => { heard = e.isIntersecting; if (heard && soundOn) startAmb(); else if (!heard && ambWanted) stopAmb(); }), { rootMargin: "-40% 0px -40% 0px" }).observe(stage);

  /* tap a ther to spotlight it (and start the crowd sound) */
  stage.addEventListener("click", e => {
    if (e.target.closest(".th-judge")) return;
    startAmb();
    if (judge) return;
    const b = stage.getBoundingClientRect(), x = e.clientX - b.left;
    const best = thers.findIndex(t => t.state === "parked" && Math.abs(x - t.x) < W / N / 2);
    if (best < 0) return;
    focus = focus === best ? -1 : best; focusT = performance.now();
    if (focus >= 0) { nameEl.textContent = "✨ " + thers[best].name; nameEl.classList.add("on"); cheer(); } else nameEl.classList.remove("on");
  });

  document.querySelectorAll("[data-th]").forEach(b => b.addEventListener("click", () => {
    const a = b.dataset.th; startAmb();
    if (a === "replay") { judge = null; judgeEl.classList.remove("on"); procession(); }
    else if (a === "next") { if (!judge) nextSet(); }
    else if (a === "judge") startJudge();
    else if (a === "mode") { nextCue(); modeEl.textContent = modeLabel(); }
    kick();
  }));
})();
