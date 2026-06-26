const fs=require('fs'), path=require('path');
const root=process.argv[2]||'.';
const base='https://www.heliotherm.lv';
const files=[]; function walk(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f); if(p.includes('vendor')||p.includes('node_modules')||p.includes('.git')||(root==='.'&&p.startsWith('httpdocs'+path.sep))) continue; const st=fs.statSync(p); if(st.isDirectory()) walk(p); else if(f==='index.html') files.push(p)}} walk(root);
let errors=[]; const titles=new Map();
for(const f of files){const html=fs.readFileSync(f,'utf8'); const rel=path.relative(root,f);
 const title=(html.match(/<title>([^<]+)<\/title>/i)||[])[1]; if(!title) errors.push(`${rel}: missing title`); else { if(titles.has(title)) errors.push(`${rel}: duplicate title with ${titles.get(title)}: ${title}`); titles.set(title,rel); }
 if(!/<meta\s+name=["']description["'][^>]+content=["'][^"']{30,}/i.test(html)) errors.push(`${rel}: missing useful meta description`);
 const canon=(html.match(/<link\s+rel=["']canonical["'][^>]+href=["']([^"']+)/i)||[])[1]; if(!canon) errors.push(`${rel}: missing canonical`); else if(!canon.startsWith(base)) errors.push(`${rel}: canonical not production absolute`);
 const h1=(html.match(/<h1\b/gi)||[]).length; if(h1!==1) errors.push(`${rel}: expected 1 h1, found ${h1}`);
 if(!/<html\s+lang=["']lv["']/i.test(html)) errors.push(`${rel}: html lang is not lv`);
 for(const m of html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{JSON.parse(m[1])}catch(e){errors.push(`${rel}: malformed JSON-LD ${e.message}`)}}
 if(/localhost|staging|127\.0\.0\.1/i.test(html)) errors.push(`${rel}: development URL found`);
}
const sm=fs.existsSync(path.join(root,'sitemap.xml'))&&fs.readFileSync(path.join(root,'sitemap.xml'),'utf8'); if(!sm) errors.push('missing sitemap.xml'); else {for(const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)){const loc=m[1]; if(!loc.startsWith(base)||loc.includes('?')||!loc.endsWith('/')) errors.push(`bad sitemap URL: ${loc}`)}}
const ht=fs.existsSync(path.join(root,'.htaccess'))&&fs.readFileSync(path.join(root,'.htaccess'),'utf8'); if(ht && !/Options -MultiViews/.test(ht)) errors.push('.htaccess should disable MultiViews');
if(errors.length){console.error(errors.join('\n')); process.exit(1)} console.log(`SEO check passed for ${files.length} HTML pages in ${root}`);
