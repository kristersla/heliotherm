/* assets/js/components.js
   Light theme header and footer for Heliotherm
   - Fixed header with reserved space (no overlap)
   - Active nav highlighting + aria-current
   - Mobile menu with ESC and focus handling
   - LV / EN switch
   - EN opens official Heliotherm English website in a new tab
*/

/* ---------- Helpers ---------- */
function setActive(shadowRoot, explicitKey) {
  const key = (explicitKey || "").toLowerCase();
  let matched = false;

  if (key) {
    shadowRoot.querySelectorAll("a[data-key]").forEach((a) => {
      if (a.dataset.key === key) {
        a.classList.add("is-active");
        matched = true;
      }
    });
  }

  if (!matched) {
    const path = (location.pathname || "").toLowerCase();
    shadowRoot.querySelectorAll("a[data-key]").forEach((a) => {
      const href = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
      if (href && path.endsWith(href)) {
        a.classList.add("is-active");
        matched = true;
      }
    });
  }

  const active = shadowRoot.querySelector("a.is-active");
  if (active) active.setAttribute("aria-current", "page");
}

function getLangFromUrl() {
  try {
    const url = new URL(location.href);
    const q = (url.searchParams.get("lang") || "").toLowerCase();
    if (q === "lv" || q === "en") return q;
  } catch {}

  const stored = (localStorage.getItem("ht_lang") || "").toLowerCase();
  if (stored === "lv" || stored === "en") return stored;

  return "lv";
}

function setLangInUrl(lang) {
  try {
    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    localStorage.setItem("ht_lang", lang);
    location.href = url.toString();
  } catch {
    location.search = `?lang=${lang}`;
  }
}

/* ===================== <app-header> ===================== */

const headerTmpl = document.createElement("template");

