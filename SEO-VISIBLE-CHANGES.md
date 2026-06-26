# SEO visible-change report

Goal: preserve the approved visual website and keep SEO work behind the scenes wherever possible.

| Production file changed | Visible to visitors? | What changes visually | Why necessary | Layout/styling changed? | Can original visual version be preserved? |
|---|---|---|---|---|---|
| `index.html` / `httpdocs/index.html` | No | Browser title/social preview metadata only | Unique homepage SEO metadata | No | Already preserved |
| `par-mums/index.html` / `httpdocs/par-mums/index.html` | No | Browser title/social preview metadata only | Unique page metadata | No | Already preserved |
| `produkti/index.html` / `httpdocs/produkti/index.html` | No | Browser title/social preview metadata only; existing visible H1 retained | Fix Products page receiving About metadata | No | Already preserved |
| `piedavajumi/index.html` / `httpdocs/piedavajumi/index.html` | No | Browser title/social preview metadata only | Unique services metadata | No | Already preserved |
| `kontakti/index.html` / `httpdocs/kontakti/index.html` | No | Browser title/social preview metadata only | Unique contact metadata | No | Already preserved |
| `produkti/produkts/index.html` / `httpdocs/produkti/produkts/index.html` | No | Browser title/social preview metadata only | Stable product-detail metadata | No | Already preserved |
| `siltumsukni/ka-darbojas-siltumsuknis/index.html` and mirror | Minimal | Existing heading tag changes from H2 to H1, with CSS parity so appearance should remain the same | One semantic H1 using the existing visible heading | Styling selector extended only to preserve original appearance | Yes, visual treatment preserved |
| `siltumsukni/dzesesana-ar-siltumsukni/index.html` and mirror | Minimal | Existing heading tag changes from H2 to H1, with CSS parity so appearance should remain the same | One semantic H1 using the existing visible heading | Styling selector extended only to preserve original appearance | Yes, visual treatment preserved |
| `siltumsukni/siltuma-avoti-siltumsukniem/index.html` and mirror | Minimal | Existing heading tag changes from H2 to H1, with CSS parity so appearance should remain the same | One semantic H1 using the existing visible heading | Styling selector extended only to preserve original appearance | Yes, visual treatment preserved |
| `siltumsukni/subsidijas-siltumsukniem/index.html` and mirror | No | Browser title/social preview metadata only | Unique supporting-page metadata | No | Already preserved |
| `siltumsukni/heliotherm-tehniskas-ipatnibas/index.html` and mirror | No | Browser title/social preview metadata only | Unique supporting-page metadata | No | Already preserved |
| `assets/js/components.js` / `httpdocs/assets/js/components.js` | No intended visual change | Header/footer appearance unchanged; root-relative links corrected | URL consistency in production | No | Already preserved |
| `.htaccess` / `httpdocs/.htaccess` | No | Redirect/header behavior only | Canonicalization, duplicate cleanup and performance headers | No | N/A |
| `robots.txt` / `httpdocs/robots.txt` | No | Search crawler directive only | Sitemap discovery | No | N/A |
| `sitemap.xml` / `httpdocs/sitemap.xml` | No | XML crawler file only | Canonical URL discovery | No | N/A |
| `scripts/seo-check.js`, `package.json`, docs | No | Not linked from public website | Maintenance and validation | No | N/A |

## Removed visible changes from the previous attempt

The plain one-line generic landing pages for `/siltumsukni/`, `/siltumsukni/zemes-siltumsuknis/`, `/siltumsukni/gaiss-udens-siltumsuknis/`, `/siltumsukni/siltumsukna-cena/`, `/siltumsukni/industrialie-siltumsukni/` and `/pakalpojumi/siltumsuknu-uzstadisana/` were removed because they did not preserve the approved design and did not contain enough approved factual content.

## Visual layout changes

None intended. Existing page layout, colors, spacing, typography, hero sections, animations, cards, buttons, product presentation, navigation appearance and responsive behavior are preserved.
