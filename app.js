/* St. Lazarus Church Kottapadi — Thirunal site. All content comes from data.js */
(() => {
"use strict";
const F = window.FEAST, DAYS = window.DAYS, MT = window.MELAM_TYPES;
const $ = s => document.querySelector(s);
const mins = t => { if (!t) return null; const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const hhmm = m => { m = Math.floor(m); return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; };
function tf(t) {
  if (!t) return { main: "—", part: "സമയം ഉടൻ", full: "സമയം ഉടൻ അറിയിക്കും" };
  let [h, m] = t.split(":").map(Number);
  m = Math.round(m || 0); if (m >= 60) { h += 1; m -= 60; }      // always whole minutes
  const h12 = ((h + 11) % 12) + 1, ap = (h % 24) < 12 ? "AM" : "PM";
  const part = h >= 24 || h < 4 ? "രാത്രി" : h < 12 ? "രാവിലെ" : h < 15 ? "ഉച്ചയ്ക്ക്" : h < 19 ? "വൈകീട്ട്" : "രാത്രി";
  const main = `${h12}:${String(m).padStart(2, "0")} ${ap}`;
  return { main, part, full: main };
}
const ML_MONTHS = ["ജനുവരി","ഫെബ്രുവരി","മാർച്ച്","ഏപ്രിൽ","മേയ്","ജൂൺ","ജൂലൈ","ഓഗസ്റ്റ്","സെപ്റ്റംബർ","ഒക്ടോബർ","നവംബർ","ഡിസംബർ"];
const ML_SHORT = ["ജനു","ഫെബ്രു","മാർ","ഏപ്രി","മേയ്","ജൂൺ","ജൂലൈ","ഓഗ","സെപ്","ഒക്ടോ","നവം","ഡിസം"];
const pd = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const dayOf = id => DAYS.find(d => d.id === id);
const dLabel = id => { const d = pd(dayOf(id).date); return `${ML_MONTHS[d.getMonth()]} ${d.getDate()}`; };
const dShort = id => { const d = pd(dayOf(id).date); return `${ML_SHORT[d.getMonth()]} ${d.getDate()}`; };
const todayId = (() => { const n = new Date().toDateString(); const d = DAYS.find(x => pd(x.date).toDateString() === n); return d ? d.id : null; })();

/* ---------- units (Jan 2 amb / vala ezhunnallippu) ---------- */
const UDAY = (DAYS.find(d => d.units) || DAYS[0]).id;
const N = window.UNITS.length;
const SAM = window.UNITS.map((u, i) => {
  const hue = Math.round(i * 137.5 % 360);
  const color = u.color || `hsl(${hue}, 85%, 62%)`;
  const a = i / N * Math.PI * 2 - Math.PI / 2, R = 64 + (i % 3) * 13;
  const path = u.path || [[Math.cos(a) * R, Math.sin(a) * R], [Math.cos(a + .14) * R * .64, Math.sin(a + .14) * R * .64],
    [Math.cos(a + .22) * 30, Math.sin(a + .22) * 30], [Math.cos(a + .1) * 14, 3 + Math.sin(a + .1) * 13]];
  const via = u.via || [];
  const stops = [{ i: 0, p: u.start || `${u.n} യൂണിറ്റ് കേന്ദ്രം`, t: u.from, n: "എഴുന്നള്ളിപ്പ് തുടങ്ങുന്നു" }];
  via.forEach((v, k) => stops.push({ i: Math.min(path.length - 2, k + 1), p: v, t: "", n: "" }));
  stops.push({ i: path.length - 1, p: "പള്ളി", t: u.to, n: "അമ്പ്, വള സമർപ്പണം · സമാപനം" });
  return { id: "u" + i, no: i + 1, name: u.n, sub: u.sub || "", color, path, stops, from: mins(u.from), to: mins(u.to), tFrom: u.from, tTo: u.to,
    melams: [{ type: u.type, troupe: u.troupe }], day: UDAY, auto: !u.path };
});
const byTime = [...SAM].sort((a, b) => a.from - b.from || a.to - b.to);

/* ---------- static text ---------- */
$("#heroTitle").textContent = F.churchName;
$("#heroPlace").textContent = F.place;
$("#heroKicker").textContent = "വി. ലാസറിന്റെയും വി. സെബാസ്ത്യനോസിന്റെയും പരിശുദ്ധ കന്യകാമറിയത്തിന്റെയും തിരുനാൾ മഹാമഹം";
{ const g = document.querySelector(".kt-dots"), cols = ["#ffcf4a", "#ff3b5c", "#22c55e", "#5ec8ff", "#e4167f", "#ff8a00"];
  if (g) for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", (60 + Math.cos(a) * 54).toFixed(1)); c.setAttribute("cy", (60 + Math.sin(a) * 54).toFixed(1)); c.setAttribute("r", i % 2 ? 2 : 3);
    c.setAttribute("fill", cols[i % cols.length]); c.style.animationDelay = (-(i % 7) * .26) + "s"; g.appendChild(c); } }
$("#heroEn").textContent = `${F.churchNameEn.toUpperCase()}, ${F.placeEn.toUpperCase()} · THIRUNAL ${F.year}`;
$("#mapsLink").href = F.mapsLink;
if (F.liveLink) { const l = $("#liveLink"); l.href = F.liveLink; l.hidden = false; $("#liveText").textContent = "തിരുകർമ്മങ്ങൾ തത്സമയം കാണാം."; }
if (F.whatsappNumber) { $("#waLink").href = `https://wa.me/${F.whatsappNumber}`; $("#waNum").textContent = F.whatsappShow; }
if (F.whatsappGroup) $("#waGroup").href = F.whatsappGroup; else $("#waGroup").hidden = true;
$("#updated").textContent = F.updated ? `അവസാനം പുതുക്കിയത്: ${F.updated}` : "";
$("#heroDates").innerHTML = DAYS.map(d => { const dt = pd(d.date);
  return `<a class="date-pill" href="#schedule" data-day="${d.id}" style="--c:${d.color}"><b>${dt.getDate()}</b><span>${ML_MONTHS[dt.getMonth()]}<br>${d.name}</span></a>`; }).join("");

/* ---------- countdown ---------- */
function tick() {
  const now = new Date(), el = $("#countdown");
  const lf = pd(F.liveFrom), lt = pd(F.liveTo); lt.setHours(23, 59);
  if (now >= lf && now <= lt) { const d = todayId && dayOf(todayId);
    el.innerHTML = `<div class="cd-live">🎉 തിരുനാൾ നടക്കുന്നു${d ? " — ഇന്ന്: " + d.name : ""}</div>`; return; }
  if (now > lt) { el.innerHTML = `<div class="cd-live">🙏 നന്ദി! അടുത്ത തിരുനാളിൽ വീണ്ടും കാണാം</div>`; return; }
  const next = F.countdown.map(c => ({ ...c, d: new Date(c.at) })).find(c => c.d > now);
  if (!next) { el.innerHTML = ""; return; }
  const s = Math.floor((next.d - now) / 1000);
  const parts = [[Math.floor(s / 86400), "ദിവസം"], [Math.floor(s % 86400 / 3600), "മണിക്കൂർ"], [Math.floor(s % 3600 / 60), "മിനിറ്റ്"], [s % 60, "സെക്കന്റ്"]];
  el.innerHTML = `<div class="cd-lbl">${next.label} ഇനി</div>` + parts.map(([v, l]) => `<div class="cd"><b>${String(v).padStart(2, "0")}</b><span>${l}</span></div>`).join("");
}
tick(); setInterval(tick, 1000);

/* ---------- day gates + schedule ---------- */
function dayEvents(d) {
  const ev = d.events.map(e => ({ ...e }));
  if (d.units) byTime.forEach(s => ev.push({ t: s.tFrom, tEnd: s.tTo, title: `${s.no}. ${s.name}${s.sub ? " (" + s.sub + ")" : ""}`,
    troupe: `${MT[s.melams[0].type].icon} ${s.melams[0].troupe}`, type: s.melams[0].type, sid: s.id, unit: true }));
  return ev;
}
let curDay = todayId || DAYS[0].id;
if (!todayId) { const now = new Date(); const up = DAYS.find(d => pd(d.date) >= now); curDay = up ? up.id : DAYS[0].id; }
$("#gates").innerHTML = DAYS.map(d => { const dt = pd(d.date); return `<button class="gate reveal" data-day="${d.id}" style="--c:${d.color}">
  <div class="num">${dt.getDate()}</div><div class="mo">${ML_MONTHS[dt.getMonth()]} ${dt.getFullYear()}</div><div class="nm">${d.name}</div><div class="sb">${d.sub}</div></button>`; }).join("");
$("#dayTabs").innerHTML = DAYS.map(d => `<button class="tab" role="tab" data-day="${d.id}" style="--c:${d.color}">${dShort(d.id)} · ${d.name}</button>`).join("");
function showDay(id) {
  curDay = id; const d = dayOf(id), dt = pd(d.date);
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("on", b.dataset.day === id));
  document.querySelectorAll(".gate").forEach(b => b.classList.toggle("on", b.dataset.day === id));
  const p = $("#dayPanel"); p.style.setProperty("--c", d.color);
  const evs = dayEvents(d);
  p.innerHTML = `<div class="day-card"><div class="num">${dt.getDate()}</div><div><h3>${d.name}</h3><p>${dLabel(id)} ${dt.getFullYear()}</p><p>${d.sub}</p>
    ${d.units ? `<a class="btn primary" href="#map" style="margin-top:12px;padding:9px 14px;font-size:14px">🗺️ 3D റൂട്ട് മാപ്പ്</a>` : ""}</div></div>
  <ol class="events">${evs.map(e => { const t = tf(e.t), ty = MT[e.type];
    return `<li class="ev ${e.highlight ? "hl" : ""}"><time>${t.main}<small>${t.part}</small></time><span class="dot"></span>
    <div class="box"><b>${ty ? ty.icon + " " : ""}${e.title}${e.highlight ? '<span class="tag">പ്രധാനം</span>' : ""}</b>
    ${e.troupe ? `<span class="tr">${e.troupe}</span>` : ""}
    <span>${e.tEnd ? `🕒 ${tf(e.t).full} – ${tf(e.tEnd).full}` : ""}${e.place ? ` 📍 ${e.place}` : ""}</span>
    ${e.sid ? `<button class="go" data-sid="${e.sid}" data-scroll="1">റൂട്ട് മാപ്പിൽ →</button>` : ""}</div></li>`; }).join("")}</ol>`;
}
document.addEventListener("click", e => {
  const b = e.target.closest(".tab,.gate,.date-pill"); if (!b) return;
  showDay(b.dataset.day);
  if (!b.classList.contains("tab")) { e.preventDefault(); $("#schedule").scrollIntoView({ behavior: "smooth" }); }
});
showDay(curDay);

/* ---------- flow ---------- */
$("#flowRow").innerHTML = window.FLOW.map(s => `<div class="step"><div class="ic">${s.i}</div><b>${s.t}</b><span>${s.d}</span></div>`).join("");

/* ---------- melams: where & when ---------- */
const MELAMS = [];
DAYS.forEach(d => d.events.forEach(e => { if (e.type && e.type !== "church") MELAMS.push({ day: d.id, ...e }); }));
SAM.forEach(s => s.melams.forEach(m => MELAMS.push({ day: s.day, t: s.tFrom, tEnd: s.tTo, type: m.type, title: s.name + (s.sub ? ` (${s.sub})` : ""),
  troupe: m.troupe, place: `${s.stops[0].p} → പള്ളി`, sid: s.id, color: s.color })));
const dayIdx = id => DAYS.findIndex(d => d.id === id);
MELAMS.sort((a, b) => dayIdx(a.day) - dayIdx(b.day) || (mins(a.t) ?? 9999) - (mins(b.t) ?? 9999));
let mDay = MELAMS.some(m => m.day === todayId) ? todayId : "all", mType = "all", mQ = "";
$("#mtypes").innerHTML = ["band", "nadaswaram", "chenda", "ganamela", "fireworks", "lights"].map((k, i) => { const v = MT[k];
  return `<button class="mtype" data-mtype="${k}" style="--c:${v.color};--dl:${i * .2}s"><i>${v.icon}</i>${v.name}</button>`; }).join("");
function melamFilters() {
  const days = DAYS.filter(d => MELAMS.some(m => m.day === d.id));
  $("#melamDayF").innerHTML = `<span class="lbl">📅 ദിവസം:</span>` + [["all", "എല്ലാം"], ...days.map(d => [d.id, `${dShort(d.id)} · ${d.name}`])]
    .map(([k, l]) => `<button class="chip ${mDay === k ? "on" : ""}" data-mday="${k}">${l}</button>`).join("");
  const types = [...new Set(MELAMS.map(m => m.type))];
  $("#melamTypeF").innerHTML = `<span class="lbl">🎶 തരം:</span>` + [["all", "എല്ലാം"], ...types.map(t => [t, MT[t].icon + " " + MT[t].name])]
    .map(([k, l]) => `<button class="chip ${mType === k ? "on" : ""}" data-mtype="${k}">${l}</button>`).join("");
}
function renderMelams() {
  melamFilters();
  const q = mQ.trim().toLowerCase();
  const list = MELAMS.filter(m => (mDay === "all" || m.day === mDay) && (mType === "all" || m.type === mType) &&
    (!q || (m.title + " " + m.troupe + " " + (m.place || "")).toLowerCase().includes(q)));
  $("#mCount").textContent = `${list.length} എണ്ണം`;
  $("#melamGrid").innerHTML = list.length ? list.map(m => { const ty = MT[m.type], c = m.color || ty.color;
    return `<article class="mcard" style="--c:${c}"><span class="when" style="--dc:${dayOf(m.day).color}">${dShort(m.day)}</span>
      <div class="top"><div class="ico">${ty.icon}</div><div><h4>${m.troupe || m.title}</h4><div class="by">${m.troupe ? (m.sid ? "യൂണിറ്റ്: " : "ഒരുക്കുന്നത്: ") + m.title : ""}</div></div></div>
      <div class="meta"><div><i>🕒</i><span>${m.t ? tf(m.t).full + (m.tEnd ? " – " + tf(m.tEnd).full : "") : "സമയം ഉടൻ അറിയിക്കും"} · ${dLabel(m.day)}</span></div>
      <div><i>📍</i><span>${m.place || "സ്ഥലം ഉടൻ അറിയിക്കും"}</span></div><div><i>${ty.icon}</i><span>${ty.name}</span></div></div>
      ${m.sid ? `<button class="go" data-sid="${m.sid}" data-scroll="1">🗺️ 3D മാപ്പിൽ റൂട്ട് കാണുക →</button>` : ""}</article>`; }).join("")
    : `<p class="empty">ഈ തിരഞ്ഞെടുപ്പിൽ ഒന്നുമില്ല.</p>`;
}
document.addEventListener("click", e => {
  const d = e.target.closest("[data-mday]"), t = e.target.closest("[data-mtype]");
  if (d) { mDay = d.dataset.mday; renderMelams(); }
  if (t) { mType = mType === t.dataset.mtype && t.classList.contains("mtype") ? "all" : t.dataset.mtype; renderMelams();
    if (t.classList.contains("mtype")) $("#melamGrid").scrollIntoView({ behavior: "smooth", block: "start" }); }
});
$("#mSearch").addEventListener("input", e => { mQ = e.target.value; renderMelams(); });
renderMelams();

/* ---------- map side: chips, panel, gantt, time ---------- */
let selected = "all", simT = 8 * 60 + 30;
const T0 = Math.floor(Math.min(...SAM.map(s => s.from)) / 60) * 60, T1 = Math.ceil(Math.max(...SAM.map(s => s.to)) / 60) * 60;
$("#schips").innerHTML = `<button class="schip on" data-sid="all" style="--c:#fff"><i></i>എല്ലാം (${N})</button>` +
  byTime.map(r => `<button class="schip" data-sid="${r.id}" style="--c:${r.color}"><i></i>${r.name}</button>`).join("");
const activeAt = t => SAM.filter(s => t >= s.from && t <= s.to);
let lastPanelKey = "";
function panel(force) {
  const key = selected + ":" + (selected === "all" ? activeAt(simT).map(s => s.id).join(",") : "");
  if (!force && key === lastPanelKey) return; lastPanelKey = key;
  const p = $("#routePanel");
  if (selected === "all") {
    const act = activeAt(simT);
    p.style.setProperty("--c", "#ffcf4a");
    p.innerHTML = `<h3>${tf(hhmm(simT)).full} — വഴിയിൽ</h3><div class="sub">${dLabel(UDAY)} · ${act.length} യൂണിറ്റുകൾ എഴുന്നള്ളിപ്പിൽ</div>
    ${act.length ? `<ul class="rail">${act.map(s => `<li style="--c:${s.color}"><time>${tf(s.tFrom).main}</time><span class="pt"></span>
    <div><button class="rname" data-sid="${s.id}" style="color:${s.color}">${s.name}</button><span>${MT[s.melams[0].type].icon} ${s.melams[0].troupe} · ${tf(s.tTo).full} വരെ</span></div></li>`).join("")}</ul>`
      : `<p class="empty" style="padding:6px 0">ഈ സമയത്ത് എഴുന്നള്ളിപ്പുകൾ ഇല്ല. സ്ലൈഡർ നീക്കി നോക്കൂ.</p>`}`;
    return;
  }
  const r = SAM.find(x => x.id === selected);
  p.style.setProperty("--c", r.color);
  p.innerHTML = `<h3>${r.no}. ${r.name}</h3><div class="sub">${r.sub ? r.sub + " · " : ""}${dLabel(r.day)} · ${tf(r.tFrom).full} – ${tf(r.tTo).full}</div>
  <ul class="rail">${r.stops.map(s => `<li><time>${tf(s.t).main === "—" ? "" : tf(s.t).main}</time><span class="pt"></span><div><b>${s.p}</b><span>${s.t ? tf(s.t).part : ""}${s.n ? " · " + s.n : ""}</span></div></li>`).join("")}</ul>
  <div class="rp-melams">${r.melams.map(m => `<span>${MT[m.type].icon} ${MT[m.type].name}: ${m.troupe}</span>`).join("")}<span>🏹 അമ്പ്</span><span>⭕ വള</span></div>
  ${r.auto ? `<p class="note">ℹ️ മാപ്പിലെ വഴി ഏകദേശ രൂപം മാത്രം. യഥാർത്ഥ റൂട്ട് data.js-ൽ ചേർക്കാം.</p>` : ""}`;
}
function selectRoute(id) {
  selected = id;
  document.querySelectorAll(".schip").forEach(b => b.classList.toggle("on", b.dataset.sid === id));
  $("#mapAll").classList.toggle("on", id === "all");
  if (id !== "all") { const r = SAM.find(x => x.id === id); if (simT < r.from || simT > r.to) setT(r.from); }
  panel(true); MAP && MAP.select(id);
}
document.addEventListener("click", e => { const b = e.target.closest("[data-sid]"); if (!b) return; selectRoute(b.dataset.sid);
  if (b.dataset.scroll) $("#map").scrollIntoView({ behavior: "smooth" }); });
$("#mapAll").onclick = () => selectRoute("all");

// time slider
const slider = $("#tSlider"); slider.min = T0; slider.max = T1; slider.step = 5;
let playing = true;
function setT(t, fromSlider) { simT = Math.max(T0, Math.min(T1, t)); if (!fromSlider) slider.value = simT;
  $("#tNow").textContent = tf(hhmm(Math.round(simT / 5) * 5)).full; $("#tCount").textContent = `${activeAt(simT).length} യൂണിറ്റുകൾ വഴിയിൽ`;
  const x = ((simT - T0) / (T1 - T0) * 100) + "%"; document.querySelectorAll(".g-cursor").forEach(c => c.style.left = x); panel(); }
slider.addEventListener("input", () => { playing = false; $("#tPlay").textContent = "▶"; setT(+slider.value, true); });
$("#tPlay").onclick = () => { playing = !playing; $("#tPlay").textContent = playing ? "⏸" : "▶"; if (playing && simT >= T1) setT(T0); };
$("#tReal").onclick = () => { const n = new Date(); playing = false; $("#tPlay").textContent = "▶"; setT(n.getHours() * 60 + n.getMinutes()); };
if (todayId === UDAY) { const n = new Date(); const m = n.getHours() * 60 + n.getMinutes(); if (m >= T0 && m <= T1) { playing = false; simT = m; } }
$("#tPlay").textContent = playing ? "⏸" : "▶";
let lastTick = performance.now();
(function step(now) { const dt = now - lastTick; lastTick = now;
  if (playing && document.visibilityState === "visible") { let t = simT + dt / 1000 * 9; if (t > T1) t = T0; setT(t); }
  requestAnimationFrame(step); })(lastTick);

// Gantt chart (all units by time)
{
  const pct = t => ((t - T0) / (T1 - T0) * 100).toFixed(2) + "%";
  let ticks = "", lines = ""; for (let t = T0; t <= T1; t += 60) { if ((t - T0) % 120 === 0) ticks += `<span style="left:${pct(t)}">${tf(hhmm(t)).main}</span>`; lines += `<i style="left:${pct(t)}"></i>`; }
  $("#gantt").innerHTML = `<h3>📊 അമ്പ്, വള എഴുന്നള്ളിപ്പ് — സമയ ചാർട്ട്</h3><p class="sub">${dLabel(UDAY)} · ${N} യൂണിറ്റുകൾ · ഓരോ യൂണിറ്റും തുടങ്ങുന്നതു മുതൽ അവസാനിക്കുന്നതു വരെ. പേരിൽ അമർത്തിയാൽ 3D റൂട്ട്.</p>
  <div class="g-inner"><div class="g-axis"><div></div><div class="ticks">${ticks}</div></div>
  <div class="g-body"><div class="g-lines">${lines}<b class="g-cursor"></b></div>
  ${byTime.map(s => `<div class="g-row" style="--c:${s.color}"><button class="nm" data-sid="${s.id}" data-scroll="1"><i></i>${s.name}</button>
    <div class="g-track"><div class="g-bar" style="left:${pct(s.from)};width:calc(${pct(s.to)} - ${pct(s.from)})" title="${s.melams[0].troupe}">
    <span>${MT[s.melams[0].type].icon} ${tf(s.tFrom).main}–${tf(s.tTo).main} · ${s.melams[0].troupe}</span></div></div></div>`).join("")}</div></div>`;
}
setT(simT); panel(true);

/* ---------- unit 3D cards ---------- */
$("#sgrid").innerHTML = byTime.map((s, i) => {
  const ty = MT[s.melams[0].type];
  const icons = ["🏹", "⭕", ty.icon, "✝", "⛪", ty.icon];
  return `<div class="scard reveal" style="--c:${s.color}" tabindex="0">
  <div class="face front"><span class="badge">${s.no}</span><div class="cube-wrap"><div class="cube" style="animation-delay:${-i * 1.3}s">${icons.map(x => `<div>${x}</div>`).join("")}</div></div>
    <h3>${s.name}</h3><div class="en">${s.sub || ty.name}</div><div class="troupe">${ty.icon} ${s.melams[0].troupe}</div>
    <div class="tm"><span>🚩 ${tf(s.tFrom).full}</span><span>⛪ ${tf(s.tTo).main}</span></div>
    <div class="flip-hint">തൊട്ടാൽ വിവരങ്ങൾ ↻</div></div>
  <div class="face back"><h4>${s.no}. ${s.name}</h4>
    ${s.sub ? `<div class="row">🏘️ <b>${s.sub}</b></div>` : ""}
    <div class="row">📅 <b>${dLabel(s.day)}</b></div>
    <div class="row">🚩 തുടക്കം: <b>${tf(s.tFrom).full}</b></div>
    <div class="row">⛪ സമാപനം: <b>${tf(s.tTo).full}</b></div>
    <div class="row">${ty.icon} ${ty.name}: <b>${s.melams[0].troupe}</b></div>
    <div class="row">🏹 അമ്പ് · ⭕ വള എഴുന്നള്ളിപ്പ്</div>
    <button class="btn primary" data-sid="${s.id}" data-scroll="1">🗺️ 3D റൂട്ട് കാണുക</button></div></div>`;
}).join("");
document.querySelectorAll(".scard").forEach(c => {
  c.addEventListener("click", e => { if (!e.target.closest("[data-sid]")) c.classList.toggle("flip"); });
  c.addEventListener("keydown", e => { if (e.key === "Enter") c.classList.toggle("flip"); });
});
// phones: the unit cards become a sideways slider (swipe, dots, arrows) instead of one long column
{
  const grid = $("#sgrid"), dots = $("#sDots"), cards = [...grid.querySelectorAll(".scard")];
  dots.innerHTML = cards.map((_, i) => `<button aria-label="${i + 1}"></button>`).join("");
  const db = [...dots.children], step = () => cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : grid.clientWidth;
  const cur = () => Math.round(grid.scrollLeft / step());
  const go = i => grid.scrollTo({ left: Math.max(0, Math.min(cards.length - 1, i)) * step(), behavior: "smooth" });
  const mark = () => { const c = cur(); db.forEach((d, i) => d.classList.toggle("on", i === c)); $("#sNav").dataset.at = c === 0 ? "start" : c >= cards.length - 1 ? "end" : ""; };
  grid.addEventListener("scroll", () => requestAnimationFrame(mark), { passive: true });
  db.forEach((d, i) => d.addEventListener("click", () => go(i)));
  $("#sNav").querySelectorAll("[data-s]").forEach(b => b.addEventListener("click", () => go(cur() + +b.dataset.s)));
  mark();
}

/* ---------- clubs & committees (programmes come from DAYS events tagged club:"id") ---------- */
if (window.CLUBS && $("#cgrid")) {
  const CL = window.CLUBS.map(c => {
    const prog = [];
    DAYS.forEach(d => d.events.forEach(e => { if (e.club === c.id) prog.push({ ...e, day: d.id }); }));
    if (c.unit) { const u = SAM.find(s => s.name === c.unit);
      if (u) prog.push({ day: u.day, t: u.tFrom, tEnd: u.tTo, type: u.melams[0].type, troupe: `അമ്പ്, വള എഴുന്നള്ളിപ്പ് — ${u.melams[0].troupe}`, sid: u.id }); }
    prog.sort((a, b) => dayIdx(a.day) - dayIdx(b.day) || (mins(a.t) ?? 9999) - (mins(b.t) ?? 9999));
    return { ...c, prog };
  }).filter(c => c.prog.length);
  let cDay = "all";
  const cdays = DAYS.filter(d => CL.some(c => c.prog.some(p => p.day === d.id)));
  function clubFilters() {
    $("#clubF").innerHTML = `<span class="lbl">📅 ദിവസം:</span>` + [["all", `എല്ലാം (${CL.length})`], ...cdays.map(d => [d.id, `${dShort(d.id)} · ${d.name}`])]
      .map(([k, l]) => `<button class="chip ${cDay === k ? "on" : ""}" data-cday="${k}">${l}</button>`).join("");
  }
  $("#cgrid").innerHTML = CL.map(c => {
    const types = [...new Set(c.prog.map(p => p.type))];
    const days = [...new Set(c.prog.map(p => p.day))];
    const mainIcon = MT[types[0]] ? MT[types[0]].icon : "⭐";
    return `<div class="ccard reveal" style="--c:${c.color}" tabindex="0" data-days="${days.join(" ")}">
      <div class="face front">
        <div class="coin-wrap"><div class="coin"><b${c.logo ? ' class="has-logo"' : ""}>${c.logo ? `<img src="${c.logo}" alt="${c.name}">` : c.mono}</b><span>${mainIcon}</span></div></div>
        <h3>${c.name}</h3>${c.en ? `<div class="en">${c.en}</div>` : ""}
        <div class="ctags">${types.map(t => `<span>${MT[t].icon} ${MT[t].name}</span>`).join("")}</div>
        <div class="cdays">${days.map(d => `<i style="--dc:${dayOf(d).color}">${dShort(d)}</i>`).join("")}</div>
        <div class="flip-hint">തൊട്ടാൽ പരിപാടികൾ ↻</div>
      </div>
      <div class="face back"><h4>${c.name}</h4>
        <ul class="cprog">${c.prog.map(p => `<li><i>${MT[p.type] ? MT[p.type].icon : "⭐"}</i><div><b>${p.troupe || p.title}</b>
          <small>${dLabel(p.day)} · ${p.t ? tf(p.t).full + (p.tEnd ? " – " + tf(p.tEnd).full : "") : "സമയം ഉടൻ"}${p.place ? " · 📍 " + p.place : ""}</small></div></li>`).join("")}</ul>
        ${c.prog.some(p => p.sid) ? `<button class="btn" data-sid="${c.prog.find(p => p.sid).sid}" data-scroll="1">🗺️ എഴുന്നള്ളിപ്പ് റൂട്ട്</button>` : ""}
        <button class="btn primary" data-goday="${days[0]}">📅 ${dShort(days[0])} പരിപാടികൾ</button>
      </div></div>`;
  }).join("");
  clubFilters();
  document.querySelectorAll(".ccard").forEach(c => {
    c.addEventListener("click", e => { if (!e.target.closest("[data-sid],[data-goday]")) c.classList.toggle("flip"); });
    c.addEventListener("keydown", e => { if (e.key === "Enter") c.classList.toggle("flip"); });
  });
  document.addEventListener("click", e => {
    const f = e.target.closest("[data-cday]"); if (f) { cDay = f.dataset.cday; clubFilters();
      document.querySelectorAll(".ccard").forEach(c => c.classList.toggle("hide", cDay !== "all" && !c.dataset.days.split(" ").includes(cDay))); }
    const g = e.target.closest("[data-goday]"); if (g) { showDay(g.dataset.goday); $("#schedule").scrollIntoView({ behavior: "smooth" }); }
  });
}

/* ---------- രാപകൽ തിരുനാൾ (data.js → RAPAKAL) ---------- */
{
  const R = window.RAPAKAL, sec = $("#rapakal");
  if (R && R.show !== false && sec) {
    sec.hidden = false;
    if (R.byLogo) $("#rpBy").innerHTML = `<img src="${R.byLogo}" alt="കോട്ടപ്പടി സ്റ്റോറീസ്"><span>ഒരുക്കുന്ന</span>`; else $("#rpBy").textContent = R.by || "";
    if (R.logo) $("#rpLogo").innerHTML = `<img src="${R.logo}" alt="${R.name} ${R.sub || ""}">`;
    else { $("#rpName").textContent = R.name || "രാപകൽ"; $("#rpSub").textContent = R.sub || ""; }
    $("#rpLogo").setAttribute("aria-label", `${R.name || ""} ${R.sub || ""}`);
    $("#rpIntro").textContent = R.intro || "";
    $("#rpMore").textContent = R.more || ""; if (!R.more) $("#rpMore").hidden = true;
    $("#rpSessions").innerHTML = (R.sessions || []).map(s => `<article class="rp-card ${s.kind === "night" ? "night" : "day"}">
      <div class="ch"><i>${s.kind === "night" ? "🌙" : "☀️"}</i><div>${s.logo ? `<img class="rp-sl" src="${s.logo}" alt="${s.label || ""}">` : `<b>${s.label || ""}</b>`}<span>${s.when || (s.day && dayOf(s.day) ? dLabel(s.day) : "")}</span></div></div>
      <ul class="rp-items">${(s.items || []).map(it => { const ty = MT[it.type];
        return `<li><i>${ty ? ty.icon : "⭐"}</i><div>${it.t ? `<span class="tm">${tf(it.t).full}</span>` : ""}<b>${it.title || ""}</b>${it.by ? `<small>${it.by}</small>` : ""}${it.note ? `<small>${it.note}</small>` : ""}</div></li>`; }).join("")
        || `<li><i>⏳</i><div><b>വിവരങ്ങൾ ഉടൻ</b></div></li>`}</ul></article>`).join("");
  } else { sec && sec.remove(); const n = document.querySelector("[data-rp-nav]"); n && n.remove(); }
}

/* ---------- അമിട്ട്: who does the fireworks (every DAYS event of type "fireworks"), as cards under the heading ---------- */
{
  const box = $("#amList"), fw = [];
  DAYS.forEach(d => d.events.forEach(e => { if (e.type === "fireworks") fw.push({ ...e, day: d.id }); }));
  if (box && fw.length) box.innerHTML = fw.map(e => `<div class="gm-card"><span class="gm-date">${dLabel(e.day)}</span><b>${e.troupe || MT[e.type].name}</b><small>${e.title || ""}</small></div>`).join("");
  else if (box) box.remove();
}

/* ---------- QR code section ---------- */
if ($("#qr")) {
  const url = F.siteUrl || location.href.split("#")[0].split("?")[0];
  const msg = `⛪ ${F.title} ${F.year} — പരിപാടികൾ, മേളങ്ങൾ, 3D റൂട്ട് മാപ്പ്: ${url}`;
  $("#qrUrl").textContent = url;
  $("#qrWa").href = "https://wa.me/?text=" + encodeURIComponent(msg);
  $("#qrCopy").onclick = async () => { try { await navigator.clipboard.writeText(url); $("#qrCopy").textContent = "✅ കോപ്പി ആയി"; }
    catch (e) { const r = document.createRange(); r.selectNodeContents($("#qrUrl")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); $("#qrCopy").textContent = "Ctrl+C അമർത്തുക"; }
    setTimeout(() => $("#qrCopy").textContent = "📋 കോപ്പി", 2200); };
  if (navigator.share) { const b = $("#qrShare"); b.hidden = false; b.onclick = () => navigator.share({ title: `${F.title} ${F.year}`, text: msg, url }).catch(() => {}); }
}

/* ---------- gallery ---------- */
$("#galleryGrid").innerHTML = window.GALLERY.map((g, i) => `<button data-gi="${i}"><img src="${g.src}" alt="${g.cap}" loading="lazy"><figcaption>${g.cap}</figcaption></button>`).join("");
document.addEventListener("click", e => { const b = e.target.closest("[data-gi]"); if (!b) return; const g = window.GALLERY[+b.dataset.gi];
  $("#lbImg").src = g.src; $("#lbCap").textContent = g.cap; $("#lightbox").classList.add("on"); });
$("#lbClose").onclick = () => $("#lightbox").classList.remove("on");
$("#lightbox").onclick = e => { if (e.target.id === "lightbox") $("#lightbox").classList.remove("on"); };
document.addEventListener("keydown", e => { if (e.key === "Escape") $("#lightbox").classList.remove("on"); });

/* ---------- sponsors + team ---------- */
const AD = window.ADVERTISE || {};
const adLink = slot => AD.whatsapp ? `https://wa.me/${AD.whatsapp}?text=${encodeURIComponent((AD.message || "") + (slot ? `

സ്ഥലം: ${slot}` : ""))}` : "";
const logo = s => {
  if (s.open && AD.whatsapp) return `<a class="logo open" href="${adLink(s.sub)}" target="_blank" rel="noopener" aria-label="ഈ സ്ഥലത്ത് പരസ്യം ചെയ്യാൻ വാട്ട്സാപ്പ്">
    <span class="ph">നിങ്ങളുടെ ലോഗോ ഇവിടെ</span><small>${s.sub || ""} · ഒഴിവുണ്ട്</small><em>💬 പരസ്യം ചെയ്യാൻ</em></a>`;
  const inner = s.logo ? `<img src="${s.logo}" alt="${s.name}">` : `<span class="ph">${s.name}</span>`;
  const tag = s.link ? "a" : "div"; return `<${tag} class="logo${s.bg === "clear" ? " clear" : ""}${s.shape === "round" ? " round" : ""}" ${s.link ? `href="${s.link}" target="_blank" rel="noopener"` : ""}>${inner}<small>${s.sub || ""}</small></${tag}>`; };
if (AD.whatsapp) { $("#adWa").href = adLink(""); $("#adNum").textContent = AD.show || ""; } else $("#adCta").remove();
$("#spMain").innerHTML = window.SPONSORS.filter(s => s.tier === "main").map(logo).join("");
$("#spGrid").innerHTML = window.SPONSORS.filter(s => s.tier !== "main").map(logo).join("");
const person = p => `<div class="person"><div class="av">${p.photo ? `<img src="${p.photo}" alt="${p.name}">` : [...p.name][0]}</div><b>${p.name}</b><span>${p.role}</span></div>`;
$("#coordinators").innerHTML = window.TEAM.coordinators.map(person).join("");
$("#designers").innerHTML = window.TEAM.designers.map(person).join("");

/* ---------- vicar message + liturgy schedule (data-liturgy.js) ---------- */
{
  const preview = /[?&]preview\b/.test(location.search);
  const WD = ["ഞായർ", "തിങ്കൾ", "ചൊവ്വ", "ബുധൻ", "വ്യാഴം", "വെള്ളി", "ശനി"];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // "പേര് & ഫാമിലി (കൂട്ടായ്മ)" → highlight the koottayma in brackets
  const fam = s => esc(s).replace(/\(([^)]+)\)\s*$/, '<em>($1)</em>');
  const tt = (a, b) => b ? `${tf(a).main} & ${tf(b).main}` : tf(a).full;

  const M = window.MESSAGE;
  if (M && (M.published || preview)) {
    $("#message").hidden = false;
    if (!M.published) $("#message .sample-tag").hidden = false;
    $("#msgGreet").textContent = M.greeting || "";
    $("#msgBody").innerHTML = (M.body || []).map(p => `<p>${esc(p)}</p>`).join("");
    $("#msgSignWord").textContent = M.sign || "";
    $("#msgName").textContent = M.name || ""; $("#msgRole").textContent = M.role || "";
    if (M.photo) { $("#msgPhoto").src = M.photo; $("#msgPhoto").alt = M.name || ""; } else $(".msg-photo").textContent = [...(M.name || "✝")][0];
  }

  const L = window.LITURGY;
  const navLink = document.querySelector("[data-lit-nav]");
  if (L && L.days && L.days.length && (L.published || preview)) {
    $("#liturgy").hidden = false;
    if (!L.published) { const t = $("#litSample"); t.hidden = false; t.textContent = "👁 " + (L.note || "മാതൃക"); }
    const days = L.days.map(d => ({ ...d, dt: pd(d.date) }));
    const today = new Date().toDateString();
    let cur = (days.find(d => d.dt.toDateString() === today) || days.find(d => d.dt >= new Date()) || days[0]).date;
    $("#litStrip").innerHTML = days.map(d => `<button class="lit-day" role="tab" data-lit="${d.date}">
      <small>${ML_SHORT[d.dt.getMonth()]}</small><b>${d.dt.getDate()}</b><span>${WD[d.dt.getDay()]}</span>${d.title ? `<i>${esc(d.title)}</i>` : ""}</button>`).join("");
    const rowsHTML = rows => (rows || []).map(([k, v, note]) => {
      const vals = Array.isArray(v) ? v : [v];
      return `<div class="lr"><span class="lk">${esc(k)}</span><span class="lc">:</span><div class="lv">${vals.map(x => `<div>${fam(x)}</div>`).join("")}${note ? `<small>${esc(note)}</small>` : ""}</div></div>`;
    }).join("");
    const blockHTML = b => `<div class="lb-block"><div class="lr lr-time"><span class="lk lt">${tt(b.t, b.t2)}</span><span class="lc">:</span>
      <div class="lv"><div class="ltitle ${b.big ? "big" : ""}">${esc(b.title)}</div>${b.sub ? `<div class="lsub">${esc(b.sub)}</div>` : ""}</div></div>${rowsHTML(b.rows)}</div>`;
    function show(date) {
      cur = date; const d = days.find(x => x.date === date);
      document.querySelectorAll(".lit-day").forEach(b => b.classList.toggle("on", b.dataset.lit === date));
      $("#litPanel").innerHTML = `<article class="lit-card">
        <div class="lit-date"><span>${d.dt.getFullYear()} ${ML_MONTHS[d.dt.getMonth()]} ${d.dt.getDate()} ${WD[d.dt.getDay()]}</span></div>
        ${d.title ? `<h3 class="lit-title">${esc(d.title)}</h3>` : ""}
        ${(d.blocks || []).map(blockHTML).join("")}
        ${d.rows ? `<div class="lb-block">${rowsHTML(d.rows)}</div>` : ""}
        ${(d.after || []).map(blockHTML).join("")}
        ${d.highlight ? `<p class="lit-hl">${esc(d.highlight)}</p>` : ""}
        ${(d.notes || []).map(n => `<p class="lit-note">${esc(n)}</p>`).join("")}
        ${d.badges ? `<div class="lit-badges">${d.badges.map(b => `<div class="lit-badge">${b.logo ? `<img src="${esc(b.logo)}" alt="${esc(b.name)}">` : `<b>${esc(b.name)}</b>`}${b.t ? `<span>${b.t2 ? tf(b.t).main + " – " + tf(b.t2).full : tf(b.t).full}</span>` : ""}</div>`).join("")}</div>` : ""}
      </article>`;
    }
    $("#litStrip").addEventListener("click", e => { const b = e.target.closest("[data-lit]"); if (b) show(b.dataset.lit); });
    show(cur);
    const on = $("#litStrip").querySelector(".on"); if (on) $("#litStrip").scrollLeft = on.offsetLeft - 40;
  } else if (navLink) navLink.remove();
}

