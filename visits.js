/* ---------- visitor counter (bottom of the page) ----------
   With window.FIREBASE_CONFIG (data.js) set: Firebase Realtime Database —
     total  : visits/total goes up by 1 the first time a browser opens the site (reloads don't count again)
     online : every open page keeps a small presence/<id> entry; it is removed the moment the page closes
              (and refreshed every few minutes, so a lost one ages out). The count is the live number of entries.
   Without it (or if Firebase can't be reached): shows the starting count and "1" so the line never looks broken.
   No personal data is stored — only a number and a random id per open page. ---------- */
(() => {
  const el = document.getElementById("visits"); if (!el) return;
  const totalEl = el.querySelector("[data-v=total]"), nowEl = el.querySelector("[data-v=now]");
  const BEFORE = 300;   // visitors before the counter was added (the count starts from here)
  const fmt = n => Number(n).toLocaleString("en-IN");
  const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  let lastSeen = BEFORE; try { lastSeen = Math.max(BEFORE, +localStorage.getItem("kp_total") || 0); } catch (_) {}
  totalEl.textContent = fmt(lastSeen); nowEl.textContent = "1"; el.hidden = false;
  const showTotal = v => { const total = Math.max(v + BEFORE, lastSeen); lastSeen = total; totalEl.textContent = fmt(total); try { localStorage.setItem("kp_total", total); } catch (_) {} };

  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || !cfg.databaseURL) return;
  const V = "10.12.2", root = local ? "test/" : "";            // local testing writes under test/, never the real count
  Promise.all([import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`), import(`https://www.gstatic.com/firebasejs/${V}/firebase-database.js`)])
    .then(([{ initializeApp }, D]) => {
      const db = D.getDatabase(initializeApp(cfg));
      // total — a transaction, so two visitors at the same moment both count
      const totalRef = D.ref(db, root + "visits/total");
      let counted = false; try { counted = localStorage.getItem("kp_visit_fb") === "1"; } catch (_) {}
      if (!counted) D.runTransaction(totalRef, n => (n || 0) + 1).then(r => { if (r.committed) try { localStorage.setItem("kp_visit_fb", "1"); } catch (_) {} }).catch(() => {});
      D.onValue(totalRef, s => { if (typeof s.val() === "number") showTotal(s.val()); });
      // online now — presence entry while this page is open
      const me = D.push(D.ref(db, root + "presence"));
      const fresh = 6 * 60 * 1000;
      D.onValue(D.ref(db, ".info/connected"), s => {
        if (s.val() !== true) return;
        D.onDisconnect(me).remove().then(() => D.set(me, D.serverTimestamp()));
      });
      setInterval(() => { if (!document.hidden) D.set(me, D.serverTimestamp()); }, 4 * 60 * 1000);
      D.onValue(D.ref(db, root + "presence"), s => {
        let n = 0; const now = Date.now(); s.forEach(c => { if (typeof c.val() === "number" && now - c.val() < fresh) n++; });
        nowEl.textContent = fmt(Math.max(1, n));
      });
    })
    .catch(() => {});   // Firebase unreachable: the starting numbers stay
})();
