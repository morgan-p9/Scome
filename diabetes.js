/* ═══════════════════════════════════════════
   EKSUMSA SCOME — World Diabetes Day 2026 · Page Renderer + Quiz
   ───────────────────────────────────────────
   Vanilla ES module. No build step, no dependencies.

   Reads:   /data/diabetesCampaign.js   page content
            /data/diabetesQuiz.js       question bank
            /data/diabetesScores.js     leaderboard config
   Writes:  scores via /js/diabetesStore.js (localStorage)

   All DOM is built with textContent / setAttribute — never innerHTML —
   so participant nicknames cannot inject markup.
   Mounts into elements by id (see diabetes-day.html).
   ═══════════════════════════════════════════ */

import { DIABETES_CAMPAIGN as C } from "../data/diabetesCampaign.js";
import { DIABETES_QUIZ as Q }     from "../data/diabetesQuiz.js";
import { SCORES_CONFIG as SC }    from "../data/diabetesScores.js";
import { submitScore, getLeaderboard, clearLocalScores, sanitizeNick, hasSharedBoard } from "./diabetesStore.js";

/* ── tiny DOM helpers ── */
const $ = (sel, root = document) => root.querySelector(sel);

function h(tag, cls, text, attrs) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  if (attrs) for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
}

function mount(sel, ...nodes) {
  const el = $(sel);
  if (el) el.replaceChildren(...nodes);
  return el;
}

const pad = n => String(n).padStart(2, "0");
const fmtTime = ms => `${Math.floor(ms / 60000)}:${pad(Math.floor(ms / 1000) % 60)}`;

/* ═══════════════ CONTENT ═══════════════ */

function renderContent() {
  // text bindings: <span data-wdd-text="theme"> etc.
  document.querySelectorAll("[data-wdd-text]").forEach(el => {
    const v = C.meta[el.dataset.wddText];
    if (v) el.textContent = v;
  });

  mount("#wdd-stats", ...C.stats.map(s => {
    const d = h("div", "wdd-stat");
    d.append(h("div", "wdd-stat-num", s.value), h("div", "wdd-stat-label", s.label));
    return d;
  }));

  mount("#wdd-symptoms", ...C.symptoms.map((s, i) => {
    const d = h("article", "wdd-card");
    d.append(h("div", "wdd-card-num", pad(i + 1)), h("h3", "wdd-card-title", s.title), h("p", "wdd-card-text", s.text));
    return d;
  }));

  mount("#wdd-emergency", ...C.emergency.map(e => {
    const d = h("div", "wdd-alert");
    d.append(h("h3", "wdd-alert-title", e.title), h("p", "wdd-alert-text", e.text));
    return d;
  }));

  const list = items => { const ul = h("ul", "wdd-list"); items.forEach(t => ul.append(h("li", null, t))); return ul; };
  mount("#wdd-risk-fixed",      list(C.risk.fixed));
  mount("#wdd-risk-changeable", list(C.risk.changeable));
  mount("#wdd-risk-test",       list(C.risk.testIf));

  // Type 1 vs Type 2 — each cell carries data-label so it can stack on phones
  const table = h("table", "wdd-table");
  const head  = h("tr");
  C.types.columns.forEach(c => head.append(h("th", null, c, { scope: "col" })));
  table.append(h("thead")).firstChild.append(head);
  const body = h("tbody");
  C.types.rows.forEach(([label, t1, t2]) => {
    const tr = h("tr");
    tr.append(h("th", null, label, { scope: "row" }),
              h("td", null, t1, { "data-label": C.types.columns[1] }),
              h("td", null, t2, { "data-label": C.types.columns[2] }));
    body.append(tr);
  });
  table.append(body);
  mount("#wdd-types", table);

  mount("#wdd-myths", ...C.myths.map(m => {
    const d = h("article", "wdd-myth");
    const a = h("div", "wdd-myth-row is-myth");
    a.append(h("span", "wdd-tag", "Myth"), h("p", null, m.myth));
    const b = h("div", "wdd-myth-row is-fact");
    b.append(h("span", "wdd-tag", "Fact"), h("p", null, m.fact));
    d.append(a, b);
    return d;
  }));

  const actions = h("ol", "wdd-actions");
  C.actions.forEach(t => actions.append(h("li", null, t)));
  mount("#wdd-actions", actions);

  const src = h("ul", "wdd-sources");
  C.sources.forEach(s => {
    const li = h("li"); li.append(h("a", null, s.label, { href: s.url, target: "_blank", rel: "noopener" })); src.append(li);
  });
  mount("#wdd-sources", src);
  mount("#wdd-disclaimer", h("p", null, C.disclaimer));
}

