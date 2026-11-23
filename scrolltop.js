/* ---------- scroll button above the band button: an arrow, with a thin ring that fills as you go down.
   Away from the top it points up and takes you to the top; at the top it points down and goes one screen down. ---------- */
(() => {
  const b = document.createElement("button");
  b.className = "totop"; b.type = "button"; b.setAttribute("aria-label", "പേജിന്റെ മുകളിലേക്ക്");
  b.innerHTML = `<svg class="totop-ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" class="trk"/><circle cx="24" cy="24" r="22" class="bar"/></svg>
    <svg class="totop-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;
  document.body.appendChild(b);
  const bar = b.querySelector(".bar"), L = 2 * Math.PI * 22; bar.style.strokeDasharray = L;
  const max = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);
  function onScroll() {
    bar.style.strokeDashoffset = L * (1 - Math.min(1, scrollY / max()));
    const down = scrollY < 200; b.classList.toggle("down", down);
    b.setAttribute("aria-label", down ? "താഴേക്ക്" : "പേജിന്റെ മുകളിലേക്ക്");
  }
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); onScroll();
  b.addEventListener("click", () => scrollTo({ top: scrollY < 200 ? scrollY + innerHeight * .9 : 0, behavior: "smooth" }));
})();
