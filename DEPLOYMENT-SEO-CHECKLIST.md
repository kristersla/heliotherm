# Deployment SEO checklist

1. Back up the current production files.
2. Deploy the repository changes to the production document root.
3. Purge the Cloudflare cache.
4. Confirm Cloudflare DNS records intended for the website are proxied if Cloudflare analytics and caching are desired.
5. Use Full (strict) SSL when the origin certificate supports it.
6. Test all canonical redirects, including non-www, HTTP, `/index.html`, slash variants and legacy routes.
7. Confirm HTML is not being served from an obsolete cache.
8. Submit `https://www.heliotherm.lv/sitemap.xml` in Google Search Console.
9. Inspect priority URLs: `/`, `/produkti/`, `/piedavajumi/`, `/kontakti/`, `/siltumsukni/siltuma-avoti-siltumsukniem/`, `/siltumsukni/ka-darbojas-siltumsuknis/`, `/siltumsukni/dzesesana-ar-siltumsukni/`.
10. Request indexing only after the final canonical version is live.
11. Check Page Indexing, HTTPS, Core Web Vitals and Rich Results reports.
12. Review server logs for Googlebot crawl errors.
13. Monitor impressions, clicks, average position and query-to-page matching.
14. Do not repeatedly request indexing every day.
