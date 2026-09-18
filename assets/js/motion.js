/* Trentino — motion layer.
 *
 * Three behaviours: a staggered hero entrance on load, reveal-on-scroll for
 * every major block, and a scroll-linked parallax on the hero screenshot plus
 * a progress bar in the header.
 *
 * Two rules throughout:
 *   1. Nothing is hidden unless JS is running. The `.js` class is set inline in
 *      the head, so with JS off or broken the page renders fully visible.
 *   2. prefers-reduced-motion turns all of it off and reveals everything.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll() {
    var els = document.querySelectorAll('[data-reveal]');
    for (var i = 0; i < els.length; i++) els[i].classList.add('is-in');
    root.classList.add('is-loaded');
  }

  if (reduced) { revealAll(); return; }

  /* --- stagger: children of a [data-stagger] group come in one after another */
  var groups = document.querySelectorAll('[data-stagger]');
  for (var g = 0; g < groups.length; g++) {
    var kids = groups[g].children;
    for (var k = 0; k < kids.length; k++) {
      kids[k].setAttribute('data-reveal', '');
      kids[k].style.setProperty('--reveal-delay', (k * 90) + 'ms');
    }
  }

  /* --- reveal on scroll */
  if (!('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        entries[i].target.classList.add('is-in');
        io.unobserve(entries[i].target);
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });

    var targets = document.querySelectorAll('[data-reveal]');
    for (var t = 0; t < targets.length; t++) io.observe(targets[t]);
  }

  /* --- hero entrance, once the first paint is done.
   *     The timeout is a safety net: if rAF is starved (a backgrounded tab at
   *     load, an throttled renderer) the hero must not stay invisible. */
  function enterHero() { root.classList.add('is-loaded'); }
  requestAnimationFrame(function () { requestAnimationFrame(enterHero); });
  setTimeout(enterHero, 400);

  /* --- watchdog: if nothing has revealed at all shortly after load, the
   *     observer is not doing its job. Show everything rather than leave the
   *     page blank. */
  setTimeout(function () {
    if (!document.querySelector('[data-reveal].is-in')) revealAll();
  }, 2500);

  /* --- scroll-linked: progress bar + a slow drift on the hero screenshot */
  var bar = document.querySelector('.scroll-progress');
  // Not .hero-visual itself — that element carries the entrance transform.
  var visual = document.querySelector('.hero-visual .mockup');
  var ticking = false;

  function update() {
    var y = window.pageYOffset || root.scrollTop;

    if (bar) {
      var scrollable = root.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (scrollable > 0 ? Math.min(y / scrollable, 1) : 0) + ')';
    }
    // Only while it is anywhere near the viewport — no work once it's gone.
    if (visual && y < window.innerHeight * 1.6) {
      visual.style.transform = 'translate3d(0,' + (y * -0.045).toFixed(2) + 'px,0)';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
})();