/* ---------- band set drummers: one tap = play, tap again = pause ---------- */
{
  const B = window.BAND_PLAYER || {}, bot = $("#bandBot"), stageSec = $("#bandstage");
  if (B.enabled === false) { bot && bot.remove(); stageSec && stageSec.remove(); document.querySelectorAll("[data-band-toggle]").forEach(b => b.remove()); }
  else if (bot && stageSec) {
    // stage: drummer A (cloned from the mini button) + drummer B (template)
    const slot = $("#bsSlot");
    slot.appendChild(bot.querySelector(".bb-svg").cloneNode(true));
    document.querySelectorAll("template[data-drummer]").forEach(t => slot.appendChild(t.content.firstElementChild.cloneNode(true)));

    const miniBtn = $("#bbBtn"), bigBtn = $("#bsBtn"), bubble = $("#bbBubble"), list = $("#bsList");
    const eq = $("#bsEq"); for (let i = 0; i < 18; i++) eq.appendChild(document.createElement("i"));
    const bars = [...eq.children];
    let songs = (B.songs || []).filter(s => s.file);
    let cur = 0, ctx = null, analyser, master, freq, mode = null, playing = false;
    const audio = new Audio(); audio.preload = "none";
    let mediaSrc = null, synthTimer = null, nextT = 0, step = 0, lastHit = 0, avg = 0, side = 0, synthStart = 0, stageVisible = true;

    function renderList() {
      list.innerHTML = songs.map((s, i) => `<li class="${i === cur ? "on" : ""}"><button data-song="${i}"><i>${i === cur && playing ? "⏸" : i + 1}</i>
        <span><b>${s.title}</b><br><span>${s.artist || ""}</span></span></button></li>`).join("")
        || `<li class="on"><button data-song="-1"><i>${playing ? "⏸" : "▶"}</i><span><b>${B.demoTitle || "ബാൻഡ് താളം"}</b><br><span>ഡെമോ താളം</span></span></button></li>`;
    }
    function setTitle() {
      const s = mode === "synth" || !songs.length ? { title: B.demoTitle || "ബാൻഡ് താളം", artist: "ഡെമോ താളം" } : songs[cur];
      $("#bsTitle").textContent = s.title; $("#bsArtist").textContent = s.artist || "";
      $("#bbTitle").textContent = `🎵 ${s.title}${s.artist ? " · " + s.artist : ""}`;
    }
    bubble.textContent = B.hint || "🎺 തൊട്ടാൽ ബാൻഡ് മേളം!";

    function ensureCtx() {
      if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; ctx = new AC();
        analyser = ctx.createAnalyser(); analyser.fftSize = 512; analyser.smoothingTimeConstant = .6; freq = new Uint8Array(analyser.frequencyBinCount);
        analyser.connect(ctx.destination); }
      if (ctx.state === "suspended") ctx.resume();
    }
    function hit(strong) {
      side ^= 1;
      document.querySelectorAll(side ? ".bb-svg .armR" : ".bb-svg .armL").forEach(a => { a.classList.add("hit"); setTimeout(() => a.classList.remove("hit"), 110); });
      if (strong) document.querySelectorAll(".bb-svg .bb-drum").forEach(d => { d.classList.add("boom"); setTimeout(() => d.classList.remove("boom"), 90); });
      if (strong && Math.random() < .45) note();
      if (stageVisible && (++hitCount % 8 === 0 || (strong && Math.random() < .3))) confetti();
    }
    let hitCount = 0;

    /* fireworks: tap anywhere on the band stage → a rocket rises and bursts there */
    {
      const box = stageSec.querySelector(".bandstage"), cv = document.createElement("canvas"), g = cv.getContext("2d");
      cv.className = "bs-fireworks"; cv.setAttribute("aria-hidden", "true"); box.appendChild(cv);
      const COLS = ["#ffd60a", "#ff3b5c", "#2ec4ff", "#7cff6b", "#ff8fd1", "#ffffff", "#ff9f1c"];
      let parts = [], rockets = [], running = false, W = 0, H = 0, dpr = 1;
      const size = () => { dpr = Math.min(2, window.devicePixelRatio || 1); W = box.clientWidth; H = box.clientHeight;
        cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
      function burst(x, y) {
        const c1 = COLS[Math.floor(Math.random() * COLS.length)], c2 = COLS[Math.floor(Math.random() * COLS.length)], n = 60;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + Math.random() * .1, sp = 2.6 + Math.random() * 3;
          parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: .009 + Math.random() * .008, col: i % 3 ? c1 : c2, r: 2.8 });
        }
        for (let i = 0; i < 14; i++) parts.push({ x, y, vx: (Math.random() - .5) * 3, vy: (Math.random() - .5) * 3, life: 1, decay: .02, col: "#fff6c8", r: 1.3, tw: 1 });
      }
      function launch(x, y) {
        rockets.push({ x: x + (Math.random() * 30 - 15), y: H, tx: x, ty: y, col: COLS[Math.floor(Math.random() * COLS.length)] });
        if (!running) { running = true; requestAnimationFrame(tick); }
      }
      function tick() {
        g.globalCompositeOperation = "source-over"; g.clearRect(0, 0, W, H); g.globalCompositeOperation = "lighter";
        rockets = rockets.filter(r => {
          r.x += (r.tx - r.x) * .14; r.y += (r.ty - r.y) * .14;
          g.fillStyle = r.col; g.beginPath(); g.arc(r.x, r.y, 2.6, 0, 7); g.fill();
          g.fillStyle = "rgba(255,220,150,.5)"; g.beginPath(); g.arc(r.x, r.y + 8, 1.6, 0, 7); g.fill();
          if (Math.abs(r.y - r.ty) < 4) { burst(r.tx, r.ty); return false; } return true;
        });
        parts = parts.filter(p => {
          p.vx *= .985; p.vy = p.vy * .985 + .05; p.x += p.vx; p.y += p.vy; p.life -= p.decay;
          if (p.life <= 0) return false;
          g.globalAlpha = p.tw ? p.life * (Math.random() > .5 ? 1 : .3) : p.life;
          g.fillStyle = p.col; g.beginPath(); g.arc(p.x, p.y, p.r * (.6 + p.life * .6), 0, 7); g.fill();
          return true;
        });
        g.globalAlpha = 1;
        if (parts.length || rockets.length) requestAnimationFrame(tick); else { running = false; g.clearRect(0, 0, W, H); }
      }
      box.addEventListener("pointerdown", e => {
        if (calm || e.target.closest(".bs-ctrl, .bs-list")) return;
        if (!W || W !== box.clientWidth || H !== box.clientHeight) size();
        const b = box.getBoundingClientRect(); launch(e.clientX - b.left, e.clientY - b.top);
      });
      window.addEventListener("resize", () => { W = 0; });
    }
    /* stage confetti like the perunnal band set */
    const CONF = ["#ff3b5c", "#ffd60a", "#2ec4ff", "#7cff6b", "#ff8fd1", "#ffffff"];
    const calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    function confetti() {
      if (calm || bigBtn.querySelectorAll(".bs-confetti").length > 40) return;
      const fall = bigBtn.clientHeight * .85;
      for (let i = 0; i < 7; i++) {
        const c = document.createElement("span"), t = 1.2 + Math.random() * .8;
        c.className = "bs-confetti"; c.style.left = (5 + Math.random() * 90) + "%"; c.style.background = CONF[i % CONF.length];
        c.style.setProperty("--fall", fall + "px"); c.style.setProperty("--dx", (Math.random() * 50 - 25) + "px");
        c.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg"); c.style.setProperty("--t", t + "s");
        bigBtn.appendChild(c); setTimeout(() => c.remove(), t * 1000);
      }
    }
    const NOTES = ["♪", "♫", "🎵", "🥁", "🎺"];
    function note() {
      const host = stageVisible ? bigBtn : $("#bbNotes"), n = document.createElement("span");
      n.className = "bs-note"; n.textContent = NOTES[Math.floor(Math.random() * NOTES.length)];
      n.style.left = (stageVisible ? 15 + Math.random() * 70 : 0) + "%"; n.style.top = stageVisible ? "25%" : "0";
      n.style.setProperty("--dx", (Math.random() * 60 - 30) + "px"); n.style.setProperty("--rot", (Math.random() * 50 - 25) + "deg");
      host.appendChild(n); setTimeout(() => n.remove(), 1600);
    }
    function setUI() {
      [bot, bigBtn, stageSec.querySelector(".bandstage")].forEach(el => el.classList.toggle("is-playing", playing));
      [miniBtn, bigBtn].forEach(b => b.setAttribute("aria-pressed", playing));
      $("#bbState").textContent = playing ? "⏸" : "▶"; $("#bsPlay").textContent = playing ? "⏸" : "▶";
      $("#bsCta").textContent = playing ? "⏸ നിർത്താൻ തൊടുക" : "▶ തൊടുക";
      if (playing) { bubble.classList.add("hide"); window.dispatchEvent(new CustomEvent("kp:audio", { detail: "band" })); }
      renderList(); setTitle(); updateBot();
    }
    const setProg = p => { miniBtn.style.setProperty("--p", p); $("#bsProg").style.width = (p * 100) + "%"; };
    (function frame() {
      requestAnimationFrame(frame);
      if (!playing || !analyser) return;
      analyser.getByteFrequencyData(freq);
      for (let i = 0; i < bars.length; i++) bars[i].style.height = Math.max(8, freq[2 + i * 5] / 255 * 100) + "%";
      if (mode === "file") {
        let low = 0; for (let i = 1; i <= 6; i++) low += freq[i]; low /= 6;
        const now = performance.now();
        let mid = 0; for (let i = 8; i <= 30; i++) mid += freq[i]; mid /= 23;
        const energy = low * .6 + mid * .4;
        if ((energy > avg * 1.04 && energy > 55 && now - lastHit > 150) || (energy > 40 && now - lastHit > 420)) { lastHit = now; hit(energy > avg * 1.15); }
        avg = avg * .9 + energy * .1;
        setProg(audio.duration ? audio.currentTime / audio.duration : 0);
      } else setProg(((ctx.currentTime - synthStart) % 32) / 32);
    })();

    /* original band rhythm generated in the browser (used when no song file loads) */
    const BPM = 116, S16 = 60 / BPM / 4;
    let noiseBuf = null;
    const noise = () => { if (noiseBuf) return noiseBuf; noiseBuf = ctx.createBuffer(1, ctx.sampleRate * .5, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return noiseBuf; };
    const env = (g, t, a, peak, dec) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); };
    function kick(t) { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + .14);
      env(g, t, .002, .95, .22); o.connect(g).connect(master); o.start(t); o.stop(t + .3); }
    function snare(t, v = .5) { const n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); n.buffer = noise(); f.type = "highpass"; f.frequency.value = 1400;
      env(g, t, .002, v, .14); n.connect(f).connect(g).connect(master); n.start(t); n.stop(t + .2);
      const o = ctx.createOscillator(), g2 = ctx.createGain(); o.type = "triangle"; o.frequency.value = 185; env(g2, t, .002, v * .5, .08); o.connect(g2).connect(master); o.start(t); o.stop(t + .12); }
    function hat(t, v = .12) { const n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); n.buffer = noise(); f.type = "highpass"; f.frequency.value = 7500;
      env(g, t, .001, v, .035); n.connect(f).connect(g).connect(master); n.start(t); n.stop(t + .06); }
    const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
    function brass(t, m, len, v = .16) { const f = ctx.createBiquadFilter(), g = ctx.createGain(); f.type = "lowpass"; f.frequency.setValueAtTime(900, t); f.frequency.linearRampToValueAtTime(2600, t + .06);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .03); g.gain.setValueAtTime(v, t + len * .75); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      [0, 7].forEach(dt => { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = mtof(m); o.detune.value = dt; o.connect(f); o.start(t); o.stop(t + len + .02); });
      f.connect(g).connect(master); }
    function tuba(t, m, len) { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "triangle"; o.frequency.value = mtof(m); env(g, t, .01, .35, len); o.connect(g).connect(master); o.start(t); o.stop(t + len + .05); }
    const RIFF = [[[0,62,2],[2,66,2],[4,69,4],[8,71,2],[10,69,2],[12,66,4]], [[0,67,2],[2,66,2],[4,64,2],[6,62,2],[8,64,6],[14,66,2]],
                  [[0,62,2],[2,66,2],[4,69,4],[8,74,2],[10,71,2],[12,69,4]], [[0,71,2],[2,69,2],[4,67,2],[6,66,2],[8,64,2],[10,62,6]]];
    const BASS = [50, 43, 50, 45];
    function scheduleStep(s, t) {
      const bar = Math.floor(s / 16) % 4, i = s % 16;
      if (i % 2 === 0) hat(t, i % 4 === 0 ? .14 : .08);
      let strong = false;
      if (i === 0 || i === 8 || (i === 10 && bar % 2)) { kick(t); strong = true; }
      if (i === 4 || i === 12) { snare(t); strong = true; }
      if (bar === 3 && i >= 13) snare(t, .32);
      if (i === 0 || i === 8) tuba(t, BASS[bar] - 12 + (i === 8 ? 7 : 0), S16 * 6);
      RIFF[bar].forEach(([st, m, l]) => { if (st === i) brass(t, m, l * S16 * .95); });
      if (strong || i % 4 === 2) setTimeout(() => playing && mode === "synth" && hit(strong), Math.max(0, (t - ctx.currentTime) * 1000));
    }
    function startSynth() {
      mode = "synth"; ensureCtx();
      master = ctx.createGain(); master.gain.value = .7; master.connect(analyser);
      nextT = ctx.currentTime + .06; synthStart = nextT; step = 0;
      synthTimer = setInterval(() => { while (nextT < ctx.currentTime + .14) { scheduleStep(step, nextT); nextT += S16; step++; } }, 25);
    }
    function stopSynth() { clearInterval(synthTimer); synthTimer = null;
      if (master) { const m = master; m.gain.setTargetAtTime(0, ctx.currentTime, .03); setTimeout(() => m.disconnect(), 300); master = null; } }

    audio.addEventListener("ended", () => { if (songs.length > 1) playSong((cur + 1) % songs.length); else { playing = false; setProg(0); setUI(); } });

    async function playSong(i) {
      ensureCtx(); if (mode === "synth") stopSynth();
      playing = true;
      if (!songs.length) { setUI(); startSynth(); setUI(); return; }
      cur = (i + songs.length) % songs.length; setUI();
      const s = songs[cur];
      if (!audio.src.endsWith(s.file)) { audio.src = s.file; audio.currentTime = 0; avg = 0; }
      try {
        if (!mediaSrc) { mediaSrc = ctx.createMediaElementSource(audio); mediaSrc.connect(analyser); }
        await audio.play(); mode = "file";
        if (!playing) { audio.pause(); return; }   // stopped (scrolled away / another section's sound) while the song was still loading
        setUI();
      } catch (e) {
        if (!playing) return;                    // paused while loading
        if (e && e.name === "NotAllowedError") { playing = false; setUI(); return; }   // browser blocked sound, keep the song
        songs.splice(cur, 1);                    // file missing → drop it, try the next, else demo beat
        if (songs.length) playSong(cur); else { mode = null; startSynth(); setUI(); }
      }
    }
    function pause() { playing = false; audio.pause(); if (mode === "synth") stopSynth();
      bars.forEach(b => b.style.height = "12%"); setUI(); }
    // only one sound on the page at a time: the band song stops when amittu is fired, and silences amittu when it starts
    window.addEventListener("kp:audio", e => { if (e.detail !== "band" && playing) pause(); });
    const toggle = () => playing ? pause(): (mode === "synth" ? (playing = true, startSynth(), setUI()) : playSong(cur));
    [miniBtn, bigBtn, $("#bsPlay")].forEach(b => b.addEventListener("click", toggle));
    $("#bsNext").addEventListener("click", () => songs.length > 1 ? playSong(cur + 1) : toggle());
    $("#bsPrev").addEventListener("click", () => songs.length > 1 ? playSong(cur - 1) : toggle());
    list.addEventListener("click", e => { const b = e.target.closest("[data-song]"); if (!b) return; const i = +b.dataset.song;
      if (i < 0 || (i === cur && playing)) toggle(); else playSong(i); });
    document.addEventListener("click", e => { if (e.target.closest("[data-band-toggle]")) toggle(); });

    // live site: hide songs whose file isn't uploaded
    songs.forEach(s => fetch(s.file, { method: "HEAD", cache: "no-store" }).then(r => { if (!r.ok) throw 0; }).catch(() => {
      if (playing) return; const k = songs.indexOf(s); if (k >= 0) { songs.splice(k, 1); if (cur >= songs.length) cur = 0; renderList(); setTitle(); } }));

    function updateBot() { bot.classList.toggle("away", stageVisible); }
    new IntersectionObserver(es => { stageVisible = es[0].isIntersecting; updateBot(); }, { threshold: .3 }).observe(bigBtn);
    // each section plays on its own: the band song starts when the band stage scrolls into view and stops when it leaves
    let autoOn = false, autoWant = true;
    new IntersectionObserver(es => {
      const vis = es[0].isIntersecting;
      if (vis && autoWant && !playing) { autoOn = true; mode === "synth" ? (playing = true, startSynth(), setUI()) : playSong(cur); }
      else if (!vis) { if (playing) pause(); autoOn = false; autoWant = true; }
    }, { rootMargin: "-40% 0px -40% 0px" }).observe(stageSec.querySelector(".bandstage"));
    [bigBtn, $("#bsPlay")].forEach(b => b.addEventListener("click", () => { if (!playing) autoWant = false; }));   // a manual pause sticks while you stay here
    setTimeout(() => bubble.classList.add("hide"), 9000);
    renderList(); setTitle();
  }
}

