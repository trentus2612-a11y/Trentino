/* Price estimator.
 *
 * Maps four answers onto the tiers already published on this page. It never
 * invents a figure: every number here appears in the pricing section too, and
 * anything outside those bands is called out as "quoted separately" rather
 * than guessed at.
 *
 * Separate from motion.js, which returns early for reduced-motion visitors —
 * a pricing tool has to work for everyone.
 */
(function () {
  'use strict';

  var form = document.getElementById('estimator');
  if (!form) return;

  var out = {
    tier:  document.getElementById('est-tier'),
    price: document.getElementById('est-price'),
    time:  document.getElementById('est-time'),
    note:  document.getElementById('est-note')
  };

  // Each result maps to a tier on this page. `select` is the exact option text
  // in the enquiry form, so the two can never drift apart.
  var RESULTS = {
    payments: {
      tier: 'E-commerce / Payments',
      price: '$1,350 – $2,850',
      time: 'Usually 2–4 weeks',
      note: 'Includes everything in the tiers below it, plus Stripe checkout and order handling. Foundation pricing applied — $150 off the usual $1,500–$3,000.',
      select: 'E-commerce / Payments — Stripe checkout'
    },
    backend: {
      tier: 'Business + Backend',
      price: '$750 – $1,650',
      time: 'Usually 2–4 weeks',
      note: 'A database for your business data, customer logins, and an admin view you run yourself. Foundation pricing applied — $150 off the usual $900–$1,800.',
      select: 'Business + Backend — data & logins'
    },
    starter: {
      tier: 'Starter Site',
      price: '$349',
      time: 'Usually 1–2 weeks',
      note: 'Up to five pages, a contact form, and your own domain connected. Fixed price, not an hourly estimate.',
      select: 'Starter Site — up to 5 pages'
    },
    starterPlus: {
      tier: 'Starter Site, extended',
      price: 'From $349',
      time: 'Usually 2–3 weeks',
      note: 'The Starter build covers five pages. Beyond that I quote the extra pages on top rather than guess at them here — it depends what is on them.',
      select: 'Starter Site — up to 5 pages'
    }
  };

  function current() {
    var v = function (name) {
      var el = form.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : '';
    };
    if (v('payments') === 'yes') return RESULTS.payments;
    if (v('data') === 'yes') return RESULTS.backend;
    if (v('pages') === 'many') return RESULTS.starterPlus;
    return RESULTS.starter;
  }

  function render() {
    var r = current();
    out.tier.textContent = r.tier;
    out.price.textContent = r.price;
    out.time.textContent = r.time;
    out.note.textContent = r.note;
  }

  form.addEventListener('change', render);
  render();

  /* Carry the answers into the enquiry form, so what arrives is already
     scoped rather than "how much for a website?". */
  var send = document.getElementById('est-send');
  if (!send) return;

  send.addEventListener('click', function () {
    var r = current();
    var select = document.getElementById('project');
    var message = document.getElementById('message');

    if (select) {
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].text === r.select) { select.selectedIndex = i; break; }
      }
    }

    if (message) {
      var pages = form.querySelector('input[name="pages"]:checked');
      var data = form.querySelector('input[name="data"]:checked');
      var pay = form.querySelector('input[name="payments"]:checked');
      var when = form.querySelector('input[name="when"]:checked');
      var lines = [
        'From the estimator: ' + r.tier + ' (' + r.price + ')',
        '· Pages: ' + (pages && pages.value === 'many' ? 'more than 5' : 'up to 5'),
        '· Logins or stored data: ' + (data && data.value === 'yes' ? 'yes' : 'no'),
        '· Takes payments online: ' + (pay && pay.value === 'yes' ? 'yes' : 'no'),
        '· Timing: ' + (when ? when.value : 'not sure'),
        '',
        ''
      ].join('\n');
      if (message.value.indexOf('From the estimator:') === -1) {
        message.value = lines + message.value;
      }
    }

    var contact = document.getElementById('contact');
    if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var name = document.getElementById('name');
    if (name) setTimeout(function () { name.focus({ preventScroll: true }); }, 600);
  });
})();
