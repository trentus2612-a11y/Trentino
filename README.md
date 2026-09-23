# Trentino

Marketing site for **Trentino** — custom web design and development, Adelaide SA.

Plain HTML and CSS, no build step, no dependencies. Netlify publishes the repo
root exactly as it is, so what you see locally is what goes live.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole site — hero, pricing, process, ownership, FAQ, contact form |
| `thanks.html` | Form success page (Netlify redirects here after a submission) |
| `404.html` | Not-found page; Netlify serves it automatically, no config needed |
| `work/performance-covers.html` | First case study |
| `assets/js/nav.js` | Mobile menu. Separate from motion.js on purpose — see below |
| `assets/img/og-image.png` | Social share card, 1200x630 |
| `assets/css/styles.css` | All styling. Brand tokens live in `:root` at the top |
| `assets/img/mark.svg` | T monogram, navy tile (also copied to `favicon.svg`) |
| `assets/img/mark-light.svg` | Same monogram on a light tile, for dark backgrounds |
| `netlify.toml` | Publish dir, security headers, cache rules, `/thanks` redirect |
| `robots.txt`, `sitemap.xml` | Search engine basics |

## Running it locally

No tooling required — open `index.html` in a browser. For paths that start with
`/` to resolve correctly, serve it instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project** → pick this repo.
3. Leave the build command empty and the publish directory as `.` — `netlify.toml`
   already sets this.
4. Deploy. You get a `*.netlify.app` URL immediately.
5. **Domain settings → Add a custom domain** → point the domain's nameservers (or
   an `ALIAS`/`CNAME` record) at Netlify. HTTPS is issued automatically.

### The contact form

The form uses [Netlify Forms](https://docs.netlify.com/forms/setup/) — no backend,
no API keys. It works because the `<form>` carries `data-netlify="true"`, a hidden
`form-name` input, and a honeypot field (`company-website`) that traps bots.

Submissions appear under **Forms → enquiry** in the Netlify dashboard. To also get
them by email, set up **Forms → Form notifications → Email notification**. Netlify's
free tier includes 100 submissions per month.

## Typefaces

Two families, loaded from Google Fonts in one request, each with a real fallback:

| Role | Face | Used for |
| --- | --- | --- |
| Display & body | Manrope | the wordmark, headings and all running text |
| Utility | JetBrains Mono | eyebrows, prices, step numbers, small labels |

This was four families until the brand direction changed; Manrope now covers
what Bricolage Grotesque, Figtree and Baloo 2 were each doing separately.

## The logo

`assets/img/mark.svg` is the T monogram: a graphite tile, a T in the surface
colour, and one signal-blue dot. It is also copied to `favicon.svg`.
`assets/img/mark-light.svg` inverts it for use on dark backgrounds.

The wordmark is not artwork — it is the word "trentino" set in Manrope 800,
lowercase, tracked at -0.045em. That is deliberate: a wordmark that is live text
stays sharp at every size, needs no asset, and can be restyled from CSS.

### Replacing it with exported artwork

If a designed logo is ever commissioned, drop the file in `assets/img/` and swap
the lockup — one change in each of `index.html` (header and footer) and
`thanks.html`:

```html
<!-- replace this -->
<svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true">…</svg>
<span class="brand-word">trentino</span>

<!-- with this -->
<img class="brand-logo" src="/assets/img/logo.svg" alt="Trentino" width="170" height="36">
```

then add:

```css
.brand-logo { height: 34px; width: auto; display: block; }
```

Use the dark-on-light version in the header and footer, and the light version
anywhere it sits on a slab. Replace `favicon.svg` and `assets/img/og-image.png`
to match.

## Colour

Graphite and one signal blue. The blue appears only where something is
clickable or live — that restraint is the whole idea, so resist spending it on
decoration.

```css
--graphite-900: #0e1014;  /* the hero slab */
--graphite-800: #121418;  /* slabs, headings, the mark */
--graphite-700: #1d2027;  /* lifted dark surfaces */

--signal:      #2f5be0;   /* fills, buttons, graphics */
--signal-ink:  #2a52cc;   /* small text and links on light grounds */
--signal-soft: #6e93ff;   /* anything on graphite */

--paper:       #f6f7f9;   /* page ground */
--ink:         #121418;   /* body text */
--ink-muted:   #5a6070;   /* secondary text */
```

Three blues rather than one, because a single value cannot clear 4.5:1 on both
a white and a graphite ground. Use `--signal` for shapes, `--signal-ink` for
words on light, `--signal-soft` for anything on dark. Every value above has been
contrast-checked against the surface it sits on.

The neutrals are cool and very slightly blue rather than pure grey, so the page
reads as one family instead of a blue accent dropped onto grey.

## The mobile menu

Below 880px the links collapse behind a button. It lives in `assets/js/nav.js`
rather than `motion.js` because that file returns early for visitors who prefer
reduced motion, and navigation has to work for them too.

It degrades in the right direction: without JavaScript the `js` class is never
set, the button never appears, and the links simply show stacked under the bar.
Usable, just not tidy. Test that path by removing the inline `js` class setter
in the `<head>`.

## The social share card

`assets/img/og-image.png` is a real PNG, because Facebook, LinkedIn and iMessage
do not render SVG share images. It is generated from an HTML file rather than
drawn by hand — the source lives in the session that made it, so if the headline
or price on the card needs to change, the quickest path is to rebuild it from
`index.html`'s hero at 1200x630 and re-export.

Note the `og:image` URL is absolute (`https://trentino.com.au/...`). It has to
be: relative URLs do not work for social crawlers. Update it when the real
domain is settled.

## Things that are built but switched off

Two blocks sit commented out in `index.html`, ready to enable:

- **Testimonials** — search for `Testimonials`. Delete the two comment marker
  lines, replace each quote and name, and it appears between the work and the
  process sections. Do not publish it with the placeholder text in place.
- **Book a call** — search for `PASTE_YOUR_BOOKING_LINK` in the contact section.
  Paste a booking URL (Cal.com has a free tier), remove the comment markers.

## The speed numbers

The `#speed` section quotes 47 KB / 142 KB / 7 files. Those are measured, not
estimated, so they go stale as the site changes. To re-measure:

```bash
python3 - <<'EOF'
import gzip, os
text = ['index.html', 'assets/css/styles.css', 'assets/js/motion.js', 'favicon.svg']
imgs = ['assets/img/work/oztrek4x4.webp', 'assets/img/work/performance-covers.webp',
        'assets/img/work/ice-blast-adelaide.webp']
tg = sum(len(gzip.compress(open(f,'rb').read(), 6)) for f in text)
ti = sum(os.path.getsize(f) for f in imgs)
print(f'first screen : {(tg + os.path.getsize(imgs[0]))/1024:.0f} KB')
print(f'whole page   : {(tg+ti)/1024:.0f} KB over {len(text)+len(imgs)} files')
EOF
```

The figures exclude webfonts, which are fetched from Google's CDN — worth saying
if anyone asks, since it is the one number that isn't self-hosted.

## Case studies

`work/performance-covers.html` is the first one. It has two `FILL IN` comments:
what the client was doing before, and the result. A single true number beats the
whole page of description — and if there isn't one, delete the section rather
than inventing it.

## Content worth reviewing before launch

- Pricing ranges in the `#pricing` section.
- The **50% up front / 50% on delivery** terms stated in step 2 and step 4 of `#process`.
- The canonical URL, `og:url` and sitemap all assume `https://trentino.com.au/` —
  update them once the real domain is registered.
