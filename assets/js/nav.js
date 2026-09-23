/* Mobile menu.
 *
 * Deliberately not part of motion.js: that file returns early when the visitor
 * prefers reduced motion, and a navigation menu must work regardless.
 *
 * Progressive enhancement. Without JS the links are simply visible, stacked
 * under the bar — usable, just not tidy. The `js` class on <html> is what
 * collapses them behind the button, so the button only ever appears when
 * there is something to run it.
 */
(function () {
  'use strict';

  var bar = document.querySelector('.nav-bar');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (!bar || !toggle || !links) return;

  function setOpen(open) {
    bar.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function () {
    setOpen(!bar.classList.contains('is-open'));
  });

  // Following a link should put the menu away.
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && bar.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Tapping outside closes it too.
  document.addEventListener('click', function (e) {
    if (bar.classList.contains('is-open') && !bar.contains(e.target)) setOpen(false);
  });

  // Leaving mobile width with the menu open would otherwise strand the state.
  if (window.matchMedia) {
    var wide = window.matchMedia('(min-width: 881px)');
    var onChange = function (e) { if (e.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onChange);
    else if (wide.addListener) wide.addListener(onChange);
  }

  setOpen(false);
})();
