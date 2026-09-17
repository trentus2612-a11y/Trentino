# Trentino

Marketing site for **Trentino** — custom web design and development, Adelaide SA.

Plain HTML and CSS, no build step, no dependencies. Netlify publishes the repo
root exactly as it is, so what you see locally is what goes live.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole site — hero, pricing, process, ownership, FAQ, contact form |
| `thanks.html` | Form success page (Netlify redirects here after a submission) |
| `assets/css/styles.css` | All styling. Brand tokens live in `:root` at the top |
| `assets/img/mark.svg` | T monogram, navy tile (also copied to `favicon.svg`) |
| `assets/img/mark-light.svg` | Same monogram on a light tile, for dark backgrounds |
| `assets/img/og-image.svg` | Social share image |
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

Three faces, loaded from Google Fonts in one request, each with a real fallback:

| Role | Face | Used for |
| --- | --- | --- |
| Wordmark | Baloo 2 ExtraBold | the "Trentino" lockup only |
| Display | Bricolage Grotesque | headings |
| Body | Figtree | running text, buttons, form fields |
| Utility | JetBrains Mono | eyebrows, prices, step numbers, small labels |

## The logo

`assets/img/mark.svg` is the **T monogram redrawn as vector** from the logo sheet
Trent supplied — two skewed bars plus a stem, in a rounded navy square. It is also
copied to `favicon.svg` and used inline in the page headers. `assets/img/mark-light.svg`
is the same mark on a light tile, for use on dark backgrounds.

The full wordmark (the slanted T, the red asterisk over the i, and the final o drawn
as a browser window) is **not** reproduced here. The site sets "Trentino" in
[Baloo 2](https://fonts.google.com/specimen/Baloo+2) ExtraBold instead, which is the
closest rounded geometric on Google Fonts.

### Dropping in the real logo file

When the exported logo is available, put it in `assets/img/` and swap the lockup —
one change in each of `index.html` (two places: header and footer) and `thanks.html`:

```html
<!-- replace this -->
<svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true">…</svg>
<span class="brand-word">Trentino</span>

<!-- with this -->
<img class="brand-logo" src="/assets/img/logo.svg" alt="Trentino" width="170" height="36">
```

then add to the stylesheet:

```css
.brand-logo { height: 34px; width: auto; display: block; }
```

Use the **navy-on-light** version in the header and footer, and the **white-on-navy**
version anywhere it sits on a slab. SVG is strongly preferred over PNG — it stays
sharp on every screen and the file is smaller. If only a PNG exists, export it at
3× the display size.

Also replace `favicon.svg` (the square icon version) and `assets/img/og-image.svg`
(the social share card) so they match.

## Colour

Two reds, by job:

```css
--red:     #de2028;  /* the logo's red — fills, buttons, the mark, graphics */
--red-ink: #b3232c;  /* deeper — small text and links on light backgrounds */
--red-soft:#f3898d;  /* the only red legible as text on navy */
--navy-800:#1c2a4a;  /* brand navy */
--navy-900:#131b30;  /* deeper navy for the hero slab */
```

The split exists because the logo red only reaches 4.7:1 against white, which is
tight for 12px label text. `--red-ink` reaches 6.6:1. Anything that is a shape
rather than small text should use `--red`.

## Content worth reviewing before launch

- Pricing ranges in the `#pricing` section.
- The **50% up front / 50% on delivery** terms stated in step 2 and step 4 of `#process`.
- The canonical URL, `og:url` and sitemap all assume `https://trentino.com.au/` —
  update them once the real domain is registered.
