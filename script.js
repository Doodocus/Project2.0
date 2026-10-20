// Mobile menu, project filters, portrait fallback, gentle section reveal.

const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('site-nav');
const setMenu = (open) => {
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
};
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', (e) => e.target.closest('a') && setMenu(false));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
});

// Desktop "More" dropdown (on mobile the same links are listed flat in the menu).
const more = document.querySelector('.more');
const moreBtn = more.querySelector('.more-btn');
const setMore = (open) => {
  more.classList.toggle('open', open);
  moreBtn.setAttribute('aria-expanded', open);
};
moreBtn.addEventListener('click', () => setMore(!more.classList.contains('open')));
more.addEventListener('click', (e) => e.target.closest('a') && setMore(false));
more.addEventListener('focusout', (e) => !more.contains(e.relatedTarget) && setMore(false));
document.addEventListener('click', (e) => !more.contains(e.target) && setMore(false));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && more.classList.contains('open')) { setMore(false); moreBtn.focus(); }
});

// Project filters: each card lists its categories in data-tags.
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.project');
const status = document.getElementById('filter-status');
const empty = document.getElementById('filter-empty');
chips.forEach((chip) => chip.addEventListener('click', () => {
  const f = chip.dataset.filter;
  chips.forEach((c) => c.setAttribute('aria-pressed', c === chip));
  let shown = 0;
  cards.forEach((card) => {
    const match = f === 'all' || card.dataset.tags.split(' ').includes(f);
    card.hidden = !match;
    shown += match;
  });
  empty.hidden = shown > 0;
  status.textContent = `${chip.textContent}: showing ${shown} of ${cards.length} projects`;
}));

// Links to a project card that the active filter hides: reset to "All" first.
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#project-"]');
  const target = a && document.querySelector(a.getAttribute('href'));
  if (target && target.hidden) document.querySelector('.chip[data-filter="all"]').click();
});

// Highlight the nav link for the section under a band near the top of the viewport.
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"], .cta-top')];
const setCurrent = (id) => navLinks.forEach((a) => {
  if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
  else a.removeAttribute('aria-current');
});
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) setCurrent(en.target.id === 'top' ? '' : en.target.id);
  }), { rootMargin: '-35% 0px -60% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));
}

// If Project2.png can't load, show the intentional placeholder.
const portrait = document.getElementById('portrait');
const img = portrait.querySelector('img');
const showPlaceholder = () => portrait.classList.add('missing');
img.addEventListener('error', showPlaceholder);
if (img.complete && img.naturalWidth === 0) showPlaceholder();

// Reveal sections on scroll; skipped entirely for reduced motion.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('main section:not(.hero) > .container').forEach((el) => {
    el.classList.add('reveal');
    io.observe(el);
  });
}
