# Project Audit: Onpower Technologies Static Website

> **Audit Date:** October 2026  
> **Auditor:** Senior Software Architect, Security Auditor & Performance Engineer  
> **Repository:** `MyGithubPages-main` (`www.onpowertech.com`)  
> **Technology Stack:** Static HTML5, Vanilla CSS3, Vanilla JavaScript (ES5/ES6), Hosted on GitHub Pages  

---

## 1. Executive Summary

### Overall Assessment
The project is a lightweight, static marketing and product showcase website for **Onpower Technologies**, an electronics engineering firm specializing in PCB design, power supply modules (AC-DC and DC-DC converters), embedded systems, and rapid prototyping. The website is deployed via **GitHub Pages** using a custom domain (`www.onpowertech.com`) specified in the `CNAME` record.

The codebase is minimal and dependency-light, with no server-side backend, database, or build pipeline. The visual styling is clean and bespoke, with good attention paid to CSS variables, typography (IBM Plex Sans and Sora), responsive layouts, and basic accessibility hooks like skip navigation and `:focus-visible` styling.

However, the repository suffers from **significant drift between iterations**, resulting in multiple broken navigation links, dead redirects, orphaned pages, incorrect sitemap records, accessibility copy-paste errors, and technical inaccuracies in product specifications. The quotation and contact mechanism relies exclusively on client-side WhatsApp redirection via `window.open`, which introduces silent lead loss, zero server-side durability, and privacy leakage of customer and proprietary project specifications in URL query parameters.

### Current Health Breakdown

| Category | Assessment | Health Rating |
| :--- | :--- | :---: |
| **Architecture Quality** | Pure static multi-page site; lacks templating/SSG resulting in high duplication | **Satisfactory (6/10)** |
| **Security Posture** | Low attack surface due to static hosting; lack of SRI, CSP, and PII leakage via GET URLs | **Moderate (6.5/10)** |
| **Code Quality** | Clean vanilla code, but heavily burdened by copy-paste sync errors and invalid URLs | **Fair (5.5/10)** |
| **Performance** | Fast static delivery, but penalized by an unoptimized 343KB PNG logo and full Font Awesome CDN | **Good (7/10)** |
| **Reliability** | Severe lead loss risk due to client-only WhatsApp redirection; 404 links on live pages | **Poor (4/10)** |
| **Testing** | Zero automated tests, link checkers, HTML validators, or CI/CD pipelines | **Critical Deficit (1/10)** |

### Biggest Risks
1. **Silent Lead & Revenue Loss:** Prospective industrial clients requesting quotes have their submission routed solely through a `window.open` call to a WhatsApp API link. If the user has a popup blocker, lacks WhatsApp, or navigates away, the inquiry is permanently lost with zero notification to Onpower Technologies.
2. **Broken User Journeys & 404 Errors:** Dead navigation links (such as `/index` in the footer of the 12V 5A converter page, broken `.html` links in `product-smps.html`, and a redirect loop to missing `services.html` in `service.html`) break user trust and hinder product exploration.
3. **SEO Degradation:** The XML sitemap points search engines to a non-existent page (`product-led-driver.html` -> 404), indexes an orphan placeholder page (`product-smps.html`), and completely omits the two primary production products (`product-12V_2A_AC-DC_Converter` and `product-12V_5A_DC-DC_Converter`). Furthermore, canonical tags on product pages contain unencoded literal whitespace.

---

## 2. Project Architecture

### Architecture Overview
The repository is structured as a static multi-page website (MPA) intended to be served directly by a static web server or GitHub Pages without compilation.

```
                    +------------------------------------+
                    |        Client Web Browser          |
                    +------------------------------------+
                         |             |            |
           HTTP/HTTPS    |             |            |  Font / Icon Requests
        (Static Assets)  |             |            |
                         v             |            v
               +-----------------+     |     +---------------------------+
               |  GitHub Pages   |     |     | External CDNs             |
               | (Static Server) |     |     | - Google Fonts (CSS/Fonts)|
               +-----------------+     |     | - cdnjs (Font Awesome)    |
                 |             |       |     +---------------------------+
                 v             v       |
          [HTML Pages]    [CSS/JS/Img] |
                                       |  Lead Submission (Client-side GET)
                                       v
                             +--------------------+
                             |  WhatsApp Web/API  |
                             |  (wa.me Gateway)   |
                             +--------------------+
```

