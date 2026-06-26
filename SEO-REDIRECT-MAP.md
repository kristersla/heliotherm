# SEO redirect map

Canonical architecture: HTTPS, `www.heliotherm.lv`, lowercase extensionless routes, trailing slash for page routes, and no public `/index.html` variants. Implemented in `.htaccess` and `httpdocs/.htaccess`.

| Old URL | Final URL | Reason | Implementation location | Expected status |
|---|---|---|---|---|
| `http://heliotherm.lv/*` | `https://www.heliotherm.lv/*` | HTTPS + www canonical production host | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `https://heliotherm.lv/*` | `https://www.heliotherm.lv/*` | www canonical production host | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `http://www.heliotherm.lv/*` | `https://www.heliotherm.lv/*` | HTTPS for canonical production host; respects `X-Forwarded-Proto: https` to avoid proxy loops | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `localhost`, preview or staging hosts | unchanged host | Do not force arbitrary hosts to production | `.htaccess`, `httpdocs/.htaccess` | no host redirect |
| `/*/index.html` | `/*/` | Remove duplicate index files | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/produkti` | `/produkti/` | One trailing-slash canonical page; prevents separate old/new documents | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/par-mums` | `/par-mums/` | Trailing-slash canonical | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/piedavajumi` | `/piedavajumi/` | Trailing-slash canonical | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/kontakti` | `/kontakti/` | Trailing-slash canonical | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/sazinaties-ar-mums` | `/kontakti/` | Superseded contact route | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/pakalpojumi` | `/piedavajumi/` | Existing service hub equivalent | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/siltumsukni` and `/siltumsukni/` | `/produkti/` | No approved designed heat-pump hub exists; avoid a thin generic page | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/siltumsuknis/` | `/produkti/` | Legacy singular heat-pump route maps to the product range | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/siltumsuknis/info-par-siltumsukniem/` | `/siltumsukni/ka-darbojas-siltumsuknis/` | Legacy informational route equivalent | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/siltumsuknis/info-par-siltumsukniem/geotermalais-siltumsuknis` | `/siltumsukni/siltuma-avoti-siltumsukniem/` | No retained standalone geothermal file exists; destination contains stronger existing ground/geosonde/zemes-siltumsūknis source content | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/produkti/produkts/index.html?item=*` | unchanged parameterized product URL | Product selection depends on the `item` query parameter; redirects that drop it are intentionally removed | product page JavaScript updates title, description, H1 and canonical dynamically | 200 |

Final `/siltumsukni/` decision: no approved designed `/siltumsukni/` hub exists in the current repository, and the previous generic page was removed. `/produkti/` is currently the strongest approved equivalent because it presents the full Heliotherm siltumsūkņu range without introducing a thin redesign. Future migration recommended: create a designed heat-pump hub and individual product URLs only after product routing and approved factual content are ready.
