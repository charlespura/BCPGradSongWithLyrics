async function loadLyrics(detailsEl) {
  const src = detailsEl.getAttribute("data-lyrics-src");
  if (!src) return;

  const target = detailsEl.querySelector("[data-lyrics-target]");
  if (!target) return;

  if (detailsEl.dataset.loaded === "1") return;
  detailsEl.dataset.loaded = "1";

  try {
    const res = await fetch(src, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    target.textContent = text.trim() ? text : "Lyrics file is empty.";
  } catch {
    // Keep the default placeholder text already in the DOM.
  }
}

function initLyricsLoader() {
  document.querySelectorAll("details.lyrics").forEach((detailsEl) => {
    // Load immediately if already open (e.g. the tribute song).
    if (detailsEl.open) loadLyrics(detailsEl);

    detailsEl.addEventListener("toggle", () => {
      if (detailsEl.open) loadLyrics(detailsEl);
    });
  });
}

window.addEventListener("DOMContentLoaded", initLyricsLoader);

