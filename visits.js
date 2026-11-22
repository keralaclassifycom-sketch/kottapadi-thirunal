/* ---------- visitor counter (bottom of the page) ----------
   Uses the free Abacus counter service (abacus.jasoncameron.dev) — no account, no personal data sent.
   total: +1 the first time a browser opens the site (reloads don't count again)
   online now: every open tab checks in once a minute; the count is how many checked in during the last minute or two */
(() => {
  const el = document.getElementById("visits"); if (!el) return;
  const API = "https://abacus.jasoncameron.dev", NS = /^(localhost|127.0.0.1)$/.test(location.hostname) ? "kottapadi-thirunal-test" : "kottapadi-thirunal-2027";   // local testing never touches the real count
  const totalEl = el.querySelector("[data-v=total]"), nowEl = el.querySelector("[data-v=now]");
  const BEFORE = 120;   // visitors before the counter was added (the count starts from here)
  const fmt = n => Number(n).toLocaleString("en-IN");
  const get = path => fetch(API + path).then(r => r.ok ? r.json() : null).then(j => j && typeof j.value === "number" ? j.value : null).catch(() => null);
  let counted = false; try { counted = localStorage.getItem("kp_visit") === "1"; } catch (_) {}
  get((counted ? "/get/" : "/hit/") + NS + "/visitors").then(v => {
    if (v == null) return; if (!counted) try { localStorage.setItem("kp_visit", "1"); } catch (_) {}
    totalEl.textContent = fmt(v + BEFORE); el.hidden = false;
  });
  const minute = () => Math.floor(Date.now() / 60000);
  function beat() {
    if (document.hidden) return; const m = minute();
    let done = false; try { done = sessionStorage.getItem("kp_live") === String(m); sessionStorage.setItem("kp_live", m); } catch (_) {}   // a reload in the same minute doesn't count twice
    Promise.all([get((done ? "/get/" : "/hit/") + NS + "/live-" + m), get("/get/" + NS + "/live-" + (m - 1))]).then(([cur, prev]) => {
      nowEl.textContent = fmt(Math.max(1, cur || 0, prev || 0)); el.hidden = false;
    });
  }
  beat(); setInterval(beat, 60000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) beat(); });
})();
