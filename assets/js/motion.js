/* Trentino — motion layer.
 *
 * Behaviours, in the order they appear below:
 *   1. Hero entrance on load
 *   2. Reveal-on-scroll (with per-group stagger)
 *   3. Headlines that rise in word by word from behind a mask
 *   4. Work screenshots uncovered by a wipe
 *   5. Parallax drift on the hero screenshot + a reading progress bar
 *   6. Magnetic buttons and a custom cursor  (fine pointers only)
 *   7. Weighted smooth scrolling             (fine pointers only)
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
  // Pointer-driven effects are desktop-only: a custom cursor is meaningless on
  // touch, and phones already have better momentum scrolling than we can fake.
  var finePointer = mq && mq('(pointer: fine)').matches && !('ontouchstart' in window);

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

  if (!finePointer) return;

  /* ------------------------------------------------------------ 6. magnetic */
  var magnets = document.querySelectorAll('[data-magnetic]');
  for (var m = 0; m < magnets.length; m++) {
    (function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + (dx * 0.18).toFixed(1) + 'px,' + (dy * 0.28).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    })(magnets[m]);
  }

  /* -------------------------------------------------------------- 6. cursor */
  try {
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var px = window.innerWidth / 2, py = window.innerHeight / 2;
    var rx = px, ry = py, seen = false;

    document.addEventListener('pointermove', function (e) {
      px = e.clientX; py = e.clientY;
      if (!seen) { rx = px; ry = py; seen = true; root.classList.add('cursor-live'); }
      dot.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0)';
    }, { passive: true });

    document.addEventListener('pointerdown', function () { root.classList.add('cursor-down'); });
    document.addEventListener('pointerup', function () { root.classList.remove('cursor-down'); });

    var hot = document.querySelectorAll('a, button, summary, .work-card, .tier');
    for (var h = 0; h < hot.length; h++) {
      hot[h].addEventListener('pointerenter', function () { root.classList.add('cursor-hot'); });
      hot[h].addEventListener('pointerleave', function () { root.classList.remove('cursor-hot'); });
    }

    (function ringLoop() {
      rx += (px - rx) * 0.16;
      ry += (py - ry) * 0.16;
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      requestAnimationFrame(ringLoop);
    })();

    // Only hide the system cursor once ours is definitely drawing.
    root.classList.add('has-cursor');
  } catch (err) { /* keep the system cursor */ }

  /* -------------------------------------------------- 7. weighted scrolling
   * Wheel events are intercepted and eased toward a target, but the real
   * window scroll position is what moves — so position:sticky, fixed headers
   * and anchor links all keep working, unlike a transformed-wrapper approach.
   */
  var target = window.pageYOffset;
  var current = target;
  var animating = false;

  function maxScroll() { return root.scrollHeight - window.innerHeight; }

  function glide() {
    current += (target - current) * 0.14;
    if (Math.abs(target - current) < 0.5) { current = target; animating = false; }
    else { requestAnimationFrame(glide); }
    window.scrollTo(0, current);
  }

  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey) return;                       // pinch-zoom
    var delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 16;          // lines
    else if (e.deltaMode === 2) delta *= window.innerHeight;
    e.preventDefault();
    target = Math.max(0, Math.min(target + delta, maxScroll()));
    if (!animating) { animating = true; requestAnimationFrame(glide); }
  }, { passive: false });

  // Anything that scrolls by other means — keyboard, scrollbar, anchor links —
  // resyncs the target so the next wheel tick does not snap back.
  window.addEventListener('scroll', function () {
    if (!animating) { target = current = window.pageYOffset; }
  }, { passive: true });

  window.addEventListener('resize', function () {
    target = current = window.pageYOffset;
  }, { passive: true });
})();
