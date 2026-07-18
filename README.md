# Card Vault

Mt. Pleasant's card shop for kids — hold now, pick up on Vault Day.
Built by Sebastian Perry (CEO, age 10) with Claude.

## What's in here

| File | What it is |
|---|---|
| `index.html` | The storefront — browse cards, put up to 5 on free hold, reserve by email |
| `scanner.html` | Vault Scanner — appraisal tool: card finder (live Pokémon database), photo reader (OCR), trader accounts, credit ledger, My Vault collections |
| `database.html` | Vault Database — mission control: merges scanner saves from all devices, shows inventory/traders/appraisals, exports everything |
| `manifest.webmanifest` + `sw.js` + icons | PWA support — once hosted, the site installs to a phone home screen like a real app and works offline |
| `MILESTONES.md` | The business roadmap |

Everything is client-side (no backend yet — by design). Data lives in each browser's
localStorage; the scanner's Save/Restore buttons move it between devices.

## Deploy it (Dad's 10-minute job)

The PWA features (home-screen install, offline mode) only switch on when served
over https — they're wired in and dormant until then.

**Option A — GitHub Pages (free):**
1. Create a GitHub account (or use yours) and a new repository called `card-vault`
2. In this folder: `git remote add origin <your-repo-url>` then `git push -u origin main`
3. Repo Settings → Pages → Deploy from branch → `main` → root
4. Site appears at `https://<username>.github.io/card-vault/`

**Option B — Vercel or Netlify (free):** create an account, drag this folder into
their dashboard. Done.

After deploying: open the site on the iPhone → Share → Add to Home Screen.
Card Vault icon, full screen, works offline at the pop-up.

## The roadmap to "really built" (agreed with Dad)

1. ✅ Repo + version control (this)
2. ✅ PWA wiring (dormant until hosted)
3. ⬜ Host it (above)
4. ⬜ Supabase ledger — traders / append-only transactions / cards, RLS,
   server-enforced rules (no minting credit, spend ≤ balance). Parent owns keys.
5. ⬜ Real auth (magic link / Google), parent-owned accounts (COPPA)
6. ⬜ Serverless proxy for paid APIs (Ximilar photo-ID, eBay sports pricing)
7. ⬜ Shopify storefront for real checkout
8. ⬜ Backups, error reporting, tests on the ledger math

Trigger for step 4: kids actually carrying credit balances between Vault Days.

## Dev notes

- The store's inventory is the `const cards = [...]` array in `index.html`
- The scanner's Pokémon lookup: `api.pokemontcg.io/v2` (public, keyless, CORS-open)
- OCR: Tesseract.js v5 from jsDelivr CDN
- Known debt: trader names render unescaped into HTML (fine single-user, XSS risk
  multi-user — fixed when auth lands); localStorage is source of truth until step 4