### File Hierarchy & Site Map
```
/
├── CNAME                           # Custom domain configuration (www.onpowertech.com)
├── robots.txt                      # Search engine crawler instructions
├── sitemap.xml                     # Search engine URL registry (desynchronized)
├── index.html                      # Homepage
├── service.html                    # Legacy redirect file (points to non-existent services.html)
├── product-smps.html               # Orphan legacy product page (contains dead .html links)
├── about/
│   └── index.html                  # About Us page
├── contact/
│   └── index.html                  # Contact & Quote Request page
├── products/
│   └── index.html                  # Product catalog with category filter chips
├── services/
│   └── index.html                  # Services breakdown page
├── product-12V_2A_AC-DC_Converter/
│   └── index.html                  # Detail page for 12V 2A AC-DC Converter
├── product-12V_5A_DC-DC_Converter/
│   └── index.html                  # Detail page for 12V 5A DC-DC Converter
├── product-custom-pcb/
│   └── index.html                  # Detail page for Custom PCB Solutions
├── css/
│   └── style.css                   # Unified stylesheet with design tokens and responsive breakpoints
├── js/
│   └── main.js                     # Unified script: mobile nav toggle, filter chips, quote handler
└── images/
    ├── logo.png                    # Company logo (343 KB unoptimized PNG)
    ├── bench.jpg                   # Hero workbench photograph (201 KB)
    ├── 12V_5A.jpg                  # 12V 5A DC-DC converter photograph (107 KB)
    ├── AC-DC_converter.jpg         # 12V 2A AC-DC converter photograph (25 KB)
    └── pcb-board.jpg               # PCB circuit board photograph (117 KB)
```

---

## 3. Critical Findings (🔴 CRITICAL)

*No immediate remote code execution, database compromise, or catastrophic vulnerabilities were identified, as the application possesses no backend execution environment or persistent database. However, the operational risks below represent the most severe failure points in the application.*

---

## 4. High Priority Findings (🟠 HIGH)

