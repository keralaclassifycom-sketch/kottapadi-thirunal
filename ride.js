/* ---------- പെരുന്നാൾ അങ്ങാടി: feast night in Kottapadi angadi ----------
   side-scrolling street that moves with the procession: band set in front, the lit ther behind,
   muthukuda umbrellas, a white fairy-light curtain overhead, lit shops, arangu arches, the church
   (the route circles it, so it keeps coming back), people walking along with sparklers, crackers,
   and every now and then two kids on a bike with balloons overtaking on the near lane. */
(() => {
  const stage = document.getElementById("rdStage");
  if (!stage) return;
  const cv = document.getElementById("rdFx"), g = cv.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const hashR = n => { let s = (n * 2654435761) >>> 0 || 1; return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)) >>> 0) / 4294967296; };
  const LED = ["#ff3fb4", "#3df2ff", "#ffd23f", "#3dff7a", "#3d7bff", "#ff3348", "#ffffff"];
  const CLOTH = ["#d9462b", "#f2a33a", "#1f9e8f", "#e6447a", "#f4f1e6", "#3a6fd8", "#7b3fb8", "#2f8f4e", "#f4f1e6", "#ffcf4a"];
  const SKIN = ["#6b4429", "#55341f", "#7a5034", "#4a2e1c"];
  // the only shops on the street, right after the church: Family Bakery, Lasarettan's shop, Eeyappettan's shop (the rest are homes)
  const NEAR_CHURCH = ["ഫാമിലി ബേക്കറി", "ലാസറേട്ടന്റെ കട", "ഈയപ്പേട്ടന്റെ കട"];
  const SHOP_AT = { 11: 0, 3: 1, 6: 2 };   // place in the 12-building stretch: bakery by the church, then houses, Lazarettan's, more houses, Eeyappettan's

  /* ---------- size ---------- */
  let W = 0, H = 0, dpr = 1, u = 1, roadTop = 0, roadBot = 0, walkY = 0, nearY = 0, bikeX = 0;
  function size() {
    if (!stage.clientWidth || !stage.clientHeight) return;
    dpr = Math.min(2, window.devicePixelRatio || 1); W = stage.clientWidth; H = stage.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    u = H / 400; roadTop = H * .73; roadBot = H * .93; walkY = H * .735; nearY = H * .985; bikeX = W * (W < 600 ? .36 : .3);
    stars = Array.from({ length: 70 }, () => [Math.random() * W, Math.random() * H * .45, Math.random() * 1.4 + .3]);
  }
  let stars = [];

  /* ---------- world state ---------- */
  let camX = 0, speed = 1, playing = true, t = 0, last = 0, rideX = -260, bikeWait = 1, seeded = false;
  const people = [], booms = [], sparks = [], smoke = [];
  let balloons = [{ col: "#ff3b5c", len: 1, x: 0, y: 0, vx: 0, vy: 0 }];
  // "ബലൂൺ" button: the bike comes by and the boy on the back lets a whole bunch of balloons go into the sky
  const BCOL = ["#ffd60a", "#2ec4ff", "#7cff6b", "#ff8fd1", "#ff9f1c", "#9b5cff", "#ff3b5c", "#ffffff"];
  let loose = [], toRelease = 0, releaseT = 0, hand = null;
  const SPEEDS = [.6, 1, 1.6];
  let speedI = 1;

  function spawnPerson(x) {
    const kid = Math.random() < .25, dir = 1;
    people.push({ x, dir, v: 16, col: pick(CLOTH), col2: pick(CLOTH), skin: pick(SKIN), kid, ph: Math.random() * 6,
      sparkler: Math.random() < .32, mundu: Math.random() < .5, row: Math.random() < .5 ? 0 : 1 });
  }
  function spawnCracker(x, chain) {
    booms.push({ x, y: chain ? nearY - 2 * u : (Math.random() < .5 ? nearY - 3 * u : walkY + 6 * u), t: -rnd(.5, 1.1), chain: chain ? 24 : 1, popped: 0 });
  }

  /* ---------- drawing: background ---------- */
  function sky() {
    const gr = g.createLinearGradient(0, 0, 0, roadTop); gr.addColorStop(0, "#040823"); gr.addColorStop(.7, "#120f3a"); gr.addColorStop(1, "#2a1640");
    g.fillStyle = gr; g.fillRect(0, 0, W, roadTop);
    g.fillStyle = "#fff"; for (const [x, y, r] of stars) { g.globalAlpha = .4 + .4 * Math.sin(t * 2 + x); g.fillRect(x, y, r, r); } g.globalAlpha = 1;
    const mx = W * .84, my = H * .13, mr = 16 * u; const mg = g.createRadialGradient(mx, my, mr * .6, mx, my, mr * 3); mg.addColorStop(0, "rgba(255,245,210,.35)"); mg.addColorStop(1, "rgba(255,245,210,0)");
    g.fillStyle = mg; g.fillRect(mx - mr * 3, my - mr * 3, mr * 6, mr * 6); g.fillStyle = "#fff6dc"; g.beginPath(); g.arc(mx, my, mr, 0, 6.283); g.fill();
  }
  function palm(x, base, h) {
    g.strokeStyle = "#0a0716"; g.lineWidth = 4 * u; g.beginPath(); g.moveTo(x, base); g.quadraticCurveTo(x + 6 * u, base - h * .5, x + 10 * u, base - h); g.stroke();
    g.lineWidth = 3 * u; for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .5; g.beginPath(); g.moveTo(x + 10 * u, base - h); g.quadraticCurveTo(x + 10 * u + Math.cos(a) * 22 * u, base - h + Math.sin(a) * 10 * u - 6 * u, x + 10 * u + Math.cos(a) * 34 * u, base - h + 12 * u + Math.abs(i - 3) * 3 * u); g.stroke(); }
  }
  function farLayer() {      // palms and distant houses with lit windows (parallax .15)
    const p = .15, seg = 120 * u, off = camX * p, i0 = Math.floor(off / seg) - 1;
    for (let i = i0; i < i0 + W / seg + 3; i++) { const R = hashR(i + 7), x = i * seg - off;
      g.fillStyle = "#0d0a22"; const hh = (20 + R() * 30) * u; g.fillRect(x, roadTop - hh - 22 * u, 60 * u, hh + 22 * u);
      g.fillStyle = "rgba(255,200,120,.55)"; for (let k = 0; k < 3; k++) if (R() < .6) g.fillRect(x + (8 + k * 17) * u, roadTop - hh - 12 * u, 7 * u, 6 * u);
      palm(x + R() * 80 * u, roadTop - 18 * u, (70 + R() * 40) * u); }
  }
  function church(cx, base) {   // white church with gold domes, LED edges (parallax .35)
    const s = u * 1.15;
    const ledEdge = (pts, col) => { for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / (6 * s)));
      for (let k = 0; k <= n; k++) { const on = ((k + i * 3 - Math.floor(t * 8)) % 6 + 6) % 6 < 3; g.fillStyle = on ? col : "rgba(255,255,255,.35)"; g.beginPath(); g.arc(x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n, 1.6 * s, 0, 6.283); g.fill(); } } };
    g.fillStyle = "#e9e4da";
    g.fillRect(cx - 70 * s, base - 70 * s, 140 * s, 70 * s);                                    // nave
    g.fillStyle = "#c8643c"; g.beginPath(); g.moveTo(cx - 76 * s, base - 70 * s); g.lineTo(cx, base - 100 * s); g.lineTo(cx + 76 * s, base - 70 * s); g.closePath(); g.fill();
    g.fillStyle = "#f2eee6"; g.fillRect(cx - 38 * s, base - 112 * s, 76 * s, 112 * s);          // facade
    g.beginPath(); g.moveTo(cx - 42 * s, base - 112 * s); g.lineTo(cx, base - 140 * s); g.lineTo(cx + 42 * s, base - 112 * s); g.closePath(); g.fill();
    for (const sd of [-1, 1]) { const tx = cx + sd * 54 * s; g.fillStyle = "#f2eee6"; g.fillRect(tx - 13 * s, base - 150 * s, 26 * s, 150 * s);
      g.fillStyle = "#d9b45a"; g.beginPath(); g.arc(tx, base - 150 * s, 13 * s, Math.PI, 0); g.fill(); g.fillRect(tx - 1.5 * s, base - 176 * s, 3 * s, 14 * s); g.fillRect(tx - 6 * s, base - 171 * s, 12 * s, 3 * s); }
    g.fillStyle = "#d9b45a"; g.beginPath(); g.arc(cx + 95 * s, base - 70 * s, 24 * s, Math.PI, 0); g.fill();           // dome behind
    g.fillStyle = "#ffcf6b"; for (let k = -1; k <= 1; k++) { g.beginPath(); g.ellipse(cx + k * 20 * s, base - 70 * s, 5 * s, 9 * s, 0, 0, 6.283); g.fill(); }
    g.fillStyle = "#5a3418"; g.beginPath(); g.moveTo(cx - 12 * s, base); g.lineTo(cx - 12 * s, base - 30 * s); g.arc(cx, base - 30 * s, 12 * s, Math.PI, 0); g.lineTo(cx + 12 * s, base); g.fill();
    g.fillStyle = "#ffffff"; g.fillRect(cx - 2 * s, base - 160 * s, 4 * s, 22 * s); g.fillRect(cx - 9 * s, base - 154 * s, 18 * s, 4 * s);
    ledEdge([[cx - 42 * s, base - 112 * s], [cx, base - 140 * s], [cx + 42 * s, base - 112 * s]], "#ffd23f");
    ledEdge([[cx - 76 * s, base - 70 * s], [cx - 38 * s, base - 87 * s]], "#3df2ff"); ledEdge([[cx + 38 * s, base - 87 * s], [cx + 76 * s, base - 70 * s]], "#3df2ff");
    for (const sd of [-1, 1]) ledEdge([[cx + sd * 54 * s - 13 * s * sd, base], [cx + sd * 54 * s - 13 * s * sd, base - 150 * s]], "#ff3fb4");
  }
  function churchLayer() {
    const p = .35, loop = 1600 * u, off = camX * p, i0 = Math.floor((off - W) / loop);
    for (let i = i0; i <= i0 + 3; i++) { const x = i * loop + 700 * u - off; if (x > -300 * u && x < W + 300 * u) church(x, roadTop - 14 * u); }
  }
  // Kottapadi angadi buildings (from street view): old two-storey shops, white or pastel walls, red tiled roofs,
  // white-pillared balcony upstairs, shutters below, red-brown plinth with steps — lit up for the feast night
  const WALLS = ["#d9d3c4", "#cfc9b9", "#a9cdbd", "#d8b8b8", "#d6caa0", "#d9d3c4"];
  function shop(x, w, h, R, idx, name) {
    const base = roadTop - 4 * u, top = base - h, wall = WALLS[idx % WALLS.length], mid = top + h * .5;
    // walls (night-dimmed) with a warm wash from the street lights
    g.fillStyle = wall; g.fillRect(x, top, w, h);
    const wash = g.createLinearGradient(0, top, 0, base); wash.addColorStop(0, "rgba(10,8,30,.55)"); wash.addColorStop(1, "rgba(255,170,90,.12)"); g.fillStyle = wash; g.fillRect(x, top, w, h);
    // red tiled roof with overhang
    g.fillStyle = "#8f3a26"; g.beginPath(); g.moveTo(x - 8 * u, top + 2 * u); g.lineTo(x + w + 8 * u, top + 2 * u); g.lineTo(x + w - 10 * u, top - 16 * u); g.lineTo(x + 10 * u, top - 16 * u); g.closePath(); g.fill();
    g.strokeStyle = "rgba(0,0,0,.25)"; g.lineWidth = 1; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(x - 8 * u + k * 2 * u, top + 2 * u - k * 4.5 * u); g.lineTo(x + w + 8 * u - k * 2 * u, top + 2 * u - k * 4.5 * u); g.stroke(); }
    // upstairs: windows (some lit) behind a white balcony balustrade with pillars
    const nWin = Math.max(2, Math.round(w / (38 * u)));
    for (let k = 0; k < nWin; k++) { const wx = x + (k + .5) * w / nWin - 7 * u, lit = R() < .55;
      g.fillStyle = "#4a2a1a"; g.fillRect(wx - 2 * u, top + 10 * u, 18 * u, 26 * u); g.fillStyle = lit ? "#ffcf7a" : "#1b1410"; g.fillRect(wx, top + 12 * u, 14 * u, 22 * u); }
    g.fillStyle = "#ece6d8"; g.fillRect(x, mid - 16 * u, w, 3 * u); g.fillRect(x, mid - 2 * u, w, 4 * u);
    for (let bx = x + 3 * u; bx < x + w; bx += 6 * u) g.fillRect(bx, mid - 13 * u, 2 * u, 11 * u);
    for (const px of [x + 4 * u, x + w - 8 * u]) g.fillRect(px, top + 6 * u, 5 * u, mid - top - 6 * u);           // corner pillars
    // ground floor: rolling shutters, one open and lit
    const nSh = Math.max(2, Math.round(w / (48 * u))), sw = (w - 10 * u) / nSh;
    for (let k = 0; k < nSh; k++) { const sx = x + 5 * u + k * sw, open = (k + idx) % 3 === 0;
      if (open) { g.fillStyle = "#ffd89a"; g.fillRect(sx + 2 * u, mid + 22 * u, sw - 4 * u, base - mid - 30 * u); g.fillStyle = "rgba(80,40,20,.45)"; g.fillRect(sx + 6 * u, mid + 36 * u, sw - 12 * u, base - mid - 46 * u); }
      else { g.fillStyle = "#7c8088"; g.fillRect(sx + 2 * u, mid + 22 * u, sw - 4 * u, base - mid - 30 * u); g.fillStyle = "rgba(0,0,0,.18)"; for (let y = mid + 24 * u; y < base - 8 * u; y += 3 * u) g.fillRect(sx + 2 * u, y, sw - 4 * u, 1); } }
    // small sign board with a running LED border
    const bw = Math.min(w - 14 * u, 120 * u), bh = 14 * u, bxx = x + (w - bw) / 2, by = mid + 5 * u;
    g.fillStyle = "#120c22"; g.fillRect(bxx, by, bw, bh);
    const n = Math.floor((bw + bh) * 2 / (6 * u)); for (let k = 0; k < n; k++) { const d = k / n * (bw + bh) * 2; let px, py;
      if (d < bw) { px = bxx + d; py = by; } else if (d < bw + bh) { px = bxx + bw; py = by + d - bw; } else if (d < bw * 2 + bh) { px = bxx + bw - (d - bw - bh); py = by + bh; } else { px = bxx; py = by + bh - (d - bw * 2 - bh); }
      g.fillStyle = ((k + Math.floor(t * 10)) % 4 < 2) ? LED[idx % LED.length] : "rgba(255,255,255,.25)"; g.fillRect(px - u, py - u, 2 * u, 2 * u); }
    g.fillStyle = "#fff3c8"; g.font = `700 ${Math.max(9, bh * .62)}px "Anek Malayalam","Noto Sans Malayalam",sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(name, bxx + bw / 2, by + bh / 2 + 1, bw - 8 * u);
    // red-brown plinth and steps
    g.fillStyle = "#7a2f24"; g.fillRect(x - 4 * u, base - 8 * u, w + 8 * u, 8 * u); g.fillStyle = "#5e231b"; g.fillRect(x + w * .3, base - 4 * u, w * .4, 4 * u);
    // blue LED strip along the balcony rail
    for (let k = 0; k <= w / (5 * u); k++) { g.fillStyle = (k + Math.floor(t * 12)) % 10 < 7 ? "#3d7bff" : "#9fc0ff"; g.fillRect(x + k * 5 * u - .9 * u, mid - 17 * u, 1.8 * u, 1.8 * u); }
    for (let k = 0; k <= w / (5 * u); k++) { g.fillStyle = "#3dff7a"; g.globalAlpha = (k + Math.floor(t * 6)) % 4 ? 1 : .4; g.fillRect(x - 8 * u + k * 5 * u * (w + 16 * u) / w, top + 1 * u, 1.8 * u, 1.8 * u); }
    g.globalAlpha = 1;
    // festival bulbs along the roof edge
    for (let k = 0; k <= w / (9 * u); k++) { g.fillStyle = LED[(k + idx) % LED.length]; g.globalAlpha = (k + Math.floor(t * 4)) % 3 ? 1 : .35; g.beginPath(); g.arc(x + k * 9 * u, top + 3 * u + Math.sin(k * .7) * 1.5 * u, 1.8 * u, 0, 6.283); g.fill(); }
    g.globalAlpha = 1;
  }
  // homes along the angadi (only the three named shops are shops): three kinds of Kerala houses, all lit for the feast
  const HOUSE_WALL = ["#d9d3c4", "#cfe3d6", "#e3cfcf", "#d6caa0", "#cdd6e6", "#e6dcc8"];
  function house(x, w, h, R, idx, kind) {
    const base = roadTop - 4 * u, wall = HOUSE_WALL[idx % HOUSE_WALL.length], night = (y0, y1) => { const g2 = g.createLinearGradient(0, y0, 0, y1); g2.addColorStop(0, "rgba(10,8,30,.55)"); g2.addColorStop(1, "rgba(255,170,90,.1)"); return g2; };
    const win = (wx, wy, ww, wh, lit) => { g.fillStyle = "#4a2a1a"; g.fillRect(wx - 2 * u, wy - 2 * u, ww + 4 * u, wh + 4 * u); g.fillStyle = lit ? "#ffcf7a" : "#1b1410"; g.fillRect(wx, wy, ww, wh);
      g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(wx + ww / 2 - .6 * u, wy, 1.2 * u, wh); };
    const hx = x + 10 * u, hw = w - 20 * u;            // house sits a little back, behind its compound wall
    if (kind === 0) {                                    // old single-storey: tiled roof, front verandah with pillars
      const hh = h * .55, top = base - hh;
      g.fillStyle = wall; g.fillRect(hx, top, hw, hh); g.fillStyle = night(top, base); g.fillRect(hx, top, hw, hh);
      g.fillStyle = "#8f3a26"; g.beginPath(); g.moveTo(hx - 14 * u, top + 6 * u); g.lineTo(hx + hw + 14 * u, top + 6 * u); g.lineTo(hx + hw - 22 * u, top - 34 * u); g.lineTo(hx + 22 * u, top - 34 * u); g.closePath(); g.fill();
      g.fillStyle = "#6e2b1c"; g.fillRect(hx - 14 * u, top + 4 * u, hw + 28 * u, 4 * u);
      for (let k = 0; k < 4; k++) { g.fillStyle = "#efe9dc"; g.fillRect(hx + 6 * u + k * (hw - 16 * u) / 3, top + 8 * u, 4 * u, hh - 10 * u); }          // verandah pillars
      g.fillStyle = "#5a3418"; g.fillRect(hx + hw / 2 - 8 * u, base - 30 * u, 16 * u, 28 * u); g.fillStyle = "#ffcf7a"; g.fillRect(hx + hw / 2 - 6 * u, base - 28 * u, 5 * u, 24 * u);   // half-open door
      win(hx + 14 * u, top + 16 * u, 16 * u, 16 * u, R() < .7); win(hx + hw - 30 * u, top + 16 * u, 16 * u, 16 * u, R() < .7);
      for (let k = 0; k <= (hw + 28 * u) / (8 * u); k++) { g.fillStyle = LED[(k + idx) % LED.length]; g.globalAlpha = (k + Math.floor(t * 4)) % 3 ? 1 : .35; g.fillRect(hx - 14 * u + k * 8 * u, top + 8 * u + Math.sin(k) * u, 2 * u, 2 * u); }
    } else if (kind === 1) {                             // modern two-storey: flat roof, balcony with railing, big windows
      const hh = h * .95, top = base - hh, mid = top + hh * .48;
      g.fillStyle = wall; g.fillRect(hx, top, hw, hh); g.fillStyle = night(top, base); g.fillRect(hx, top, hw, hh);
      g.fillStyle = "#efe9dc"; g.fillRect(hx - 6 * u, top - 6 * u, hw + 12 * u, 7 * u); g.fillRect(hx - 8 * u, mid - 3 * u, hw + 16 * u, 5 * u);               // parapet + sunshade slab
      g.strokeStyle = "#cfd4dc"; g.lineWidth = 1.2 * u; g.strokeRect(hx + hw * .45, mid - 18 * u, hw * .5, 15 * u); for (let bx = hx + hw * .45; bx < hx + hw * .95; bx += 6 * u) { g.beginPath(); g.moveTo(bx, mid - 18 * u); g.lineTo(bx, mid - 3 * u); g.stroke(); }   // balcony rail
      win(hx + 12 * u, top + 14 * u, 26 * u, 22 * u, R() < .7); win(hx + hw * .55, top + 12 * u, 22 * u, 14 * u, R() < .5);
      win(hx + 12 * u, mid + 12 * u, 30 * u, 22 * u, R() < .8); g.fillStyle = "#3a2618"; g.fillRect(hx + hw - 34 * u, base - 32 * u, 18 * u, 30 * u);
      for (let k = 0; k <= (hw + 12 * u) / (6 * u); k++) { g.fillStyle = (k + Math.floor(t * 10)) % 8 < 5 ? "#3d7bff" : "#9fc0ff"; g.fillRect(hx - 6 * u + k * 6 * u, top - 7 * u, 2 * u, 2 * u); }   // LED on the parapet
    } else {                                             // old two-storey with tiled roof and a white-pillared balcony (like the street view), no shop
      const hh = h * .9, top = base - hh, mid = top + hh * .5;
      g.fillStyle = wall; g.fillRect(hx, top, hw, hh); g.fillStyle = night(top, base); g.fillRect(hx, top, hw, hh);
      g.fillStyle = "#8f3a26"; g.beginPath(); g.moveTo(hx - 8 * u, top + 2 * u); g.lineTo(hx + hw + 8 * u, top + 2 * u); g.lineTo(hx + hw - 10 * u, top - 16 * u); g.lineTo(hx + 10 * u, top - 16 * u); g.closePath(); g.fill();
      for (let k = 0; k < 2; k++) win(hx + 12 * u + k * (hw - 40 * u), top + 10 * u, 16 * u, 22 * u, R() < .6);
      g.fillStyle = "#ece6d8"; g.fillRect(hx, mid - 16 * u, hw, 3 * u); g.fillRect(hx, mid - 2 * u, hw, 4 * u); for (let bx = hx + 3 * u; bx < hx + hw; bx += 6 * u) g.fillRect(bx, mid - 13 * u, 2 * u, 11 * u);
      g.fillStyle = "#5a3418"; g.fillRect(hx + hw / 2 - 9 * u, base - 34 * u, 18 * u, 32 * u); win(hx + 10 * u, mid + 14 * u, 18 * u, 20 * u, R() < .7); win(hx + hw - 28 * u, mid + 14 * u, 18 * u, 20 * u, R() < .7);
      for (let k = 0; k <= w / (5 * u); k++) { g.fillStyle = (k + Math.floor(t * 12)) % 10 < 7 ? "#3dff7a" : "#c6ffd6"; g.fillRect(hx + k * 5 * u - .9 * u, mid - 17 * u, 1.8 * u, 1.8 * u); }
    }
    // compound wall with gate and serial lights along its top
    const cw = 16 * u;
    g.fillStyle = "#bdb5a6"; g.fillRect(x, base - cw, w * .38, cw); g.fillRect(x + w * .62, base - cw, w * .38, cw);
    g.fillStyle = "rgba(10,8,30,.4)"; g.fillRect(x, base - cw, w, cw);
    g.strokeStyle = "#2a2a30"; g.lineWidth = 1.2 * u; for (let gx = x + w * .38 + 3 * u; gx < x + w * .62; gx += 5 * u) { g.beginPath(); g.moveTo(gx, base - cw + 2 * u); g.lineTo(gx, base); g.stroke(); }   // iron gate
    for (let k = 0; k <= w / (7 * u); k++) { if (k * 7 * u > w * .38 && k * 7 * u < w * .62) continue; g.fillStyle = LED[(k * 3 + idx) % LED.length]; g.globalAlpha = (k + Math.floor(t * 5)) % 3 ? 1 : .3; g.beginPath(); g.arc(x + k * 7 * u, base - cw - 1 * u, 1.6 * u, 0, 6.283); g.fill(); }
    g.globalAlpha = 1;
    // a Christmas-style star lantern hanging in front of many homes in the feast season
    if (R() < .6) { const sx = x + w * (R() < .5 ? .25 : .75), sy = base - h * .62, r = 9 * u;
      g.strokeStyle = "rgba(220,220,220,.5)"; g.lineWidth = 1; g.beginPath(); g.moveTo(sx, sy - r - 18 * u); g.lineTo(sx, sy - r); g.stroke();
      const sc = ["#ff3348", "#ffd23f", "#3df2ff", "#ff3fb4"][idx % 4], gl = g.createRadialGradient(sx, sy, 0, sx, sy, r * 2.4); gl.addColorStop(0, sc + "88"); gl.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gl; g.fillRect(sx - r * 2.4, sy - r * 2.4, r * 4.8, r * 4.8);
      g.fillStyle = sc; g.beginPath(); for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283 - Math.PI / 2 + Math.sin(t) * .05, rr = k % 2 ? r * .45 : r; g.lineTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr); } g.closePath(); g.fill();
      g.strokeStyle = "#fff6dc"; g.lineWidth = 1; g.stroke(); }
  }
  function shopLayer() {      // parallax .6; a gap every few buildings so the church shows through; electric poles and wires
    const p = .6, seg = 196 * u, off = camX * p, i0 = Math.floor(off / seg) - 1;
    const md = (a, m) => ((a % m) + m) % m;
    for (let i = i0 - 2; i < i0 + W / seg + 3; i++) if (md(i, 12) === 9) church(i * seg - off + seg, roadTop - 6 * u);   // the church shows through its gap
    for (let i = i0; i < i0 + W / seg + 3; i++) { const R = hashR(i * 13 + 5), j = md(i, 12); if (j === 9 || j === 10) continue;
      const ord = SHOP_AT[j], block = Math.floor((i + 1) / 12);
      const w = (160 + R() * 30) * u, h = (118 + R() * 30) * u;
      if (ord != null) shop(i * seg - off, w, h, R, md(i, 6), NEAR_CHURCH[ord]);      // the three real shops, each on its own stretch with houses in between
      else house(i * seg - off, w, h, R, md(i, 6), md(j + block, 3)); }               // everything else: homes, three kinds
    const ps = 300 * u, j0 = Math.floor(off / ps) - 1, poleTop = roadTop - 190 * u;
    g.strokeStyle = "rgba(20,18,30,.9)"; g.lineWidth = 1.2;
    for (let j = j0; j < j0 + W / ps + 3; j++) { const x0 = j * ps - off + 40 * u, x1 = x0 + ps;
      g.fillStyle = "#6f6f78"; g.fillRect(x0 - 2.5 * u, poleTop, 5 * u, roadTop - poleTop); g.fillRect(x0 - 12 * u, poleTop + 8 * u, 24 * u, 3 * u);
      for (const dy of [10, 18]) { g.beginPath(); g.moveTo(x0 - 10 * u, poleTop + dy * u); g.quadraticCurveTo((x0 + x1) / 2, poleTop + (dy + 22) * u, x1 - 10 * u, poleTop + dy * u); g.stroke(); } }
  }
  function arangu(x) {        // LED arch on the roadside (parallax 1)
    const w = 150 * u, h = 150 * u, base = walkY + 2 * u, cx = x + w / 2;
    const pts = []; for (let i = 0; i <= 40; i++) { const a = Math.PI - Math.PI * i / 40; pts.push([cx + Math.cos(a) * w / 2, base - h * .62 + -Math.sin(a) * h * .38]); }
    const posts = [[x, base], [x, base - h * .62]], posts2 = [[x + w, base - h * .62], [x + w, base]];
    const strip = (P, off, cols) => { for (let i = 0; i < P.length - 1; i++) { const [x0, y0] = P[i], [x1, y1] = P[i + 1], n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / (5 * u)));
      for (let k = 0; k < n; k++) { const j = i * 7 + k, on = ((j - Math.floor(t * 14) + off) % 10 + 10) % 10 < 5; g.fillStyle = on ? cols[(Math.floor(j / 10) + off) % cols.length] : "rgba(255,255,255,.18)";
        g.beginPath(); g.arc(x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n, 1.9 * u, 0, 6.283); g.fill(); } } };
    strip(posts.concat(pts).concat(posts2), 0, ["#ffd23f", "#ff3fb4", "#3df2ff"]);
    const inner = pts.map(([px, py]) => [cx + (px - cx) * .82, base - h * .62 + (py - (base - h * .62)) * .78]); strip(inner, 3, ["#3dff7a", "#ff3348", "#ffffff"]);
    // star on top + banner
    g.fillStyle = "#ffd23f"; g.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283 - Math.PI / 2, r = i % 2 ? 4 * u : 10 * u; g.lineTo(cx + Math.cos(a) * r, base - h - 4 * u + Math.sin(a) * r); } g.fill();
    g.fillStyle = "rgba(18,12,34,.85)"; g.fillRect(cx - 52 * u, base - h * .62 - 4 * u, 104 * u, 16 * u);
    g.fillStyle = "#ffcf4a"; g.font = `700 ${10 * u}px "Anek Malayalam","Noto Sans Malayalam",sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("തിരുനാൾ ആശംസകൾ", cx, base - h * .62 + 4 * u);
  }
  function road() {
    g.fillStyle = "#2a2230"; g.fillRect(0, roadTop - 6 * u, W, 10 * u);                         // far sidewalk
    g.fillStyle = "#1a1720"; g.fillRect(0, roadTop + 4 * u, W, roadBot - roadTop);             // asphalt
    const glow = g.createLinearGradient(0, roadTop, 0, roadBot); glow.addColorStop(0, "rgba(255,180,90,.12)"); glow.addColorStop(1, "rgba(255,180,90,0)"); g.fillStyle = glow; g.fillRect(0, roadTop, W, roadBot - roadTop);
    g.fillStyle = "#e9e4da"; const dash = 40 * u, off = camX % (dash * 2); for (let x = -off; x < W; x += dash * 2) g.fillRect(x, (roadTop + roadBot) / 2, dash, 2.4 * u);
    g.fillStyle = "#2e2632"; g.fillRect(0, roadBot, W, H - roadBot);                             // near sidewalk
    g.fillStyle = "#4a4048"; g.fillRect(0, roadBot, W, 2 * u);
  }

  /* ---------- people, sparklers, crackers ---------- */
  function person(p, now) {
    const x = p.x - camX, s = u * (p.kid ? .75 : 1) * (p.row ? 1.05 : .9), y = walkY + (p.row ? 4 : -2) * u;
    if (x < -40 || x > W + 40) return;
    const sw = Math.sin(now * 6 + p.ph) * 5 * s;
    g.strokeStyle = p.skin; g.lineWidth = 2.6 * s; g.lineCap = "round";
    g.beginPath(); g.moveTo(x, y - 18 * s); g.lineTo(x + sw, y); g.moveTo(x, y - 18 * s); g.lineTo(x - sw, y); g.stroke();       // legs
    g.fillStyle = p.mundu ? "#f4f1e6" : p.col2; g.fillRect(x - 5 * s, y - 20 * s, 10 * s, p.mundu ? 18 * s : 8 * s);              // mundu / skirt
    g.fillStyle = p.col; g.beginPath(); g.ellipse(x, y - 28 * s, 6 * s, 10 * s, 0, 0, 6.283); g.fill();                             // body
    g.fillStyle = p.skin; g.beginPath(); g.arc(x, y - 42 * s, 4.6 * s, 0, 6.283); g.fill();
    g.fillStyle = "#111"; g.beginPath(); g.arc(x, y - 44 * s, 4.6 * s, Math.PI, 0); g.fill();
    if (p.sparkler) {               // arm held out with a lit kambithiri
      const hx = x + p.dir * 9 * s, hy = y - 30 * s, tx = hx + p.dir * 10 * s, ty = hy - 10 * s;
      g.strokeStyle = p.skin; g.lineWidth = 2.2 * s; g.beginPath(); g.moveTo(x + p.dir * 3 * s, y - 32 * s); g.lineTo(hx, hy); g.stroke();
      g.strokeStyle = "#888"; g.lineWidth = 1 * s; g.beginPath(); g.moveTo(hx, hy); g.lineTo(tx, ty); g.stroke();
      const gl = g.createRadialGradient(tx, ty, 0, tx, ty, 14 * s); gl.addColorStop(0, "rgba(255,240,190,.9)"); gl.addColorStop(1, "rgba(255,200,120,0)"); g.fillStyle = gl; g.fillRect(tx - 14 * s, ty - 14 * s, 28 * s, 28 * s);
      if (playing && sparks.length < 900) for (let i = 0; i < 3; i++) { const a = Math.random() * 6.283, v = rnd(30, 90) * s; sparks.push({ x: tx + camX, y: ty, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rnd(.2, .45), col: Math.random() < .5 ? "#fff3c8" : "#ffcf4a" }); }
    }
  }
  function drawBooms(dt) {
    for (let i = booms.length - 1; i >= 0; i--) { const b = booms[i], x = b.x - camX; b.t += dt;
      if (b.t < 0) {    // fuse burning
        if (x > -20 && x < W + 20) { g.fillStyle = "#c0262f"; g.fillRect(x - 3 * u, b.y - 7 * u, 6 * u, 7 * u); g.fillStyle = Math.random() < .5 ? "#fff3c8" : "#ffb347"; g.beginPath(); g.arc(x + rnd(-1, 1) * u, b.y - 9 * u, 1.6 * u, 0, 6.283); g.fill(); }
        continue; }
      // chain crackers pop one after another
      const due = Math.min(b.chain, Math.floor(b.t / .09) + 1);
      while (b.popped < due) { const px = b.x + b.popped * (b.chain > 1 ? 4 : 7) * u, py = b.y - 4 * u; if (playing && (b.chain === 1 || b.popped === 0)) pop(px - camX + (b.chain > 1 ? b.chain * 2 * u : 0), b.chain > 1); b.popped++;
        if (playing) { for (let k = 0; k < (b.chain > 1 ? 8 : 14); k++) { const a = Math.random() * 6.283, v = rnd(60, 180) * u; sparks.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40 * u, life: rnd(.15, .4), col: pick(["#fff", "#ffd23f", "#ff8a1f"]) }); }
          smoke.push({ x: px, y: py, r: 6 * u, life: 1 }); flashes.push({ x: px, y: py, life: 1 }); } }
      if (b.popped >= b.chain && b.t > b.chain * .09 + .3) booms.splice(i, 1);
    }
  }
  const flashes = [];
  function drawFx(dt) {
    for (let i = flashes.length - 1; i >= 0; i--) { const f = flashes[i]; f.life -= dt * 6; if (f.life <= 0) { flashes.splice(i, 1); continue; }
      const x = f.x - camX, r = (1 - f.life) * 30 * u + 6 * u, gl = g.createRadialGradient(x, f.y, 0, x, f.y, r); gl.addColorStop(0, `rgba(255,250,220,${f.life})`); gl.addColorStop(1, "rgba(255,200,120,0)");
      g.fillStyle = gl; g.fillRect(x - r, f.y - r, r * 2, r * 2); }
    g.globalCompositeOperation = "lighter";
    for (let i = sparks.length - 1; i >= 0; i--) { const p = sparks[i]; if (playing) { p.life -= dt; p.vy += 260 * u * dt; p.x += p.vx * dt; p.y += p.vy * dt; } if (p.life <= 0) { sparks.splice(i, 1); continue; }
      g.globalAlpha = Math.min(1, p.life * 4); g.fillStyle = p.col; g.fillRect(p.x - camX, p.y, 1.8 * u, 1.8 * u); }
    g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    for (let i = smoke.length - 1; i >= 0; i--) { const s = smoke[i]; if (playing) { s.life -= dt * .35; s.r += 14 * u * dt; s.y -= 8 * u * dt; } if (s.life <= 0) { smoke.splice(i, 1); continue; }
      g.fillStyle = `rgba(200,190,200,${s.life * .25})`; g.beginPath(); g.arc(s.x - camX, s.y, s.r, 0, 6.283); g.fill(); }
  }

  /* ---------- overhead bulb strings + poles (foreground, parallax 1.25) ---------- */
  function overhead() {
    const p = 1.25, seg = 260 * u, off = camX * p, i0 = Math.floor(off / seg) - 1, poleTop = H * .08;
    for (let i = i0; i < i0 + W / seg + 3; i++) { const x0 = i * seg - off, x1 = x0 + seg;
      g.fillStyle = "#0a0812"; g.fillRect(x0 - 3 * u, poleTop, 6 * u, H - poleTop);
      for (let k = 0; k <= 26; k++) { const tt = k / 26, x = x0 + (x1 - x0) * tt, y = poleTop + 8 * u + Math.sin(tt * Math.PI) * 34 * u;
        const on = ((k + i * 5 + Math.floor(t * 5)) % 3) !== 0; g.fillStyle = LED[(k + i) % LED.length]; g.globalAlpha = on ? 1 : .3;
        g.beginPath(); g.arc(x, y, 2.4 * u, 0, 6.283); g.fill(); if (on) { g.globalAlpha = .18; g.beginPath(); g.arc(x, y, 6 * u, 0, 6.283); g.fill(); } }
      g.globalAlpha = 1; }
  }

  /* ---------- the bike, two kids, balloons ---------- */
  function bike(now) {
    const s = u * 1.1, bx = rideX, by = H - 4 * u + Math.sin(now * 14) * .8 * u, spin = (camX + rideX) / (14 * s);
    if (bx < -200 * u || bx > W + 200 * u) return;
    // headlight beam
    const hx = bx + 40 * s, hy = by - 34 * s, beam = g.createLinearGradient(hx, hy, hx + 180 * s, hy);
    beam.addColorStop(0, "rgba(255,240,190,.45)"); beam.addColorStop(1, "rgba(255,240,190,0)"); g.fillStyle = beam;
    g.beginPath(); g.moveTo(hx, hy - 3 * s); g.lineTo(hx + 180 * s, hy - 30 * s); g.lineTo(hx + 180 * s, hy + 36 * s); g.closePath(); g.fill();
    // wheels
    for (const wx of [bx - 30 * s, bx + 32 * s]) { g.strokeStyle = "#0b0b0e"; g.lineWidth = 5 * s; g.beginPath(); g.arc(wx, by - 14 * s, 13 * s, 0, 6.283); g.stroke();
      g.strokeStyle = "#9aa1ab"; g.lineWidth = 1.2 * s; g.beginPath(); for (let k = 0; k < 6; k++) { const a = spin + k * Math.PI / 3; g.moveTo(wx, by - 14 * s); g.lineTo(wx + Math.cos(a) * 11 * s, by - 14 * s + Math.sin(a) * 11 * s); } g.stroke();
      g.fillStyle = "#c9ced6"; g.beginPath(); g.arc(wx, by - 14 * s, 2.5 * s, 0, 6.283); g.fill(); }
    // frame + body
    g.strokeStyle = "#2a2a30"; g.lineWidth = 3 * s; g.beginPath(); g.moveTo(bx - 30 * s, by - 14 * s); g.lineTo(bx - 6 * s, by - 26 * s); g.lineTo(bx + 32 * s, by - 14 * s); g.moveTo(bx + 32 * s, by - 14 * s); g.lineTo(bx + 24 * s, by - 42 * s); g.stroke();
    g.fillStyle = "#c81e3a"; g.beginPath(); g.moveTo(bx - 34 * s, by - 30 * s); g.lineTo(bx - 8 * s, by - 34 * s); g.lineTo(bx + 18 * s, by - 40 * s); g.lineTo(bx + 30 * s, by - 32 * s); g.lineTo(bx + 10 * s, by - 22 * s); g.lineTo(bx - 26 * s, by - 22 * s); g.closePath(); g.fill();
    g.fillStyle = "#ff5a6e"; g.fillRect(bx + 2 * s, by - 38 * s, 12 * s, 3 * s);
    g.fillStyle = "#111"; g.beginPath(); g.ellipse(bx - 14 * s, by - 36 * s, 18 * s, 4 * s, -.05, 0, 6.283); g.fill();            // seat
    g.fillStyle = "#555"; g.fillRect(bx - 40 * s, by - 26 * s, 12 * s, 3 * s);                                                     // exhaust
    g.fillStyle = "#fff2b0"; g.beginPath(); g.arc(bx + 38 * s, by - 34 * s, 4 * s, 0, 6.283); g.fill();                            // headlight
    g.fillStyle = "#ff3348"; g.fillRect(bx - 38 * s, by - 34 * s, 4 * s, 3 * s);                                                   // tail light
    g.strokeStyle = "#222"; g.lineWidth = 2.4 * s; g.beginPath(); g.moveTo(bx + 24 * s, by - 42 * s); g.lineTo(bx + 18 * s, by - 50 * s); g.stroke();
    // rider (helmet) and pillion
    const kid = (hipX, col, skin, lean, helmet) => {
      g.strokeStyle = "#2a3a6a"; g.lineWidth = 5 * s; g.lineCap = "round";
      g.beginPath(); g.moveTo(hipX, by - 38 * s); g.lineTo(hipX + 14 * s, by - 30 * s); g.lineTo(hipX + 12 * s, by - 18 * s); g.stroke();         // leg
      g.strokeStyle = col; g.lineWidth = 9 * s; g.beginPath(); g.moveTo(hipX, by - 40 * s); g.lineTo(hipX + lean, by - 60 * s); g.stroke();      // torso
      g.fillStyle = skin; g.beginPath(); g.arc(hipX + lean + 1 * s, by - 69 * s, 6.5 * s, 0, 6.283); g.fill();
      if (helmet) { g.fillStyle = "#ffcf4a"; g.beginPath(); g.arc(hipX + lean + 1 * s, by - 71 * s, 7.5 * s, Math.PI * 1.05, Math.PI * 2.1); g.fill(); g.fillStyle = "rgba(120,180,255,.6)"; g.fillRect(hipX + lean + 3 * s, by - 72 * s, 5 * s, 3 * s); }
      else { g.fillStyle = "#111"; g.beginPath(); g.arc(hipX + lean + 1 * s, by - 72 * s, 6.5 * s, Math.PI, 0); g.fill(); }
    };
    kid(bx - 22 * s, "#2f8f4e", "#6b4429", 3 * s, false);
    // pillion's arm up holding the balloon strings
    const handX = bx - 24 * s, handY = by - 84 * s; hand = { x: handX, y: handY, s };
    g.strokeStyle = "#6b4429"; g.lineWidth = 3 * s; g.beginPath(); g.moveTo(bx - 19 * s, by - 58 * s); g.lineTo(handX, handY); g.stroke();
    kid(bx + 2 * s, "#ffcf4a", "#7a5034", 6 * s, true);
    g.strokeStyle = "#7a5034"; g.lineWidth = 3 * s; g.beginPath(); g.moveTo(bx + 9 * s, by - 56 * s); g.lineTo(bx + 18 * s, by - 50 * s); g.stroke();   // rider's arm on the handle
    // balloons: springy, pushed back by the wind
    balloons.forEach((b, i) => {
      const tx = handX - (26 + i * 10) * s * (.6 + .4 * speed), ty = handY - (44 + b.len * 16 + i * 6) * s + Math.sin(now * 2 + i) * 4 * s;
      if (!b.x) { b.x = tx; b.y = ty; }
      b.vx += (tx - b.x) * .08 + Math.sin(now * 3 + i * 2) * .25 * s; b.vy += (ty - b.y) * .08; b.vx *= .86; b.vy *= .86; b.x += b.vx; b.y += b.vy;
      g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 1; g.beginPath(); g.moveTo(handX, handY); g.quadraticCurveTo((handX + b.x) / 2 - 8 * s, (handY + b.y) / 2 + 10 * s, b.x, b.y + 13 * s); g.stroke();
      g.fillStyle = b.col; g.beginPath(); g.ellipse(b.x, b.y, 10 * s, 13 * s, Math.sin(now + i) * .15, 0, 6.283); g.fill();
      g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.ellipse(b.x - 3.5 * s, b.y - 5 * s, 2.5 * s, 3.5 * s, 0, 0, 6.283); g.fill();
      g.fillStyle = b.col; g.beginPath(); g.moveTo(b.x - 2 * s, b.y + 13 * s); g.lineTo(b.x + 2 * s, b.y + 13 * s); g.lineTo(b.x, b.y + 16 * s); g.fill();
    });
  }

  // balloons let go from the bike: they float up, sway, lag behind the moving bike and drift off the top
  function drawLoose(dt) {
    const onScreen = hand && rideX > 20 * u && rideX < W - 20 * u;
    if (toRelease > 0 && onScreen && playing) {
      releaseT -= dt;
      while (releaseT <= 0 && toRelease > 0) { releaseT += rnd(.04, .11); toRelease--;
        const s = hand.s;
        loose.push({ x: hand.x + rnd(-14, 6) * s, y: hand.y - rnd(20, 50) * s, vx: rnd(-80, 40) * u, vy: rnd(-150, -70) * u, ph: Math.random() * 6, col: pick(BCOL), r: rnd(.8, 1.15), str: rnd(16, 26) }); }
    }
    for (let i = loose.length - 1; i >= 0; i--) { const b = loose[i];
      if (playing) { b.vx += (-30 * u * SPEEDS[speedI] - b.vx) * .6 * dt; b.vy = Math.max(b.vy - 8 * u * dt, -130 * u); b.x += (b.vx + Math.sin(t * 2.2 + b.ph) * 22 * u) * dt; b.y += b.vy * dt; }
      if (b.y < -60 * u || b.x < -60 * u) { loose.splice(i, 1); continue; }
      const s = u * 1.1 * b.r, tilt = Math.sin(t * 2 + b.ph) * .2;
      g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1; g.beginPath(); g.moveTo(b.x, b.y + 13 * s);
      g.quadraticCurveTo(b.x + Math.sin(t * 3 + b.ph) * 6 * s, b.y + (13 + b.str / 2) * s, b.x - Math.sin(t * 2 + b.ph) * 4 * s, b.y + (13 + b.str) * s); g.stroke();
      g.fillStyle = b.col; g.beginPath(); g.ellipse(b.x, b.y, 10 * s, 13 * s, tilt, 0, 6.283); g.fill();
      g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.ellipse(b.x - 3.5 * s, b.y - 5 * s, 2.5 * s, 3.5 * s, 0, 0, 6.283); g.fill();
      g.fillStyle = b.col; g.beginPath(); g.moveTo(b.x - 2 * s, b.y + 13 * s); g.lineTo(b.x + 2 * s, b.y + 13 * s); g.lineTo(b.x, b.y + 16 * s); g.fill();
    }
  }

  /* ---------- procession: band set in front, the ther behind, umbrellas, fairy-light curtain ---------- */
  function umbrella(x, top, s, col, col2, pole) {
    if (pole) { g.strokeStyle = "#c9a24a"; g.lineWidth = 2 * s; g.beginPath(); g.moveTo(x, top); g.lineTo(x, top + pole); g.stroke(); }
    g.fillStyle = col; g.beginPath(); g.moveTo(x - 20 * s, top + 6 * s); g.quadraticCurveTo(x, top - 16 * s, x + 20 * s, top + 6 * s); g.closePath(); g.fill();
    g.fillStyle = col2; for (let k = -4; k <= 4; k++) { g.beginPath(); g.arc(x + k * 4.6 * s, top + 7 * s, 2.4 * s, 0, Math.PI); g.fill(); }      // frill
    g.fillStyle = "#ffd23f"; g.beginPath(); g.arc(x, top - 9 * s, 2.4 * s, 0, 6.283); g.fill(); g.fillRect(x - .8 * s, top - 15 * s, 1.6 * s, 6 * s);
    g.fillStyle = "rgba(255,230,140,.8)"; for (let k = -3; k <= 3; k++) g.fillRect(x + k * 5.5 * s - .8 * s, top + 1 * s - Math.abs(k) * 1.2 * s, 1.6 * s, 1.6 * s);
  }
  const UMB = [["#2fbf4a", "#ffd23f"], ["#e8b62a", "#c81e3a"], ["#c81e3a", "#ffd23f"], ["#7b3fb8", "#ffd23f"], ["#1f9e8f", "#ffffff"]];
  function roadsideUmbrellas() {        // muthukuda lining the far side of the street
    const seg = 95 * u, i0 = Math.floor(camX / seg) - 1;
    for (let i = i0; i < i0 + W / seg + 3; i++) { const c = UMB[((i % UMB.length) + UMB.length) % UMB.length]; umbrella(i * seg - camX, walkY - 52 * u, u * 1.05, c[0], c[1], 46 * u); }
  }
  // hanging LED-string curtain like the band-set video: white at the top, two colour bands, a rainbow hem; schemes cycle
  const SCHEMES = [["#2dff6a", "#3d7bff"], ["#3d7bff", "#b04dff"], ["#2dff6a", "#ffd23f"], ["#ff3fb4", "#3df2ff"]];
  function fairyCurtain() {
    const p = 1.15, gap = 8 * u, off = camX * p, i0 = Math.floor(off / gap), sch = SCHEMES[Math.floor(t / 4.5) % SCHEMES.length], pulse = 1 + beatPulse() * .6;
    g.strokeStyle = "rgba(200,200,220,.25)"; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 4 * u); g.lineTo(W, 4 * u); g.stroke();
    for (let i = i0; i < i0 + W / gap + 2; i++) { const R = hashR(i * 31 + 3), x = i * gap - off, sag = Math.sin(((x / W) * Math.PI)) * 18 * u, len = (62 + R() * 22) * u + sag, ph = R() * 6;
      for (let y = 6 * u; y < len; y += 5.2 * u) { const f = y / len, tw = (.55 + .45 * Math.sin(t * 3 + ph + y * .3)) * pulse;
        g.fillStyle = f < .38 ? "#fffbea" : f < .62 ? sch[0] : f < .82 ? sch[1] : `hsl(${((x / W) * 360 + t * 60) % 360},100%,60%)`;
        g.globalAlpha = Math.min(1, tw); g.fillRect(x - .9 * u, y + Math.sin(t + i) * u, 1.8 * u, 1.8 * u); } }
    g.globalAlpha = 1;
    const fog = g.createLinearGradient(0, 0, 0, H * .32); fog.addColorStop(0, "rgba(255,250,230,.10)"); fog.addColorStop(1, "rgba(255,250,230,0)"); g.fillStyle = fog; g.fillRect(0, 0, W, H * .32);
  }
  function bandMan(x, y, s, kind, i) {   // musician in grey uniform, marching
    const step = Math.sin(t * 5.2 + i * .9), hit = music.on ? (beatAge() < .11) !== (i % 2 === 1) : Math.sin(t * 10.4 + i) > 0;
    g.strokeStyle = "#1c1e25"; g.lineWidth = 4 * s; g.lineCap = "round";
    g.beginPath(); g.moveTo(x, y - 20 * s); g.lineTo(x + step * 5 * s, y); g.moveTo(x, y - 20 * s); g.lineTo(x - step * 5 * s, y); g.stroke();
    g.fillStyle = "#c9ccd4"; g.beginPath(); g.ellipse(x, y - 30 * s, 7 * s, 11 * s, 0, 0, 6.283); g.fill();
    g.fillStyle = "#5a3a24"; g.beginPath(); g.arc(x + 1 * s, y - 46 * s, 5 * s, 0, 6.283); g.fill();
    g.fillStyle = "#111"; g.beginPath(); g.arc(x + 1 * s, y - 48 * s, 5 * s, Math.PI, 0); g.fill();
    g.strokeStyle = "#5a3a24"; g.lineWidth = 2.4 * s;
    if (kind === "drum") {
      g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 1.6 * s; g.beginPath(); g.moveTo(x - 5 * s, y - 38 * s); g.lineTo(x + 8 * s, y - 20 * s); g.stroke();
      g.fillStyle = "#cfd4dc"; g.fillRect(x - 2 * s, y - 24 * s, 18 * s, 9 * s); g.fillStyle = "#fbf6e8"; g.beginPath(); g.ellipse(x + 7 * s, y - 24 * s, 9 * s, 3 * s, 0, 0, 6.283); g.fill();
      g.strokeStyle = "#d6a86a"; g.lineWidth = 1.6 * s; g.beginPath(); g.moveTo(x + 3 * s, y - 30 * s); g.lineTo(x + 7 * s, hit ? y - 25 * s : y - 38 * s); g.moveTo(x + 9 * s, y - 30 * s); g.lineTo(x + 12 * s, !hit ? y - 25 * s : y - 38 * s); g.stroke();
    } else if (kind === "horn") {
      g.beginPath(); g.moveTo(x + 4 * s, y - 34 * s); g.lineTo(x + 8 * s, y - 44 * s); g.stroke();
      g.strokeStyle = "#e8c45a"; g.lineWidth = 2 * s; g.beginPath(); g.moveTo(x + 6 * s, y - 45 * s); g.lineTo(x + 22 * s, y - 47 * s); g.stroke();
      g.fillStyle = "#ffd76a"; g.beginPath(); g.moveTo(x + 22 * s, y - 47 * s); g.lineTo(x + 28 * s, y - 52 * s); g.lineTo(x + 28 * s, y - 42 * s); g.closePath(); g.fill();
    } else if (kind === "bass") {
      g.fillStyle = "#fbf6e8"; g.beginPath(); g.arc(x + 7 * s, y - 28 * s, 11 * s, 0, 6.283); g.fill(); g.strokeStyle = "#c81e3a"; g.lineWidth = 2.4 * s; g.stroke();
      g.strokeStyle = "#d6a86a"; g.lineWidth = 1.8 * s; g.beginPath(); g.moveTo(x + 14 * s, y - 36 * s); g.lineTo(hit ? x + 12 * s : x + 18 * s, hit ? y - 30 * s : y - 44 * s); g.stroke();
    }
  }
  const DANCE = Array.from({ length: 40 }, (_, i) => { const R = hashR(i * 97 + 11); return { dx: R(), dy: R(), col: CLOTH[Math.floor(R() * CLOTH.length)], skin: SKIN[Math.floor(R() * SKIN.length)], ph: R() * 6, style: Math.floor(R() * 3) }; });
  function dancers(x0, width, n, seed) {
    const yTop = walkY + 26 * u, yBot = roadBot - 4 * u;
    const GROUPS = [3, 2, 3, 2], spots = []; let gx = x0;
    for (const size of GROUPS) { for (let k = 0; k < size && spots.length < n; k++) spots.push(gx + k * 13 * u); gx += size * 13 * u + 34 * u; if (spots.length >= n) break; }
    DANCE.slice(seed, seed + spots.length).map((d, i) => ({ d, x: spots[i], y: yTop + (.35 + d.dy * .5) * (yBot - yTop) })).sort((a, b) => a.y - b.y).forEach(({ d, x, y }) => {
      const sc = u * (1 + (y - yTop) / (yBot - yTop) * .35);
      const beat = music.on ? Math.max(0, 1 - beatAge() / .3) : Math.max(0, Math.sin(t * 6 + d.ph));
      const jump = beat * 7 * sc, wave = Math.sin(t * 7 + d.ph), yy = y - jump;
      g.strokeStyle = d.skin; g.lineCap = "round"; g.lineWidth = 2.8 * sc;
      g.beginPath(); g.moveTo(x, yy - 18 * sc); g.lineTo(x - 4 * sc, yy); g.moveTo(x, yy - 18 * sc); g.lineTo(x + 4 * sc, yy); g.stroke();      // legs
      g.fillStyle = "#1c1e25"; g.fillRect(x - 5 * sc, yy - 20 * sc, 10 * sc, 8 * sc);
      g.fillStyle = d.col; g.beginPath(); g.ellipse(x, yy - 28 * sc, 6 * sc, 10 * sc, 0, 0, 6.283); g.fill();
      g.strokeStyle = d.skin; g.lineWidth = 2.6 * sc; g.beginPath();                                                                       // arms up, waving
      if (d.style === 0) { g.moveTo(x - 4 * sc, yy - 34 * sc); g.lineTo(x - 10 * sc + wave * 3 * sc, yy - 50 * sc); g.moveTo(x + 4 * sc, yy - 34 * sc); g.lineTo(x + 10 * sc - wave * 3 * sc, yy - 50 * sc); }
      else if (d.style === 1) { g.moveTo(x - 4 * sc, yy - 34 * sc); g.lineTo(x - 13 * sc, yy - 40 * sc + wave * 5 * sc); g.moveTo(x + 4 * sc, yy - 34 * sc); g.lineTo(x + 8 * sc, yy - 52 * sc); }
      else { g.moveTo(x - 4 * sc, yy - 34 * sc); g.lineTo(x - 2 * sc + wave * 4 * sc, yy - 54 * sc); g.moveTo(x + 4 * sc, yy - 34 * sc); g.lineTo(x + 13 * sc, yy - 40 * sc - wave * 5 * sc); }
      g.stroke();
      g.fillStyle = d.skin; g.beginPath(); g.arc(x, yy - 43 * sc, 4.6 * sc, 0, 6.283); g.fill();
      g.fillStyle = "#111"; g.beginPath(); g.arc(x, yy - 45 * sc, 4.6 * sc, Math.PI, 0); g.fill();
    });
  }
  function band(baseX) {                 // two rows: drummers lead, horns and bass behind
    const back = ["horn", "horn", "bass", "horn", "drum", "drum"], front = ["horn", "drum", "horn", "drum", "drum", "drum"];
    const gap = 31 * u;
    back.forEach((k, i) => bandMan(baseX + i * gap, walkY + 22 * u, u * 1.2, k, i));
    dancers(baseX - 10 * u, gap * 6, 4, 30);   // a few dancing among the band
    front.forEach((k, i) => bandMan(baseX + i * gap + 14 * u, roadBot + 4 * u, u * 1.4, k, i + 7));
  }
  // the ther float, using a design from the Ther section
  const THER_KINDS = [11, 12, 10]; let therDesign = null, therKind = 0;
  // the ther travels folded on a tempo that drives in reverse (cab at the back), like on the real feast night
  function therFloat(cx) {
    const s = u * 1.15, ground = (roadTop + roadBot) / 2 + 22 * u, bob = Math.sin(t * 9) * .6 * u, bedY = ground - 30 * s + bob;
    g.save(); g.translate(cx * 2, 0); g.scale(-1, 1);      // mirror: cab ends up on the left, facing back
    tempo(cx, s, ground, bob);
    g.restore();
    foldedTher(cx + 21 * s, bedY - 6 * s, s);               // the folded ther stands on the bed (bed is centred at cx+21s after mirroring)
    return { left: cx - 144 * s, right: cx + 120 * s };
  }
  // seen from the side on the road: the ther's sides are folded, so only one side section shows —
  // the real ther design (from the Ther section) cut down the middle, its half standing on the tempo bed
  function foldedTher(cx, base, s) {
    if (!therDesign && window.KP_THER_DESIGN) therDesign = window.KP_THER_DESIGN(THER_KINDS[therKind]);
    if (!therDesign) return;
    const bedLen = 198 * s, left = cx - bedLen / 2, right = left + bedLen, ut = bedLen / .78, d = Math.max(1.1, ut * .0085);   // centre line (tallest part) at the back of the bed, away from the cab
    const glow = g.createRadialGradient(right - bedLen * .4, base - ut * .5, 0, right - bedLen * .4, base - ut * .5, ut);
    glow.addColorStop(0, "rgba(255,210,140,.16)"); glow.addColorStop(1, "rgba(255,210,140,0)"); g.fillStyle = glow; g.fillRect(right - ut * 1.2, base - ut * 1.5, ut * 1.4, ut * 1.6);
    // the black frame the LEDs are fixed on — its outline follows the half's widest LED at each height
    if (!therDesign.halfPoly) {
      const bins = new Map(); for (const l of therDesign.leds) { if (l.x < -.01) continue; const b = Math.round(l.y / .03); bins.set(b, Math.max(bins.get(b) || 0, l.x)); }
      const keys = [...bins.keys()].sort((a, b) => a - b), pts = [[0, 0]];
      for (let i = 0; i < keys.length; i++) { const prev = bins.get(keys[i - 1]) || 0, next = bins.get(keys[i + 1]) || 0, w = Math.max(bins.get(keys[i]), (prev + next) / 2 * .9); pts.push([w + .025, keys[i] * .03]); }
      pts.push([0, keys[keys.length - 1] * .03 + .03]); therDesign.halfPoly = pts;
    }
    g.fillStyle = "#05040a"; g.beginPath(); therDesign.halfPoly.forEach(([x, y], i) => i ? g.lineTo(right - x * ut, base - y * ut) : g.moveTo(right - x * ut, base - y * ut)); g.closePath(); g.fill();
    for (const l of therDesign.leds) {
      if (l.x < -.01) continue;                                  // keep one half: from the centre line out to the edge
      const px = right - l.x * ut, py = base - l.y * ut; if (py < -8) continue;
      const on = ((l.k - t * 24) % 12 + 12) % 12 < 7;
      g.globalAlpha = on ? 1 : .55; g.fillStyle = l.c || therDesign.pal[l.g % therDesign.pal.length];
      g.beginPath(); g.arc(px, py, d, 0, 6.283); g.fill();
    }
    g.globalAlpha = 1;
    // the fold line along the centre, and tie ropes down to the bed
    g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1; g.beginPath(); g.moveTo(right, base); g.lineTo(right, base - ut * Math.min(1.2, therDesign.H)); g.stroke();
    g.strokeStyle = "rgba(230,220,200,.5)"; g.beginPath(); g.moveTo(right - 4 * s, base - ut * .55); g.lineTo(right + 20 * s, base + 4 * s); g.moveTo(right - bedLen * .6, base - ut * .35); g.lineTo(left - 6 * s, base + 4 * s); g.stroke();
  }
  function tempo(cx, s, ground, bob) {
    const bedL = cx - 120 * s, bedR = cx + 78 * s, bedY = ground - 30 * s + bob, cabL = bedR + 4 * s, cabR = cabL + 62 * s;
    // flatbed with a colourful fringed skirt (as on the ther tempos)
    g.fillStyle = "#2b2730"; g.fillRect(bedL, bedY - 6 * s, bedR - bedL, 10 * s);
    const sk = ["#ffd23f", "#c81e3a", "#2fbf4a", "#ff3fb4"];
    for (let x = bedL, k = 0; x < bedR; x += 7 * s, k++) { g.fillStyle = sk[k % sk.length]; g.beginPath(); g.moveTo(x, bedY + 4 * s); g.lineTo(x + 7 * s, bedY + 4 * s); g.lineTo(x + 3.5 * s, bedY + 13 * s); g.closePath(); g.fill(); }
    g.fillStyle = "#e8b62a"; g.fillRect(bedL, bedY + 3 * s, bedR - bedL, 2 * s);
    // chassis
    g.fillStyle = "#151318"; g.fillRect(bedL + 10 * s, bedY + 8 * s, cabR - bedL - 20 * s, 8 * s);
    // cab (facing right, the way the procession walks)
    const cy = bedY - 34 * s;
    g.fillStyle = "#2f5fb3"; g.beginPath(); g.moveTo(cabL, bedY + 14 * s); g.lineTo(cabL, cy + 4 * s); g.quadraticCurveTo(cabL, cy, cabL + 6 * s, cy); g.lineTo(cabR - 14 * s, cy);
    g.quadraticCurveTo(cabR - 4 * s, cy + 2 * s, cabR - 2 * s, cy + 18 * s); g.lineTo(cabR, bedY + 14 * s); g.closePath(); g.fill();
    g.fillStyle = "#e9eef6"; g.fillRect(cabL, bedY - 4 * s, cabR - cabL, 4 * s);                                                       // white stripe
    g.fillStyle = "rgba(140,190,255,.55)"; g.beginPath(); g.moveTo(cabL + 30 * s, cy + 4 * s); g.lineTo(cabR - 14 * s, cy + 4 * s); g.lineTo(cabR - 5 * s, cy + 18 * s); g.lineTo(cabL + 30 * s, cy + 18 * s); g.closePath(); g.fill();   // windscreen
    g.fillStyle = "rgba(140,190,255,.4)"; g.fillRect(cabL + 8 * s, cy + 5 * s, 18 * s, 13 * s);                                     // door window
    g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 1; g.strokeRect(cabL + 6 * s, cy + 3 * s, 22 * s, 34 * s);                       // door
    g.fillStyle = "#111"; g.fillRect(cabR - 2 * s, cy + 10 * s, 5 * s, 2 * s);                                                       // mirror
    g.fillStyle = "#9aa1ab"; g.fillRect(cabR - 6 * s, bedY + 8 * s, 10 * s, 5 * s);                                                  // bumper
    g.fillStyle = "#fff2b0"; g.beginPath(); g.arc(cabR - 2 * s, bedY + 2 * s, 3 * s, 0, 6.283); g.fill();                           // headlight
    g.fillStyle = "#ff9f1c"; g.fillRect(cabR - 4 * s, bedY - 3 * s, 3 * s, 2 * s);
    g.fillStyle = "#ffffff"; g.fillRect(bedL - 3 * s, bedY - 2 * s, 3 * s, 4 * s); g.fillStyle = "#ff3348"; g.fillRect(bedL - 3 * s, bedY + 3 * s, 3 * s, 3 * s);   // reversing + tail lamps (lead the way)
    const beam = g.createLinearGradient(cabR, 0, cabR + 120 * s, 0); beam.addColorStop(0, "rgba(255,240,190,.18)"); beam.addColorStop(1, "rgba(255,240,190,0)"); g.fillStyle = beam;
    g.beginPath(); g.moveTo(cabR, bedY); g.lineTo(cabR + 120 * s, bedY - 14 * s); g.lineTo(cabR + 120 * s, bedY + 22 * s); g.closePath(); g.fill();
    // wheels (front single, rear double)
    for (const wx of [cabL + 30 * s, bedL + 30 * s, bedL + 48 * s]) { g.fillStyle = "#08070a"; g.beginPath(); g.arc(wx, ground, 10 * s, 0, 6.283); g.fill();
      g.fillStyle = "#8d939c"; g.beginPath(); g.arc(wx, ground, 4 * s, 0, 6.283); g.fill(); }
  }

  /* ---------- sound: the band song (Kavane Nalla Kavane) with beat detection, a natural crowd murmur when the
     band isn't playing, and a bang for every cracker. One sound source on the page at a time (kp:audio). ---------- */
  const music = { el: new Audio("audio/angadi-kavane.mp3"), on: false, want: true, ctx: null, an: null, buf: null, avg: 0, lastBeat: -9, out: null, noise: null };
  music.el.loop = true; music.el.preload = "none";
  const amb = new Audio("audio/ther-crowd.mp3?v=2"); amb.loop = true; amb.preload = "none"; amb.volume = 0;
  let soundOn = false;   // becomes true on the first tap in this section
  const beatAge = () => t - music.lastBeat, beatPulse = () => music.on ? Math.max(0, 1 - beatAge() / .25) : 0;
  function ensureCtx() {
    try {
      if (!music.ctx) { const AC = window.AudioContext || window.webkitAudioContext; music.ctx = new AC();
        const src = music.ctx.createMediaElementSource(music.el); music.an = music.ctx.createAnalyser(); music.an.fftSize = 512;
        src.connect(music.an); music.an.connect(music.ctx.destination); music.buf = new Uint8Array(music.an.frequencyBinCount);
        music.out = music.ctx.createDynamicsCompressor(); music.out.connect(music.ctx.destination);
        const n = music.ctx.createBuffer(1, music.ctx.sampleRate * .4, music.ctx.sampleRate), d = n.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; music.noise = n; loadWala(); }
      if (music.ctx.state === "suspended") music.ctx.resume();
    } catch (_) {}
  }
  function soundStart() { soundOn = true; ensureCtx(); window.dispatchEvent(new CustomEvent("kp:audio", { detail: "angadi" })); updateAmb(); }
  function soundStop() { soundOn = false; musicStop(); updateAmb(); }
  function updateAmb() {   // crowd murmur: full when the band is quiet, very low under the song
    const want = soundOn && heard && playing;
    if (!want) { amb.pause(); return; }
    try { amb.volume = music.on ? .12 : .55; } catch (_) {}
    if (amb.paused) { const p = amb.play(); if (p && p.catch) p.catch(() => {}); }
  }
  function musicStart() {
    if (!music.want) return;
    if (!soundOn) soundStart(); else ensureCtx();
    const pr = music.el.play(); if (pr && pr.catch) pr.catch(() => { music.on = false; sndBtn.textContent = "🔇 പാട്ട്"; songBtn.classList.remove("hide"); updateAmb(); }); music.on = true;   // blocked until the visitor has tapped the page once sndBtn.textContent = "🔊 പാട്ട്"; songBtn.classList.add("hide"); updateAmb();
  }
  function musicStop() { music.el.pause(); music.on = false; sndBtn.textContent = "🔇 പാട്ട്"; songBtn.classList.remove("hide"); updateAmb(); }
  // real Kerala padakkam sounds, cut from a 1000-wala recording: two maalapadakkam strings + four single bangs
  const WALA = { mala: ["audio/padakkam-mala1.mp3", "audio/padakkam-mala2.mp3"], one: ["audio/padakkam-1.mp3", "audio/padakkam-2.mp3", "audio/padakkam-3.mp3", "audio/padakkam-4.mp3"] }, wala = { mala: [], one: [] };
  function loadWala() {
    for (const k of ["mala", "one"]) WALA[k].forEach(url => fetch(url).then(r => r.arrayBuffer()).then(a => new Promise((ok, no) => music.ctx.decodeAudioData(a, ok, no))).then(b => wala[k].push(b)).catch(() => {}));
  }
  function pop(x, chain) {   // play the real recording, panned to where it burst; synthesized crack only until the files have loaded
    if (!soundOn || !heard || !music.ctx) return;
    const list = wala[chain ? "mala" : "one"];
    if (list.length) {
      const c = music.ctx, now = c.currentTime, src = c.createBufferSource(), gn = c.createGain();
      src.buffer = pick(list); src.playbackRate.value = rnd(.94, 1.06); gn.gain.value = (chain ? .85 : .75) * rnd(.8, 1);
      let last = gn; if (c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = Math.max(-.8, Math.min(.8, (x / W) * 2 - 1)); gn.connect(p); last = p; }
      src.connect(gn); last.connect(music.out); src.start(now); return;
    }
    if (!music.noise) return; const big = !chain;
    const c = music.ctx, now = c.currentTime, src = c.createBufferSource(), bp = c.createBiquadFilter(), gn = c.createGain();
    src.buffer = music.noise; src.playbackRate.value = rnd(.8, 1.2); bp.type = "bandpass"; bp.frequency.value = rnd(900, 2400); bp.Q.value = .7;
    const v = (big ? .9 : .55) * rnd(.75, 1); gn.gain.setValueAtTime(v, now); gn.gain.exponentialRampToValueAtTime(.001, now + rnd(.12, .22));
    let last = gn; if (c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = Math.max(-.9, Math.min(.9, (x / W) * 2 - 1)); gn.connect(p); last = p; }
    src.connect(bp); bp.connect(gn); last.connect(music.out); src.start(now); src.stop(now + .3);
    const o = c.createOscillator(), og = c.createGain(); o.frequency.setValueAtTime(110, now); o.frequency.exponentialRampToValueAtTime(40, now + .12);
    og.gain.setValueAtTime(v * .7, now); og.gain.exponentialRampToValueAtTime(.001, now + .14); o.connect(og); og.connect(music.out); o.start(now); o.stop(now + .16);
  }
  function listenBeat() {
    if (!music.on || !music.an) return;
    music.an.getByteFrequencyData(music.buf); let e = 0; for (let i = 1; i <= 8; i++) e += music.buf[i]; e /= 8;
    if (e > music.avg * 1.18 && e > 60 && t - music.lastBeat > .2) music.lastBeat = t;
    music.avg = music.avg * .92 + e * .08;
  }
  window.addEventListener("kp:audio", e => { if (e.detail !== "angadi" && soundOn) soundStop(); });
  const sndBtn = document.getElementById("rdSnd"), songBtn = document.getElementById("rdSong");
  songBtn.addEventListener("click", e => { e.stopPropagation(); music.want = true; musicStart(); kick(); });

  /* ---------- loop ---------- */
  let visible = false, heard = false, running = false, nextBoomX = 0, nextArch = 0, nextGroupX = 0;
  function frame(now) {
    now /= 1000; const dt = Math.min(.05, now - (last || now)); last = now; listenBeat();
    if (playing) { t += dt; camX += 42 * u * SPEEDS[speedI] * dt; speed = SPEEDS[speedI];
      if (bikeWait > 0) bikeWait -= dt; else { rideX += 120 * u * SPEEDS[speedI] * dt; if (rideX > W + 260 * u) { rideX = -260 * u; bikeWait = rnd(2.5, 5); } } }
    // keep the street populated ahead of the bike
    const spawnGroup = x => { const n = Math.random() < .5 ? 2 : 3; for (let k = 0; k < n; k++) spawnPerson(x + k * 14 * u); };
    if (!seeded && W) { seeded = true; for (let x = rnd(0, 60) * u; x < W; x += rnd(130, 190) * u) spawnGroup(camX + x); }   // street already busy at the start, in groups
    if (people.length < (W < 600 ? 9 : 16) && camX + W + 40 * u > nextGroupX) { spawnGroup(Math.max(nextGroupX, camX + W + 20 * u)); nextGroupX = Math.max(nextGroupX, camX + W + 20 * u) + rnd(130, 200) * u; }
    for (let i = people.length - 1; i >= 0; i--) { const p = people[i]; if (playing) p.x += p.dir * p.v * u * dt; if (p.x < camX - 80 * u) people.splice(i, 1); }
    if (camX + W > nextBoomX) { spawnCracker(nextBoomX, Math.random() < .35); nextBoomX += rnd(380, 900) * u; }

    sky(); farLayer(); shopLayer();
    // roadside arches every 900 units
    const as = 900 * u; for (let i = Math.floor(camX / as) - 1; i <= Math.floor((camX + W) / as) + 1; i++) arangu(i * as + 320 * u - camX);
    road(); roadsideUmbrellas();
    // everything on the far side of the road first — people, sparklers, crackers, the umbrellas carried alongside —
    // then the tempo and its ther on top, so its black frame hides whatever is behind it
    people.forEach(p => person(p, t));
    drawBooms(playing ? dt : 0);
    drawFx(dt);
    const thX = W * (W < 600 ? .3 : .24), fLeft = thX - 144 * u * 1.15;
    [fLeft - 10 * u, fLeft + 70 * u].forEach(x => umbrella(x, (roadTop + roadBot) / 2 - 30 * u, u * 1.2, "#2fbf4a", "#ffd23f", 56 * u));   // umbrellas carried beside the ther
    const fl = therFloat(thX);
    // dancers only round the band: behind it (on the road, clear of the tempo), among it, and in front of it
    const bandX = fl.right + 92 * u, bandEnd = bandX + 6 * 31 * u + 14 * u;
    dancers(fl.right + 16 * u, 60 * u, 5, 10);       // behind the band
    band(bandX);                                      // (a few dance among the players too)
    dancers(bandEnd + 18 * u, 110 * u, 8, 0);        // in front of the band
    bike(t);
    drawLoose(dt);
    fairyCurtain();
    if (visible) requestAnimationFrame(frame); else running = false;
  }
  function kick() { if (!running && !reduce) { running = true; last = 0; requestAnimationFrame(frame); } else if (reduce && !running) { frame(performance.now()); } }
  size(); new ResizeObserver(size).observe(stage);
  new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; if (visible) { nextBoomX = nextBoomX || camX + W * .8; kick(); } updateAmb(); }), { threshold: .15 }).observe(stage);
  new IntersectionObserver(es => es.forEach(e => { heard = e.isIntersecting; if (heard) { if (music.want && !music.on && playing) musicStart(); } else if (music.on) musicStop(); updateAmb(); }), { rootMargin: "-40% 0px -40% 0px" }).observe(stage);
  stage.addEventListener("click", () => { if (!soundOn) musicStart(); });

  /* ---------- buttons ---------- */
  const playBtn = document.getElementById("rdPlay");
  document.querySelectorAll("[data-rd]").forEach(b => b.addEventListener("click", () => {
    const a = b.dataset.rd;
    if (a === "snd") { music.want = !music.on; if (!soundOn) soundStart(); music.on ? musicStop() : musicStart(); kick(); return; }
    if (a === "play") { playing = !playing; playBtn.textContent = playing ? "⏸ നിർത്തുക" : "▶️ യാത്ര തുടരുക"; if (!playing) { musicStop(); kick(); return; } updateAmb(); }
    if (!soundOn) musicStart();
    if (a === "balloon") {                // call the bike over (if it is not already on the road) and let 40 balloons go
      if (rideX < -40 * u || rideX > W * .7) { rideX = -140 * u; bikeWait = 0; }
      toRelease += 40; releaseT = 0;
      balloons = BCOL.slice(0, 5).map((col, i) => ({ col, len: Math.random(), x: 0, y: 0, vx: 0, vy: 0 }));   // a fresh bunch in his hand
    }
    else if (a === "boom") { spawnCracker(camX + W * .82, true); booms[booms.length - 1].t = -.35; }
    else if (a === "ther") { therKind = (therKind + 1) % THER_KINDS.length; therDesign = null; }
    else if (a === "speed") { speedI = (speedI + 1) % SPEEDS.length; b.textContent = ["🐢 പതുക്കെ", "🛵 സാധാരണ", "⚡ വേഗം"][speedI]; }
    kick();
  }));
})();
