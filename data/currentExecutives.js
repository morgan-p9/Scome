/* ═══════════════════════════════════════════
   EKSUMSA SCOME — Current Executives (2025/26)
   ───────────────────────────────────────────
   Add a new executive by appending an object.
   No HTML changes required — the renderer in
   /js/executives.js picks it up automatically.

   Schema:
     name     (string, required)
     role     (string, required)
     image    (string, optional — path under /assets/images/executives/current/)
              omit or leave blank to use the placeholder
     bio      (string, optional — one short sentence)
     socials  (object, optional — any of: x, instagram, linkedin, tiktok, email)
   ═══════════════════════════════════════════ */

export const CURRENT_EXECUTIVES = [
  {
    name: "Abiona Ayomide Morgan",
    role: "Director of Academics & Research",
    image: "/assets/images/executives/current/morgan.jpg",
    bio: "Leads academic programming and research advocacy for SCOME EKSUMSA.",
    socials: {
      // x: "https://x.com/handle",
      // instagram: "https://instagram.com/handle",
      // linkedin: "https://linkedin.com/in/handle",
      // email: "name@example.com",
    },
  },
  // Add the rest of the 2025/26 executives below — one object per person.
];
