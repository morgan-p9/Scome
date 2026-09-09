/* ═══════════════════════════════════════════
   EKSUMSA SCOME — Executives Renderer
   ───────────────────────────────────────────
   Vanilla ES module. No build step required.

   Usage in HTML:
     <div class="exec-grid" data-exec-source="current"></div>
     <div class="exec-grid" data-exec-source="past"></div>
     <template id="exec-card-template">…</template>
     <script type="module" src="js/executives.js"></script>

   Adding a person: edit /data/currentExecutives.js or
   /data/pastExecutives.js — no DOM/HTML changes needed.
   ═══════════════════════════════════════════ */

import { CURRENT_EXECUTIVES } from "../data/currentExecutives.js";
import { PAST_EXECUTIVES }    from "../data/pastExecutives.js";

const PLACEHOLDER = "assets/images/executives/placeholder.svg";

const SOURCES = {
  current: CURRENT_EXECUTIVES,
  past:    PAST_EXECUTIVES,
};

/* ── Social icon SVGs (kept inline to avoid extra requests) ── */
const ICONS = {
  x:         '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.22-1.67 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.15-3.23 1.67-4.77 4.92-4.92C8.42 2.21 8.8 2.2 12 2.2zm0 5.84c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6.62c-1.45 0-2.63-1.18-2.63-2.62S10.55 9.4 12 9.4s2.63 1.18 2.63 2.62-1.18 2.63-2.63 2.63zm5.07-6.78a.93.93 0 1 1-1.87 0 .93.93 0 0 1 1.87 0z"/></svg>',
  linkedin:  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1-.01 5.01A2.5 2.5 0 0 1 4.98 3.5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21h-4V9z"/></svg>',
  tiktok:    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.33a8.16 8.16 0 0 0 4.77 1.52V7.4a4.85 4.85 0 0 1-1-.71z"/></svg>',
  email:     '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 8.2L4.4 7H19.6L12 13.2z"/></svg>',
};

const SOCIAL_LABELS = {
  x: "Twitter / X", instagram: "Instagram", linkedin: "LinkedIn",
  tiktok: "TikTok", email: "Email",
};

/* ── Normalize the image path so it resolves against the site root ── */
function normalizeImage(path) {
  if (!path) return PLACEHOLDER;
  return path.startsWith("/") ? path.slice(1) : path;
}

/* ── Build a single card from the <template> ── */
function buildCard(person, tpl) {
  const node = tpl.content.firstElementChild.cloneNode(true);

  const img = node.querySelector(".exec-card-img");
  img.src = normalizeImage(person.image);
  img.alt = `Portrait of ${person.name}`;
  img.addEventListener("error", () => { img.src = PLACEHOLDER; }, { once: true });

  node.querySelector(".exec-card-name").textContent = person.name || "—";
  node.querySelector(".exec-card-role").textContent = person.role || "";

  const termEl = node.querySelector(".exec-card-term");
  if (termEl) {
    if (person.term) termEl.textContent = person.term;
    else termEl.remove();
  }

  const bioEl = node.querySelector(".exec-card-bio");
  if (person.bio) bioEl.textContent = person.bio;
  else bioEl.remove();

  const socialsEl = node.querySelector(".exec-card-socials");
  const socials = person.socials || {};
  const entries = Object.entries(socials).filter(([, v]) => v);
  if (entries.length === 0) {
    socialsEl.remove();
  } else {
    socialsEl.innerHTML = entries.map(([key, url]) => {
      const icon = ICONS[key] || "";
      const label = SOCIAL_LABELS[key] || key;
      const href = key === "email" ? `mailto:${url}` : url;
      return `<a href="${href}" target="_blank" rel="noopener" title="${label}" aria-label="${label}">${icon}</a>`;
    }).join("");
  }

  return node;
}

/* ── Mount all grids found in the page ── */
function mount() {
  const tpl = document.getElementById("exec-card-template");
  if (!tpl) {
    console.warn("[executives] Missing <template id=\"exec-card-template\">");
    return;
  }

  document.querySelectorAll(".exec-grid[data-exec-source]").forEach(grid => {
    const key  = grid.dataset.execSource;
    const data = SOURCES[key];

    if (!Array.isArray(data) || data.length === 0) {
      grid.classList.add("exec-grid--empty");
      grid.innerHTML = '<p class="exec-empty">No executives listed yet. Add entries in <code>/data/' + key + 'Executives.js</code>.</p>';
      return;
    }

    const frag = document.createDocumentFragment();
    data.forEach(person => frag.appendChild(buildCard(person, tpl)));
    grid.replaceChildren(frag);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