/* ---------- nav, reveal ---------- */
$("#menuBtn").onclick = () => $("#links").classList.toggle("open");
$("#links").onclick = e => { if (e.target.tagName === "A") $("#links").classList.remove("open"); };
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .1 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ---------- background sparks ---------- */
{
  const c = $("#sparks"), x = c.getContext("2d"); let W, H; const P = [];
  const cols = ["#ffcf4a", "#ff3b5c", "#5ec8ff", "#22c55e", "#e4167f"];
  const rs = () => { W = c.width = innerWidth; H = c.height = innerHeight; }; rs(); addEventListener("resize", rs);
  for (let i = 0; i < 46; i++) P.push({ x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2.2, v: .0004 + Math.random() * .0012, c: cols[i % 5], p: Math.random() * 6 });
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  (function loop(t) {
    x.clearRect(0, 0, W, H);
    for (const p of P) { p.y -= p.v; if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); }
      x.globalAlpha = .35 + .35 * Math.sin(t / 600 + p.p); x.fillStyle = p.c; x.shadowColor = p.c; x.shadowBlur = 10;
      x.beginPath(); x.arc(p.x * W, p.y * H, p.r, 0, 7); x.fill(); }
    if (!reduce) requestAnimationFrame(loop);
  })(0);
}


/* =====================================================================
   THREE.JS — 3D church + 3D Kottapadi map
   ===================================================================== */
