# Heliotherm SEO migration recovery audit

Production domain: `https://www.heliotherm.lv`
Primary archive reviewed: `https://web.archive.org/web/20250320095841/https://www.heliotherm.lv/`

## Method and limitations

- Crawling from the container to Wayback and production returned `403 Forbidden`, so the audit combines repository inspection, current server configuration, current sitemap/metadata, and search-engine accessible cached snippets of archived/current legacy URLs.
- Content was not invented where archived text was unavailable. Restored pages use concise factual summaries and clearly avoid unsupported prices, warranties, savings, or guaranteed ranking claims.
- Existing modern pages were not edited for visible text, layout, CSS, images, forms, JavaScript interactions, or components.

## Legacy URL mapping and action table

| Old URL | Archived title | Archived H1 | Main topic | Search intent | Depth | Unique? | Important internal links | Current response observed | Current redirect destination | Current canonical | Current equivalent | Recommended action | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/siltumsukni` | `Siltumsūkņi - Heliotherm Baltics` | `Siltumsūkņi` | Siltumsūkņu information hub | Learn about heat pumps and find subtopics | Medium | Yes | darbības princips, siltuma avoti, dzesēšana, ieguvumi, leksikons | Local `.htaccess` redirected to `/produkti/`; production curl blocked with 403 | `/produkti/` in repo before change | n/a | Partial equivalent only | Restore at `/siltumsukni/` | Products page is commercial and does not fully match informational hub intent. |
| `/siltumsuknis/info-par-siltumsukniem/geotermalais-siltumsuknis` | Not fully accessible | Not fully accessible | Geothermal / ground-source heat pump | Understand geothermal, ground, ground-water concepts | Medium to high | Yes | likely heat-source and product links | Local `.htaccess` redirected to broad heat-source page; production curl blocked with 403 | `/siltumsukni/siltuma-avoti-siltumsukniem/` in repo before change | n/a | Broad partial equivalent | Restore at original URL | Dedicated valuable topic; broad redirect weakens intent. |
| `/siltumsuknis/info-par-siltumsukniem/geotermala-energija` | Not fully accessible | Not fully accessible | Geothermal energy | Learn what geothermal energy means for heat pumps | Medium | Yes | geothermal heat pump, heat sources | No local page before change; production curl blocked with 403 | n/a | n/a | Partial equivalent: heat-source page | Restore at original URL | Useful focused educational topic not duplicated by a current focused page. |
| `/siltumsuknis/info-par-siltumsukniem/udens-siltumsuknis` | Not fully accessible | Not fully accessible | Water / groundwater heat pump | Understand groundwater as heat source | Medium | Yes | heat pump principle, products | No local page before change; production curl blocked with 403 | n/a | n/a | Partial equivalent: products and heat-source page | Restore at original URL | Specific water-source intent would be diluted by broad redirects. |
| `/siltumsuknis/info-par-siltumsukniem/cop` | `Augstas Kvalitātes Siltumsūkņi Jebkuram Mājoklim | Heliotherm` | `Siltumsūkņu leksikons` | COP | Define COP and efficiency | Short/lexicon | Yes | products, leksikons | No local page before change; production curl blocked with 403 | n/a | n/a | No exact current page | Restore at original URL | COP/SCOP is a priority search topic and a distinct intent. |
| `/siltumsuknis/info-par-siltumsukniem/plusmas-temperatura` | `Siltumsūkņu leksikons - Heliotherm Baltics` | `Siltumsūkņu leksikons` | Flow temperature | Define flow temperature and effect on heating | Short/lexicon | Yes | products, COP | No local page before change; production curl blocked with 403 | n/a | n/a | No exact current page | Restore at original URL | Useful supporting topic for COP and system design. |
| `/siltumsuknis` | n/a | n/a | Duplicate/singular heat-pump route | Navigate to heat-pump information | Thin/utility | No | n/a | Local `.htaccess` redirected to `/produkti/` before change | `/produkti/` before change | n/a | `/siltumsukni/` | 301 to `/siltumsukni/` | Singular duplicate best maps to restored information hub. |
| `/siltumsuknis/info-par-siltumsukniem/` | n/a | n/a | Legacy info index | Navigate to heat-pump information | Thin/index | No | topic links | Local `.htaccess` redirected to current principle page before change | `/siltumsukni/ka-darbojas-siltumsuknis/` before change | n/a | `/siltumsukni/` | 301 to `/siltumsukni/` | Parent info index maps better to restored hub than one subtopic. |
| `/sazinaties-ar-mums/` | n/a | n/a | Contact | Contact company | Utility | No | contact details | 301 in repo | `/kontakti/` | n/a | `/kontakti/` | Keep 301 | Genuine equivalent. |
| `/pakalpojumi/` | n/a | n/a | Services/offers | View services/offers | Utility | No | services | 301 in repo | `/piedavajumi/` | n/a | `/piedavajumi/` | Keep 301 | Genuine equivalent. |

## Restored pages

- `/siltumsukni/`
- `/siltumsuknis/info-par-siltumsukniem/geotermalais-siltumsuknis/`
- `/siltumsuknis/info-par-siltumsukniem/geotermala-energija/`
- `/siltumsuknis/info-par-siltumsukniem/udens-siltumsuknis/`
- `/siltumsuknis/info-par-siltumsukniem/cop/`
- `/siltumsuknis/info-par-siltumsukniem/plusmas-temperatura/`

## Redirects added or retained

- Kept `301` `/sazinaties-ar-mums/` -> `/kontakti/`.
- Kept `301` `/pakalpojumi/` -> `/piedavajumi/`.
- Changed `301` `/siltumsuknis/` -> `/siltumsukni/`.
- Changed `301` `/siltumsuknis/info-par-siltumsukniem/` -> `/siltumsukni/`.
- Removed broad redirects from restored topic URLs so they can return canonical `200` pages.

## 404/410 decisions

No explicit 404 or 410 rules were added. The reviewed meaningful legacy URLs were either restored or mapped one-to-one to a relevant current page.

## Sitemap and robots.txt

- `sitemap.xml` now includes canonical HTTPS URLs for current indexable pages plus restored legacy pages.
- Redirecting legacy URLs and query-string product duplicates are not included.
- `robots.txt` continues to allow crawling and references `https://www.heliotherm.lv/sitemap.xml`.

