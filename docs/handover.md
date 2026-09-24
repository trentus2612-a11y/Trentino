# Client handover checklist

Internal. Run this at the end of every build.

The site promises "the accounts are yours, in your name, from day one." This is
the list that makes that true.

**Current gap:** OzTrek4x4, Performance Covers and Ice Blast are all still sitting
in the Trentino Netlify team. Migrate them before pointing prospects at that
promise — OzTrek's October launch is a natural moment.

---

## Set up at the START, not the end

Some things can't be retrofitted cleanly.

- [ ] **Domain registered in the client's name**, on their card. Never yours.
      This is the one that turns ugly in a dispute.
- [ ] **Stripe account is theirs** — their business details, their bank, their
      identity checks. Never run a client's money through your account.
- [ ] **Supabase project is theirs** if the build needs one. It holds their
      customers' data.

## Build phase

- [ ] Build in your own Netlify. Faster, and previews work immediately.
- [ ] Code in a GitHub repo from day one.
- [ ] Send preview links as you go, so nothing is a surprise at the end.

## Handover

- [ ] **Client creates their own free Netlify account.**
- [ ] **They connect the same GitHub repo** — screen-share it, takes ten minutes.
      Their account, their billing, no seat cost, same code.
      (Netlify's free plan is one member per team, so "just add me to yours"
      doesn't work without someone paying for a seat.)
- [ ] Custom domain connected in their Netlify, HTTPS confirmed.
- [ ] Form notifications pointed at their inbox, and **tested with a real
      submission**.
- [ ] Stripe live mode on, and **one real payment put through and refunded**.
- [ ] Decide the repo: transferred to their GitHub, or stays in yours. Say which
      in writing either way.
- [ ] Final 50% invoiced and paid.

## Access, so free bug fixes stay cheap

Your promise needs a way in. Pick one and write it down:

- **They invite you back when needed** — cleanest ownership, slowest fixes.
- **You stay a collaborator on the GitHub repo** — you push a fix, their Netlify
  deploys it, you never touch their hosting. **Default to this one.**

Otherwise "free bug fixes" quietly becomes "free bug fixes, if I can get in."

## Hand them a page

One email, in plain words:

- Where the site lives and how to log in
- Where form submissions arrive
- Where to see orders and payments
- What to ring you about (broken) vs what's a quote (new)
- Your number: 0420 902 228

## A fortnight later

- [ ] Check in. Anything broken?
- [ ] Ask for a testimonial while it's fresh.
- [ ] Ask for a referral: "anyone in the trade whose website is embarrassing them?"
