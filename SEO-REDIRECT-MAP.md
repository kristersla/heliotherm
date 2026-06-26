# SEO redirect map

Canonical architecture: production HTTPS `www.heliotherm.lv`, extensionless page routes with trailing slash, and no public `/index.html` variants. Arbitrary preview/staging hosts are not forced to production.

| Old URL | Final URL | Reason | Implementation location | Expected status |
|---|---|---|---|---|
| `http://heliotherm.lv/*` | `https://www.heliotherm.lv/*` | HTTPS + www canonical production host | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `https://heliotherm.lv/*` | `https://www.heliotherm.lv/*` | www canonical production host | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `http://www.heliotherm.lv/*` | `https://www.heliotherm.lv/*` | HTTPS for canonical production host; respects `X-Forwarded-Proto: https` | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `localhost`, preview or staging hosts | unchanged host | Avoid redirecting non-production hosts to production | `.htaccess`, `httpdocs/.htaccess` | no host redirect |
| `/*/index.html` | `/*/` | Remove duplicate index files | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/produkti` | `/produkti/` | Trailing-slash canonical | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/par-mums` | `/par-mums/` | Trailing-slash canonical | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/piedavajumi` | `/piedavajumi/` | Trailing-slash canonical | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/kontakti` | `/kontakti/` | Trailing-slash canonical | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/sazinaties-ar-mums` | `/kontakti/` | Superseded contact route | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/pakalpojumi` | `/piedavajumi/` | Existing service hub equivalent | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/siltumsukni` and `/siltumsukni/` | `/produkti/` | No approved designed heat-pump hub exists; product catalogue is the strongest retained commercial equivalent | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/siltumsuknis/` | `/produkti/` | Legacy singular heat-pump route maps to the product range | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/siltumsuknis/info-par-siltumsukniem/` | `/siltumsukni/ka-darbojas-siltumsuknis/` | Legacy informational route equivalent | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/siltumsuknis/info-par-siltumsukniem/geotermalais-siltumsuknis` | `/siltumsukni/siltuma-avoti-siltumsukniem/` | No retained standalone geothermal file exists; destination contains existing ground/geosonde/zemes-siltumsūknis source content | `.htaccess`, `httpdocs/.htaccess` | 301 |
| `/produkti/produkts/index.html?item=*` | unchanged parameterized URL | Product selection depends on `item`; no redirect drops the selected product | product page | 200 |