/* ═══════════════ QR + SHARE ═══════════════ */

const shareText = (extra = "") =>
  `${extra}World Diabetes Day 2026 — "${C.meta.theme}" Take the quiz by EKSUMSA SCOME: ${C.meta.pageUrl}`;

const whatsappHref = text => `https://wa.me/?text=${encodeURIComponent(text)}`;

function renderShare() {
  const box = $("#wdd-qr");
  if (!box) return;

  const frame = h("div", "wdd-qr-frame");
  frame.append(h("img", null, null, {
    src: C.meta.qrImage, width: "220", height: "220", loading: "lazy",
    alt: `QR code linking to ${C.meta.pageUrl}`,
  }));

  const info = h("div", "wdd-qr-info");
  info.append(
    h("p", "wdd-qr-url", C.meta.pageUrl),
    (() => {
      const row = h("div", "wdd-btn-row");
      row.append(
        h("a", "btn-pill primary", "Share on WhatsApp", { href: whatsappHref(shareText()), target: "_blank", rel: "noopener" }),
        h("a", "btn-pill outline", "Download QR", { href: C.meta.qrDownload, download: "world-diabetes-day-qr.png" })
      );
      const copy = h("button", "btn-pill outline", "Copy link", { type: "button" });
      copy.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(C.meta.pageUrl); copy.textContent = "Copied ✓"; }
        catch { copy.textContent = "Select the link above"; }
        setTimeout(() => (copy.textContent = "Copy link"), 2200);
      });
      row.append(copy);
      return row;
    })(),
    h("p", "wdd-qr-note", "Print it on posters and notice boards, or post it on your status — scanning opens this page.")
  );
  box.replaceChildren(frame, info);
}

/* ═══════════════ QUIZ ═══════════════ */

const quizEl = () => $("#wdd-quiz");
const state = { round: [], i: 0, score: 0, locked: false, t0: 0, t1: 0, nick: "" };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function buildRound() {
  let qs = Q.settings.shuffleQuestions ? shuffle(Q.questions) : [...Q.questions];
  qs = qs.slice(0, Q.settings.perRound || qs.length);
  return qs.map(q => {
    const opts = q.options.map((text, i) => ({ text, ok: i === q.answer }));
    return { ...q, opts: Q.settings.shuffleOptions ? shuffle(opts) : opts };
  });
}

