/* helpers */
const $ = (s, r=document) => r.querySelector(s);

/* footer year */
(() => { const y = $('#year'); if (y) y.textContent = new Date().getFullYear(); })();

/* mobile nav */
(() => {
  const btn = $('#navToggle');
  const menu = $('#primary-menu');
  if(!btn || !menu) return;
  btn.addEventListener('click', () => {
    const exp = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!exp));
    menu.classList.toggle('show');
  });
})();

/* smooth scroll */
(() => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
      const menu = $('#primary-menu');
      if(menu && menu.classList.contains('show')) menu.classList.remove('show');
      const btn = $('#navToggle'); if(btn) btn.setAttribute('aria-expanded','false');
    });
  });
})();