## Metadata and canonical changes

- Restored pages include unique titles, meta descriptions, self-referencing canonical URLs, Open Graph title/description/URL/image, `index,follow`, and one H1.
- Existing current pages were not visibly changed.

## Internal links

- Added contextual links only inside restored pages.
- Recommended future visible links from approved modern pages to restored educational pages require client approval and were not implemented.

## Product URL notes

- Existing product URL pattern such as `/produkti/produkts/index.html?item=natural-goth` was not redesigned.
- Clean product URL migration was not attempted because it would require a riskier one-to-one product mapping and runtime behavior validation.

## Post-deployment Search Console checklist

1. Resubmit `sitemap.xml`.
2. Inspect the main products page.
3. Inspect the main heat-pump information page `/siltumsukni/`.
4. Inspect the restored geothermal page.
5. Inspect several redirected old URLs.
6. Confirm Google detects the intended redirects and canonicals.
7. Request indexing only for the most important restored canonical pages.
8. Monitor performance for at least 28 days.
9. Compare clicks, impressions, average position, queries containing `siltumsūkn`, queries containing `ģeoterm`, and queries containing `zemes siltumsūknis`.
10. Do not repeatedly submit every URL.

## Technical claims requiring client confirmation

- Suitability of water-source systems depends on actual groundwater availability, quality, flow and local requirements.
- Ground-source collector or borehole suitability depends on soil, land area, drilling options and project calculations.
- Product-specific COP/SCOP values should be confirmed from current Heliotherm technical documentation before adding visible claims.

## Remaining SEO risks

- Wayback access was partially blocked from the execution environment, so some archived H1/title details could not be independently extracted.
- Restored pages are intentionally concise to avoid unsupported claims; future expansion should use verified client-approved technical content.
- Existing modern pages do not visibly link to every restored page; adding those links would improve discovery but requires client approval because it changes visible content.

## Recommendations requiring visible content changes, not implemented

- Add a small approved educational links section on the modern heat-source page pointing to geothermal, water-source, COP and flow-temperature pages.
- Add a contextual link from product cards for ground and water systems to the matching restored educational page.
- Add FAQ content for geothermal and water-source eligibility after technical review by the client.
