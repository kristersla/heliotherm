# SEO audit route inventory

Framework: static HTML/CSS/JavaScript site with PHP form endpoint and Apache `.htaccess`; deployment copy is mirrored in `httpdocs/`. Routing is directory-index based with Apache redirects.

## Findings addressed

- `/produkti/` used the About page title; this was fixed without changing the approved product-page layout.
- Generic `Heliotherm Baltic` titles on informational pages were replaced with unique metadata.
- Three informational pages had no H1; their existing visible H2 headings were changed semantically to H1 while preserving identical styling.
- Canonical redirects now cover production host, HTTPS, slash and `/index.html` variants without forcing arbitrary preview/staging hosts to production.
- Product query-string URLs remain working and are not redirected to generic pages.
- No new landing pages are published in this cleanup.
