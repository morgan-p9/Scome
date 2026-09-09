/* ═══════════════════════════════════════════
   EKSUMSA SCOME — Awareness Resources Renderer
   ───────────────────────────────────────────
   Vanilla ES module. No build step required.

   Usage in HTML:
     <div class="resource-grid" data-resource-month="april"></div>
     <div class="resource-grid" data-resource-month="may"></div>
     <template id="resource-card-template">…</template>
     <script type="module" src="js/awareness.js"></script>

   Adding a resource: edit /data/awarenessResources.js
   — no DOM or HTML changes needed.
   ═══════════════════════════════════════════ */

import { AWARENESS_RESOURCES } from "../data/awarenessResources.js";

/* ── Type icons (inline SVG, no extra requests) ── */
const TYPE_ICONS = {
  poster: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  pdf:    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  slides: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  video:  '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
  photo:  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
};

const PLACEHOLDER_THUMB = "assets/images/executives/placeholder.svg";

/* ── Build a single card from the <template> ── */
function buildCard(resource, tpl) {
  const node = tpl.content.firstElementChild.cloneNode(true);

  /* Thumb */
  const thumb = node.querySelector(".resource-card-thumb");
  if (resource.thumb) {
    thumb.src = resource.thumb;
    thumb.alt = resource.title;
    thumb.addEventListener("error", () => { thumb.src = PLACEHOLDER_THUMB; }, { once: true });
  } else {
    thumb.src = PLACEHOLDER_THUMB;
    thumb.alt = resource.title;
  }

  /* Type badge */
  const typeEl = node.querySelector(".resource-card-type");
  typeEl.innerHTML = (TYPE_ICONS[resource.type] || "") + `<span>${resource.type}</span>`;

  /* Title + desc */
  node.querySelector(".resource-card-title").textContent = resource.title || "—";
  const descEl = node.querySelector(".resource-card-desc");
  if (resource.desc) descEl.textContent = resource.desc;
  else descEl.remove();

  /* Tags */
  const tagsEl = node.querySelector(".resource-card-tags");
  if (Array.isArray(resource.tags) && resource.tags.length) {
    tagsEl.innerHTML = resource.tags.map(t => `<span class="resource-tag">${t}</span>`).join("");
  } else {
    tagsEl.remove();
  }

  /* Action link */
  const link = node.querySelector(".resource-card-action");
  const href = resource.external || resource.file || null;
  if (href) {
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = resource.type === "pdf" ? "Download PDF" :
                       resource.type === "poster" ? "View Poster" :
                       resource.type === "slides" ? "View Slides" :
                       resource.type === "video"  ? "Watch Video" : "View";
  } else {
    link.textContent = "Coming Soon";
    link.classList.add("resource-card-action--disabled");
    link.removeAttribute("href");
  }

  return node;
}

/* ── Render a month header if the grid has a month label ── */
function getMonthData(key) {
  return AWARENESS_RESOURCES[key] || null;
}

/* ── Mount all resource grids found in the page ── */
function mount() {
  const tpl = document.getElementById("resource-card-template");
  if (!tpl) {
    console.warn("[awareness] Missing <template id=\"resource-card-template\">");
    return;
  }

  document.querySelectorAll(".resource-grid[data-resource-month]").forEach(grid => {
    const key  = grid.dataset.resourceMonth;
    const data = getMonthData(key);

    if (!data || !Array.isArray(data.resources) || data.resources.length === 0) {
      grid.classList.add("resource-grid--empty");
      grid.innerHTML = `<p class="resource-empty">No resources uploaded yet for ${data ? data.label : key}. Add entries in <code>/data/awarenessResources.js</code>.</p>`;
      return;
    }

    const frag = document.createDocumentFragment();
    data.resources.forEach(r => frag.appendChild(buildCard(r, tpl)));
    grid.replaceChildren(frag);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
