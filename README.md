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
| `assets/img/mark.svg` | Placeholder logo mark (also copied to `favicon.svg`) |
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

## Changing the brand

Every colour is a custom property at the top of `assets/css/styles.css`:

```css
--crimson:      #b3232c;  /* primary brand red */
--crimson-soft: #e8747c;  /* lightened red — used on navy for contrast */
--navy:         #1c2a4a;  /* brand navy-indigo */
```

`--crimson-soft` exists because the full crimson only hits 2.1:1 against navy,
which fails accessibility contrast. Keep a lighter tint for anything red sitting
on a dark background.

The typeface is [Outfit](https://fonts.google.com/specimen/Outfit) (geometric sans,
matching the logo direction), loaded from Google Fonts with a system-font fallback.

## Replacing the logo

`assets/img/mark.svg` is a placeholder built from the brand colours. When the real
logo exists, replace that file and re-copy it to `favicon.svg`. The inline copies of
the mark in `index.html` and `thanks.html` (in the header and footer `.brand` links)
need updating too — search for `<svg viewBox="0 0 64 64"`.

## Content worth reviewing before launch

- Pricing ranges in the `#pricing` section.
- The **50% up front / 50% on delivery** terms stated in step 2 and step 4 of `#process`.
- The canonical URL, `og:url` and sitemap all assume `https://trentino.com.au/` —
  update them once the real domain is registered.
