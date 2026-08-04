// Pranesh Shrestha portfolio — interactive behavior
// (converted from Claude Design's runtime into plain JS, no build step needed)

let navScrollY = 0;

function openNav() {
  navScrollY = window.scrollY;
  const shell = document.querySelector('[data-shell]');
  shell.style.position = 'fixed';
  shell.style.top = `-${navScrollY}px`;
  shell.style.left = '0';
  shell.style.right = '0';
  document.body.classList.add('nav-open');
}

function closeNav() {
  document.body.classList.remove('nav-open');
  const shell = document.querySelector('[data-shell]');
  shell.style.position = '';
  shell.style.top = '';
  shell.style.left = '';
  shell.style.right = '';
  window.scrollTo(0, navScrollY);
}

function toggleNav() {
  if (document.body.classList.contains('nav-open')) closeNav();
  else openNav();
}

function railClick(e) {
  const rail = e.currentTarget.dataset.rail;
  if (document.body.classList.contains('nav-open')) closeNav();
  const target = document.querySelector(`[data-sec="${rail}"]`);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToTop() {
  if (document.body.classList.contains('nav-open')) {
    document.body.classList.remove('nav-open');
    const shell = document.querySelector('[data-shell]');
    shell.style.position = '';
    shell.style.top = '';
    shell.style.left = '';
    shell.style.right = '';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// the name is plain text while still in the hero; it only acts as a
// "scroll to top" link once the visitor has actually scrolled down
function nameLinkClick() {
  if (document.body.classList.contains('scrolled')) scrollToTop();
}

function updateScrolledState() {
  document.body.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', updateScrolledState, { passive: true });
updateScrolledState();

function setArticleHover(which) {
  document.querySelectorAll('[data-preview]').forEach(el => {
    const on = el.dataset.preview === which;
    el.style.opacity = on ? '1' : '0';
    el.style.visibility = on ? 'visible' : 'hidden';
  });
}

// devices without a real hover-capable pointer (touch) ignore the hover handler entirely,
// since mobile browsers fire compatibility mouseenter/click events together on tap
function hoverPreview(which) {
  if (window.matchMedia('(hover: hover)').matches) setArticleHover(which);
}

// mobile has no hover, so tapping the card toggles the preview instead
function toggleArticlePreview(e, which) {
  if (window.matchMedia('(hover: hover)').matches) return;
  e.stopPropagation();
  const el = document.querySelector(`[data-preview="${which}"]`);
  const isOpen = el.style.opacity === '1';
  setArticleHover(isOpen ? null : which);
}

// ---- scroll spy: highlight the current section in the left rail ----
function spy() {
  const secs = Array.from(document.querySelectorAll('[data-sec]'));
  if (!secs.length) return;
  let cur = secs[0].dataset.sec;
  const isDesktop = window.matchMedia('(min-width: 761px)').matches;
  const atBottom = isDesktop && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (atBottom) {
    cur = secs[secs.length - 1].dataset.sec;
  } else {
    secs.forEach(s => { if (s.getBoundingClientRect().top <= 170) cur = s.dataset.sec; });
  }
  document.querySelectorAll('[data-rail]').forEach(r => {
    const on = r.dataset.rail === cur;
    r.style.color = on ? 'var(--ink)' : 'var(--meta)';
    if (r.firstElementChild) r.firstElementChild.style.color = on ? 'var(--accText)' : 'var(--meta)';
  });
}
window.addEventListener('scroll', spy, { passive: true });

// ---- mobile-only "scroll to top" button, appears once the user has scrolled down ----
function updateScrollTopBtn() {
  if (!window.matchMedia('(max-width: 760px)').matches) {
    document.body.classList.remove('scrolltop-visible');
    return;
  }
  document.body.classList.toggle('scrolltop-visible', window.scrollY > 400);
}
window.addEventListener('scroll', updateScrollTopBtn, { passive: true });
updateScrollTopBtn();
spy();

// ---- image crossfades: any group of sibling <img> tags with inline opacity ----
// auto-rotates each such group independently; dots are clickable and the card
// is swipeable on touch devices, mirroring the original auto-rotate design
document.querySelectorAll('div').forEach(container => {
  const fadeImgs = Array.from(container.children).filter(
    el => el.tagName === 'IMG' && el.style.opacity !== ''
  );
  if (fadeImgs.length < 2) return;

  const dotsWrap = Array.from(container.children).find(
    el => el.tagName === 'DIV' && Array.from(el.children).some(
      c => c.tagName === 'SPAN' && c.style.borderRadius === '50%'
    )
  );
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
  const activeBg = dots[0] ? dots[0].style.background : '';
  const inactiveBg = dots[1] ? dots[1].style.background : '';
  let idx = 0;
  let timer;

  function goTo(newIdx) {
    const next = (newIdx + fadeImgs.length) % fadeImgs.length;
    if (next === idx) return;
    fadeImgs[idx].style.opacity = '0';
    if (dots[idx]) dots[idx].style.background = inactiveBg;
    idx = next;
    fadeImgs[idx].style.opacity = '1';
    if (dots[idx]) dots[idx].style.background = activeBg;
  }

  function restartAutoplay() {
    clearInterval(timer);
    timer = setInterval(() => goTo(idx + 1), 3600);
  }
  restartAutoplay();

  // web: clicking a dot jumps straight to that slide
  dots.forEach((dot, i) => {
    dot.style.cursor = 'pointer';
    dot.style.pointerEvents = 'auto';
    dot.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      goTo(i);
      restartAutoplay();
    });
  });

  // mobile: swipe left/right to move between slides
  let touchStartX = 0, touchStartY = 0;
  container.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });
  container.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();
      goTo(dx < 0 ? idx + 1 : idx - 1);
      restartAutoplay();
    }
  }, { passive: false });
});