headerTmpl.innerHTML = `
  <style>
    :host{
      display:block;
      position:relative;
      z-index:40;
      isolation:isolate;
      --header-h:72px;
      height:var(--header-h);
      box-sizing:border-box;
      max-width:100vw;
      overflow:hidden;
    }

    option{ color:#000 }

    header{
      position:fixed;
      top:0;
      left:0;
      right:0;
      z-index:9999;
      background:rgba(255,255,255,.9);
      border-bottom:1px solid var(--hair, #e9ebf0);
      backdrop-filter:saturate(1.2) blur(12px);
      -webkit-backdrop-filter:saturate(1.2) blur(12px);
      box-shadow:0 4px 16px rgba(0,0,0,.05);
      box-sizing:border-box;
      max-width:100vw;
    }

    .nav{
      display:flex;
      align-items:center;
      justify-content:space-between;
      width:100%;
      max-width:1200px;
      margin:0 auto;
      padding:.6rem min(5vw,24px);
      gap:clamp(14px,2vw,26px);
      box-sizing:border-box;
    }

    .brand{
      display:inline-flex;
      align-items:center;
      gap:.62rem;
      color:#0b0c0f;
      text-decoration:none;
      white-space:nowrap;
    }
    .brand-copy{
      display:flex;
      flex-direction:column;
      align-items:flex-start;
      gap:2px;
      line-height:1.05;
    }

    .brand .logo{
      height:26px;
      width:auto;
      display:block;
      transition:transform .12s ease;
    }

    .brand strong{
      font-weight:800;
      letter-spacing:.03em;
      font-size:.95rem;
    }
    .brand-tagline{
      font-size:.62rem;
      letter-spacing:.18em;
      text-transform:uppercase;
      color:#7b8493;
      font-weight:600;
    }

    .brand:hover .logo{
      transform:translateY(-1px);
    }

    nav ul{
      display:none;
      list-style:none;
      margin:0;
      padding:0;
      gap:1.4rem;
    }

    nav a{
      color:#5b6474;
      font-weight:600;
      position:relative;
      padding:.35rem .1rem;
      text-decoration:none;
      font-size:.92rem;
      transition:color .2s ease;
    }

    nav a:hover{
      color:#111827;
    }

    nav a.is-active{
      color:var(--brand, #C4122F);
    }

    nav a.is-active::after{
      content:"";
      position:absolute;
      left:0;
      right:0;
      bottom:-4px;
      height:2px;
      background:linear-gradient(90deg,#C4122F,#E22A46);
      border-radius:999px;
    }

    @media (min-width:860px){
      nav ul{
        display:flex;
      }
    }

    .lang{
      display:none;
      align-items:center;
    }

    .seg{
      display:inline-flex;
      gap:4px;
      padding:4px;
      background:#fff;
      border:1px solid var(--hair,#e9ebf0);
      border-radius:999px;
      box-shadow:0 2px 8px rgba(0,0,0,.04);
    }

    .seg-btn{
      appearance:none;
      border:0;
      background:transparent;
      cursor:pointer;
      padding:.32rem .64rem;
      border-radius:999px;
      color:#5b6474;
      font-weight:700;
      line-height:1;
      letter-spacing:.04em;
      font-size:.78rem;
      text-transform:uppercase;
      transition:background .18s ease, color .18s ease;
      text-decoration:none;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      font-family:inherit;
    }

    .seg-btn[aria-pressed="true"]{
      background:#f5f6f9;
      color:#0b0c0f;
      outline:1px solid #e9ebf0;
    }

    .seg-btn:focus-visible{
      outline:2px solid #F3A4AF;
      outline-offset:2px;
    }

    @media (min-width:860px){
      .lang{
        display:flex;
      }
    }

    .burger{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      width:40px;
      height:40px;
      border-radius:10px;
      border:1px solid #e4e6ee;
      background:#fff;
      color:#111827;
      cursor:pointer;
      box-shadow:0 2px 8px rgba(15,23,42,.06);
      transition:background .16s ease, transform .12s ease, box-shadow .16s ease;
    }

    .burger-icon{
      position:relative;
      width:18px;
      height:12px;
    }

    .burger-icon span{
      position:absolute;
      inset-inline:0;
      height:2px;
      border-radius:999px;
      background:#111827;
      transition:transform .18s ease, opacity .18s ease, top .18s ease, bottom .18s ease;
    }

    .burger-icon span:nth-child(1){
      top:0;
    }

    .burger-icon span:nth-child(2){
      top:5px;
    }

    .burger-icon span:nth-child(3){
      bottom:0;
    }

    .burger[aria-expanded="true"] .burger-icon span:nth-child(1){
      top:5px;
      transform:rotate(45deg);
    }

    .burger[aria-expanded="true"] .burger-icon span:nth-child(2){
      opacity:0;
    }

    .burger[aria-expanded="true"] .burger-icon span:nth-child(3){
      bottom:5px;
      transform:rotate(-45deg);
    }

    .burger:hover{
      background:#f8fafc;
      transform:translateY(-1px);
      box-shadow:0 4px 14px rgba(15,23,42,.08);
    }

    @media (min-width:860px){
      .burger{
        display:none;
      }
    }

    .mobile{
      position:fixed;
      left:0;
      right:0;
      top:var(--header-h);
      display:none;
      z-index:9998;
      background:#ffffff;
      border-top:1px solid #e5e7ef;
      box-shadow:0 18px 40px rgba(15,23,42,.12);
      max-height:calc(100vh - var(--header-h));
      overflow:auto;
      box-sizing:border-box;
      max-width:100vw;
    }

    .mobile.open{
      display:block;
      padding:10px min(5vw,24px) 16px;
      animation:fadeIn .16s ease-out;
    }

    .mobile ul{
      list-style:none;
      margin:0;
      padding:0;
      display:grid;
      gap:8px;
    }

    .mobile a{
      display:block;
      padding:.8rem .85rem;
      border-radius:12px;
      color:#0b0c0f;
      border:1px solid #e4e6ee;
      background:#f7f8fb;
      text-decoration:none;
      font-weight:600;
      font-size:.98rem;
    }

    .mobile a:hover{
      background:#ffffff;
    }

    .mobile .seg-btn{
      display:inline-flex;
      padding:.32rem .64rem;
      border-radius:999px;
      border:0;
      background:transparent;
      color:#5b6474;
      font-size:.78rem;
      font-weight:700;
    }

    .mobile .seg-btn[aria-pressed="true"]{
      background:#f5f6f9;
      color:#0b0c0f;
      outline:1px solid #e9ebf0;
    }

    .mobile .mlang{
      margin-top:12px;
      display:flex;
      justify-content:flex-start;
    }

    @keyframes fadeIn{
      from{
        opacity:0;
        transform:translateY(-6px);
      }
      to{
        opacity:1;
        transform:translateY(0);
      }
    }

    @media (max-width:600px){
      :host{
        --header-h:64px;
      }

      .nav{
        padding:.5rem min(5vw,18px);
      }

      .brand .logo{
        height:22px;
      }

      .brand-tagline{font-size:.56rem; letter-spacing:.14em}
    }
  </style>

  <header>
    <div class="nav">
      <a class="brand" href="/index.html#home" aria-label="Sākums">
        <img src="/heliotherm/media/image/logo.svg" alt="Heliotherm logo" class="logo" />
        <span class="brand-copy">
          <span class="brand-tagline">Premium Austrijas siltumsūkņi</span>
        </span>
      </a>

      <nav aria-label="Primārā navigācija">
        <ul>
          <li><a data-key="home" href="/heliotherm/">Sākums</a></li>
          <li><a data-key="about" href="/heliotherm/par-mums/">Par mums</a></li>
          <li><a data-key="products" href="/heliotherm/produkti/">Produkti</a></li>
          <li><a data-key="solutions" href="/heliotherm/piedavajumi/">Piedāvājumi</a></li>
          <li><a data-key="contacts" href="/heliotherm/kontakti/">Kontakti</a></li>
        </ul>
      </nav>

      <div class="lang" aria-label="Valodas izvēle">
        <div class="seg" id="lang-seg" role="group" aria-label="Language">
          <button type="button" class="seg-btn" data-lang="lv" aria-pressed="false">LV</button>
          <a
            class="seg-btn"
            data-lang="en"
            href="https://www.heliotherm.com/en/"
            target="_blank"
            rel="noopener noreferrer"
            aria-pressed="false"
          >EN</a>
        </div>
      </div>

      <button class="burger" aria-label="Izvēlne" aria-expanded="false" title="Atvērt izvēlni">
        <span class="burger-icon" aria-hidden="true">
          <span></span><span></span><span></span>
        </span>
      </button>
    </div>

    <div class="mobile">
      <ul>
        <li><a data-key="home" href="/heliotherm/">Sākums</a></li>
        <li><a data-key="about" href="/heliotherm/par-mums/">Par mums</a></li>
        <li><a data-key="products" href="/heliotherm/produkti/">Produkti</a></li>
        <li><a data-key="solutions" href="/heliotherm/piedavajumi/">Piedāvājumi</a></li>
        <li><a data-key="contacts" href="/heliotherm/kontakti/">Kontakti</a></li>
      </ul>

      <div class="mlang" aria-label="Valodas izvēle (mobilā)">
        <div class="seg" id="lang-seg-mobile" role="group" aria-label="Language (mobile)">
          <button type="button" class="seg-btn" data-lang="lv" aria-pressed="false">LV</button>
          <a
            class="seg-btn"
            data-lang="en"
            href="https://www.heliotherm.com/en/"
            target="_blank"
            rel="noopener noreferrer"
            aria-pressed="false"
          >EN</a>
        </div>
      </div>
    </div>
  </header>
`;

