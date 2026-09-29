const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const panel = document.querySelector('.nav-panel');
const links = [...document.querySelectorAll('.nav-links a')];
const panelLinks = [...document.querySelectorAll('.nav-panel a')];
let menuReturnFocus = null;

const closeNavigation = (restoreFocus = false) => {
  if (!toggle || !panel) return;
  panel.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  document.body.classList.remove('nav-open');
  if (restoreFocus) (menuReturnFocus || toggle).focus();
};

if (toggle && panel) {
  toggle.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('nav-open', open);
    if (open) {
      menuReturnFocus = toggle;
      window.requestAnimationFrame(() => panelLinks[0]?.focus());
    }
  });

  panelLinks.forEach((link) => link.addEventListener('click', closeNavigation));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('open')) {
      closeNavigation(true);
      return;
    }

    if (event.key === 'Tab' && panel.classList.contains('open') && panelLinks.length) {
      const first = panelLinks[0];
      const last = panelLinks[panelLinks.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) closeNavigation();
  });
}

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if ('IntersectionObserver' in window) {
  const sections = [...document.querySelectorAll('main section[id]')]
    .filter((section) => links.some((link) => link.hash === `#${section.id}`));

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    links.forEach((link) => {
      link.classList.toggle('active', link.hash === `#${visible.target.id}`);
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.2, 0.5] });

  sections.forEach((section) => observer.observe(section));
}