let MAP = null;
if (!window.THREE || !(() => { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl") || c.getContext("experimental-webgl")); } catch (e) { return false; } })()) {
  document.querySelectorAll(".fallback").forEach(f => f.style.display = "grid"); return;
}
const V3 = THREE.Vector3;
const PALETTE = ["#ff3b5c", "#ffd60a", "#22c55e", "#3b82f6", "#e4167f", "#ff8a00", "#5ec8ff", "#ffffff"].map(c => new THREE.Color(c));
const dotTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.25, "rgba(255,255,255,.9)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
const M = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .75, metalness: 0 }, o));

function orbit(canvas, cam, o) {
  const st = Object.assign({ theta: .6, phi: 1.1, r: 50, minR: 15, maxR: 140, minPhi: .25, maxPhi: 1.45, target: new V3() }, o);
  const ptrs = new Map(); let pinch = 0;
  canvas.addEventListener("pointerdown", e => { ptrs.set(e.pointerId, [e.clientX, e.clientY]); st.user = performance.now(); });
  canvas.addEventListener("pointermove", e => {
    if (!ptrs.has(e.pointerId)) return; const [px, py] = ptrs.get(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.size === 1) { st.theta -= (e.clientX - px) * .008; if (e.pointerType === "mouse") st.phi = Math.min(st.maxPhi, Math.max(st.minPhi, st.phi - (e.clientY - py) * .006)); }
    else if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) st.r = Math.min(st.maxR, Math.max(st.minR, st.r * pinch / d)); pinch = d; }
    st.user = performance.now();
  });
  const up = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = 0; };
  ["pointerup", "pointercancel", "pointerleave"].forEach(n => canvas.addEventListener(n, up));
  canvas.addEventListener("wheel", e => { e.preventDefault(); st.r = Math.min(st.maxR, Math.max(st.minR, st.r * (1 + e.deltaY * .001))); st.user = performance.now(); }, { passive: false });
  st.apply = () => { const t = st.target; cam.position.set(t.x + st.r * Math.sin(st.phi) * Math.sin(st.theta), t.y + st.r * Math.cos(st.phi), t.z + st.r * Math.sin(st.phi) * Math.cos(st.theta)); cam.lookAt(t); };
  return st;
}
function stage(el) {
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.outputEncoding = THREE.sRGBEncoding;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  el.prepend(r.domElement);
  const cam = new THREE.PerspectiveCamera(45, 1, .5, 1000);
  const fit = () => { const w = el.clientWidth, h = el.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  new ResizeObserver(fit).observe(el); fit();
  let visible = false; new IntersectionObserver(es => visible = es[0].isIntersecting).observe(el);
  return { r, cam, el, get visible() { return visible; } };
}

/* ---------- church model ---------- */
function buildChurch(pointSize) {
  const g = new THREE.Group(), pts = [], grp = [];
  const white = M(0xf5f2ea), trim = M(0xe3dacb), roof = M(0xcf6a3f, { roughness: .85 }), gold = M(0xd9b45a, { metalness: .75, roughness: .3 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x24345e, emissive: 0xffb347, emissiveIntensity: 0, roughness: .3 });
  const add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
  const box = (w, h, d, mat, x, y, z) => add(new THREE.BoxGeometry(w, h, d), mat, x, y, z);
  const cyl = (rt, rb, h, s, mat, x, y, z) => add(new THREE.CylinderGeometry(rt, rb, h, s), mat, x, y, z);
  const gable = (w, h, d, mat, x, y, z) => { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }); geo.translate(0, 0, -d / 2); return add(geo, mat, x, y, z); };
  const cross = (x, y, z, s, mat) => { box(.28 * s, 2.2 * s, .28 * s, mat, x, y + 1.1 * s, z); box(1.3 * s, .28 * s, .28 * s, mat, x, y + 1.45 * s, z);
    seg([x, y, z + .2], [x, y + 2.2 * s, z + .2], 9); seg([x - .65 * s, y + 1.45 * s, z + .2], [x + .65 * s, y + 1.45 * s, z + .2], 9); };
  let gi = 0;
  function seg(a, b, gid = gi) { const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), n = Math.max(2, Math.round(d / .38));
    for (let i = 0; i <= n; i++) { const t = i / n; pts.push(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t); grp.push(gid); } }
  function ring(cx, y, cz, r, n = 40, gid = gi) { for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; pts.push(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r); grp.push(gid); } }

  box(19, .6, 32, M(0xcbbca6), 0, .3, 0);
  box(16.4, 4.6, 20, white, 0, 2.9, -2); gable(17.4, 1.8, 21, roof, 0, 5.2, -2);
  box(10, 8, 25, white, 0, 4.6, -.5); gable(11.4, 3.4, 26, roof, 0, 8.6, -.5);
  box(13.2, 11, 1.6, white, 0, 6.1, 12.4); gable(14, 3.6, 2, white, 0, 11.6, 12.4); box(14.4, .5, 2.4, trim, 0, 11.6, 12.4);
  [-4.6, -3.2, -1.2, 1.2, 3.2, 4.6].forEach(x => cyl(.32, .38, 9.6, 14, white, x, 5.4, 15));
  box(11, .9, 3.4, trim, 0, 10.6, 14.6);
  [[14.5, .45, 16.6], [15, .25, 17.6], [15.5, .1, 18.6]].forEach(([w, y, z]) => box(w, .3, 1.1, M(0xd8cfc0), 0, y, z));
  box(2.4, 3.8, .2, M(0x6b3d1f), 0, 2.5, 13.25);
  [-2.6, 2.6].forEach(x => box(1.3, 2.8, .2, M(0x6b3d1f), x, 2.2, 13.25));
  [-3, 0, 3].forEach(x => box(1.2, 2, .15, glass, x, 7.6, 13.25));
  box(.9, 1.6, .15, glass, 0, 13, 13.45);
  for (const z of [-10, -6, -2, 2, 6]) for (const s of [-1, 1]) { box(.15, 2.2, 1.1, glass, s * 5.05, 7, z); box(.15, 2, 1.3, glass, s * 8.25, 3, z - 1); }
  // towers
  for (const s of [-1, 1]) { const x = s * 7.7, z = 12.2;
    cyl(1.7, 1.95, 15, 8, white, x, 8.1, z).rotation.y = Math.PI / 8;
    [5, 10, 15.4].forEach(y => cyl(2.05, 2.05, .35, 8, trim, x, y, z).rotation.y = Math.PI / 8);
    cyl(1.3, 1.3, 2.2, 8, white, x, 16.7, z); box(.15, 1.2, .7, glass, x + s * 0, 16.7, z + 1.3);
    add(new THREE.SphereGeometry(1.45, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), gold, x, 17.8, z);
    [1, 2, 3].forEach(k => box(.15, 1.8, .8, glass, x, 3 + k * 3.6, z + 1.75));
    gi = 1; for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4 + Math.PI / 8; seg([x + Math.cos(a) * 1.98, .6, z + Math.sin(a) * 1.98], [x + Math.cos(a) * 1.75, 15.4, z + Math.sin(a) * 1.75], 1 + k % 2); }
    gi = 3; [5, 10, 15.4, 17.8].forEach(y => ring(x, y, z, y > 17 ? 1.5 : 2.1, 30, 3));
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; for (let i = 0; i <= 6; i++) { const t = i / 6 * Math.PI / 2; pts.push(x + Math.cos(a) * Math.cos(t) * 1.5, 17.8 + Math.sin(t) * 1.5, z + Math.sin(a) * Math.cos(t) * 1.5); grp.push(4); } }
    gi = 5; cross(x, 19.2, z, .7, gold); }
  // dome
  cyl(3.5, 3.5, 3.2, 24, white, 0, 12.6, -8); cyl(3.8, 3.8, .4, 24, trim, 0, 14.2, -8);
  add(new THREE.SphereGeometry(3.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), gold, 0, 14.2, -8);
  cyl(.7, .7, 1.4, 10, white, 0, 18.3, -8); add(new THREE.SphereGeometry(.75, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), gold, 0, 19, -8);
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; box(.12, 1.3, .7, glass, Math.cos(a) * 3.55, 12.6, -8 + Math.sin(a) * 3.55).rotation.y = -a + Math.PI / 2; }
  gi = 6; ring(0, 14.25, -8, 3.85, 60, 6); ring(0, 11, -8, 3.6, 56, 7);
  for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8; for (let i = 0; i <= 12; i++) { const t = i / 12 * Math.PI / 2; pts.push(Math.cos(a) * Math.cos(t) * 3.6, 14.2 + Math.sin(t) * 3.6, -8 + Math.sin(a) * Math.cos(t) * 3.6); grp.push(k % 2 ? 0 : 1); } }
  cross(0, 19.6, -8, 1, gold); cross(0, 15.2, 12.4, 1.1, M(0xffffff));
  // light strings: facade, pediment, roofs, columns
  gi = 0; seg([-6.6, .6, 13.3], [-6.6, 11.6, 13.3]); seg([6.6, .6, 13.3], [6.6, 11.6, 13.3]); seg([-7.2, 11.8, 13.5], [7.2, 11.8, 13.5], 2);
  seg([-7, 11.8, 13.5], [0, 15.4, 13.5], 4); seg([0, 15.4, 13.5], [7, 11.8, 13.5], 4);
  seg([-5.5, 11.1, 16.35], [5.5, 11.1, 16.35], 5);
  [-4.6, -3.2, -1.2, 1.2, 3.2, 4.6].forEach((x, i) => seg([x, .6, 15.42], [x, 10.1, 15.42], 1 + i % 3));
  for (const s of [-1, 1]) { seg([s * 5.75, 8.65, -13.5], [s * 5.75, 8.65, 11.5], 3); seg([s * 5.75, 8.65, -13.5], [0, 12, -13.5], 6);
    seg([s * 8.75, 5.25, -12.5], [s * 8.75, 5.25, 8.5], 5); seg([s * 8.3, .6, 8.1], [s * 8.3, 5.2, 8.1], 2); seg([s * 8.3, .6, -12.1], [s * 8.3, 5.2, -12.1], 2); }
  seg([0, 12.05, -13.5], [0, 12.05, 11.5], 7);
  for (let k = 0; k < 6; k++) { const y = 1.6 + k * 1.6; seg([-6.6, y, 13.3], [-5.2, y, 13.3], k); seg([5.2, y, 13.3], [6.6, y, 13.3], k); }

  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  const col = new Float32Array(pts.length); geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const lights = new THREE.Points(geo, new THREE.PointsMaterial({ size: pointSize, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  g.add(lights);
  const n = grp.length;
  function animate(t, mode = "multi") {
    const c = geo.attributes.color.array;
    for (let i = 0; i < n; i++) {
      let C, k = 1;
      if (mode === "gold") { C = PALETTE[1]; k = .55 + .45 * Math.sin(t * 3 + i * .7); }
      else { C = PALETTE[(grp[i] + Math.floor(t * 1.5 + i * .02)) % PALETTE.length]; k = .7 + .3 * Math.sin(t * 6 - i * .3); }
      c[i * 3] = C.r * k; c[i * 3 + 1] = C.g * k; c[i * 3 + 2] = C.b * k;
    }
    geo.attributes.color.needsUpdate = true;
  }
  return { group: g, lights, glass, animate };
}
function palm(scene, x, z, h, mat) {
  const p = new THREE.Group(); const tr = new THREE.Mesh(new THREE.CylinderGeometry(.18, .3, h, 6), mat.trunk); tr.position.y = h / 2; p.add(tr);
  for (let k = 0; k < 7; k++) { const l = new THREE.Mesh(new THREE.ConeGeometry(.5, 4, 4), mat.leaf); l.position.set(0, h, 0);
    l.rotation.set(1.9, k / 7 * Math.PI * 2, 0, "YXZ"); l.translateY(2); p.add(l); }
  p.position.set(x, 0, z); p.rotation.z = (Math.random() - .5) * .2; p.castShadow = true; scene.add(p); return p;
}

/* ---------- 3D CHURCH SCENE ---------- */
{
  const S = stage($("#churchStage")), scene = new THREE.Scene();
  const ch = buildChurch(1.05); scene.add(ch.group);
  const grass = new THREE.Mesh(new THREE.CircleGeometry(80, 48), M(0x3d7a33)); grass.rotation.x = -Math.PI / 2; grass.receiveShadow = true; scene.add(grass);
  const yard = new THREE.Mesh(new THREE.CircleGeometry(30, 48), M(0xb0573c)); yard.rotation.x = -Math.PI / 2; yard.position.set(0, .02, 6); yard.receiveShadow = true; scene.add(yard);
  const pm = { trunk: M(0x7a5a3a), leaf: M(0x2f8a3a) };
  for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2 + Math.random() * .2, r = 36 + Math.random() * 26; palm(scene, Math.cos(a) * r, Math.sin(a) * r, 9 + Math.random() * 6, pm); }
  // festival bunting lamps around yard
  const bp = []; for (let i = 0; i < 260; i++) { const a = i / 260 * Math.PI * 2; bp.push(Math.cos(a) * 29, 3.2 + Math.sin(i * .9) * .25, 6 + Math.sin(a) * 29); }
  const bgeo = new THREE.BufferGeometry(); bgeo.setAttribute("position", new THREE.Float32BufferAttribute(bp, 3));
  const bcol = new Float32Array(bp.length); bgeo.setAttribute("color", new THREE.BufferAttribute(bcol, 3));
  const bunt = new THREE.Points(bgeo, new THREE.PointsMaterial({ size: .9, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(bunt);
  const hemi = new THREE.HemisphereLight(0xbfdcff, 0x3d5a2a, .9); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1d6, 1.1); sun.position.set(30, 50, 40); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40 }); scene.add(sun);
  const warm = new THREE.PointLight(0xffa94d, 0, 60); warm.position.set(0, 8, 26); scene.add(warm);
  const O = orbit(S.r.domElement, S.cam, { theta: .55, phi: 1.2, r: 64, minR: 28, maxR: 120, target: new V3(0, 8, 0) });
  if (S.cam.aspect < 1) O.r = Math.min(O.maxR, 64 / Math.max(.5, S.cam.aspect) * .85);
  let night = true, spin = true;
  function setNight(v) { night = v; $("#chNight").classList.toggle("on", v); $("#chDay").classList.toggle("on", !v);
    scene.background = new THREE.Color(v ? 0x090614 : 0x8ec9ff); scene.fog = new THREE.Fog(v ? 0x090614 : 0x8ec9ff, 90, 200);
    hemi.intensity = v ? .22 : .9; sun.intensity = v ? .12 : 1.1; warm.intensity = v ? 1.4 : 0;
    ch.lights.visible = bunt.visible = v; ch.glass.emissiveIntensity = v ? 1.1 : 0; }
  setNight(true);
  $("#chNight").onclick = () => setNight(true); $("#chDay").onclick = () => setNight(false);
  $("#chSpin").onclick = () => { spin = !spin; $("#chSpin").classList.toggle("on", spin); };
  const clock = new THREE.Clock();
  (function loop() { requestAnimationFrame(loop); if (!S.visible) return;
    const t = clock.getElapsedTime();
    if (spin && (!O.user || performance.now() - O.user > 2500)) O.theta += .0025;
    O.apply();
    if (night) { ch.animate(t); for (let i = 0; i < bcol.length / 3; i++) { const C = PALETTE[(i + Math.floor(t * 4)) % 7]; bcol.set([C.r, C.g, C.b], i * 3); } bgeo.attributes.color.needsUpdate = true; }
    S.r.render(scene, S.cam); })();
}


/* ---------- AMITTU backdrop: the real (white) 3D church, only its domes and tower tops peeping up at the bottom,
   floodlit for the night, with LEDs running along its edges — the fireworks get the sky ---------- */
{
  const host = $("#amStage");
  if (host && host.dataset.church === "3d") {   // replaced by the photo sketch (amittu.js); set data-church="3d" to bring it back
    const r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.setClearColor(0x000000, 0);
    r.domElement.className = "am-church3d"; r.domElement.setAttribute("aria-hidden", "true");
    host.insertBefore(r.domElement, host.querySelector(".am-tip"));
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(26, 1, 1, 600);   // long lens: true proportions, little distortion
    const ch = buildChurch(1); ch.lights.visible = false; scene.add(ch.group);
    ch.group.updateMatrixWorld(true);
    // real colours (white walls, tiled roof, gold domes), floodlit warm from the front like on feast night
    scene.add(new THREE.HemisphereLight(0x9fb4ff, 0x2a1830, .55));
    const key = new THREE.DirectionalLight(0xfff0dc, .75); key.position.set(30, 40, 60); scene.add(key);
    const flood = new THREE.PointLight(0xffb070, 1.3, 160); flood.position.set(10, 6, 45); scene.add(flood);
    ch.glass.emissiveIntensity = 1.1;
    const pts = [], grp = [];
    let gid = 0;
    ch.group.children.forEach(m => {
      if (!m.isMesh) return;
      const skip = m.material === ch.glass || (m.material.color && [0x6b3d1f, 0xd8cfc0, 0xcbbca6].includes(m.material.color.getHex()));
      m.castShadow = m.receiveShadow = false;
      m.material = m.material.clone(); Object.assign(m.material, { polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });   // edge LEDs sit in front
      if (skip) return;
      // only the real outline edges (corners, rims, roof lines)
      const e = new THREE.EdgesGeometry(m.geometry, 35), p = e.attributes.position, a = new V3(), b = new V3();
      gid++;
      for (let i = 0; i < p.count; i += 2) {
        a.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld); b.fromBufferAttribute(p, i + 1).applyMatrix4(m.matrixWorld);
        const n = Math.max(1, Math.round(a.distanceTo(b) / .42));
        for (let k = 0; k <= n; k++) { const t = k / n; pts.push(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t); grp.push(gid); }
      }
      e.dispose();
    });
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const col = new Float32Array(pts.length); geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.3, map: dotTex, vertexColors: true, transparent: true, depthWrite: false })));
    const n = grp.length;
    // colours by part, like the real Kottapadi feast decoration: towers yellow/purple/green, front gable purple/blue,
    // columns cyan, domes orange/gold, nave roofs green, side aisles pink/red, crosses white
    const HC = h => new THREE.Color(h), P2 = [];
    for (let i = 0; i < n; i++) {
      const x = pts[i * 3], y = pts[i * 3 + 1], z = pts[i * 3 + 2], ax = Math.abs(x);
      let pair;
      if (y > 18.6) pair = ["#ffffff", "#fff3c8"];                                                   // crosses
      else if (z > 9 && ax > 5.6 && ax < 10) pair = y > 16 ? ["#ff8a1f", "#ffd23f"] : [["#ffd23f", "#a46bff", "#3dff7a"][Math.floor(y / 1.3) % 3], "#a46bff"];   // towers
      else if (z < -3 && y > 10.5) pair = ["#ff8a1f", "#ffd23f"];                                    // big dome
      else if (z > 14) pair = ["#3df2ff", "#ffffff"];                                                // front columns / porch
      else if (z > 11.4 && y > 11.2) pair = ["#8a5cff", "#3d7bff"];                                  // front gable
      else if (z > 11.4) pair = ["#3d7bff", "#ffffff"];                                              // facade
      else if (y > 7.5) pair = ["#3dff7a", "#ffd23f"];                                               // nave roof
      else pair = ["#ff3fb4", "#ff3348"];                                                            // side aisles
      P2.push([HC(pair[0]), HC(pair[1])]);
    }

    // fixed three-quarter view; only the top of the church (roof, towers, domes, crosses) rises into the bottom of the frame
    const fit = () => {
      const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
      r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      const d = Math.max(72, 100 / cam.aspect), half = d * Math.tan(13 * Math.PI / 180);
      view.d = d; view.ty = 3.5 + half;          // y ≈ 3.5 sits on the bottom edge (the crowd covers the lowest part)
    };
    const view = { d: 46, ty: 14 };
    new ResizeObserver(fit).observe(host); fit();
    let visible = false; new IntersectionObserver(es => visible = es[0].isIntersecting).observe(host);
    const clock = new THREE.Clock();
    (function loop() {
      requestAnimationFrame(loop); if (!visible) return;
      const t = clock.getElapsedTime(), th = .62 + Math.sin(t * .15) * .05, ph = 1.5;
      cam.position.set(view.d * Math.sin(ph) * Math.sin(th), view.ty + view.d * Math.cos(ph), view.d * Math.sin(ph) * Math.cos(th) - 2);
      cam.lookAt(0, view.ty, -2);
      // running LEDs: a bright pulse chases along every edge; each part swaps between its two colours every few seconds
      const shift = Math.floor(t / 4);
      for (let i = 0; i < n; i++) {
        const C = P2[i][(grp[i] + shift) % 2], run = ((i - t * 22) % 9 + 9) % 9, k = run < 3 ? 1.15 : .55;
        col[i * 3] = C.r * k; col[i * 3 + 1] = C.g * k; col[i * 3 + 2] = C.b * k;
      }
      geo.attributes.color.needsUpdate = true;
      r.render(scene, cam);
    })();
  }
}