class AppHeader extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;

    const root = this.attachShadow({ mode: "open" });
    root.appendChild(headerTmpl.content.cloneNode(true));

    const headerEl = root.querySelector("header");
    const burger = root.querySelector(".burger");
    const mobile = root.querySelector(".mobile");

    setActive(root, this.getAttribute("active"));

    const setHeightNow = () => {
      const h = Math.round(headerEl.getBoundingClientRect().height) || 72;
      this.style.setProperty("--header-h", h + "px");
    };

    let raf = 0;

    const setHeight = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(setHeightNow);
    };

    setHeight();

    new ResizeObserver(setHeight).observe(headerEl);

    addEventListener("resize", setHeight, { passive: true });
    addEventListener("orientationchange", setHeight, { passive: true });
    addEventListener("scroll", setHeight, { passive: true });

    const currentLang = getLangFromUrl();

    const initSeg = (id) => {
      const seg = root.getElementById(id);
      if (!seg) return;

      const btns = Array.from(seg.querySelectorAll(".seg-btn"));

      btns.forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.lang === currentLang));
      });

      seg.addEventListener("click", (e) => {
        const btn = e.target.closest(".seg-btn");
        if (!btn) return;

        const lang = btn.dataset.lang;

        if (lang === "en") {
          return;
        }

        btns.forEach((b) => {
          b.setAttribute("aria-pressed", String(b === btn));
        });

        setLangInUrl(lang);
      });

      seg.addEventListener("keydown", (e) => {
        if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;

        e.preventDefault();

        const idx = btns.findIndex(
          (b) => b.getAttribute("aria-pressed") === "true"
        );

        const currentIndex = idx >= 0 ? idx : 0;

        const next =
          e.key === "ArrowRight"
            ? (currentIndex + 1) % btns.length
            : (currentIndex - 1 + btns.length) % btns.length;

        btns[next].focus();
      });
    };

    initSeg("lang-seg");
    initSeg("lang-seg-mobile");

    const closeMobile = () => {
      mobile.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    };

    const openMobile = () => {
      mobile.classList.add("open");
      burger.setAttribute("aria-expanded", "true");

      const firstLink = mobile.querySelector("a");
      if (firstLink) firstLink.focus();
    };

    burger.addEventListener("click", () => {
      if (mobile.classList.contains("open")) {
        closeMobile();
      } else {
        openMobile();
      }
    });

    mobile.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        closeMobile();
      }
    });

    root.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobile.classList.contains("open")) {
        e.stopPropagation();
        closeMobile();
        burger.focus();
      }
    });
  }
}

