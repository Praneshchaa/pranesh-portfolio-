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
spy();

// ---- image crossfades: any group of sibling <img> tags with inline opacity ----
// auto-rotates each such group independently, mirroring the original design
document.querySelectorAll('div').forEach(container => {
  const fadeImgs = Array.from(container.children).filter(
    el => el.tagName === 'IMG' && el.style.opacity !== ''
  );
  if (fadeImgs.length > 1) {
    const dotsWrap = Array.from(container.children).find(
      el => el.tagName === 'DIV' && Array.from(el.children).some(
        c => c.tagName === 'SPAN' && c.style.borderRadius === '50%'
      )
    );
    const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
    const activeBg = dots[0] ? dots[0].style.background : '';
    const inactiveBg = dots[1] ? dots[1].style.background : '';
    let idx = 0;
    setInterval(() => {
      fadeImgs[idx].style.opacity = '0';
      if (dots[idx]) dots[idx].style.background = inactiveBg;
      idx = (idx + 1) % fadeImgs.length;
      fadeImgs[idx].style.opacity = '1';
      if (dots[idx]) dots[idx].style.background = activeBg;
    }, 3600);
  }
});
