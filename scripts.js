/* ═══════════════════════════════════════════
   EKSUMSA SCOME — Shared Scripts
   ═══════════════════════════════════════════ */

/* ─── NAV MOBILE ─── */
function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobile-menu').classList.toggle('open');
}

/* ─── REVEAL ON SCROLL ─── */
const obs = new IntersectionObserver(
  e => e.forEach(x => {
    if (x.isIntersecting) {
      x.target.classList.add('in-view');
      obs.unobserve(x.target);
    }
  }),
  { threshold: .1 }
);
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ─── AGENDA DRAWER ─── */
function openAgenda() {
  const modal = document.getElementById('agendaModal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAgenda() {
  const modal = document.getElementById('agendaModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function closeAgendaOutside(e) {
  if (e.target === document.getElementById('agendaModal')) closeAgenda();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAgenda();
});
