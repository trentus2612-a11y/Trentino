/* Trentino — motion layer.
 *
 * Behaviours, in the order they appear below:
 *   1. Hero entrance on load
 *   2. Reveal-on-scroll (with per-group stagger)
 *   3. Headlines that rise in word by word from behind a mask
 *   4. Work screenshots uncovered by a wipe
 *   5. Parallax drift on the hero screenshot + a reading progress bar
 *
 * Two effects were tried and removed: eased "weighted" scrolling, and a custom
 * cursor with magnetic buttons. Both drew attention to themselves rather than
 * to the work, which is worse than no effect at all.
 *
 * Three rules hold throughout:
 *   - The `js` class is set inline in the head. With JS off or broken, none of
 *     the hiding CSS applies and the page renders normally.
 *   - prefers-reduced-motion turns the whole file off at the first branch.
 *   - Nothing here changes layout. Transform and opacity only, so the work
 *     stays on the compositor.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var mq = window.matchMedia;
  var reduced = mq && mq('(prefers-reduced-motion: reduce)').matches;

  function revealAll() {
    var els = document.querySelectorAll('[data-reveal], [data-stagger] > *, .split');
    for (var i = 0; i < els.length; i++) els[i].classList.add('is-in');
    root.classList.add('is-loaded');
  }

  if (reduced) { revealAll(); return; }

  /* ---------------------------------------------------------------- 3. words
   * Split headings into per-word spans, preserving inline elements such as
   * the accent span inside the hero headline. Each word sits in a masked
   * wrapper so it can rise from behind the line above it.
   */
  function splitNode(node) {
    var kids = Array.prototype.slice.call(node.childNodes);
    for (var i = 0; i < kids.length; i++) {
      var child = kids[i];
      if (child.nodeType === 3) {
        var parts = child.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        for (var p = 0; p < parts.length; p++) {
          if (!parts[p]) continue;
          if (/^\s+$/.test(parts[p])) { frag.appendChild(document.createTextNode(parts[p])); continue; }
          var outer = document.createElement('span');
          outer.className = 'w';
          var inner = document.createElement('span');
          inner.className = 'w-i';
          inner.textContent = parts[p];
          outer.appendChild(inner);
          frag.appendChild(outer);
        }
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        splitNode(child);
      }
    }
  }

  var headings = document.querySelectorAll('[data-split]');
  for (var hi = 0; hi < headings.length; hi++) {
    splitNode(headings[hi]);
    headings[hi].classList.add('split');
    var words = headings[hi].querySelectorAll('.w-i');
    for (var wi = 0; wi < words.length; wi++) {
      words[wi].style.setProperty('--wd', (wi * 55) + 'ms');
    }
  }

  /* ------------------------------------------------------------- 2. stagger */
  var groups = document.querySelectorAll('[data-stagger]');
  for (var g = 0; g < groups.length; g++) {
    var kids2 = groups[g].children;
    for (var k = 0; k < kids2.length; k++) {
      kids2[k].setAttribute('data-reveal', '');
      kids2[k].style.setProperty('--reveal-delay', (k * 90) + 'ms');
    }
  }

  /* -------------------------------------------------------------- 2. reveal */
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

    var targets = document.querySelectorAll('[data-reveal], .split');
    for (var t = 0; t < targets.length; t++) io.observe(targets[t]);
  }

  /* -------------------------------------------------------------- 1. hero */
  function enterHero() { root.classList.add('is-loaded'); }
  requestAnimationFrame(function () { requestAnimationFrame(enterHero); });
  setTimeout(enterHero, 400);

  // Watchdog: if nothing has revealed shortly after load, the observer is not
  // doing its job — show everything rather than leave the page blank.
  setTimeout(function () {
    if (!document.querySelector('[data-reveal].is-in')) revealAll();
  }, 2500);

  /* ----------------------------------------------- 5. parallax + progress */
  var bar = document.querySelector('.scroll-progress');
  var visual = document.querySelector('.hero-visual .mockup');
  var ticking = false;

  function paintScroll() {
    var y = window.pageYOffset || root.scrollTop;
    if (bar) {
      var scrollable = root.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (scrollable > 0 ? Math.min(y / scrollable, 1) : 0) + ')';
    }
    if (visual && y < window.innerHeight * 1.6) {
      visual.style.transform = 'translate3d(0,' + (y * -0.045).toFixed(2) + 'px,0)';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paintScroll);
  }, { passive: true });
  paintScroll();


})();
