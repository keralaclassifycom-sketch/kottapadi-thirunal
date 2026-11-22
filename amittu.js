/* ---------- അമിട്ട് (colour shells): tap = one shell, press & hold = barrage ---------- */
(() => {
  const stage = document.getElementById("amStage");
  if (!stage) return;
  const fx = document.getElementById("amFx"), sm = document.getElementById("amSmoke");
  const g = fx.getContext("2d"), s = sm.getContext("2d");
  const tip = document.getElementById("amTip"), countEl = document.getElementById("amCount"), sndBtn = document.getElementById("amSnd");

  /* ---------- canvas size ---------- */
  let W = 0, H = 0, dpr = 1, small = false;
  const sky = document.createElement("canvas");
  function size() {
    if (!stage.clientWidth || !stage.clientHeight) return;   // section hidden: keep the last size
    small = stage.clientWidth < 600;
    dpr = Math.min(small ? 1.5 : 2, window.devicePixelRatio || 1);
    W = stage.clientWidth; H = stage.clientHeight;
    [fx, sm].forEach(c => { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); });
    g.setTransform(dpr, 0, 0, dpr, 0, 0); s.setTransform(dpr, 0, 0, dpr, 0, 0);
    // night sky painted once; each frame a thin layer of it is laid over the fireworks → trails without haze
    sky.width = fx.width; sky.height = fx.height;
    const k = sky.getContext("2d"); k.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gr = k.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#050c30"); gr.addColorStop(.55, "#0c1a55"); gr.addColorStop(.85, "#1c2270"); gr.addColorStop(1, "#3a2660");
    k.fillStyle = gr; k.fillRect(0, 0, W, H);
    for (let i = 0; i < 70; i++) { k.globalAlpha = .2 + Math.random() * .6; k.fillStyle = "#fff"; k.fillRect(Math.random() * W, Math.random() * H * .45, Math.random() < .2 ? 1.6 : 1, 1); }
    k.globalAlpha = 1;
    paintSky(1);
  }
  function paintSky(a) { if (!sky.width || !sky.height) return; g.globalCompositeOperation = "source-over"; g.globalAlpha = a; g.drawImage(sky, 0, 0, W, H); g.globalAlpha = 1; }
  size();
  if (window.ResizeObserver) new ResizeObserver(size).observe(stage); else window.addEventListener("resize", size);

  /* ---------- festival ground: searchlight beams behind the church, cheering crowd and balloons in front ---------- */
  stage.insertAdjacentHTML("beforeend", `<div class="am-beams" aria-hidden="true">${[18, 34, 62, 80].map((l, i) => `<i style="left:${l}%;animation-delay:${-i * 1.7}s"></i>`).join("")}</div>`);
  (() => {
    const CL = ["#d9462b", "#f2a33a", "#1f9e8f", "#e6447a", "#f4f1e6", "#3a6fd8", "#f4f1e6", "#7b3fb8", "#f4f1e6", "#2f8f4e", "#ffcf4a"];
    const SK = ["#6b4429", "#55341f", "#7a5034", "#4a2e1c"], R2 = rng => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
    const r = R2(); let back = "", front = "", phones = "";
    const person = (x, base, sc, row) => {
      const col = CL[Math.floor(r() * CL.length)], sk = SK[Math.floor(r() * SK.length)], hy = base - 46 * sc;
      let o = `<path d="M${x - 15 * sc} ${base} Q${x - 16 * sc} ${hy + 18 * sc} ${x} ${hy + 14 * sc} Q${x + 16 * sc} ${hy + 18 * sc} ${x + 15 * sc} ${base}Z" fill="${col}"/>`;
      o += `<circle cx="${x}" cy="${hy}" r="${9 * sc}" fill="${sk}"/><path d="M${x - 9 * sc} ${hy - 1 * sc} Q${x} ${hy - 14 * sc} ${x + 9 * sc} ${hy - 1 * sc} Q${x} ${hy - 7 * sc} ${x - 9 * sc} ${hy - 1 * sc}Z" fill="#111"/>`;
      if (r() < .28) { const sd = r() < .5 ? -1 : 1, ax = x + sd * 12 * sc, tx = ax + sd * 6 * sc, ty = hy - 30 * sc;
        o += `<path d="M${ax} ${hy + 20 * sc} L${tx} ${ty}" stroke="${sk}" stroke-width="${5 * sc}" stroke-linecap="round"/>`;
        if (r() < .5) phones += `<rect x="${tx - 3 * sc}" y="${ty - 9 * sc}" width="${6 * sc}" height="${10 * sc}" rx="1" fill="#cfe9ff"/>`; }
      return o;
    };
    for (let x = 10; x < 1600; x += 26 + r() * 10) back += person(x, 150, .8 + r() * .1, 0);
    for (let x = 0; x < 1600; x += 34 + r() * 14) front += person(x, 160, 1 + r() * .15, 1);
    const balloons = [120, 340, 610, 900, 1150, 1420].map((x, i) => { const c = ["#ff3b5c", "#ffd60a", "#2ec4ff", "#7cff6b", "#ff8fd1", "#ff9f1c"][i], y = 30 + (i % 3) * 14;
      return `<g class="am-bal" style="animation-delay:${-i * .7}s"><path d="M${x} ${y + 16} q4 30 -2 70" stroke="rgba(255,255,255,.5)" fill="none"/><ellipse cx="${x}" cy="${y}" rx="11" ry="14" fill="${c}"/><ellipse cx="${x - 4}" cy="${y - 5}" rx="3" ry="4" fill="rgba(255,255,255,.55)"/></g>`; }).join("");
    stage.insertAdjacentHTML("beforeend", `<svg class="am-crowd" viewBox="0 0 1600 160" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      ${balloons}<g opacity=".72">${back}</g><g>${front}</g><g>${phones}</g></svg>`);
  })();

  /* ---------- colours (many, mixed freely) ---------- */
  const COL = {
    green: "#3dff7a", silver: "#f2f5ff", pink: "#ff3fb4", magenta: "#e040fb", gold: "#ffc94a", red: "#ff3348",
    blue: "#3d8bff", cyan: "#3df2ff", purple: "#9b5cff", orange: "#ff8a1f", lime: "#c6ff3d", rose: "#ff7a9c"
  };
  const NAMES = Object.keys(COL);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ---------- sound: real shell launch + burst recorded at a Kerala church perunnal ---------- */
  const SND = { launch: ["audio/amittu-launch1.mp3", "audio/amittu-launch2.mp3", "audio/amittu-launch3.mp3"],
                burst: ["audio/amittu-burst1.mp3", "audio/amittu-burst2.mp3", "audio/amittu-burst3.mp3", "audio/amittu-burst4.mp3"] };
  const live = new Set(); let lastAnnounce = 0;
  let ac = null, master = null, bufs = { launch: [], burst: [] }, loading = null, soundOn = true, voices = 0, lastLaunchSnd = 0;
  function initAudio() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ac = new AC();
      const comp = ac.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 6;
      master = ac.createGain(); master.gain.value = .9; master.connect(comp); comp.connect(ac.destination);
    }
    if (ac.state === "suspended") ac.resume();
    if (!loading) loading = Promise.all(Object.entries(SND).map(([k, list]) => Promise.all(list.map(u =>
      fetch(u).then(r => r.arrayBuffer()).then(b => new Promise((ok, no) => ac.decodeAudioData(b, ok, no))).then(buf => bufs[k].push(buf)).catch(() => {})))));
  }
  function play(kind, vol, x) {
    if (!soundOn || !ac || !bufs[kind].length || voices > 14) return;
    const src = ac.createBufferSource(), gn = ac.createGain();
    src.buffer = pick(bufs[kind]); src.playbackRate.value = rnd(.9, 1.08); gn.gain.value = vol;
    let out = gn;
    if (ac.createStereoPanner) { const p = ac.createStereoPanner(); p.pan.value = Math.max(-.8, Math.min(.8, (x / W) * 2 - 1)); gn.connect(p); out = p; }
    src.connect(gn); out.connect(master);
    voices++; live.add(src); src.onended = () => { voices--; live.delete(src); }; src.start();
    announce();
  }
  /* only one sound on the page at a time: shells pause the band song, the band song silences the shells */
  function announce() { const t = performance.now(); if (t - lastAnnounce > 300) { lastAnnounce = t; window.dispatchEvent(new CustomEvent("kp:audio", { detail: "amittu" })); } }
  function silence() {
    live.forEach(src => { try { src.stop(); } catch (_) {} }); live.clear();
    shells.forEach(sh => sh.mute = true);
    timers.forEach(clearTimeout); timers.clear();
    holds.forEach(h => { clearTimeout(h.start); clearTimeout(h.timer); }); holds.clear();
  }
  window.addEventListener("kp:audio", e => { if (e.detail !== "amittu") silence(); });
  sndBtn.addEventListener("click", () => {
    soundOn = !soundOn; sndBtn.textContent = soundOn ? "🔊" : "🔇"; sndBtn.setAttribute("aria-pressed", soundOn);
    if (soundOn) initAudio();
  });

  /* ---------- simulation ---------- */
  const holds = new Map(), timers = new Set();
  let shells = [], stars = [], sparks = [], glows = [], smoke = [], running = false, last = 0, fired = 0;
  const MAX = () => small ? 1800 : 3600, SPK = 1600;

  function launch(tx, ty, opt = {}) {
    tx = Math.max(W * .06, Math.min(W * .94, tx)); ty = Math.max(H * .08, Math.min(H * .55, ty));
    const sx = tx + rnd(-W * .05, W * .05), sy = H * .93;
    shells.push({ sx, sy, x: sx, y: sy, tx, ty, t: 0, dur: rnd(.85, 1.15) * (0.7 + (sy - ty) / H * .7), wob: rnd(0, 6.28), type: opt.type, big: opt.big || 1 });
    glows.push({ x: sx, y: sy, r: 60, col: "#ff5a2a", a: .12, life: 1, decay: .06 });
    if (smoke.length < 50) smoke.push({ x: sx, y: sy - 6, r: 14, gr: .25, a: .16, life: 1, decay: .004, vx: rnd(-.1, .2), vy: -.12, tint: "150,120,130" });
    const now = performance.now();
    if (now - lastLaunchSnd > 110) { lastLaunchSnd = now; play("launch", .45, sx); }
    fired++; countEl.textContent = `🎆 ${fired}`;
    tip.classList.add("hide");
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); }
  }

  const TYPES = ["peony", "peony", "twotone", "willow", "ring", "glitter", "chrys", "multi"];
  function burst(sh) {
    const type = sh.type || pick(TYPES), x = sh.x, y = sh.y, big = sh.big;
    const c1 = COL[pick(NAMES)], c2 = COL[pick(NAMES)];
    const room = Math.max(0, MAX() - stars.length), scale = small ? .65 : 1;
    let n = Math.min(room, Math.round(rnd(110, 150) * scale * big));
    const base = rnd(4.3, 5.6) * Math.min(1.25, Math.max(.75, H / 520)) * big;
    const add = (vx, vy, col, o = {}) => stars.push({ x, y, vx, vy, col, life: 1, decay: o.decay || rnd(.0095, .0135), drag: o.drag || .972, grav: o.grav || .034,
      r: o.r || 1.9, glit: o.glit || 0, trail: o.trail || 0, tip: o.tip || null });
    const sphere = () => { const a = Math.random() * 6.283, r = Math.sqrt(1 - Math.random() ** 2); return [Math.cos(a) * r, Math.sin(a) * r]; };

    if (type === "willow") {
      for (let i = 0; i < n; i++) { const [ux, uy] = sphere(); add(ux * base * .9, uy * base * .9, "#ffcf6b", { decay: rnd(.0045, .0065), drag: .962, grav: .045, r: 1.6, trail: 1 }); }
    } else if (type === "ring") {
      const tilt = rnd(.35, 1), rot = rnd(0, 3.14);
      for (let i = 0; i < n * .7; i++) { const a = i / (n * .7) * 6.283, ex = Math.cos(a), ey = Math.sin(a) * tilt;
        add((ex * Math.cos(rot) - ey * Math.sin(rot)) * base, (ex * Math.sin(rot) + ey * Math.cos(rot)) * base, c1); }
      for (let i = 0; i < n * .3; i++) { const [ux, uy] = sphere(); add(ux * base * .35, uy * base * .35, c2, { r: 1.6 }); }
    } else if (type === "twotone") {
      for (let i = 0; i < n * .65; i++) { const [ux, uy] = sphere(); add(ux * base, uy * base, c1); }
      for (let i = 0; i < n * .35; i++) { const [ux, uy] = sphere(); add(ux * base * .5, uy * base * .5, c2, { r: 2.1 }); }
    } else if (type === "glitter") {
      for (let i = 0; i < n; i++) { const [ux, uy] = sphere(); add(ux * base, uy * base, "#f4f6ff", { glit: 1, r: 1.7, decay: rnd(.008, .012) }); }
    } else if (type === "chrys") {          // chrysanthemum: coloured stars leaving gold sparks
      for (let i = 0; i < n; i++) { const [ux, uy] = sphere(); add(ux * base, uy * base, c1, { trail: 1, r: 1.8 }); }
    } else if (type === "multi") {          // every star a different colour
      for (let i = 0; i < n; i++) { const [ux, uy] = sphere(); add(ux * base, uy * base, COL[pick(NAMES)], { r: 1.9 }); }
    } else {                                // peony with white tips like the video
      for (let i = 0; i < n; i++) { const [ux, uy] = sphere(); add(ux * base, uy * base, c1, { tip: "#ffffff" }); }
    }
    // bright core flash + whole-sky colour wash
    glows.push({ x, y, r: 45 * big, col: "#ffffff", a: .14, life: 1, decay: .12 });
    if (glows.filter(o => o.wash).length < 3) glows.push({ wash: 1, x, y, r: Math.max(W, H) * .7, col: type === "willow" ? "#ffb84a" : type === "glitter" ? "#dfe6ff" : c1, a: .009, life: 1, decay: .025 });
    for (let i = 0; i < 4 && smoke.length < 50; i++) smoke.push({ x: x + rnd(-40, 40), y: y + rnd(-30, 40), r: rnd(25, 45), gr: .22, a: .07, life: 1, decay: rnd(.0022, .0035), vx: rnd(.05, .25), vy: rnd(-.05, .05), tint: "170,160,175" });
    if (!sh.mute) setTimeout(() => { if (!sh.mute) play("burst", Math.min(1, .75 + big * .15), x); }, rnd(0, 60));
  }

  function tick(now) {
    const k = Math.min(3, (now - last) / 16.67); last = now;
    // fade old frame → light trails
    paintSky(Math.min(1, .22 * k));
    g.globalCompositeOperation = "lighter";

    // glows
    glows = glows.filter(o => {
      o.life -= o.decay * k; if (o.life <= 0) return false;
      const gr = g.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      gr.addColorStop(0, hexA(o.col, o.a * o.life)); gr.addColorStop(1, hexA(o.col, 0));
      g.fillStyle = gr; g.fillRect(o.x - o.r, o.y - o.r, o.r * 2, o.r * 2); return true;
    });

    // rising shells with a wobbly orange spark tail
    shells = shells.filter(sh => {
      sh.t += k / 60 / sh.dur; const e = 1 - Math.pow(1 - Math.min(1, sh.t), 2.2);
      sh.x = sh.sx + (sh.tx - sh.sx) * e + Math.sin(sh.wob + sh.t * 18) * 1.6; sh.y = sh.sy + (sh.ty - sh.sy) * e;
      for (let i = 0; i < 2; i++) sparks.push({ x: sh.x + rnd(-1.5, 1.5), y: sh.y + rnd(0, 4), vx: rnd(-.35, .35), vy: rnd(.4, 1.4), life: 1, decay: rnd(.04, .07), col: Math.random() < .6 ? "#ffb347" : "#ffe7a3", r: 1.3 });
      g.globalAlpha = 1; g.fillStyle = "#fff2c4"; g.beginPath(); g.arc(sh.x, sh.y, 2.2, 0, 6.283); g.fill();
      if (sh.t >= 1) { burst(sh); return false; } return true;
    });

    // stars
    const nextStars = [];
    for (const p of stars) {
      p.vx *= Math.pow(p.drag, k); p.vy = p.vy * Math.pow(p.drag, k) + p.grav * k; p.x += p.vx * k; p.y += p.vy * k; p.life -= p.decay * k;
      if (p.life <= 0) { if (p.glit && sparks.length < SPK && Math.random() < .25) sparks.push({ x: p.x, y: p.y, vx: 0, vy: 0, life: 1, decay: .12, col: "#ffffff", r: 2.2 }); continue; }
      if (p.trail && sparks.length < SPK && Math.random() < .35 * k) sparks.push({ x: p.x, y: p.y, vx: p.vx * .1, vy: p.vy * .1 + .2, life: .8, decay: rnd(.025, .045), col: "#ffcf6b", r: 1 });
      let a = p.life < .25 ? p.life * 4 : 1;
      if (p.glit) a *= Math.random() < .55 ? 1 : .15;
      const col = p.tip && p.life < .22 ? p.tip : p.col;
      g.globalAlpha = a; g.fillStyle = col;
      const r = p.r * (.55 + p.life * .6);
      g.beginPath(); g.arc(p.x, p.y, r, 0, 6.283); g.fill();
      nextStars.push(p);
    }
    stars = nextStars;

    // small sparks
    sparks = sparks.filter(p => {
      p.vy += .03 * k; p.x += p.vx * k; p.y += p.vy * k; p.life -= p.decay * k; if (p.life <= 0) return false;
      g.globalAlpha = p.life; g.fillStyle = p.col; g.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r); return true;
    });
    g.globalAlpha = 1;
    if (letters.length) { g.globalCompositeOperation = "lighter"; drawLetters(k); }

    // smoke (separate layer behind the sparks)
    s.clearRect(0, 0, W, H);
    smoke = smoke.filter(o => {
      o.life -= o.decay * k; if (o.life <= 0) return false;
      o.r += o.gr * k; o.x += o.vx * k; o.y += o.vy * k;
      const gr = s.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      gr.addColorStop(0, `rgba(${o.tint},${o.a * o.life})`); gr.addColorStop(1, `rgba(${o.tint},0)`);
      s.fillStyle = gr; s.fillRect(o.x - o.r, o.y - o.r, o.r * 2, o.r * 2); return true;
    });

    if (shells.length || stars.length || sparks.length || glows.length || smoke.length || letters.length) requestAnimationFrame(tick);
    else { running = false; paintSky(1); s.clearRect(0, 0, W, H); }
  }
  /* ---------- sky writing: sparks fly out and spell the feast name in gold ---------- */
  let letters = [];
  function writeSky(text) {
    const oc = document.createElement("canvas"), c = oc.getContext("2d");
    let fs = Math.min(H * .16, 90); c.font = `800 ${fs}px "Anek Malayalam","Noto Sans Malayalam",sans-serif`;
    const tw = c.measureText(text).width; if (tw > W * .88) { fs *= W * .88 / tw; c.font = `800 ${fs}px "Anek Malayalam","Noto Sans Malayalam",sans-serif`; }
    const w = Math.ceil(c.measureText(text).width) + 10, h = Math.ceil(fs * 1.5);
    oc.width = w; oc.height = h; c.font = `800 ${fs}px "Anek Malayalam","Noto Sans Malayalam",sans-serif`; c.textBaseline = "middle"; c.fillStyle = "#fff"; c.fillText(text, 5, h / 2);
    const d = c.getImageData(0, 0, w, h).data, st = Math.max(3, Math.round(fs / 16)), ox = (W - w) / 2, oy = H * .2 - h / 2, cx = W / 2, cy = H * .3;
    const pts = []; for (let y = 0; y < h; y += st) for (let x = 0; x < w; x += st) if (d[(y * w + x) * 4 + 3] > 128) pts.push([ox + x, oy + y]);
    const keep = small ? 700 : 1300, every = Math.max(1, Math.ceil(pts.length / keep));
    pts.forEach(([tx, ty], i) => { if (i % every) return; letters.push({ x: cx, y: cy, sx: cx + rnd(-8, 8), sy: cy + rnd(-8, 8), tx, ty, t: -rnd(0, .25), col: pick(["#ffd76a", "#ffcf4a", "#fff1b8", "#ffb347"]), vy: 0 }); });
    glows.push({ x: cx, y: cy, r: 80, col: "#ffffff", a: .3, life: 1, decay: .08 });
    play("burst", 1, cx);
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); }
  }
  function drawLetters(k) {
    letters = letters.filter(p => {
      p.t += k / 60;
      if (p.t < 0) return true;
      if (p.t < 1) { const e = 1 - Math.pow(1 - p.t, 3); p.x = p.sx + (p.tx - p.sx) * e; p.y = p.sy + (p.ty - p.sy) * e; }
      else if (p.t < 3.6) { p.x = p.tx + rnd(-.4, .4); p.y = p.ty + rnd(-.4, .4); }
      else { p.vy += .04 * k; p.y += p.vy * k; p.x += rnd(-.3, .3); }
      const a = p.t > 3.6 ? Math.max(0, 1 - (p.t - 3.6) / 1.4) : (p.t > 1 && Math.random() < .08 ? .4 : 1);
      if (a <= 0) return false;
      g.globalAlpha = a * .7; g.fillStyle = Math.random() < .03 ? "#ffffff" : p.col; g.beginPath(); g.arc(p.x, p.y, small ? 1.4 : 1.7, 0, 6.283); g.fill();
      return true;
    });
    g.globalAlpha = 1;
  }

  function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${Math.max(0, a).toFixed(3)})`; }

  /* ---------- touch: tap = one, press & hold = continuous barrage (multi-finger works) ---------- */
  const local = e => { const b = stage.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  stage.addEventListener("pointerdown", e => {
    e.preventDefault(); initAudio();
    try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    const [x, y] = local(e); launch(x, y);
    const h = { x, y, timer: null };
    h.start = setTimeout(() => {
      const fire = () => {
        launch(h.x + rnd(-W * .12, W * .12), h.y + rnd(-H * .1, H * .1));
        if (Math.random() < .3) launch(h.x + rnd(-W * .2, W * .2), h.y + rnd(-H * .12, H * .12));
        h.timer = setTimeout(fire, rnd(170, 260));
      };
      fire();
    }, 320);
    holds.set(e.pointerId, h);
  });
  stage.addEventListener("pointermove", e => { const h = holds.get(e.pointerId); if (h) [h.x, h.y] = local(e); });
  const end = e => { const h = holds.get(e.pointerId); if (!h) return; clearTimeout(h.start); clearTimeout(h.timer); holds.delete(e.pointerId); };
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(t => stage.addEventListener(t, end));
  stage.addEventListener("contextmenu", e => e.preventDefault());

  /* ---------- buttons ---------- */
  const skyX = () => rnd(W * .12, W * .88), skyY = () => rnd(H * .12, H * .45);
  const later = (ms, f) => { const id = setTimeout(() => { timers.delete(id); f(); }, ms); timers.add(id); };
  const ACTS = {
    one: () => launch(skyX(), skyY(), { big: 1.15 }),
    volley: () => { const n = small ? 5 : 7; for (let i = 0; i < n; i++) later(rnd(0, 140), () => launch(W * (i + .5) / n + rnd(-20, 20), rnd(H * .15, H * .38))); },
    chain: () => { for (let i = 0; i < 10; i++) later(i * 420, () => launch(W * (.1 + .8 * i / 9), rnd(H * .14, H * .4))); },
    finale: () => {
      for (let i = 0; i < 34; i++) later(i * rnd(90, 150), () => launch(skyX(), skyY()));
      later(4300, () => { for (let i = 0; i < 6; i++) later(i * 60, () => launch(W * (i + .5) / 6, rnd(H * .12, H * .3), { big: 1.25 })); });
      later(6600, () => writeSky("കോട്ടപ്പടി തിരുനാൾ"));
    }
  };
  document.querySelectorAll("[data-am]").forEach(b => b.addEventListener("click", () => {
    initAudio(); stage.scrollIntoView({ behavior: "smooth", block: "nearest" }); ACTS[b.dataset.am]();
  }));
})();
