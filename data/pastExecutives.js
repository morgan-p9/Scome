/* ═══════════════════════════════════════════
   EKSUMSA SCOME — Past Executives / Legacy
   ───────────────────────────────────────────
   Archive of previous boards. Group by year via
   the `term` field; the renderer keeps insertion
   order, so list newest term first.

   Schema:
     name     (string, required)
     role     (string, required)
     term     (string, required — e.g. "2024/25")
     image    (string, optional)
     bio      (string, optional)
     socials  (object, optional)
   ═══════════════════════════════════════════ */

export const PAST_EXECUTIVES = [
  {
    name: "Previous Director (Example)",
    role: "Director of Academics & Research",
    term: "2024/25",
    image: "/assets/images/executives/past/example.jpg",
    bio: "Served on the 2024/25 board.",
    socials: {},
  },
  // Add past executives below — group by descending term.
];