/* ---------- 3D KOTTAPADI MAP (time-driven) ---------- */
{
  const S = stage($("#mapStage")), scene = new THREE.Scene(), labelsEl = $("#mapLabels");
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(280, 280), M(0x3b7a30)); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  for (const [x, z, w, d] of [[-70, -55, 50, 36], [62, -20, 30, 30], [-34, 78, 44, 30], [78, 84, 40, 30]]) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, d), M(0x6aa83a)); p.rotation.x = -Math.PI / 2; p.position.set(x, .02, z); scene.add(p); }
  const ch = buildChurch(.7); ch.group.scale.setScalar(.34); ch.group.position.z = -2; scene.add(ch.group);
  const yard = new THREE.Mesh(new THREE.CircleGeometry(15, 48), M(0xb0573c)); yard.rotation.x = -Math.PI / 2; yard.position.set(0, .05, 0); yard.receiveShadow = true; scene.add(yard);

  const rObjs = {}, samples = [], roadMat = M(0x4a4853, { roughness: .95 }), streetPts = [];
  SAM.forEach((r, ri) => {
    const curve = new THREE.CatmullRomCurve3(r.path.map(([x, z]) => new V3(x, .4, z)), false, "catmullrom", .35);
    const road = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 1.7, 6), roadMat); road.scale.y = .12; road.receiveShadow = true; scene.add(road);
    const gcurve = new THREE.CatmullRomCurve3(r.path.map(([x, z]) => new V3(x, .9, z)), false, "catmullrom", .35);
    const col = new THREE.Color(r.color);
    const glowMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .2 });
    const glow = new THREE.Mesh(new THREE.TubeGeometry(gcurve, 160, .45, 8), glowMat); scene.add(glow);
    for (let i = 0; i <= 200; i++) samples.push(curve.getPoint(i / 200));
    const len = curve.getLength();
    for (let d = 3; d < len - 6; d += 1.6) { const t = d / len, p = curve.getPointAt(t), tg = curve.getTangentAt(t);
      streetPts.push(p.x - tg.z * 2.4, 2.2, p.z + tg.x * 2.4, p.x + tg.z * 2.4, 2.2, p.z - tg.x * 2.4); }
    const mk = new THREE.Group();
    const lead = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 12), new THREE.MeshBasicMaterial({ color: col })); lead.position.y = 1.6; mk.add(lead);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTex, color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); halo.scale.set(10, 10, 1); halo.position.y = 1.6; mk.add(halo);
    const amb = new THREE.Mesh(new THREE.ConeGeometry(.35, 3.2, 6), new THREE.MeshBasicMaterial({ color: 0xffe08a })); amb.position.y = 4.3; mk.add(amb);
    const vala = new THREE.Mesh(new THREE.TorusGeometry(1, .18, 8, 24), new THREE.MeshBasicMaterial({ color: 0xffcf4a })); vala.position.y = 4.4; mk.add(vala);
    scene.add(mk);
    const trail = []; for (let k = 0; k < 8; k++) { const d = new THREE.Mesh(new THREE.SphereGeometry(.42, 8, 6), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 1 - k / 9 })); scene.add(d); trail.push(d); }
    const s = r.path[0];
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, 8, 6), M(0xdddddd)); pole.position.set(s[0], 4, s[1]); scene.add(pole);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide })); flag.position.set(s[0] + 1.6, 7, s[1]); scene.add(flag);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, .3, 24), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .5 })); base.position.set(s[0], .3, s[1]); scene.add(base);
    rObjs[r.id] = { r, curve: gcurve, glow, glowMat, mk, trail, flag, base, ri };
  });
  const sgeo = new THREE.BufferGeometry(); sgeo.setAttribute("position", new THREE.Float32BufferAttribute(streetPts, 3));
  const scol = new Float32Array(streetPts.length); sgeo.setAttribute("color", new THREE.BufferAttribute(scol, 3));
  const street = new THREE.Points(sgeo, new THREE.PointsMaterial({ size: 1.1, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(street);

  // houses + palms, kept off the roads
  const grid = new Map(); for (const p of samples) { const k = Math.round(p.x / 6) + "," + Math.round(p.z / 6); (grid.get(k) || grid.set(k, []).get(k)).push(p); }
  const near = (x, z, d) => { if (Math.hypot(x, z) < 19) return true; const gx = Math.round(x / 6), gz = Math.round(z / 6);
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const p of grid.get((gx + i) + "," + (gz + j)) || []) if (Math.hypot(p.x - x, p.z - z) < d) return true; return false; };
  const rnd = (a, b) => a + Math.random() * (b - a), dummy = new THREE.Object3D();
  const HN = 210, PN = 340;
  const houses = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), M(0xffffff), HN), roofs = new THREE.InstancedMesh(new THREE.ConeGeometry(.78, 1, 4), M(0xb85a32), HN);
  const wallCols = [0xf3efe6, 0xf6e3b4, 0xcfe7f1, 0xe9d3e8, 0xd6efd0, 0xffffff];
  let hi = 0, guard = 0;
  while (hi < HN && guard++ < 8000) { const x = rnd(-125, 125), z = rnd(-125, 125); if (near(x, z, 5)) continue;
    const w = rnd(2.4, 4.2), h = rnd(1.8, 3.2), d = rnd(2.4, 4), ry = Math.round(Math.random()) * Math.PI / 2 + rnd(-.2, .2);
    dummy.position.set(x, h / 2, z); dummy.rotation.set(0, ry, 0); dummy.scale.set(w, h, d); dummy.updateMatrix(); houses.setMatrixAt(hi, dummy.matrix);
    houses.setColorAt(hi, new THREE.Color(wallCols[hi % wallCols.length]));
    dummy.position.set(x, h + .7, z); dummy.rotation.set(0, ry + Math.PI / 4, 0); dummy.scale.set(Math.max(w, d) * 1.05, 1.4, Math.max(w, d) * 1.05); dummy.updateMatrix(); roofs.setMatrixAt(hi, dummy.matrix); hi++; }
  houses.count = roofs.count = hi; houses.castShadow = roofs.castShadow = true; scene.add(houses, roofs);
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(.15, .25, 1, 5), M(0x7a5a3a), PN), crowns = new THREE.InstancedMesh(new THREE.ConeGeometry(1, 1, 7), M(0x2f8a3a), PN);
  let pi = 0; guard = 0;
  while (pi < PN && guard++ < 9000) { const x = rnd(-135, 135), z = rnd(-135, 135); if (near(x, z, 3.2)) continue; const h = rnd(5, 9), tilt = rnd(-.15, .15);
    dummy.position.set(x, h / 2, z); dummy.rotation.set(tilt, 0, tilt); dummy.scale.set(1, h, 1); dummy.updateMatrix(); trunks.setMatrixAt(pi, dummy.matrix);
    dummy.position.set(x + tilt * h * .5, h, z - tilt * h * .5); dummy.rotation.set(Math.PI, rnd(0, 3), 0); dummy.scale.set(2.6, 1.2, 2.6); dummy.updateMatrix(); crowns.setMatrixAt(pi, dummy.matrix); pi++; }
  trunks.count = crowns.count = pi; crowns.castShadow = true; scene.add(trunks, crowns);

  const hemi = new THREE.HemisphereLight(0xbfdcff, 0x2d4a22, .9); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1d6, 1); sun.position.set(60, 100, 50); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -140, right: 140, top: 140, bottom: -140, far: 320 }); scene.add(sun);

  // labels
  const labels = [];
  const label = (txt, pos, cls, color, id) => { const el = document.createElement("div"); el.className = "lb " + (cls || ""); el.textContent = txt; if (color) el.style.setProperty("--c", color);
    labelsEl.appendChild(el); const o = { el, pos, id }; labels.push(o); return o; };
  label("⛪ " + F.churchName, new V3(0, 9, -2), "church");
  SAM.forEach(r => { label(`${r.no}. ${r.name}`, new V3(r.path[0][0], 9, r.path[0][1]), "", r.color, r.id); });

  const O = orbit(S.r.domElement, S.cam, { theta: .25, phi: .82, r: 210, minR: 30, maxR: 290, maxPhi: 1.35, target: new V3(0, 0, 0) });
  let goal = { target: new V3(0, 0, 0), r: 210 }, follow = false, night = false, sel = "all";
  function setNight(v) { night = v; $("#mapNight").classList.toggle("on", v); $("#mapNight").textContent = v ? "☀️ പകൽ" : "🌙 രാത്രി";
    scene.background = new THREE.Color(v ? 0x0a0818 : 0x9fd2ff); scene.fog = new THREE.Fog(v ? 0x0a0818 : 0x9fd2ff, 230, 460);
    hemi.intensity = v ? .32 : .95; sun.intensity = v ? .15 : 1; street.visible = ch.lights.visible = v; ch.glass.emissiveIntensity = v ? 1.2 : 0; }
  $("#mapNight").onclick = () => setNight(!night);
  $("#mapFollow").onclick = () => { follow = !follow; $("#mapFollow").classList.toggle("on", follow); if (!follow) frame(); };
  function frame() {
    if (sel === "all") { goal.target = new V3(0, 0, 0); goal.r = S.cam.aspect < 1 ? 270 : 210; return; }
    const b = new THREE.Box3(); rObjs[sel].r.path.forEach(([x, z]) => b.expandByPoint(new V3(x, 0, z))); const s = b.getSize(new V3());
    goal.target = b.getCenter(new V3()); goal.r = Math.max(80, Math.max(s.x, s.z) * 1.7);
  }
  MAP = { select(id) { sel = id; frame(); } };
  setNight(simT >= 18 * 60);

  const clock = new THREE.Clock(), v = new V3();
  (function loop() { requestAnimationFrame(loop); if (!S.visible) return;
    const t = clock.getElapsedTime();
    if (!night && simT >= 18 * 60 + 30 && playing) setNight(true); else if (night && simT < 18 * 60 && playing) setNight(false);
    for (const id in rObjs) { const o = rObjs[id], r = o.r;
      const active = simT >= r.from && simT <= r.to, chosen = sel === "all" || sel === id;
      const show = active && chosen;
      o.glowMat.opacity = sel === id ? 1 : chosen ? (active ? .9 : .14) : .06;
      o.mk.visible = show; o.trail.forEach(d => d.visible = show);
      o.flag.visible = o.base.visible = chosen; o.base.material.opacity = active ? .5 + .3 * Math.sin(t * 4) : .25;
      if (show) { const u = Math.min(1, (simT - r.from) / Math.max(1, r.to - r.from));
        o.mk.position.copy(o.curve.getPointAt(u)).setY(0); o.mk.children[2].rotation.y = t * 2; o.mk.children[3].rotation.y = t * 1.5;
        o.mk.children[1].material.opacity = .6 + .4 * Math.sin(t * 5 + o.ri);
        o.trail.forEach((d, k) => d.position.copy(o.curve.getPointAt(Math.max(0, u - (k + 1) * .012))).setY(1.2));
        if (follow && sel === id) { goal.target = o.mk.position.clone(); goal.r = 60; } }
      o.flag.rotation.y = Math.sin(t * 2 + o.ri) * .3; }
    if (follow && sel === "all") { const a = activeAt(simT)[0]; if (a) { goal.target = rObjs[a.id].mk.position.clone(); goal.r = 80; } }
    O.target.lerp(goal.target, .05);
    if (O.user && performance.now() - O.user < 1500) goal.r = O.r; else O.r += (goal.r - O.r) * .05;
    if (!O.user || performance.now() - O.user > 4000) O.theta += .0006;
    O.apply();
    if (night) { ch.animate(t, "multi"); for (let i = 0; i < scol.length / 3; i++) { const C = PALETTE[(Math.floor(i / 2) + Math.floor(t * 3)) % 7]; scol[i * 3] = C.r; scol[i * 3 + 1] = C.g; scol[i * 3 + 2] = C.b; } sgeo.attributes.color.needsUpdate = true; }
    S.r.render(scene, S.cam);
    const w = S.el.clientWidth, h = S.el.clientHeight;
    for (const l of labels) { let show = true;
      if (l.id) { const r = rObjs[l.id].r; show = sel === l.id || (sel === "all" && simT >= r.from && simT <= r.to); }
      if (!show) { l.el.style.opacity = 0; continue; } v.copy(l.pos).project(S.cam);
      if (v.z > 1) { l.el.style.opacity = 0; continue; } l.el.style.opacity = 1; l.el.style.left = ((v.x + 1) / 2 * w) + "px"; l.el.style.top = ((1 - v.y) / 2 * h) + "px"; }
  })();
}
})();
