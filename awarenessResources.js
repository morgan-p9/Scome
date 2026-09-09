/* ═══════════════════════════════════════════
   EKSUMSA SCOME — Awareness Resources Archive
   ───────────────────────────────────────────
   Data-driven archive of awareness campaign
   materials. Rendered by /js/awareness.js.

   To add a resource:
     1. Drop the file into /assets/resources/awareness/<month>/
     2. Append an entry to the relevant month array below.
     3. No HTML or JS changes needed.

   Schema per entry:
     title    (string, required)
     type     (string, required) — "poster" | "pdf" | "slides" | "video" | "photo"
     desc     (string, optional) — one sentence
     file     (string, optional) — path under /assets/ for download/view
     thumb    (string, optional) — path to a preview image
     tags     (array,  optional) — e.g. ["TB", "Infectious Disease"]
     external (string, optional) — external URL (overrides file link)
   ═══════════════════════════════════════════ */

export const AWARENESS_RESOURCES = {

  april: {
    label: "April 2026",
    events: ["World Health Day", "World Malaria Day", "World Immunization Week"],
    resources: [
      {
        title: "World TB Day — Awareness Poster (Red)",
        type: "poster",
        desc: "General awareness poster for World TB Day, March 24. Shareable on all social platforms.",
        file: "assets/images/1000783118.jpg",
        thumb: "assets/images/1000783118.jpg",
        tags: ["TB", "Infectious Disease", "Awareness"],
      },
      {
        title: "World TB Day — Myths vs Facts Poster",
        type: "poster",
        desc: "Debunking four common TB myths with clinical facts. Dark edition.",
        file: "assets/images/1000783119.jpg",
        thumb: "assets/images/1000783119.jpg",
        tags: ["TB", "Myths & Facts", "Awareness"],
      },
      {
        title: "Tuberculosis: Clinical Case Scenarios",
        type: "slides",
        desc: "Four illustrative TB cases — Classic Pulmonary, Latent, Meningitis, Pericarditis. Designed for medical students.",
        file: "",
        thumb: "",
        tags: ["TB", "Clinical Cases", "Medical Education"],
      },
      {
        title: "Global TB Paradigms: Epidemiological Shifts & Therapeutic Innovations (2024–2026)",
        type: "pdf",
        desc: "Comprehensive research write-up on global TB trends, new regimens, vaccine pipeline, and socioeconomic drivers.",
        file: "Tuberculosis Research_ Spread, Cure, Prevention(1).pdf",
        thumb: "",
        tags: ["TB", "Research", "Epidemiology"],
      },
      // Add April World Health Day, Malaria Day, Immunization Week resources here as they are created.
    ],
  },

  may: {
    label: "May 2026",
    events: ["World Asthma Day", "World Lupus Day", "International Nurses Day", "World Hypertension Day", "World No Tobacco Day"],
    resources: [
      // Add May resources here as they are created.
      // Example structure:
      // {
      //   title: "World Hypertension Day — Awareness Poster",
      //   type: "poster",
      //   desc: "Blood pressure awareness campaign poster.",
      //   file: "assets/resources/awareness/may/hypertension-poster.jpg",
      //   thumb: "assets/resources/awareness/may/hypertension-poster.jpg",
      //   tags: ["Hypertension", "Cardiovascular", "Awareness"],
      // },
    ],
  },

};
