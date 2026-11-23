/* ---------- ഗാനമേള: a night stage show — singers, band, moving lights, LED wall, and a crowd holding balloons
   (now and then one is let go and floats up). Troupes and songs come from data.js → window.GANAMELA.
   Draft until GANAMELA.show is true: before that it only appears with ?preview in the address. ---------- */
(() => {
  const GM = window.GANAMELA, sec = document.getElementById("ganamela");
  if (!GM || !sec) return;
  const preview = /[?&]preview\b/.test(location.search);
  if (!GM.show && !preview) { sec.remove(); const n = document.querySelector("[data-gm-nav]"); n && n.remove(); return; }
  sec.hidden = false;

  const stage = document.getElementById("gmStage"), cv = document.getElementById("gmFx"), g = cv.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];
  // each ganamela has its own stage, lights, band line-up and crowd
  const THEMES = [
    { sky: ["#05031a", "#1a0b2e"], light: ["#3df2ff", "#ffd23f", "#00c2a8", "#3d7bff", "#ffffff", "#7cff6b"], balloons: ["#ff3b5c", "#ffd60a", "#2ec4ff", "#7cff6b", "#ff8fd1", "#ff9f1c", "#9b5cff", "#ffffff"],
      skirtTop: "#ffd23f", skirt: "#e8eef2", haze: "150,230,230" },
    { sky: ["#0a0f2e", "#2a0a1e"], light: ["#2e7bff", "#5fd3ff", "#ffffff", "#9fc4ff", "#ffd23f", "#3d5bff"], balloons: ["#2e7bff", "#5fd3ff", "#ffffff", "#ffd23f", "#c0c8ff", "#1e40af"],
      skirtTop: "#ffd23f", skirt: "#173a8a", haze: "120,170,255" },
  ];
  let LIGHT = THEMES[0].light, BCOL = THEMES[0].balloons;
  let W = 0, H = 0, dpr = 1, u = 1, t = 0, last = 0, visible = false, running = false;
  let troupe = 0, crowd = [], free = [];

  /* ---------- crowd: three rows; about a third hold a balloon ---------- */
  function size() {
    dpr = Math.min(2, devicePixelRatio || 1); W = stage.clientWidth; H = stage.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); u = H / 420;
    crowd = []; LIGHT = THEMES[troupe].light; BCOL = THEMES[troupe].balloons;
    const rows = troupe === 0 ? [[.86, .78, .55, 0], [.93, .9, .75, 0], [1.01, 1.05, 1, 0]]          // standing crowd, open ground
                              : [[.84, .74, .5, 0], [.95, .92, .8, 1], [1.05, 1.08, 1, 1]];          // standing at the back, seated on chairs in front
    rows.forEach(([y, s, shade, seated], row) => {
      const gap = (W < 600 ? 30 : 38) * u * s * (seated ? 1.15 : 1);
      for (let x = rnd(-10, 10) * u; x < W + 20 * u; x += gap * (seated ? 1 : rnd(.8, 1.2)))
        crowd.push({ x, y: H * y, s: u * s, row, shade, seated, ph: Math.random() * 6, col: pick(BCOL),
          hold: Math.random() < (troupe === 0 ? (row === 2 ? .3 : .38) : .22), len: rnd(40, 70), refill: 0, arm: Math.random() < .5 ? -1 : 1, phone: Math.random() < (troupe === 0 ? .25 : .4) });
    });
  }
  new ResizeObserver(size).observe(stage); size();

  /* ---------- the beat: from the song when it plays, otherwise a steady 112 bpm for the lights ---------- */
  const audio = new Audio(); audio.preload = "none";
  let ctx = null, an = null, buf = null, avg = 0, lastBeat = -9, songOn = false, want = true, heard = false;
  function listen() {
    if (!songOn || !an) return;
    an.getByteFrequencyData(buf); let e = 0; for (let i = 1; i <= 8; i++) e += buf[i]; e /= 8;
    if (e > avg * 1.18 && e > 60 && t - lastBeat > .22) lastBeat = t; avg = avg * .92 + e * .08;
  }
  const beat = () => songOn ? Math.max(0, 1 - (t - lastBeat) / .3) : Math.max(0, 1 - ((t * 112 / 60) % 1) / .35) * .7;

  /* ---------- drawing ---------- */
  function person(x, y, s, body, skin, sway, armUp) {
    g.fillStyle = body; g.beginPath(); g.ellipse(x + sway, y - 22 * s, 9 * s, 20 * s, sway * .02, 0, 6.283); g.fill();
    g.fillStyle = skin; g.beginPath(); g.arc(x + sway * 1.3, y - 47 * s, 7 * s, 0, 6.283); g.fill();
    g.fillStyle = "#15101a"; g.beginPath(); g.arc(x + sway * 1.3, y - 49 * s, 7 * s, Math.PI, 0); g.fill();
    g.strokeStyle = body; g.lineWidth = 3.6 * s; g.lineCap = "round"; g.beginPath(); g.moveTo(x + sway + 6 * s, y - 36 * s);
    g.lineTo(x + sway + (armUp ? 14 : 10) * s, y - (armUp ? 66 : 22) * s); g.stroke();
  }
  function draw(dt) {
    const b = beat(), TH = THEMES[troupe];
    // night sky + haze
    const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, TH.sky[0]); sky.addColorStop(1, TH.sky[1]); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    if (troupe === 0) {   // striped shamiana tent roof (red / yellow / white), as over a church-ground stage
      const SH = ["#16306b", "#f2c230", "#f4efe6", "#0f8f86", "#f2c230"]; const n = Math.ceil(W / (34 * u)) + 1;
      for (let i = 0; i < n; i++) { const x = i * 34 * u; g.fillStyle = SH[i % SH.length]; g.globalAlpha = .55;
        g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 34 * u, 0); g.lineTo(x + 34 * u, H * .06); g.quadraticCurveTo(x + 17 * u, H * .1, x, H * .06); g.closePath(); g.fill(); }
      g.globalAlpha = 1; }
    // stage box
    const sx = W * .08, sw = W * .84, top = H * .12, floor = H * .62;
    // LED wall: dot grid that ripples with the beat, troupe name across it
    const wx = sx + sw * .14, ww = sw * .72, wy = top + 26 * u, wh = floor - wy - 40 * u, step = Math.max(7, 9 * u);
    g.fillStyle = "#07050e"; g.fillRect(wx, wy, ww, wh);
    if (troupe === 0) for (let y = wy + step / 2; y < wy + wh; y += step) for (let x = wx + step / 2; x < wx + ww; x += step) {   // colour ripples
      const d = Math.hypot(x - (wx + ww / 2), y - (wy + wh / 2)) / 40 / u, v = .5 + .5 * Math.sin(d * 1.6 - t * 4);
      g.globalAlpha = .18 + v * .45 * (.5 + b * .5); g.fillStyle = LIGHT[(Math.floor(d - t * 1.5) % 6 + 6) % 6];
      g.fillRect(x - step * .3, y - step * .3, step * .6, step * .6);
    } else for (let y = wy + step / 2; y < wy + wh; y += step) for (let x = wx + step / 2; x < wx + ww; x += step) {             // turning blue diamonds
      const cx = wx + ww / 2, cy = wy + wh / 2, rx = (x - cx) * Math.cos(t * .4) - (y - cy) * Math.sin(t * .4), ry = (x - cx) * Math.sin(t * .4) + (y - cy) * Math.cos(t * .4);
      const dm = (Math.abs(rx) + Math.abs(ry)) / (26 * u), v = .5 + .5 * Math.cos(dm * 2.2 - t * 3);
      g.globalAlpha = .15 + v * .55 * (.6 + b * .4); g.fillStyle = v > .85 ? "#ffffff" : LIGHT[Math.floor(dm) % 4];
      g.fillRect(x - step * .3, y - step * .3, step * .6, step * .6);
    }
    g.globalAlpha = 1;
    for (const [cx0, cx1] of [[sx + 12 * u, wx - 6 * u], [wx + ww + 6 * u, sx + sw - 12 * u]]) {     // white fairy-light curtains on both sides
      g.fillStyle = troupe === 0 ? "#1a1622" : "#0f2266"; g.fillRect(cx0, wy - 6 * u, cx1 - cx0, wh + 6 * u);
      if (troupe === 1) { g.fillStyle = "rgba(0,0,0,.25)"; for (let x = cx0; x < cx1; x += 10 * u) g.fillRect(x, wy - 6 * u, 3 * u, wh + 6 * u); }   // drape folds
      let k = 0;
      for (let x = cx0 + 7 * u; x < cx1; x += 15 * u) for (let y = wy + 4 * u; y < wy + wh; y += 16 * u) {      // sparse warm-yellow fairy lights, like the real curtain
        const jx = x + Math.sin(++k * 12.9) * 4 * u, jy = y + Math.cos(k * 7.3) * 4 * u, tw = .5 + .5 * Math.abs(Math.sin(k * 1.7 + t * 1.3));
        g.globalAlpha = tw * .35; g.fillStyle = troupe === 0 ? "#ffd25a" : "#cfe3ff"; g.beginPath(); g.arc(jx, jy, 4.5 * u, 0, 6.283); g.fill();
        g.globalAlpha = tw; g.fillStyle = troupe === 0 ? "#fff1b0" : "#ffffff"; g.beginPath(); g.arc(jx, jy, 1.6 * u, 0, 6.283); g.fill(); }
      g.globalAlpha = 1; }
    if (troupe === 1) for (let i = 0; i <= 40; i++) {      // gold bulb arch over the screen
      const a = Math.PI * i / 40, ax = wx + ww / 2 - Math.cos(a) * (ww / 2 + 10 * u), ay = wy - 4 * u - Math.sin(a) * 22 * u, on = (i + Math.floor(t * 6)) % 3 !== 0;
      g.globalAlpha = on ? 1 : .35; g.fillStyle = "#ffd23f"; g.beginPath(); g.arc(ax, ay, 2.6 * u, 0, 6.283); g.fill(); }
    g.globalAlpha = 1;
    g.font = `800 ${Math.min(ww / 11, 34 * u)}px "Anek Malayalam","Noto Sans Malayalam",sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
    g.shadowColor = "#ffcf4a"; g.shadowBlur = 18 * u; g.fillStyle = "#fff7d6"; g.fillText(GM.title || "ഗാനമേള", wx + ww / 2, wy + wh * .38);
    g.shadowBlur = 0; g.font = `700 ${Math.min(ww / 22, 16 * u)}px "Anek Malayalam",sans-serif`; g.fillStyle = "#ffcf4a"; g.fillText(GM.dates || "", wx + ww / 2, wy + wh * .38 + 30 * u);
    // truss + moving heads with beams
    g.fillStyle = "#2a2733"; g.fillRect(sx, top, sw, 9 * u); g.fillRect(sx, top, 9 * u, floor - top); g.fillRect(sx + sw - 9 * u, top, 9 * u, floor - top);
    g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 6; i++) {
      const hx = sx + sw * (.12 + i * .152), len = H * .95, c = LIGHT[(i + Math.floor(t / 4)) % 6];
      const a = troupe === 0 ? Math.sin(t * (.7 + i * .13) + i) * .5 + (i % 2 ? .15 : -.15) : (i < 3 ? 1 : -1) * (.35 + Math.sin(t * .9) * .3);   // theme 2: beams cross in a V
      const bg = g.createLinearGradient(hx, top, hx + Math.sin(a) * len, top + Math.cos(a) * len); bg.addColorStop(0, c); bg.addColorStop(1, "rgba(0,0,0,0)");
      g.globalAlpha = .16 + b * .22; g.fillStyle = bg; g.beginPath(); g.moveTo(hx - 4 * u, top + 8 * u); g.lineTo(hx + 4 * u, top + 8 * u);
      g.lineTo(hx + Math.sin(a + .1) * len, top + Math.cos(a + .1) * len); g.lineTo(hx + Math.sin(a - .1) * len, top + Math.cos(a - .1) * len); g.closePath(); g.fill();
      g.globalAlpha = 1; g.fillStyle = c; g.beginPath(); g.arc(hx, top + 12 * u, 4 * u, 0, 6.283); g.fill();
    }
    g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
    // speakers stacks, cones pulse
    if (false) for (const x of [sx + 14 * u, sx + sw - 54 * u]) for (let k = 0; k < 3; k++) {
      const y = floor - (k + 1) * 34 * u; g.fillStyle = "#121018"; g.fillRect(x, y, 40 * u, 32 * u);
      g.fillStyle = "#2c2838"; g.beginPath(); g.arc(x + 20 * u, y + 16 * u, (10 + b * 2.5) * u, 0, 6.283); g.fill(); g.fillStyle = "#0a0810"; g.beginPath(); g.arc(x + 20 * u, y + 16 * u, 4 * u, 0, 6.283); g.fill();
    }
    // two singers in front; the orchestra sits behind them on a riser — keyboard, flute, drum kit, side drum, guitar (or violin)
    const sway = Math.sin(t * 112 / 60 * Math.PI) * 3 * u, s = Math.min(u * 1.45, W / 400), hit = b > .6;
    const cap = x => { g.fillStyle = "#e9e4d8"; g.beginPath(); g.ellipse(x + sway * 1.3, floor + 10 * u - 50 * s * 1.15, 8 * s, 3.4 * s, 0, Math.PI, 0); g.fill(); g.fillRect(x + sway * 1.3, floor + 10 * u - 51 * s * 1.15, 10 * s, 2 * s); };
    const mic = (x, body, skin, up) => { g.strokeStyle = "#888"; g.lineWidth = 1.6 * u; g.beginPath(); g.moveTo(x + 16 * u, floor); g.lineTo(x + 16 * u, floor - 70 * u); g.stroke(); g.fillStyle = "#222"; g.beginPath(); g.arc(x + 16 * u, floor - 72 * u, 3 * u, 0, 6.283); g.fill();
      person(x, floor + 10 * u, s * 1.15, body, skin, sway, up); };
    // riser
    const rx0 = sx + sw * .1, rx1 = sx + sw * .9, ry = floor - 24 * u;
    g.fillStyle = troupe === 0 ? "#1d4a52" : "#1d2a55"; g.fillRect(rx0, ry, rx1 - rx0, 24 * u);
    g.fillStyle = troupe === 0 ? "#3a3448" : "#2a3c78"; g.fillRect(rx0, ry, rx1 - rx0, 3 * u);
    for (let x = rx0 + 6 * u; x < rx1; x += 14 * u) { g.fillStyle = LIGHT[Math.floor(x / (14 * u) + t * 3) % 6]; g.globalAlpha = .6; g.fillRect(x, ry + 10 * u, 3 * u, 3 * u); } g.globalAlpha = 1;
    const ms = s * .8, mx = f => sx + sw * f, seat = ry + 2 * u;
    // the orchestra in matching uniforms (like the photo), seated on plastic chairs
    const UNI = troupe === 0 ? "#1fa79a" : "#5aa0e8", SK = ["#6b4429", "#7a5034", "#5a3a22", "#8a5a3c", "#6b4429"];
    const chair = x => { g.fillStyle = troupe === 0 ? "#2a5db0" : "#b03a2e"; g.fillRect(x - 9 * u, seat - 34 * u, 18 * u, 16 * u); };
    const stand = x => { g.strokeStyle = "#222"; g.lineWidth = 1.6 * u; g.beginPath(); g.moveTo(x, seat); g.lineTo(x, seat - 30 * u); g.stroke();
      g.fillStyle = "#111"; g.fillRect(x - 9 * u, seat - 40 * u, 18 * u, 11 * u); g.fillStyle = "#f2f2f2"; g.fillRect(x - 7 * u, seat - 39 * u, 14 * u, 9 * u); };
    // tabla + dholak on a cloth-covered floor mat (left)
    if (troupe === 0) { g.fillStyle = "#cfd8e3"; g.fillRect(mx(.08), seat - 8 * u, sw * .16, 10 * u); }
    else { g.fillStyle = "#3a1d5c"; g.fillRect(mx(.08), seat - 10 * u, sw * .16, 12 * u);           // lit box riser under the tabla
      for (let x = mx(.08) + 3 * u; x < mx(.24); x += 7 * u) { g.fillStyle = (Math.floor(x / (7 * u) + t * 4) % 2) ? "#ffd23f" : "#c77dff"; g.fillRect(x, seat - 6 * u, 4 * u, 2.5 * u); } }
    person(mx(.16), seat - 6 * u, ms * .9, UNI, SK[0], sway * .3, false);
    g.fillStyle = "#5a3a22"; g.beginPath(); g.ellipse(mx(.16) - 14 * u, seat - 12 * u, 6 * u, 7 * u, 0, 0, 6.283); g.ellipse(mx(.16) + 14 * u, seat - 12 * u, 7 * u, 8 * u, 0, 0, 6.283); g.fill();
    g.fillStyle = "#e0d2b0"; g.beginPath(); g.ellipse(mx(.16) - 14 * u, seat - 18 * u + (hit ? 1 : 0) * u, 5 * u, 2 * u, 0, 0, 6.283); g.ellipse(mx(.16) + 14 * u, seat - 19 * u, 6 * u, 2.2 * u, 0, 0, 6.283); g.fill();
    // flute with a music stand
    chair(mx(.31)); person(mx(.31), seat, ms, UNI, SK[1], sway * .3, false); stand(mx(.31) - 18 * u);
    g.strokeStyle = "#d8d8d8"; g.lineWidth = 2.4 * u; g.beginPath(); g.moveTo(mx(.31) - 2 * u, seat - 46 * ms); g.lineTo(mx(.31) + 26 * u, seat - 42 * ms); g.stroke();
    // drum kit in the middle — bass drum, toms, cymbals that shake on the beat
    chair(mx(.5)); person(mx(.5), seat - 4 * u, ms, UNI, SK[2], sway * .5, hit);
    g.fillStyle = "#7a1f1f"; g.beginPath(); g.arc(mx(.5), seat - 10 * u, 13 * u, 0, 6.283); g.fill(); g.fillStyle = "#eee"; g.beginPath(); g.arc(mx(.5), seat - 10 * u, 9 * u, 0, 6.283); g.fill();
    g.fillStyle = "#8a2a2a"; g.beginPath(); g.ellipse(mx(.5) - 16 * u, seat - 26 * u, 7 * u, 4 * u, 0, 0, 6.283); g.ellipse(mx(.5) + 16 * u, seat - 26 * u, 7 * u, 4 * u, 0, 0, 6.283); g.fill();
    g.fillStyle = "#d4af37"; for (const [dx, dy] of [[-28, -46], [28, -44], [36, -30]]) { g.beginPath(); g.ellipse(mx(.5) + dx * u, seat + dy * u - (hit ? 2 * u : 0), 10 * u, 2.4 * u, hit ? .15 : 0, 0, 6.283); g.fill(); }
    // two keyboards on the right, one with a music stand
    for (const [f, k] of [[.68, 3], [.85, 4]]) {
      chair(mx(f)); person(mx(f), seat, ms, UNI, SK[k], (k === 3 ? 1 : -1) * sway * .4, false);
      g.fillStyle = "#111"; g.fillRect(mx(f) - 22 * u, seat - 30 * u, 44 * u, 6 * u); g.fillStyle = "#eee"; for (let q = 0; q < 9; q++) g.fillRect(mx(f) - 21 * u + q * 4.8 * u, seat - 29 * u, 3.6 * u, 3 * u);
      g.strokeStyle = "#444"; g.lineWidth = 2 * u; g.beginPath(); g.moveTo(mx(f) - 16 * u, seat - 24 * u); g.lineTo(mx(f) + 14 * u, seat); g.moveTo(mx(f) + 16 * u, seat - 24 * u); g.lineTo(mx(f) - 14 * u, seat); g.stroke(); }
    stand(mx(.85) + 26 * u);
    // hanging line-array speakers from the truss + subwoofers at the stage corners
    for (const lx of [sx + 4 * u, sx + sw - 26 * u]) for (let k = 0; k < 5; k++) { g.fillStyle = "#0e0c14"; g.fillRect(lx + k * .6 * u, top + 14 * u + k * 11 * u, 22 * u - k * 1.2 * u, 10 * u); g.fillStyle = "#26222f"; g.fillRect(lx + 3 * u, top + 17 * u + k * 11 * u, 16 * u - k * 1.2 * u, 3 * u); }
    for (const fx of [sx - 6 * u, sx + sw - 34 * u]) { g.fillStyle = "#0b0a10"; g.fillRect(fx, floor - 30 * u, 40 * u, 30 * u); g.fillStyle = "#1f1b28"; g.beginPath(); g.arc(fx + 20 * u, floor - 15 * u, (11 + b * 2) * u, 0, 6.283); g.fill(); }
    if (troupe === 1) { g.strokeStyle = "#c8a96a"; g.lineWidth = 5 * u;                    // bamboo frame posts and a slanting brace
      for (const bx of [sx - 14 * u, sx + sw + 14 * u]) { g.beginPath(); g.moveTo(bx, top - 10 * u); g.lineTo(bx, floor + 14 * u); g.stroke(); }
      g.lineWidth = 3 * u; g.beginPath(); g.moveTo(sx - 14 * u, top + 30 * u); g.lineTo(sx + 30 * u, top - 6 * u); g.moveTo(sx + sw + 14 * u, top + 30 * u); g.lineTo(sx + sw - 30 * u, top - 6 * u); g.stroke(); }
    // a music stand in front of one singer
    { const x = sx + sw * .58 + 30 * u; g.strokeStyle = "#111"; g.lineWidth = 1.6 * u; g.beginPath(); g.moveTo(x, floor + 10 * u); g.lineTo(x, floor - 34 * u); g.moveTo(x - 8 * u, floor + 10 * u); g.lineTo(x, floor - 4 * u); g.lineTo(x + 8 * u, floor + 10 * u); g.stroke();
      g.fillStyle = "#0b0b0b"; g.fillRect(x - 11 * u, floor - 46 * u, 22 * u, 13 * u); }
    // the two singers in front
    if (troupe === 0) { mic(sx + sw * .42, "#ffb300", "#8a5a3c", Math.sin(t * .9) > .7); mic(sx + sw * .58, "#5b6270", "#6b4429", Math.sin(t * .9 + 2) > .7); cap(sx + sw * .58); }
    else { mic(sx + sw * .42, "#e6b800", "#8a5a3c", Math.sin(t * .8) > .7); mic(sx + sw * .58, "#0d47a1", "#6b4429", Math.sin(t * .8 + 2) > .7); }
    // stage floor edge with chasing lights + smoke
    g.fillStyle = troupe === 0 ? "#245a64" : "#1b1726"; g.fillRect(sx - 10 * u, floor, sw + 20 * u, 14 * u);
    if (troupe === 0) { for (let x = sx - 6 * u, k = 0; x < sx + sw + 10 * u; x += 12 * u, k++) {   // patterned carpet (red / green diamonds)
      g.fillStyle = k % 2 ? "#0f8f86" : "#e6b422"; g.beginPath(); g.moveTo(x, floor + 7 * u); g.lineTo(x + 5 * u, floor + 2 * u); g.lineTo(x + 10 * u, floor + 7 * u); g.lineTo(x + 5 * u, floor + 12 * u); g.closePath(); g.fill(); } }
    g.fillStyle = TH.skirtTop; g.fillRect(sx - 10 * u, floor + 14 * u, sw + 20 * u, 5 * u);
    g.fillStyle = TH.skirt; g.fillRect(sx - 10 * u, floor + 19 * u, sw + 20 * u, 34 * u);
    for (const fx of [.36, .5, .64]) { const mx = sx + sw * fx; g.fillStyle = "#0d0c12"; g.beginPath(); g.moveTo(mx - 14 * u, floor + 1 * u); g.lineTo(mx + 14 * u, floor + 1 * u); g.lineTo(mx + 10 * u, floor - 12 * u); g.lineTo(mx - 12 * u, floor - 9 * u); g.closePath(); g.fill(); }
    for (let x = sx; x < sx + sw; x += 10 * u) { g.fillStyle = LIGHT[Math.floor(x / (10 * u) + t * 8) % 6]; g.globalAlpha = .9; g.fillRect(x, floor + 4 * u, 5 * u, 4 * u); }
    g.globalAlpha = 1;
    for (let i = 0; i < 5; i++) { const x = sx + sw * (i / 4), r = g.createRadialGradient(x, floor + 4 * u, 0, x, floor + 4 * u, 90 * u);
      r.addColorStop(0, `rgba(${TH.haze},.12)`); r.addColorStop(1, `rgba(${TH.haze},0)`); g.fillStyle = r; g.fillRect(x - 90 * u, floor - 90 * u, 180 * u, 180 * u); }
    g.globalCompositeOperation = "lighter"; g.globalAlpha = .07 + b * .05; g.fillStyle = troupe === 0 ? "#18d6c6" : "#2a6bff"; g.fillRect(sx - 20 * u, top, sw + 40 * u, floor - top + 20 * u);
    g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
    // crowd (back rows first) — heads bob with the beat, hands hold balloons, some hold phones up
    crowd.forEach(p => {
      const bob = Math.sin(t * 112 / 60 * Math.PI * 2 / 2 + p.ph) * 2 * p.s * (.4 + b), x = p.x, y = p.y + bob, s = p.s;
      const handX = x + p.arm * 12 * s, handY = y - 70 * s;
      if (p.hold) {   // balloon on a string from the raised hand
        const bx = handX + Math.sin(t * 1.3 + p.ph) * 6 * s, by = handY - p.len * s;
        g.strokeStyle = "rgba(255,255,255,.45)"; g.lineWidth = 1; g.beginPath(); g.moveTo(handX, handY); g.quadraticCurveTo(handX - 4 * s, (handY + by) / 2, bx, by + 13 * s); g.stroke();
        balloonShape(bx, by, s * 1.05, p.col, Math.sin(t + p.ph) * .15, p.shade);
      } else if (p.refill > 0) { p.refill -= dt; if (p.refill <= 0) { p.hold = true; p.col = pick(BCOL); } }
      const dark = Math.round(8 + 10 * p.shade), lift = p.seated ? 6 * s : 0;
      g.fillStyle = `rgb(${dark},${dark - 2},${dark + 8})`;
      g.beginPath(); g.ellipse(x, y - 14 * s - lift, 15 * s, 22 * s, 0, 0, 6.283); g.fill();
      g.beginPath(); g.arc(x, y - 42 * s - lift, 9 * s, 0, 6.283); g.fill();
      if (p.seated) { g.fillStyle = `rgba(${Math.round(150 + 60 * p.shade)},30,40,.95)`; g.fillRect(x - 13 * s, y - 18 * s, 26 * s, 18 * s); g.fillRect(x - 15 * s, y - 22 * s, 30 * s, 5 * s); }   // red plastic chair back
      if (p.hold || p.phone) { g.strokeStyle = `rgb(${dark},${dark - 2},${dark + 8})`; g.lineWidth = 5 * s; g.lineCap = "round"; g.beginPath(); g.moveTo(x + p.arm * 8 * s, y - 28 * s); g.lineTo(handX, handY + 4 * s); g.stroke(); }
      if (p.phone && !p.hold) { g.fillStyle = "#fffbe6"; g.globalAlpha = .9; g.fillRect(handX - 3 * s, handY - 4 * s, 6 * s, 9 * s);
        const r = g.createRadialGradient(handX, handY, 0, handX, handY, 22 * s); r.addColorStop(0, "rgba(255,250,220,.35)"); r.addColorStop(1, "rgba(255,250,220,0)");
        g.fillStyle = r; g.fillRect(handX - 22 * s, handY - 22 * s, 44 * s, 44 * s); g.globalAlpha = 1; }
    });
    // released balloons float up and drift away
    for (let i = free.length - 1; i >= 0; i--) { const f = free[i];
      f.vy = Math.max(f.vy - 10 * u * dt, -120 * u); f.x += (f.vx + Math.sin(t * 2 + f.ph) * 18 * u) * dt; f.y += f.vy * dt;
      if (f.y < -50 * u) { free.splice(i, 1); continue; }
      g.strokeStyle = "rgba(255,255,255,.45)"; g.lineWidth = 1; g.beginPath(); g.moveTo(f.x, f.y + 13 * f.s); g.lineTo(f.x + Math.sin(t * 3 + f.ph) * 5 * f.s, f.y + 40 * f.s); g.stroke();
      balloonShape(f.x, f.y, f.s, f.col, Math.sin(t * 2 + f.ph) * .2, 1);
    }
    g.globalAlpha = 1;
  }
  function balloonShape(x, y, s, col, tilt, shade) {
    g.globalAlpha = .55 + .45 * shade; g.fillStyle = col; g.beginPath(); g.ellipse(x, y, 10 * s, 13 * s, tilt, 0, 6.283); g.fill();
    g.fillStyle = "rgba(255,255,255,.5)"; g.beginPath(); g.ellipse(x - 3.5 * s, y - 5 * s, 2.5 * s, 3.5 * s, 0, 0, 6.283); g.fill();
    g.fillStyle = col; g.beginPath(); g.moveTo(x - 2 * s, y + 13 * s); g.lineTo(x + 2 * s, y + 13 * s); g.lineTo(x, y + 16 * s); g.fill(); g.globalAlpha = 1;
  }

  /* ---------- balloon actions ---------- */
  const holders = () => crowd.filter(p => p.hold);
  function letGo(n = 1) {
    for (let k = 0; k < n; k++) { const p = pick(holders()); if (!p) return;
      p.hold = false; p.refill = rnd(4, 9);
      free.push({ x: p.x + p.arm * 12 * p.s, y: p.y - (70 + p.len) * p.s, vx: rnd(-20, 20) * u, vy: rnd(-70, -40) * u, s: p.s * 1.05, col: p.col, ph: Math.random() * 6 }); }
  }
  // a fresh balloon rising from a point (a tap on the stage, or a random hand in the crowd)
  function spawnAt(x, y, spread = 1) {
    if (free.length > 420) return;
    free.push({ x: x + rnd(-12, 12) * u * spread, y: y + rnd(-8, 8) * u * spread, vx: rnd(-45, 45) * u, vy: rnd(-150, -70) * u, s: u * rnd(.9, 1.2), col: pick(BCOL), ph: Math.random() * 6 });
  }
  const fromCrowd = () => { const p = pick(crowd); spawnAt(p.x + p.arm * 12 * p.s, p.y - 90 * p.s, .6); };
  // holding: the button (balloons from all over the crowd) or a finger / mouse held on the stage (balloons from that spot)
  let streamBtn = false, streamAt = null, streamT = 0;
  function stream(dt) {
    if (!streamBtn && !streamAt) return;
    streamT -= dt;
    while (streamT <= 0) { streamT += .045; if (streamBtn) { fromCrowd(); if (Math.random() < .3) letGo(1); } if (streamAt) spawnAt(streamAt.x, streamAt.y); }
  }
  let autoT = 0;
  function autoEvents(dt) { autoT -= dt; if (autoT <= 0) { autoT = rnd(1.2, 2.8); letGo(1); } }

  /* ---------- sound: the troupe song (when a file is given) ---------- */
  function ensureCtx() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); const src = ctx.createMediaElementSource(audio); an = ctx.createAnalyser(); an.fftSize = 512;
      src.connect(an); an.connect(ctx.destination); buf = new Uint8Array(an.frequencyBinCount); } catch (_) {}
  }
  const songBtn = document.getElementById("gmSong");
  const songs = () => (GM.songs || []).filter(x => x.file);
  let songI = 0;
  function setUI() {
    const has = songs().length;
    songBtn.textContent = !has ? "🎵 പാട്ട് ഉടൻ" : songOn ? "⏸ പാട്ട് നിർത്തുക" : "🎵 പാട്ട് കേൾക്കാം";
    songBtn.disabled = !has;
    const n = songs().length, lab = document.getElementById("gmNow");
    if (lab) lab.textContent = n ? `🎵 ഗാനം ${songI % n + 1} / ${n}` : "";
    document.querySelectorAll("[data-gm-skip]").forEach(b => b.disabled = n < 2);
  }
  function skip(d) { const n = songs().length; if (!n) return; songI = (songI + d + n) % n; want = true; audio.src = songs()[songI].file; play(); }
  function play() {
    const list = songs(); if (!list.length) return;
    ensureCtx(); window.dispatchEvent(new CustomEvent("kp:audio", { detail: "ganamela" }));
    const s = list[songI % list.length]; if (!audio.src.endsWith(s.file)) audio.src = s.file;
    const pr = audio.play(); songOn = true; if (pr && pr.catch) pr.catch(() => { songOn = false; setUI(); }); setUI();
  }
  function stop() { audio.pause(); songOn = false; setUI(); }
  audio.addEventListener("ended", () => { songI++; play(); });
  window.addEventListener("kp:audio", e => { if (e.detail !== "ganamela" && songOn) stop(); });
  songBtn.addEventListener("click", () => { if (songOn) { want = false; stop(); } else { want = true; play(); } });
  // the stage changes look now and then (lights, band line-up, crowd) — or at once with the button; the song keeps playing
  function switchStage() { troupe = (troupe + 1) % THEMES.length; free = []; size(); stageT = 35; }
  let stageT = 35;
  document.querySelector('[data-gm="stage"]').addEventListener("click", switchStage);
  document.querySelectorAll("[data-gm-skip]").forEach(b => b.addEventListener("click", () => skip(+b.dataset.gmSkip)));
  const goBtn = document.querySelector('[data-gm="go"]');
  goBtn.addEventListener("pointerdown", e => { e.preventDefault(); letGo(8); for (let k = 0; k < 8; k++) fromCrowd(); streamBtn = true; streamT = .25; kick(); });
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev => goBtn.addEventListener(ev, () => streamBtn = false));
  goBtn.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); letGo(8); for (let k = 0; k < 12; k++) fromCrowd(); } });
  goBtn.addEventListener("contextmenu", e => e.preventDefault());
  // tap the stage: a handful of balloons fly up from there · hold: a stream · double tap: a big burst
  const at = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  cv.addEventListener("pointerdown", e => { const q = at(e); for (let k = 0; k < 6; k++) spawnAt(q.x, q.y, 1.5); streamAt = q; streamT = .3; kick(); });
  cv.addEventListener("pointermove", e => { if (streamAt) streamAt = at(e); });
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev => cv.addEventListener(ev, () => streamAt = null));
  cv.addEventListener("dblclick", e => { const q = at(e); for (let k = 0; k < 30; k++) spawnAt(q.x, q.y, 3); });

  /* ---------- loop; sound only while the stage holds the middle of the screen ---------- */
  function frame(now) {
    now /= 1000; const dt = Math.min(.05, now - (last || now)); last = now; t += dt;
    listen(); stream(dt); if (!reduce) { autoEvents(dt); stageT -= dt; if (stageT <= 0) switchStage(); } draw(dt);
    if (visible) requestAnimationFrame(frame); else running = false;
  }
  function kick() { if (!running) { running = true; last = 0; requestAnimationFrame(frame); } }
  new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; if (visible) kick(); }), { threshold: .1 }).observe(stage);
  new IntersectionObserver(es => es.forEach(e => { heard = e.isIntersecting; if (heard && want && !songOn) play(); else if (!heard && songOn) stop(); }), { rootMargin: "-40% 0px -40% 0px" }).observe(stage);
  setUI();
})();