function keepInView(el) {
  if (el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderIntro() {
  const total = Math.min(Q.settings.perRound || Q.questions.length, Q.questions.length);
  const wrap = h("div", "wdd-quiz-intro");
  wrap.append(
    h("h3", "wdd-quiz-heading", "How much do you know?"),
    h("p", "wdd-quiz-sub", `${total} questions · instant feedback after every answer · about 3 minutes`),
    h("p", "wdd-quiz-sub", "Top scores go on the leaderboard. A nickname is optional — no real names or contact details are needed.")
  );
  const start = h("button", "btn-pill primary", "Start the quiz", { type: "button" });
  start.addEventListener("click", startQuiz);
  wrap.append(start);
  quizEl().replaceChildren(wrap);
}

function startQuiz() {
  Object.assign(state, { round: buildRound(), i: 0, score: 0, locked: false, t0: Date.now(), t1: 0 });
  renderQuestion();
}

function renderQuestion() {
  const q = state.round[state.i];
  const total = state.round.length;
  const wrap = h("div", "wdd-quiz-q");

  const top = h("div", "wdd-quiz-top");
  top.append(h("span", "wdd-quiz-count", `Question ${state.i + 1} of ${total}`),
             h("span", "wdd-quiz-score", `Score ${state.score}`));
  const bar = h("div", "wdd-progress", null, { role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(total), "aria-valuenow": String(state.i), "aria-label": "Quiz progress" });
  const fill = h("div", "wdd-progress-fill"); fill.style.width = `${(state.i / total) * 100}%`;
  bar.append(fill);

  const heading = h("h3", "wdd-quiz-question", q.q, { tabindex: "-1" });
  const optBox  = h("div", "wdd-options", null, { role: "group", "aria-label": "Answer options" });
  const feedback = h("div", "wdd-feedback", null, { role: "status", "aria-live": "polite" });
  feedback.hidden = true;
  const next = h("button", "btn-pill primary wdd-next", state.i === total - 1 ? "See my score" : "Next question", { type: "button" });
  next.hidden = true;

  q.opts.forEach((o, idx) => {
    const b = h("button", "wdd-opt", null, { type: "button" });
    b.append(h("span", "wdd-opt-key", "ABCD"[idx]), h("span", "wdd-opt-text", o.text), h("span", "wdd-opt-mark", ""));
    b.addEventListener("click", () => answer(b, o, q, optBox, feedback, next, fill));
    optBox.append(b);
  });

  next.addEventListener("click", () => {
    if (state.i === total - 1) { state.t1 = Date.now(); renderResult(); }
    else { state.i++; renderQuestion(); }
  });

  wrap.append(top, bar, heading, optBox, feedback, next);
  quizEl().replaceChildren(wrap);
  heading.focus({ preventScroll: true });
  keepInView(quizEl());
}

function answer(btn, chosen, q, optBox, feedback, next, fill) {
  if (state.locked) return;
  state.locked = true;

  const buttons = [...optBox.children];
  buttons.forEach((b, i) => {
    b.setAttribute("aria-disabled", "true");
    b.classList.add("is-locked");
    if (q.opts[i].ok) { b.classList.add("is-correct"); b.querySelector(".wdd-opt-mark").textContent = "✓ Correct"; }
  });
  if (!chosen.ok) { btn.classList.add("is-wrong"); btn.querySelector(".wdd-opt-mark").textContent = "✗ Your answer"; }
  else state.score++;

  feedback.className = `wdd-feedback ${chosen.ok ? "is-correct" : "is-wrong"}`;
  feedback.replaceChildren(
    h("strong", null, chosen.ok ? "Correct!" : "Not quite."),
    h("p", null, q.explain)
  );
  feedback.hidden = false;
  fill.style.width = `${((state.i + 1) / state.round.length) * 100}%`;
  $(".wdd-quiz-score", quizEl()).textContent = `Score ${state.score}`;
  next.hidden = false;
  next.focus({ preventScroll: true });
  state.locked = false;   // unlocked so the next render starts clean; clicks are ignored via aria-disabled
  buttons.forEach(b => b.replaceWith(b.cloneNode(true)));   // strip click handlers → one answer per question
}

function bandFor(ratio) { return Q.bands.find(b => ratio >= b.min) || Q.bands[Q.bands.length - 1]; }

function renderResult() {
  const total = state.round.length, score = state.score, ms = state.t1 - state.t0;
  const band = bandFor(score / total);
  const wrap = h("div", "wdd-result");

  const ring = h("div", "wdd-ring", null, { role: "img", "aria-label": `${score} out of ${total}` });
  ring.style.setProperty("--p", String(Math.round((score / total) * 100)));
  ring.append(h("div", "wdd-ring-num", `${score}/${total}`), h("div", "wdd-ring-sub", fmtTime(ms)));

  const text = h("div", "wdd-result-text");
  text.append(h("h3", "wdd-quiz-heading", band.title), h("p", "wdd-quiz-sub", band.msg));

  // — save form —
  const form = h("form", "wdd-save", null, { novalidate: "" });
  const label = h("label", "wdd-save-label", "Nickname for the leaderboard (optional)", { for: "wdd-nick" });
  const input = h("input", "wdd-input", null, { id: "wdd-nick", type: "text", maxlength: String(SC.nickMaxLength), autocomplete: "off", placeholder: "e.g. FutureDoc", inputmode: "text" });
  input.value = state.nick;
  const hint = h("p", "wdd-hint", hasSharedBoard()
    ? "Only your nickname, score and time are saved — nothing else."
    : "Only your nickname, score and time are saved, on this device only.");
  const saveBtn = h("button", "btn-pill primary", "Save to leaderboard", { type: "submit" });
  const status = h("p", "wdd-save-status", null, { role: "status", "aria-live": "polite" });
  form.append(label, input, hint, saveBtn, status);

  form.addEventListener("submit", async e => {
    e.preventDefault();
    saveBtn.disabled = true; input.disabled = true;
    state.nick = sanitizeNick(input.value);
    const res = await submitScore({ nick: state.nick, score, total, ms });
    if (!res) { status.textContent = "Couldn't save that score."; saveBtn.disabled = false; input.disabled = false; return; }
    saveBtn.textContent = "Saved ✓";
    status.textContent = res.rank
      ? `You're #${res.rank} on the ${res.board.scope === "everyone" ? "leaderboard" : "leaderboard (this device)"}.`
      : "Saved. Keep playing to climb the board.";
    renderLeaderboard(state.nick);
    $("#wdd-leaderboard-wrap")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const actions = h("div", "wdd-btn-row");
  const again = h("button", "btn-pill outline", "Play again", { type: "button" });
  again.addEventListener("click", startQuiz);
  actions.append(
    again,
    h("a", "btn-pill outline", "Share my score", {
      href: whatsappHref(shareText(`I scored ${score}/${total} on the quiz! `)), target: "_blank", rel: "noopener" })
  );

  wrap.append(ring, text, form, actions);
  quizEl().replaceChildren(wrap);
  $("h3", wrap).setAttribute("tabindex", "-1");
  $("h3", wrap).focus({ preventScroll: true });
  keepInView(quizEl());
}

/* ═══════════════ LEADERBOARD ═══════════════ */

async function renderLeaderboard(highlightNick = "") {
  const box = $("#wdd-leaderboard");
  if (!box) return;
  const { rows, scope } = await getLeaderboard();

  const meta = $("#wdd-leaderboard-scope");
  if (meta) meta.textContent = scope === "everyone"
    ? "Top scores from all participants."
    : "Top scores saved on this device. Take the quiz and add yours.";

  if (!rows.length) {
    box.replaceChildren(h("p", "wdd-empty", "No scores yet — be the first on the board."));
    return;
  }

  const hl = highlightNick.toLowerCase();
  const ol = h("ol", "wdd-board");
  rows.forEach((r, i) => {
    const li = h("li", `wdd-board-row${hl && r.nick.toLowerCase() === hl ? " is-you" : ""}`);
    li.append(
      h("span", "wdd-board-rank", String(i + 1)),
      h("span", "wdd-board-nick", r.nick),
      h("span", "wdd-board-score", `${r.score}/${r.total}`),
      h("span", "wdd-board-time", r.ms ? fmtTime(r.ms) : "—")
    );
    ol.append(li);
  });
  box.replaceChildren(ol);
}

function wireClear() {
  const btn = $("#wdd-clear");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (!confirm("Remove the scores saved on this device?")) return;
    clearLocalScores();
    renderLeaderboard();
  });
}

/* ═══════════════ BOOT ═══════════════ */

function boot() {
  renderContent();
  renderShare();
  if (quizEl()) renderIntro();
  renderLeaderboard();
  wireClear();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