### Finding H-01: Silent Lead Loss & Fragile Client-Side Quote Dispatch
- **Category:** Reliability / Business Logic / Data Loss
- **File:** [js/main.js](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/js/main.js#L8-L17)
- **Problem:** Inquiries submitted through the quote form on `/contact` are not persisted, emailed, or sent to an API. Instead, `main.js` calls:
  ```javascript
  window.open('https://wa.me/918476003531?text='+encodeURIComponent(t),'_blank','noopener')
  ```
- **Why It Matters:**
  - Modern desktop and mobile browsers frequently block programmatic `window.open` popups, especially under strict security configurations or in in-app web views (e.g., LinkedIn, Instagram, WeChat).
  - When blocked or when the user does not have WhatsApp configured, the event fails silently.
  - The web page does not render any visual confirmation, feedback state, or fallback instructions.
  - Potential high-value engineering clients are lost permanently with zero trace.
- **Evidence:** Lines 12-17 of `js/main.js`.
- **Recommended Fix:** Integrate a zero-maintenance, serverless contact form backend (e.g., Formspree, Web3Forms, Netlify Forms, or Cloudflare Worker with email dispatch) so all quotes are logged and emailed directly to `contact@onpowertech.com`, while providing an *optional* direct WhatsApp chat button.
- **Priority:** Immediate.

---

### Finding H-02: Broken Footer Navigation Link on 12V 5A Converter Page
- **Category:** Broken Links / Navigation
- **File:** [product-12V_5A_DC-DC_Converter/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/product-12V_5A_DC-DC_Converter/index.html#L186)
- **Problem:** The footer link to the Home page is hardcoded as:
  ```html
  <li><a href="/index">Home</a></li>
  ```
- **Why It Matters:** On GitHub Pages and standard web servers, navigating to `/index` throws an HTTP 404 (Not Found). A prospective client reading this product page who attempts to return to the home page via the footer encounters a dead page.
- **Evidence:** Line 186 in `product-12V_5A_DC-DC_Converter/index.html` (compare with `<li><a href="/">Home</a></li>` in all other pages).
- **Recommended Fix:** Change `href="/index"` to `href="/"`.
- **Priority:** Immediate.

---

### Finding H-03: Sitemap Contains Non-Existent Product (HTTP 404)
- **Category:** SEO / Search Indexing
- **File:** [sitemap.xml](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/sitemap.xml#L1)
- **Problem:** `sitemap.xml` instructs search engine crawlers to index:
  ```xml
  <url><loc>https://www.onpowertech.com/product-led-driver.html</loc></url>
  ```
- **Why It Matters:** `product-led-driver.html` does not exist in the repository. Googlebot and Bingbot will hit an immediate 404 error, exhausting crawl budget and signaling poor site hygiene.
- **Evidence:** Line 1 of `sitemap.xml`.
- **Recommended Fix:** Remove the entry from `sitemap.xml` or create the corresponding product page if the LED driver is an active offering.
- **Priority:** Immediate.

---

### Finding H-04: Defective Redirect in `service.html` Targets Non-Existent File
- **Category:** Routing / Dead Redirect
- **File:** [service.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/service.html#L1)
- **Problem:** `service.html` attempts to forward visitors to `services.html`:
  ```html
  <meta http-equiv="refresh" content="0; url=services.html">
  <link rel="canonical" href="https://www.onpowertech.com/services.html">
  <a href="services.html">Services</a>
  ```
- **Why It Matters:** The actual services page is located at `/services/index.html` (accessible as `/services` or `/services/`). The file `services.html` does not exist. Anyone hitting `service.html` is redirected straight into an HTTP 404 error.
- **Evidence:** Line 1 of `service.html`.
- **Recommended Fix:** Change `url=services.html`, the canonical link, and the anchor href to `/services`.
- **Priority:** Immediate.

---

### Finding H-05: Legacy Orphan Page `product-smps.html` Contains 100% Broken Links
- **Category:** Architecture / Dead Code
- **File:** [product-smps.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/product-smps.html#L11-L24)
- **Problem:** `product-smps.html` is an unlinked orphan page left over from an earlier version of the site. It is still listed in `sitemap.xml`, but every internal link inside it points to obsolete `.html` files that do not exist:
  - `about.html` -> 404
  - `products.html` -> 404
  - `services.html` -> 404
  - `contact.html` -> 404
  - `contact.html?product=SMPS` -> 404
  - `product-led-driver.html` -> 404
  - `product-custom-pcb.html` -> 404
- **Why It Matters:** Users entering via search engine results landing on `product-smps.html` are trapped in a dead-end experience where clicking any navigation link results in a 404 error.
- **Evidence:** Lines 11, 13, 16, 18, 20, 21, 23 of `product-smps.html`.
- **Recommended Fix:** Either remove `product-smps.html` and its entry in `sitemap.xml`, or migrate it to a modern directory `/product-smps/index.html` with clean URLs matching the rest of the site and fill in its specifications.
- **Priority:** High.

---

## 5. Medium Priority Findings (🟡 MEDIUM)

### Finding M-01: Sensitive Customer Information & Commercial IP Leaked via URL
- **Category:** Security / Data Privacy
- **File:** [js/main.js](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/js/main.js#L16-L17)
- **Problem:** The quote request script packages the user's name, email, and proprietary project details into a GET query parameter:
  ```javascript
  var t='Hello OnPower Technologies,\n\nI would like to request a quote.\n\nName: '+n+'\nEmail: '+em+'\nProject Details: '+msg+'\n\nPlease get back to me.';
  window.open('https://wa.me/918476003531?text='+encodeURIComponent(t),'_blank','noopener')
  ```
- **Why It Matters:**
  - Prospective B2B clients frequently submit proprietary technical specifications, project budgets, and confidential circuit requirements.
  - Query parameters in GET requests are logged in browser history, proxy server logs, enterprise firewalls, and Referer headers.
  - If the project details are lengthy, browser URI limits (2048 characters) may truncate or cause the request to fail entirely.
- **Evidence:** Lines 16-17 of `js/main.js`.
- **Recommended Fix:** Send quote data via an encrypted HTTPS POST request to an API endpoint or form service.
- **Priority:** Short Term.

---

### Finding M-02: Missing Subresource Integrity (SRI) on External CDN Assets
- **Category:** Security
- **Files:** Across all 9 HTML files (e.g., [index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/index.html#L19), [about/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/about/index.html#L8))
- **Problem:** Font Awesome is loaded from Cloudflare CDNJS without `integrity` or `crossorigin` attributes:
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  ```
- **Why It Matters:** If CDNJS or a downstream DNS cache were compromised, malicious CSS (such as CSS keyloggers or fake UI overlays) could be injected into Onpower Technologies' website without the client browser detecting file modification.
- **Evidence:** Line 19 in `index.html`.
- **Recommended Fix:** Add SRI hash:
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" integrity="sha512-Avb2QiuDEEvB4bZJYdft2mNjVShBftLdPG8FJ0V7irTLQ8Uo0qcPxh4Plq7G5tGm0rU+1SPhVotteLpBERwTkw==" crossorigin="anonymous" referrerpolicy="no-referrer">
  ```
  Or self-host only the required SVG icons to eliminate third-party dependencies completely.
- **Priority:** Short Term.

---

### Finding M-03: Invalid Canonical URLs (Literal Unencoded Whitespace)
- **Category:** SEO / Standards Compliance
- **Files:**
  - [product-12V_2A_AC-DC_Converter/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/product-12V_2A_AC-DC_Converter/index.html#L7)
  - [product-12V_5A_DC-DC_Converter/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/product-12V_5A_DC-DC_Converter/index.html#L7)
  - [contact/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/contact/index.html#L8)
- **Problem:**
  1. The canonical tags on both converter pages contain unencoded literal space characters and do not match the actual URL slugs:
     ```html
     <!-- product-12V_2A_AC-DC_Converter -->
     <link rel="canonical" href="https://www.onpowertech.com/product-12V 2A AC-DC Converter">

     <!-- product-12V_5A_DC-DC_Converter -->
     <link rel="canonical" href="https://www.onpowertech.com/product-12V 5A DC-DC Converter">
     ```
  2. In `contact/index.html`, canonical has a trailing slash (`https://www.onpowertech.com/contact/`), whereas `sitemap.xml` lists `https://www.onpowertech.com/contact` without a slash.
- **Why It Matters:** Literal whitespace violates RFC 3986 URI syntax. Search engines may disregard the canonical tag, split indexing signals, or index unpredictable URL variations.
- **Evidence:** Line 7 of `product-12V_2A_AC-DC_Converter/index.html` and `product-12V_5A_DC-DC_Converter/index.html`.
- **Recommended Fix:** Correct canonical URLs to match the exact directory structure:
  ```html
  <link rel="canonical" href="https://www.onpowertech.com/product-12V_2A_AC-DC_Converter">
  <link rel="canonical" href="https://www.onpowertech.com/product-12V_5A_DC-DC_Converter">
  <link rel="canonical" href="https://www.onpowertech.com/contact">
  ```
- **Priority:** Short Term.

---

### Finding M-04: Primary Products Completely Omitted from XML Sitemap
- **Category:** SEO / Search Indexing
- **File:** [sitemap.xml](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/sitemap.xml#L1)
- **Problem:** `sitemap.xml` omits:
  - `https://www.onpowertech.com/product-12V_2A_AC-DC_Converter`
  - `https://www.onpowertech.com/product-12V_5A_DC-DC_Converter`
- **Why It Matters:** These are the two primary hardware products manufactured and highlighted by the company. Search engines should be explicitly instructed to index them.
- **Evidence:** Complete content of `sitemap.xml`.
- **Recommended Fix:** Update `sitemap.xml` to include both converter pages with `<priority>0.8</priority>` and `<changefreq>monthly</changefreq>`.
- **Priority:** Short Term.

---

### Finding M-05: Factual Contradiction in DC-DC Converter Product Highlights
- **Category:** Data Integrity / Content Quality
- **File:** [product-12V_5A_DC-DC_Converter/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/product-12V_5A_DC-DC_Converter/index.html#L72)
- **Problem:** The product is named **12V 5A DC-DC Converter** with input specified as 16–32V DC. However, the key bullet point states:
  ```html
  <span>60W AC-DC Power Supply</span>
  ```
- **Why It Matters:** Stating that a DC-DC converter is an "AC-DC Power Supply" is an engineering contradiction. For an electronics design firm targeting professional engineers and procurement teams, this undermines technical credibility.
- **Evidence:** Line 72 of `product-12V_5A_DC-DC_Converter/index.html`.
- **Recommended Fix:** Change bullet text to `<span>60W DC-DC Converter</span>` or `<span>60W DC-DC Power Module</span>`.
- **Priority:** Short Term.

---

### Finding M-06: Severely Oversized Logo Asset & Inaccurate Image Dimensions
- **Category:** Performance / Core Web Vitals
- **Files:** [images/logo.png](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/images/logo.png), [index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/index.html#L99-L115)
- **Problem:**
  1. `logo.png` is **343 KB** (813 x 296 px), displayed at only 160 x 58 px in the header. It accounts for almost half of the total initial asset weight.
  2. Intrinsic dimension attributes in HTML do not match the real aspect ratios of the images:
     - `12V_5A.jpg`: Actual dimensions are 790 x 494 (aspect ratio 1.60). HTML attributes specify `width="790" height="390"` (aspect ratio 2.02).
     - `AC-DC_converter.jpg`: Actual dimensions are 590 x 235 (aspect ratio 2.51). HTML attributes specify `width="790" height="390"` (aspect ratio 2.02).
     - `bench.jpg`: Actual dimensions are 1200 x 478. HTML attributes specify `width="1200" height="511"`.
- **Why It Matters:**
  - Wasteful bandwidth consumption on mobile networks.
  - Distorted intrinsic aspect ratio reservation by the browser before image download, causing Cumulative Layout Shift (CLS) or visual pillarboxing due to `object-fit: contain`.
- **Evidence:** Image dimensions verified via GDI+ inspection versus HTML declarations.
- **Recommended Fix:**
  - Compress `logo.png` with WebP/PNGcrush to ~15-20 KB, or convert to SVG.
  - Update HTML `width` and `height` attributes to match true file dimensions.
- **Priority:** Medium Term.

---

## 6. Low Priority Findings (🟢 LOW)

### Finding L-01: Widespread Image Alt Text Duplication
- **Category:** Accessibility (a11y)
- **Files:**
  - [index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/index.html#L99-L115)
  - [products/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/products/index.html#L64-L80)
  - [product-12V_2A_AC-DC_Converter/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/product-12V_2A_AC-DC_Converter/index.html#L159)
  - [product-12V_5A_DC-DC_Converter/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/product-12V_5A_DC-DC_Converter/index.html#L160)
- **Problem:** The alt attribute `alt="Custom PCB - PCB photograph"` was copy-pasted onto images for both the 12V 2A AC-DC converter and 12V 5A DC-DC converter cards.
- **Why It Matters:** Visually impaired visitors using screen readers are given false descriptions of converter products.
- **Recommended Fix:** Assign accurate alt text: `alt="12V 2A AC-DC Converter module photograph"` and `alt="12V 5A DC-DC Converter module photograph"`.
- **Priority:** Medium Term.

---

### Finding L-02: Typo in ARIA Label
- **Category:** Accessibility / HTML Quality
- **File:** [index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/index.html#L121)
- **Problem:** Link contains:
  ```html
  aria-label="Learn more about 12V 5A DC-DC Converte"
  ```
- **Why It Matters:** Missing trailing "r" in "Converter" read by assistive technologies.
- **Recommended Fix:** Change to `Converte` -> `Converter`.
- **Priority:** Low.

---

### Finding L-03: Invalid MIME Type in Favicon Link
- **Category:** Standards Compliance
- **File:** [about/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/about/index.html#L5)
- **Problem:**
  ```html
  <link rel="icon" type="/image/png" sizes="32x32" href="/favicon-32x32.png">
  ```
- **Why It Matters:** The MIME type contains an invalid leading slash (`/image/png` instead of `image/png`).
- **Recommended Fix:** Correct to `type="image/png"`.
- **Priority:** Low.

---

### Finding L-04: Phone Number Inconsistency Between Form and Buttons
- **Category:** User Experience / Operations
- **Files:** [contact/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/contact/index.html#L44), [js/main.js](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/js/main.js#L17)
- **Problem:** On `/contact`, the "Chat on WhatsApp" button links to `+91 8810503192`, but submitting the quote form sends messages to `+91 8476003531`.
- **Why It Matters:** Leads and communications are split unpredictably across two different WhatsApp accounts.
- **Recommended Fix:** Standardize on a single dedicated business WhatsApp number or explain the department routing (e.g. Sales vs Technical Support).
- **Priority:** Low.

---

### Finding L-05: Missing Social Share Metadata (Open Graph / Twitter)
- **Category:** Social Media / Branding
- **Files:** All HTML pages
- **Problem:** Open Graph metadata is incomplete:
  - `og:url` is omitted on all pages.
  - `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image` tags are completely absent.
  - Every page uses the generic workbench image `bench.jpg` instead of specific product images.
- **Why It Matters:** Links shared on Twitter/X, LinkedIn, Slack, and Discord render without rich preview cards.
- **Recommended Fix:** Add complete Open Graph and Twitter Card tags to all pages.
- **Priority:** Low.

---

## 7. Security Audit

### Threat Modeling & Attack Surface
The application runs as a static site on GitHub Pages. There is no server-side application logic, database, operating system access, file upload handler, or server-side session management. Consequently, classic vulnerabilities such as SQL injection, Remote Code Execution (RCE), SSRF, local/remote file inclusion (LFI/RFI), and OS command injection are **structurally impossible**.

```
+-------------------------------------------------------------------------+
| ATTACK VECTOR MATRIX                                                    |
+--------------------------+---------------------+------------------------+
| Attack Vector            | Status              | Analysis               |
+--------------------------+---------------------+------------------------+
| SQL / NoSQL Injection    | N/A (Immune)        | No database present    |
| Remote Code Execution    | N/A (Immune)        | No server execution    |
| Server-Side Request (SSRF)| N/A (Immune)       | No outbound requests   |
| Command Injection        | N/A (Immune)        | No OS shell access     |
| Cross-Site Scripting (XSS)| Verified Safe       | No unsafe DOM injection|
| Clickjacking             | Minor Concern       | No CSP / X-Frame-Opts  |
| Third-Party CDN Hijack   | Moderate Concern    | Missing SRI hashes     |
| PII / Data Interception  | Moderate Concern    | GET parameters on wa.me|
+--------------------------+---------------------+------------------------+
```

### Detailed Verification

#### 1. Cross-Site Scripting (XSS) Analysis
We traced the query parameter handling in `js/main.js`:
```javascript
var q = new URLSearchParams(location.search).get('product');
if (q) document.getElementById('msg').value = 'Product enquiry: ' + q;
```
- **Callers:** Product detail pages link to `/contact?product=...`.
- **Verification:** Setting `.value` on an `HTMLTextAreaElement` assigns the DOM property as plain text. It does *not* parse or execute HTML/scripts (unlike `innerHTML` or `document.write`). Therefore, this vector is **not vulnerable to DOM-based XSS**.
- **Error Handling:** `err.textContent = '...'` also uses `textContent`, preventing injection.

#### 2. Sensitive Data & Privacy Exposure
The quote request handler sends customer name, email address, and project specifications in plain text within a GET query string:
`https://wa.me/918476003531?text=...`
- **Impact:** GET query strings are retained in browser history, proxy server logs, mobile app logs, and HTTP Referer headers. For clients disclosing proprietary circuit designs or confidential device specs, this constitutes an unencrypted data trail.

#### 3. Subresource Integrity (SRI)
- Both Google Fonts and Font Awesome are loaded from public CDNs. While Google Fonts uses dynamic CSS based on User-Agent (where SRI is impractical), Font Awesome (`cdnjs.cloudflare.com/.../all.min.css`) is a static asset and must include an SRI hash to prevent tampering.

#### 4. HTTP Headers & Content Security Policy (CSP)
- As GitHub Pages does not support custom response headers via `.htaccess` or `_headers` without Cloudflare/Fastly in front, no CSP, `X-Frame-Options`, `X-Content-Type-Options`, or `Permissions-Policy` headers are sent.
- **Mitigation:** A `<meta http-equiv="Content-Security-Policy" content="...">` tag can be added to the `<head>` of HTML documents to restrict scripts and styles to trusted domains.

---

## 8. Performance Audit

### Asset Weight & Delivery Analysis

```
Asset Breakdown by Size:
+------------------------------------+-----------+--------------------+
| Asset                              | File Size | Display Dimensions |
+------------------------------------+-----------+--------------------+
| images/logo.png                    | 342.9 KB  | 160 x 58 px        |
| images/bench.jpg                   | 196.8 KB  | 1200 x 478 px      |
| images/pcb-board.jpg               | 114.6 KB  | 790 x 381 px       |
| images/12V_5A.jpg                  | 104.7 KB  | 790 x 494 px       |
| images/AC-DC_converter.jpg         | 24.4 KB   | 590 x 235 px       |
| css/style.css                      | 9.1 KB    | N/A                |
| js/main.js                         | 1.3 KB    | N/A                |
| Font Awesome (cdnjs CSS + fonts)   | ~230 KB   | Remote CDN         |
| Google Fonts (IBM Plex Sans, Sora) | ~60 KB    | Remote CDN         |
+------------------------------------+-----------+--------------------+
```

### Key Performance Findings
1. **Uncompressed Logo:** At 342.9 KB, `logo.png` represents ~45% of the page's first-load image weight. Re-encoding `logo.png` as an optimized SVG or WebP would reduce its size to < 15 KB (a **95% size reduction**).
2. **Font Awesome Overhead:** Font Awesome is loaded across all pages (~230 KB compressed transfer for CSS + webfonts) simply to display ~12 basic UI icons. Replacing Font Awesome with inline SVG icons would save ~230 KB of network transfer and eliminate an external render-blocking roundtrip to CDNJS.
3. **Cumulative Layout Shift (CLS):** `width` and `height` attributes on product cards do not match true image proportions (e.g. 790x390 declared vs 590x235 actual). While CSS `object-fit: contain` prevents image distortion, the browser's calculated placeholder aspect ratio differs from the asset, risking minor CLS.
4. **Hero Image Optimization:** `bench.jpg` in `index.html` uses `fetchpriority="high"`, which is an excellent modern optimization for the Largest Contentful Paint (LCP) element. Other images appropriately use `loading="lazy"`.

---

## 9. Database Audit

*Not applicable.* The project does not utilize a database. No client-side storage mechanisms (`localStorage`, `sessionStorage`, or `IndexedDB`) are used.

---

## 10. API / Backend Audit

*Not applicable.* The project has no custom backend, API routes, microservices, or serverless functions. Form submissions are delegated entirely to the external `https://wa.me` URL gateway on the client side.

---

## 11. Frontend Audit

### Component Architecture & Design System
The visual presentation is cleanly implemented using semantic HTML5 and vanilla CSS.
- **Design Tokens:** Defined centrally in `:root` (`--ink`, `--ink2`, `--blue`, `--orange`, `--paper`, `--white`, `--text`, `--muted`, `--line`).
- **Typography:** Effective pairing of **Sora** (for display headings) and **IBM Plex Sans** (for body text).
- **Responsive Layout:** Responsive grid system using `clamp()`, `auto-fit`, and CSS grid/flexbox. Breakpoints at `900px` and `760px` handle tablets and smartphones cleanly.
- **Reduced Motion:** Includes `@media(prefers-reduced-motion: reduce)` media query resetting animations and smooth scroll behavior for accessibility compliance.
- **Focus Rings:** Explicit and visible `:focus-visible` styles using `--orange` outline.

### Frontend Deficiencies & Inconsistencies
1. **Filter Reset & State Persistence:** The category chips on `/products` filter products using HTML `hidden` attributes. There is no empty state if zero products match, and filter selection is not stored in the URL (`?category=power`), preventing bookmarking or direct sharing.
2. **Mobile Nav Accessibility:** The mobile menu toggle sets `aria-expanded`, but does not trap focus inside the navigation drawer when open, nor does it listen for the `Escape` key to close.

---

## 12. Dependency Audit

The project has **zero npm / package dependencies**. It has no `package.json`, `node_modules`, or bundler dependencies.

### External Runtime Dependencies

| Dependency | Version / Source | Purpose | Assessment |
| :--- | :--- | :--- | :--- |
| **Font Awesome** | `6.5.0` via `cdnjs.cloudflare.com` | Icons | Heavy (~230KB); missing SRI hash; can be replaced with inline SVGs |
| **Google Fonts** | `IBM Plex Sans`, `Sora` via `fonts.googleapis.com` | Typography | Fast and well-cached; preconnect tags correctly present |

---

## 13. Testing Audit

### Current Test Coverage
- **Unit Tests:** None (0%)
- **Integration Tests:** None (0%)
- **End-to-End Tests:** None (0%)
- **HTML / CSS Validation:** None (0%)
- **Automated Link Checking:** None (0%)

### High-Value Tests to Implement Immediately
1. **Automated Link Checker:** A simple CI script (e.g. `lychee` or a GitHub Action) that crawls all `.html` files in the repository and asserts that all internal links, anchors, and image `src` paths resolve to real files (would have immediately caught `/index`, `services.html`, and `product-led-driver.html`).
2. **W3C HTML Validator:** Automated markup validation to detect invalid MIME types (`type="/image/png"`), malformed canonical links with whitespace, and missing alt attributes.
3. **Form Submission Validation:** End-to-end test verifying that the quote request form correctly validates inputs and creates the proper inquiry payload.

---

## 14. Technical Debt

1. **Manual HTML Duplication:** Headers, navigation bars, and footers are manually duplicated across 9 separate HTML files. Any change to phone numbers, copyright year, or navigation links must be repeated 9 times, which has already caused desynchronization and broken links.
2. **Abandoned Legacy Files:** `service.html` and `product-smps.html` are remnants of previous site iterations that were never properly cleaned up or updated.
3. **Inconsistent URL Formatting:** Mixture of directory-style clean URLs (`/about`, `/products`), trailing-slash canonicals (`/contact/`), legacy `.html` links in `product-smps.html`, and spaces in canonical tags.

---

## 15. Recommended Improvements

### Architectural Improvements
- **Adopt a Minimal Static Site Generator (SSG):** Adopt Astro, 11ty (Eleventy), or Jekyll (native to GitHub Pages). This allows shared layout components (`<Header />`, `<Footer />`, `<HeadMeta />`) to be defined once and compiled into static HTML, eliminating manual duplication while keeping zero-cost GitHub Pages hosting.

### Reliability & Lead Generation
- **Serverless Form Endpoint:** Replace direct `wa.me` `window.open` calls with a free or low-cost serverless form endpoint (e.g. Formspree, Formkeep, or a Cloudflare Worker). Submissions will be stored in an administrative dashboard and emailed directly to `contact@onpowertech.com`. WhatsApp can be retained as an optional secondary chat button.

### SEO & Discoverability
- **Clean Sitemap & Canonical Tags:** Regenerate `sitemap.xml` to include `product-12V_2A_AC-DC_Converter` and `product-12V_5A_DC-DC_Converter`, remove `product-led-driver.html`, and ensure all canonical tags contain valid, whitespace-free URLs.
- **Structured Data:** Add Schema.org `Product` JSON-LD to each product detail page and `BreadcrumbList` for breadcrumb navigation.

---

## 16. Priority Roadmap

```
TIMELINE ROADMAP:
[Immediate: Days 1-2]    --> Fix 404 links (/index, service.html, sitemap.xml)
                             Fix DC-DC converter "AC-DC" spec contradiction
                             Fix canonical URLs with spaces
[Short Term: Week 1]     --> Connect reliable form endpoint (Formspree / Cloudflare Worker)
                             Compress logo.png & fix image dimension attributes
                             Update sitemap.xml with live converter products
[Medium Term: Weeks 2-3] --> Add Subresource Integrity (SRI) hashes
                             Correct duplicate alt text across all product images
                             Standardize business phone numbers
[Long Term: Month 1+]    --> Migrate to 11ty or Astro for single-source header/footer
                             Replace Font Awesome CDN with inline SVG icons
                             Add automated link checking via GitHub Actions
```

### Phase 1: Immediate (Critical Fixes)
- [ ] Fix `/index` to `/` in footer of [product-12V_5A_DC-DC_Converter/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/product-12V_5A_DC-DC_Converter/index.html#L186).
- [ ] Fix redirect target in [service.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/service.html) to point to `/services` instead of missing `services.html`.
- [ ] Remove `product-led-driver.html` from [sitemap.xml](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/sitemap.xml).
- [ ] Fix technical contradiction in [product-12V_5A_DC-DC_Converter/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/product-12V_5A_DC-DC_Converter/index.html#L72) from "60W AC-DC Power Supply" to "60W DC-DC Converter".
- [ ] Fix canonical URLs in both converter pages to remove unencoded spaces.

### Phase 2: Short Term (Reliability & SEO)
- [ ] Add a reliable form submission service to [contact/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/contact/index.html) so quote inquiries are never lost to popup blockers.
- [ ] Add `product-12V_2A_AC-DC_Converter` and `product-12V_5A_DC-DC_Converter` to `sitemap.xml`.
- [ ] Delete or modernize orphan page [product-smps.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/product-smps.html).
- [ ] Compress `images/logo.png` from 343 KB down to < 20 KB.
- [ ] Update `width` and `height` attributes on product images to match true dimensions.

### Phase 3: Medium Term (Quality & Standards)
- [ ] Add SRI hashes and `crossorigin="anonymous"` to CDNJS Font Awesome link across all HTML files.
- [ ] Fix copy-pasted `alt="Custom PCB - PCB photograph"` on all product card images.
- [ ] Fix `type="/image/png"` typo in [about/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/about/index.html#L5).
- [ ] Add Open Graph tags (`og:url`) and Twitter Card metadata across all pages.
- [ ] Add Schema.org `Product` JSON-LD structured data to product pages.

### Phase 4: Long Term (Architecture & Maintainability)
- [ ] Set up a GitHub Actions workflow to run an automated link checker and HTML linter on every commit.
- [ ] Migrate the project to a static site generator (e.g. Astro or Eleventy) to eliminate manual header/footer duplication while maintaining static output for GitHub Pages.
- [ ] Replace external Font Awesome library with lightweight inline SVGs.

---

## 17. Final Scorecard

```
============================================================
              PROJECT AUDIT SCORECARD
============================================================
 Architecture:    6.0 / 10  - Simple static setup, but heavy manual duplication
 Code Quality:    5.5 / 10  - Clean CSS/JS, but degraded by copy-paste sync bugs
 Security:        6.5 / 10  - Low static attack surface, but PII in URLs & no SRI
 Performance:     7.0 / 10  - Fast static serving; penalized by 343KB logo & CDN font
 Reliability:     4.0 / 10  - Silent lead loss risk on quote form & 404 dead links
 Testing:         1.0 / 10  - Zero automated testing, validation, or CI checks
 Maintainability: 5.0 / 10  - High friction updating duplicated HTML across 9 files
------------------------------------------------------------
 OVERALL SCORE:   5.0 / 10  - Promising foundation with urgent operational bugs
============================================================
```

### Score Explanations
- **Architecture (6.0/10):** The choice of a static site hosted on GitHub Pages is cost-effective, secure, and appropriate for a small engineering firm. However, the complete absence of a layout templating engine forces repetitive HTML duplication that has directly resulted in site drift.
- **Code Quality (5.5/10):** The CSS stylesheet is well-crafted with good naming, custom properties, and responsive design. However, HTML files contain multiple copy-paste errors, invalid MIME types, unencoded spaces in canonical tags, and factually contradictory technical specifications.
- **Security (6.5/10):** While static hosting eliminates server vulnerabilities, sensitive client specifications and contact information are leaked via GET URLs to WhatsApp, and third-party CDN scripts lack integrity attributes.
- **Performance (7.0/10):** Serving pure static HTML is inherently fast, but an unoptimized 343 KB logo image and a 230 KB third-party icon font add unnecessary latency on mobile networks.
- **Reliability (4.0/10):** Live users encounter 404 links when navigating the footer or legacy pages, and quote requests are vulnerable to silent failure via popup blockers.
- **Testing (1.0/10):** No automated verification, link validation, or CI/CD pipelines exist to prevent regression.
- **Maintainability (5.0/10):** Any routine change (such as updating a phone number or adding a navigation item) requires manual, error-prone edits across 9 distinct files.
- **Overall (5.0/10):** The visual design and branding are professional and modern, but the codebase has accumulated critical link and lead-generation defects that must be resolved to protect commercial conversions and SEO ranking.