if (!customElements.get("app-header")) {
  customElements.define("app-header", AppHeader);
}

/* ===================== <app-footer> ===================== */

const footerTmpl = document.createElement("template");

footerTmpl.innerHTML = `
  <style>
    :host{
      display:block;
      isolation:isolate;
      --text: var(--text, #0b0c0f);
      --muted: var(--muted, #5b6474);
      --hair: var(--hair, #e9ebf0);
      box-sizing:border-box;
      max-width:100vw;
      overflow:hidden;
    }

    footer{
      margin-top:40px;
      background:#fafbfc;
      border-top:1px solid var(--hair);
      box-sizing:border-box;
      max-width:100vw;
      overflow:hidden;
    }

    .foot{
      display:grid;
      grid-template-columns:1.6fr 1fr 1fr 1.1fr;
      gap:clamp(18px,2.4vw,32px);
      padding-block:22px;
      width:100%;
      max-width:1200px;
      margin:0 auto;
      padding-inline:min(5vw,28px);
      font-size:.94rem;
      box-sizing:border-box;
    }

    .brand{
      display:inline-flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:4px;
      color:#0b0c0f;
      text-decoration:none;
      white-space:nowrap;
      line-height:1;
    }

    .brand .logo{
      height:26px;
      width:auto;
      display:block;
      transition:transform .12s ease;
    }

    .brand-tagline{
      display:block;
      font-size:.72rem;
      letter-spacing:.01em;
      color:#111827;
      line-height:1;
    }

    .brand-tagline strong{
      font-weight:800;
    }

    .brand-tagline span{
      font-weight:300;
    }

    .brand:hover .logo{
      transform:translateY(-1px);
    }

    .muted{
      color:var(--muted);
    }

    .title{
      font-weight:800;
      margin-bottom:6px;
      color:var(--text);
      font-size:.92rem;
    }

    ul{
      list-style:none;
      padding:0;
      margin:6px 0 0;
    }

    ul li{
      line-height:1.8;
      font-size:.9rem;
    }

    a{
      color:inherit;
      text-decoration:none;
    }

    a:hover{
      color:#C4122F;
      text-decoration:underline;
    }

    .bottom{
      border-top:1px solid var(--hair);
      background:#fafbfc;
    }

    .bottom .inner{
      width:100%;
      max-width:1200px;
      margin:0 auto;
      padding:8px min(5vw,28px);
      display:flex;
      align-items:center;
      justify-content:center;
      min-height:34px;
      box-sizing:border-box;
    }

    .copy{
      color:#c4122f;
      font-size:.84rem;
      text-align:center;
      line-height:1.4;
    }

    @media (max-width:960px){
      .foot{
        grid-template-columns:1.4fr 1fr;
        padding-block:20px;
      }
    }

    @media (max-width:640px){
      footer{
        margin-top:32px;
      }

      .foot{
        grid-template-columns:1fr;
        gap:18px;
        padding-block:18px;
      }

      ul li{
        line-height:1.9;
        font-size:.95rem;
      }

      .copy{
        font-size:.8rem;
      }
    }
  </style>

  <footer id="contacts">
    <div class="foot">
      <div>
        <div class="brand">
          <img src="/heliotherm/media/image/logo.svg" alt="Heliotherm logo" class="logo" />
        </div>
        <p class="muted">Heliotherm Baltics, premium klases Austrijas siltumsūkņu risinājumi.</p>
      </div>

      <div>
        <div class="title">Uzņēmums</div>
        <ul class="muted">
          <li><a href="/heliotherm/par-mums/">Par mums</a></li>
          <li><a href="/index.html#partners">Partneri</a></li>
          <li><a href="/index.html#press">Preses materiāli</a></li>
        </ul>
      </div>

      <div>
        <div class="title">Resursi</div>
        <ul class="muted">
          <li><a href="/index.html#docs">Dokumentācija</a></li>
          <li><a href="/index.html#installers">Uzstādītāju portāls</a></li>
          <li><a href="/index.html#support">Atbalsts</a></li>
        </ul>
      </div>

      <div>
        <div class="title">Kontakti</div>
        <ul class="muted">
          <li><a href="mailto:info@heliotherm.lv">info@heliotherm.lv</a></li>
          <li>Serviss: +371 26631777</li>
          <li>Citi jaut.: +371 29335554</li>
        </ul>
      </div>
    </div>

    <div class="bottom">
      <div class="inner">
        <div class="copy">
          © <span id="ycopy"></span> Heliotherm Baltics SIA. Visas tiesības aizsargātas.
        </div>
      </div>
    </div>
  </footer>
`;

class AppFooter extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;

    const root = this.attachShadow({ mode: "open" });
    root.appendChild(footerTmpl.content.cloneNode(true));

    const span = root.getElementById("ycopy");
    if (span) span.textContent = String(new Date().getFullYear());
  }
}

if (!customElements.get("app-footer")) {
  customElements.define("app-footer", AppFooter);
}

/* ===================== subtle parallax ===================== */
(() => {
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)");
  const layers = () => Array.from(document.querySelectorAll("[data-parallax]"));
  if (prefersReduced.matches) return;

  let ticking = false;
  const update = () => {
    const y = window.scrollY || 0;
    layers().forEach((el) => {
      const speed = Number(el.getAttribute("data-parallax")) || 0;
      el.style.transform = `translate3d(0, ${Math.max(-18, y * speed * -0.18).toFixed(2)}px, 0)`;
    });
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  update();
})();