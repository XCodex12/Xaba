'use strict';

const S = window.SITE;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (t) => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- sidebar (mobile) ---------- */
$('[data-sidebar-btn]').addEventListener('click', () => $('[data-sidebar]').classList.toggle('active'));

/* ---------- page navigation ---------- */
const navLinks = $$('[data-nav-link]');
const pages = $$('[data-page]');
function showPage(name) {
  pages.forEach(p => p.classList.toggle('active', p.dataset.page === name));
  navLinks.forEach(l => l.classList.toggle('active', l.dataset.target === name));
  window.scrollTo(0, 0);
}
navLinks.forEach(l => l.addEventListener('click', () => showPage(l.dataset.target)));
$$('[data-goto]').forEach(b => b.addEventListener('click', () => showPage(b.dataset.goto)));

/* ---------- typing effect ---------- */
(function typing() {
  const el = $('#typing-text');
  if (!el) return;
  const lines = [
    'Software Developer.',
    'Advanced Diploma in ICT graduate.',
    'Full-stack web and Android developer.',
    'Fast learner who ships real projects.'
  ];
  let li = 0, ci = 0, deleting = false;
  (function tick() {
    const text = lines[li];
    el.textContent = text.slice(0, ci);
    if (!deleting && ci < text.length) { ci++; return setTimeout(tick, 70); }
    if (!deleting) { deleting = true; return setTimeout(tick, 1600); }
    if (ci > 0) { ci--; return setTimeout(tick, 30); }
    deleting = false; li = (li + 1) % lines.length; setTimeout(tick, 300);
  })();
})();

/* ---------- rotating avatar ---------- */
(function avatar() {
  const img = $('#avatarImage');
  if (!img) return;
  const imgs = ['./assets/images/Myself.jpg', './assets/images/Me.jpg'];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % imgs.length;
    img.classList.add('hidden');
    setTimeout(() => { img.src = imgs[i]; img.classList.remove('hidden'); }, 500);
  }, 5700);
})();

/* ---------- skills ---------- */
$('#skills-groups').innerHTML = S.skillGroups.map(g => `
  <div class="skill-group">
    <h4 class="h5 skill-group-title">${esc(g.title)}</h4>
    <ul class="chip-list">${g.items.map(i => `<li class="chip">${esc(i)}</li>`).join('')}</ul>
  </div>`).join('');

/* ---------- modules (collapsible, from data.js) ---------- */
$('#modules-list').innerHTML = Object.entries(S.modules).map(([title, mods], idx) => `
  <details class="modules-block" ${idx === 0 ? 'open' : ''}>
    <summary>${esc(title)} <span class="modules-count">${mods.length} modules</span></summary>
    <ul class="modules-ul">${mods.map(m =>
      `<li><span>${esc(m.n)}</span><span class="mod-sem">${esc(m.s)}${m.d ? ' <b class="dist">Distinction</b>' : ''}</span></li>`).join('')}
    </ul>
  </details>`).join('');

/* ---------- projects + filter ---------- */
const cats = ['All', ...new Set(S.projects.map(p => p.cat))];
$('#project-filters').innerHTML = cats.map((c, i) =>
  `<button class="filter-chip${i === 0 ? ' active' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');

$('#project-list').innerHTML = S.projects.map(p => `
  <li class="project-item active" data-filter-item data-category="${esc(p.cat)}">
    <a href="${esc(p.link)}" target="_blank" rel="noopener">
      <figure class="project-img">
        <div class="project-item-icon-box"><ion-icon name="eye-outline"></ion-icon></div>
        ${p.img
          ? `<img src="./assets/images/${esc(p.img)}" alt="${esc(p.name)} screenshot" loading="lazy">`
          : `<div class="project-tile"><ion-icon name="${esc(p.icon)}"></ion-icon></div>`}
        <span class="project-badge">${esc(p.status)}</span>
      </figure>
      <h3 class="project-title">${esc(p.name)}</h3>
      <p class="project-desc">${esc(p.desc)}</p>
      <div class="project-tech">${p.tech.map(t => `<span class="project-category">${esc(t)}</span>`).join('')}</div>
      <span class="project-cta">${esc(p.cta)} <ion-icon name="arrow-forward-outline"></ion-icon></span>
    </a>
  </li>`).join('');

$('#project-count').textContent = S.projects.length;
$('#project-filters').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-chip');
  if (!btn) return;
  $$('.filter-chip').forEach(b => b.classList.toggle('active', b === btn));
  $$('[data-filter-item]').forEach(it =>
    it.classList.toggle('active', btn.dataset.cat === 'All' || it.dataset.category === btn.dataset.cat));
});

/* ---------- contact form (opens the visitor's email app) ---------- */
const form = $('[data-form]');
const formInputs = $$('[data-form-input]');
const formBtn = $('[data-form-btn]');
formInputs.forEach(i => i.addEventListener('input', () => { formBtn.disabled = !form.checkValidity(); }));
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const subject = encodeURIComponent('Portfolio enquiry from ' + d.get('fullname'));
  const body = encodeURIComponent(d.get('message') + '\n\n' + d.get('fullname') + '\n' + d.get('email'));
  window.location.href = `mailto:${S.email}?subject=${subject}&body=${body}`;
});

/* ---------- sidebar contact + footer year ---------- */
$$('[data-open-chat]').forEach(b => b.addEventListener('click', () => window.SiyandaBot && window.SiyandaBot.open()));
