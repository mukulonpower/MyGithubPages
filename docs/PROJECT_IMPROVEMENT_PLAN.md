# PROJECT IMPROVEMENT PLAN: Onpower Technologies Website

> **Document Version:** 1.0.0  
> **Date:** October 2026  
> **Status:** Planning Only — Awaiting Stakeholder Sign-Off  
> **Target Production URL:** `https://www.onpowertech.com`  
> **Deployment Target:** GitHub Pages (`MyGithubPages-main`)  
> **Scope:** Architecture, URL Clean-Up, Lead & Quote System, SEO, Performance, Accessibility, Security, and Quality Assurance  

---

## 1. Executive Summary

This document establishes the official master engineering improvement plan for the **Onpower Technologies** commercial website. It builds upon the findings of `docs/AUDIT.md`, verified against the current codebase, and translates technical deficiencies into an actionable, phased implementation roadmap.

### Core Strategic Objectives
1. **Preserve What Works:** Maintain the existing visual brand identity, modern color scheme, typography, fast static hosting model, and zero-cost GitHub Pages infrastructure.
2. **Eliminate Customer Drop-Off (P0):** Fix all live HTTP 404 links (notably the `/index` footer link, the broken `service.html` redirect, and missing sitemap routes).
3. **Prevent Silent Lead Loss (P0):** Replace the fragile client-side WhatsApp popup redirection on the quote form with a resilient, privacy-compliant dual submission architecture (secure form endpoint + direct WhatsApp contact).
4. **Standardize Clean URL Architecture (P1):** Enforce strict clean URL standards across all internal links, sitemap entries, redirects, and canonical tags, permanently preventing `.html` extensions.
5. **Optimize Performance & Compliance (P2):** Reduce initial page payload by ~75% through logo optimization, SVG icon migration, proper image sizing, and Subresource Integrity (SRI) integration.
6. **Zero Over-Engineering:** Keep the website lightweight and maintenance-friendly. No heavy JavaScript frameworks (React/Next.js) or unneeded backend servers are introduced.

---

## 2. Current Project Health

The website currently achieves an operational score of **5.0 / 10**. While the aesthetic presentation and CSS architecture are solid, silent business failure modes and navigation dead-ends severely impair lead generation and search engine indexing.

```
+------------------------------------------------------------------------------------+
| HEALTH RADAR                                                                       |
+--------------------------+--------+------------------------------------------------+
| Metric                   | Rating | Key Driver                                     |
+--------------------------+--------+------------------------------------------------+
| Visual & UI Design       | 8.0/10 | Clean styling, good typography, modern layout  |
| CSS Architecture         | 7.5/10 | Cohesive design tokens, responsive breakpoints  |
| Security & Hosting       | 6.5/10 | Static hosting immunity; PII in URLs / no SRI  |
| Performance              | 7.0/10 | Fast static base; blocked by 343KB PNG logo    |
| Codebase Maintainability | 5.0/10 | Manual copy-pasting across 9 static files      |
| Data Integrity           | 4.5/10 | Conflicting DC-DC specs, alt-text duplicates   |
| Reliability & Navigation | 4.0/10 | Popup quote loss; 404 links; dead redirects    |
| Testing & CI/CD          | 1.0/10 | Zero automated verification or link checking   |
+--------------------------+--------+------------------------------------------------+
```

---

## 3. What Is Already Good (Must Be Preserved)

During implementation, the following architectural choices, styles, and assets **must not be broken or rewritten**:

1. **Lightweight Static Hosting on GitHub Pages:**  
   The zero-maintenance, zero-server-cost deployment model via GitHub Pages and custom domain `CNAME` (`www.onpowertech.com`) is optimal for this stage of the business. Do not add server hosting costs.
2. **Design Tokens & Color Palette:**  
   The custom CSS design system defined in [css/style.css](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/css/style.css#L1-L13) (`--ink: #0b1f3a`, `--ink2: #14325c`, `--blue: #0a6cb8`, `--orange: #f26a1b`, `--paper: #f4f7fb`) creates a distinguished, high-trust engineering aesthetic.
3. **Typography Pairing:**  
   The pairing of **Sora** for headings and **IBM Plex Sans** for body copy is balanced, professional, and properly loaded via Google Fonts preconnect tags.
4. **Accessibility Foundations:**  
   - Skip-to-content navigation (`<a class="skip" href="#main">Skip to content</a>`) is already present on all pages.
   - High-contrast `:focus-visible` styling (`outline: 3px solid var(--orange); outline-offset: 2px`) is established.
   - Reduced-motion accessibility `@media (prefers-reduced-motion: reduce)` is implemented.
5. **Modern Image Prioritization:**  
   The hero workbench photograph (`images/bench.jpg`) on the homepage correctly uses `fetchpriority="high"`, while secondary product cards employ `loading="lazy"`.
6. **Component Layouts:**  
   Responsive layouts for product cards, specifications tables, breadcrumbs, and "How We Work" numbered steps are well-styled and responsive across desktop, tablet, and mobile.

---

## 4. What Is Missing

Across all operational dimensions, the project currently lacks the following essential capabilities:

### A. Critical Business Systems
- **Reliable Lead Intake:** No durable mechanism to receive quote requests when a visitor's device blocks popups or does not have WhatsApp configured.
- **Lead Backup & Notifications:** No email notifications dispatched to `contact@onpowertech.com` when a quote form is completed.
- **Accurate Product Data:** Factual consistency in hardware product classifications (e.g., DC-DC vs. AC-DC).

### B. Website Functionality
- **Form State Feedback:** No visual "Submitting...", "Success / Thank You", or user-friendly fallback messaging on the contact page.
- **Mobile Menu UX:** Mobile drawer does not close on `Escape` key press or on clicking outside the navigation container.
- **Product Filter State:** Category filtering on `/products` has no empty-state message if zero items match, and filter selection is not reflected in URL query parameters (`?cat=power`).

### C. SEO & Search Discoverability
- **Sitemap Coverage:** Two out of the three core products are missing from `sitemap.xml`.
- **Valid Canonicals:** Canonical tags on product pages contain unencoded literal whitespace.
- **Open Graph & Twitter Cards:** Missing `og:url` and all Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:image`).
- **Structured Data (Schema.org):** No Schema.org `Product` or `BreadcrumbList` JSON-LD markup on product pages.
- **Custom 404 Error Page:** No `404.html` exists; missing pages fall back to GitHub Pages default 404 screen.

### D. Performance & Core Web Vitals
- **Optimized Brand Asset:** The 343 KB uncompressed logo delays First Contentful Paint.
- **Asset Dimensions:** Product card image tags declare incorrect intrinsic height/width (causing potential Cumulative Layout Shift).
- **Icon Bundling:** ~230 KB of external Font Awesome files are downloaded to display ~12 basic UI glyphs.

### E. Security & Privacy
- **Client Data Privacy:** Customer names, emails, and proprietary circuit requirements are passed in GET URLs.
- **Subresource Integrity:** External CDN stylesheets lack cryptographic SRI hashes.
- **Content Security Policy:** No CSP meta-tag is configured to prevent script injection.

### F. Testing & Quality Assurance
- **Automated Validation:** No link checking, HTML validation, or continuous integration checks exist in the repository.

---

## 5. Critical Problems (Ranked by Business Impact)

```
+----------------------------------------------------------------------------------------------------+
| SEVERITY BREAKDOWN                                                                                 |
+-----+---------------------------------------------+------------------------------------+-----------+
| ID  | Problem Description                         | Location                           | Risk      |
+-----+---------------------------------------------+------------------------------------+-----------+
| C-1 | Silent lead loss on quote form submission   | js/main.js & contact/index.html    | Lost Sales|
| C-2 | Broken navigation link (/index -> 404)      | product-12V_5A_DC-DC_Converter     | Dead End  |
| C-3 | Non-existent URL in sitemap.xml (404)       | sitemap.xml                        | SEO Drop  |
| C-4 | Broken redirect target in service.html      | service.html                       | Dead End  |
| C-5 | Orphan page product-smps.html with 404 links| product-smps.html                  | User Trap |
| C-6 | Literal whitespace in canonical link tags   | Converter product detail pages     | SEO Drop  |
| C-7 | Engineering contradiction in DC-DC specs    | product-12V_5A_DC-DC_Converter     | Credibility|
+-----+---------------------------------------------+------------------------------------+-----------+
```

---

## 6. Recommended Improvements

### Recommendation Group 1: Lead Capture & Contact Flow
- **Dual-Dispatch Quote Form:** Wire the contact form to post asynchronously via HTTPS to a reliable, zero-maintenance form service (recommended: **Web3Forms** or **Formspree**).
- **Instant WhatsApp Option:** Maintain an explicit, dedicated "Chat on WhatsApp" button for users who prefer direct mobile messaging, while ensuring form submissions are always safely delivered to `contact@onpowertech.com`.
- **Form UX:** Add input validation for phone numbers, a clear submit spinner, and an in-page modal/alert confirming: *"Thank you! Your quote request has been received. Our engineering team will respond within 24 hours."*

### Recommendation Group 2: Routing, URLs & SEO Hygiene
- **Strict Clean URLs:** Standardize all internal links to clean directory paths without `.html` and with consistent trailing slash conventions (`/about`, `/products`, `/services`, `/contact`).
- **Update Sitemap:** Regenerate [sitemap.xml](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/sitemap.xml) to index all live routes: `/`, `/about`, `/products`, `/services`, `/contact`, `/product-12V_2A_AC-DC_Converter`, `/product-12V_5A_DC-DC_Converter`, and `/product-custom-pcb`. Remove `product-led-driver.html`.
- **Dedicated 404 Error Page:** Create a branded `404.html` at the project root so any broken external backlink or mistyped URL displays navigation options and contact links.
- **Repair `service.html`:** Update the meta refresh in [service.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/service.html) to target `/services` instead of `services.html`.

### Recommendation Group 3: Content & Accessibility Accuracy
- **Fix Product Highlight:** Change "60W AC-DC Power Supply" to "60W DC-DC Converter" on the 12V 5A product page.
- **Unique Alt Text:** Replace generic `alt="Custom PCB - PCB photograph"` across all cards with descriptive text matching each product.
- **Keyboard Trapping & Escape Listener:** Update mobile menu JavaScript to close the drawer upon `Escape` key press.

### Recommendation Group 4: Performance & Asset Delivery
- **Compress Brand Assets:** Convert `images/logo.png` (343 KB) to WebP or optimize PNG down to < 20 KB.
- **Image Intrinsic Proportions:** Align declared HTML `width` and `height` attributes with the actual file dimensions to eliminate layout shifts.
- **Add SRI Hashes:** Include `integrity` and `crossorigin` attributes on external CDN stylesheet tags.

---

## 7. Priority Matrix

Every planned task is categorized using an industry-standard P0–P3 priority framework:

```
                  URGENCY vs. IMPACT MATRIX
    High Impact  +-------------------------+-------------------------+
                 | P1: High Priority       | P0: Critical Urgency    |
                 | - Sitemap correction    | - Fix quote form loss   |
                 | - Canonical fixes       | - Fix footer /index 404 |
                 | - Dual form endpoint    | - Fix service.html loop |
                 | - Add 404.html          | - Fix DC-DC spec error  |
                 +-------------------------+-------------------------+
                 | P3: Low / Enhancement   | P2: Medium Priority     |
                 | - SSG evaluation        | - Compress 343KB logo   |
                 | - Icon SVG replacement  | - Fix duplicate alt tags|
                 | - Filter query params   | - Add SRI hashes        |
                 | - LocalBusiness schema  | - Schema.org Products   |
     Low Impact  +-------------------------+-------------------------+
                           Low Urgency               High Urgency
```

### Detailed Priority Definitions

#### 🔴 P0 — Critical (Immediate Fix Required)
*Directly breaks user journeys, corrupts product technical credibility, or causes business revenue/lead loss.*
- **P0-1:** Repair quote form submission so customer submissions are guaranteed to be captured even if WhatsApp popups are blocked.
- **P0-2:** Fix footer link in `product-12V_5A_DC-DC_Converter/index.html` from `href="/index"` to `href="/"`.
- **P0-3:** Fix redirect in `service.html` from `services.html` to `/services`.
- **P0-4:** Remove non-existent `product-led-driver.html` from `sitemap.xml`.
- **P0-5:** Correct product highlight in `product-12V_5A_DC-DC_Converter/index.html` from "60W AC-DC Power Supply" to "60W DC-DC Converter".
- **P0-6:** Correct canonical URLs on both converter pages to eliminate unencoded whitespace.

#### 🟠 P1 — High (Core Functionality & SEO)
*Significantly impairs search engine indexing, social sharing, or navigation reliability.*
- **P1-1:** Add missing production converter pages to `sitemap.xml`.
- **P1-2:** Clean up or deprecate orphan page `product-smps.html` and update its internal links to clean URLs.
- **P1-3:** Standardize canonical URLs across all pages (uniform trailing slash policy).
- **P1-4:** Create branded root `404.html` with navigation links back to core sections.
- **P1-5:** Standardize company telephone number references across the site.

#### 🟡 P2 — Medium (Performance, Accessibility & Polish)
*Improves load times, Core Web Vitals, accessibility compliance, and rich search snippets.*
- **P2-1:** Compress `images/logo.png` from 343 KB to < 20 KB.
- **P2-2:** Add Subresource Integrity (SRI) hashes to Font Awesome CDN link across all HTML files.
- **P2-3:** Fix image `width` and `height` attributes to match true asset dimensions.
- **P2-4:** Provide unique, descriptive `alt` text for all product images.
- **P2-5:** Add Schema.org `Product` and `BreadcrumbList` JSON-LD structured data.
- **P2-6:** Add Open Graph `og:url` and complete Twitter Card meta tags.
- **P2-7:** Fix `type="/image/png"` invalid MIME type in `about/index.html`.
- **P2-8:** Fix ARIA typo `aria-label="Learn more about 12V 5A DC-DC Converte"`.

#### 🟢 P3 — Low (Future Maintainability & Optimizations)
*Long-term maintenance enhancements and minor UX conveniences.*
- **P3-1:** Implement automated link checking via GitHub Actions.
- **P3-2:** Add `Escape` key and outside-click dismissal to mobile navigation drawer.
- **P3-3:** Synchronize product category filter state with URL parameters (`?cat=power`).
- **P3-4:** Replace Font Awesome CDN bundle with inline SVG icons.
- **P3-5:** Evaluate migration to a Static Site Generator (Astro or Eleventy) when page count exceeds 15 pages.

---

## 8. Phase-by-Phase Roadmap

```
PHASE TIMELINE:
[Phase 0] --> Backup & Safety Snapshot
[Phase 1] --> Critical Navigation, Link & Content Fixes (P0)
[Phase 2] --> URL Architecture, Sitemap & Redirect Strategy (P0/P1)
[Phase 3] --> Lead Capture & Contact System Modernization (P0/P1)
[Phase 4] --> Asset Performance & Core Web Vitals (P2)
[Phase 5] --> Accessibility & Assistive UX (P2)
[Phase 6] --> Rich Metadata, Social Cards & Structured Data (P2)
[Phase 7] --> Testing, Validation & Continuous Integration (P3)
[Phase 8] --> Long-Term Maintainability & SSG Assessment (P3)
```

### Phase 0: Backup & Safety
Before applying any edits to the repository:
1. Create a full working backup branch (e.g. `backup/pre-improvement-audit`).
2. Verify that local repository status is clean via `git status`.
3. Retain original image files in a dedicated backup folder before compression.

### Phase 1: Critical Fixes
- Target files: `product-12V_5A_DC-DC_Converter/index.html`, `service.html`, `sitemap.xml`.
- Execute P0-2: Fix `/index` link to `/`.
- Execute P0-3: Fix `service.html` redirect target to `/services`.
- Execute P0-4: Delete `product-led-driver.html` entry from `sitemap.xml`.
- Execute P0-5: Correct "AC-DC" highlight typo on DC-DC converter page.
- Execute P0-6: Correct whitespace in canonical links.

### Phase 2: URL & SEO Cleanup
- Standardize all internal links to clean URLs.
- Update `sitemap.xml` with active product detail URLs.
- Resolve `product-smps.html`: Migrate to `/product-smps/index.html` with clean internal links OR remove from sitemap if discontinued by the owner.
- Create branded `404.html`.

### Phase 3: Lead Generation & Contact System
- Select and configure zero-maintenance form backend (Web3Forms / Formspree).
- Update [contact/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/contact/index.html) with clean form attributes, customer phone number input, and feedback alerts.
- Refactor [js/main.js](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/js/main.js) to submit form via asynchronous fetch, display in-page confirmation, and offer an optional WhatsApp click.

### Phase 4: Performance Optimization
- Compress `logo.png` to WebP/PNGcrush (< 20 KB).
- Update image dimension attributes (`width` and `height`) on all product cards.
- Add SRI hashes to external CDN tags.

### Phase 5: Accessibility & Assistive UX
- Update all image `alt` attributes to accurately reflect product names.
- Correct ARIA typos in `index.html`.
- Fix invalid MIME type `type="/image/png"` in `about/index.html`.
- Add keyboard accessibility (Escape to close) for mobile navigation in `js/main.js`.

### Phase 6: SEO Enhancements & Structured Data
- Add Schema.org `Product` JSON-LD to all product pages.
- Add `BreadcrumbList` structured data to subpages.
- Add `og:url` and Twitter Card metadata across all HTML headers.

### Phase 7: Testing & CI
- Create GitHub Actions workflow `.github/workflows/verify.yml` to run automated link checking on commits.
- Run W3C markup validator and accessibility audit.

### Phase 8: Maintainability Review
- Review codebase maintainability. If the owner plans to add more products, provide a frictionless migration path to Astro or Eleventy.

---

## 9. URL & Routing Plan

### Standard URL Rule
To guarantee clean URLs without `.html` extensions on GitHub Pages, **directory-based routing** must be uniformly applied:
- Every route is backed by a directory containing an `index.html` file.
- Clean URLs omit `.html` extensions in all links, sitemaps, and canonical tags.
- In accordance with standard web architecture, root-relative clean paths without trailing slashes (`/about`, `/products`, `/services`, `/contact`, `/product-custom-pcb`) are standardized across all navigation elements.

### Comprehensive URL Mapping Table

| Web Route | File System Path | Current Status | Required Action | Desired Canonical URL | Sitemap URL |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `index.html` | Active | Preserve | `https://www.onpowertech.com/` | `https://www.onpowertech.com/` |
| `/about` | `about/index.html` | Active | Preserve | `https://www.onpowertech.com/about` | `https://www.onpowertech.com/about` |
| `/products` | `products/index.html` | Active | Preserve | `https://www.onpowertech.com/products` | `https://www.onpowertech.com/products` |
| `/services` | `services/index.html` | Active | Preserve | `https://www.onpowertech.com/services` | `https://www.onpowertech.com/services` |
| `/contact` | `contact/index.html` | Active | Standardize canonical (strip trailing slash) | `https://www.onpowertech.com/contact` | `https://www.onpowertech.com/contact` |
| `/product-12V_2A_AC-DC_Converter` | `product-12V_2A_AC-DC_Converter/index.html` | Active | Fix whitespace in canonical; add to sitemap | `https://www.onpowertech.com/product-12V_2A_AC-DC_Converter` | `https://www.onpowertech.com/product-12V_2A_AC-DC_Converter` |
| `/product-12V_5A_DC-DC_Converter` | `product-12V_5A_DC-DC_Converter/index.html` | Active | Fix footer link; fix whitespace in canonical; add to sitemap | `https://www.onpowertech.com/product-12V_5A_DC-DC_Converter` | `https://www.onpowertech.com/product-12V_5A_DC-DC_Converter` |
| `/product-custom-pcb` | `product-custom-pcb/index.html` | Active | Preserve | `https://www.onpowertech.com/product-custom-pcb` | `https://www.onpowertech.com/product-custom-pcb` |
| `/service.html` | `service.html` | Legacy Redirect | Update refresh target from `services.html` to `/services` | None (Redirect File) | Do NOT list in sitemap |
| `/product-smps.html` | `product-smps.html` | Orphan File | Relocate to `product-smps/index.html` OR decommission | `https://www.onpowertech.com/product-smps` (if kept) | Remove unless modernized |
| `/product-led-driver.html` | *None (Missing)* | 404 in Sitemap | Remove from sitemap immediately | N/A | REMOVE |

---

## 10. SEO Plan

### Page-by-Page Metadata Strategy

```
+-----------------------------------------------------------------------------------------------------------------------------------+
| SEO METADATA SPECIFICATION                                                                                                        |
+------------------------------------+---------------------------------------------+------------------------------------------------+
| Page Path                          | Recommended <title>                         | Recommended <meta name="description">          |
+------------------------------------+---------------------------------------------+------------------------------------------------+
| /                                  | Onpower Technologies | Smart Power Solutions| End-to-end electronic product development:     |
|                                    | & Embedded Systems                          | custom PCB design, power supplies, embedded    |
|                                    |                                             | firmware, and rapid prototyping in India.      |
+------------------------------------+---------------------------------------------+------------------------------------------------+
| /about                             | About Us | Onpower Technologies            | Learn about Onpower Technologies, our mission, |
|                                    |                                             | hardware development capabilities, and rapid   |
|                                    |                                             | prototyping engineering services.              |
+------------------------------------+---------------------------------------------+------------------------------------------------+
| /products                          | Electronics Products & Power Modules |       | Explore our reliable power electronics: 12V 2A |
|                                    | Onpower Technologies                        | AC-DC converters, 12V 5A DC-DC converters, and |
|                                    |                                             | custom PCB solutions for industrial uses.      |
+------------------------------------+---------------------------------------------+------------------------------------------------+
| /services                          | Electronics Engineering & PCB Services |    | Complete hardware development: multi-layer PCB |
|                                    | Onpower Technologies                        | design, embedded firmware, IoT solutions, and  |
|                                    |                                             | turn-key SMT/through-hole PCB assembly.        |
+------------------------------------+---------------------------------------------+------------------------------------------------+
| /contact                           | Contact & Request a Quote | Onpower         | Request a quote for your electronics or PCB    |
|                                    | Technologies                                | project. Contact our engineering team via      |
|                                    |                                             | web form, email, or direct WhatsApp chat.      |
+------------------------------------+---------------------------------------------+------------------------------------------------+
| /product-12V_2A_AC-DC_Converter    | 12V 2A AC-DC Converter (24W) | Onpower     | High-efficiency isolated 12V 2A (24W) AC-DC    |
|                                    | Technologies                                | power supply converter module. Wide 172-300V   |
|                                    |                                             | AC input with 90% efficiency. Get a quote.     |
+------------------------------------+---------------------------------------------+------------------------------------------------+
| /product-12V_5A_DC-DC_Converter    | 12V 5A DC-DC Converter (60W) | Onpower     | High-efficiency 12V 5A (60W) DC-DC power supply|
|                                    | Technologies                                | module. 16-32V DC input with 90% efficiency.   |
|                                    |                                             | Designed for stable industrial power delivery. |
+------------------------------------+---------------------------------------------+------------------------------------------------+
| /product-custom-pcb                | Custom PCB Design & Assembly Solutions |     | End-to-end custom PCB design, layout, component|
|                                    | Onpower Technologies                        | sourcing, prototyping, and functional testing  |
|                                    |                                             | built to your exact technical specifications.  |
+------------------------------------+---------------------------------------------+------------------------------------------------+
```

### Social Graph (Open Graph & Twitter Cards)
Add the following standardized block to all page `<head>` sections:
```html
<!-- Open Graph -->
<meta property="og:site_name" content="Onpower Technologies">
<meta property="og:type" content="website">
<meta property="og:title" content="[PAGE_TITLE]">
<meta property="og:description" content="[PAGE_DESCRIPTION]">
<meta property="og:url" content="https://www.onpowertech.com[CLEAN_PATH]">
<meta property="og:image" content="https://www.onpowertech.com/images/[SPECIFIC_IMAGE].jpg">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[PAGE_TITLE]">
<meta name="twitter:description" content="[PAGE_DESCRIPTION]">
<meta name="twitter:image" content="https://www.onpowertech.com/images/[SPECIFIC_IMAGE].jpg">
```

### Structured Data (JSON-LD)
On product detail pages, inject Schema.org `Product` structured data:
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "12V 2A AC-DC Converter",
  "image": "https://www.onpowertech.com/images/AC-DC_converter.jpg",
  "description": "Compact AC-DC converter providing stable 12V 2A output with 90% efficiency.",
  "brand": {
    "@type": "Brand",
    "name": "Onpower Technologies"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://www.onpowertech.com/product-12V_2A_AC-DC_Converter",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "price": "Contact for Quote"
  }
}
```

---

## 11. Product Page Plan

To enhance product discoverability without altering true technical parameters:

### Page 1: 12V 2A AC-DC Converter
- **File:** `product-12V_2A_AC-DC_Converter/index.html`
- **Product Name:** 12V 2A AC-DC Converter (24W)
- **Image:** `images/AC-DC_converter.jpg` (Update declared dimensions to `width="590" height="235"`)
- **Key Details to Keep:** High efficiency (90%), 24W Power Rating, 172–300V AC Input, 12V DC Output, 2A Output Current, Isolated: Yes.
- **Missing Data:**
  - Dimensions: `CONTENT REQUIRED FROM OWNER`
- **Actions:** Correct canonical tag, add Product Schema, ensure related product card links are clean.

### Page 2: 12V 5A DC-DC Converter
- **File:** `product-12V_5A_DC-DC_Converter/index.html`
- **Product Name:** 12V 5A DC-DC Converter (60W)
- **Image:** `images/12V_5A.jpg` (Update declared dimensions to `width="790" height="494"`)
- **Key Details to Correct:** Change bullet item from "60W AC-DC Power Supply" to "60W DC-DC Converter".
- **Verified Specs:** Input: 16–32V DC, Output: 12V DC, Output Current: 5A, Power: 60W, Efficiency: 90%.
- **Missing Data:**
  - Isolation specification (`--` currently listed): `CONTENT REQUIRED FROM OWNER`
  - Dimensions: `CONTENT REQUIRED FROM OWNER`
- **Actions:** Repair footer Home link, fix canonical tag, add Product Schema.

### Page 3: Custom PCB Solutions
- **File:** `product-custom-pcb/index.html`
- **Product Name:** Custom PCB Design & Prototyping Solutions
- **Image:** `images/pcb-board.jpg` (Update dimensions to `width="790" height="381"`)
- **Key Details to Keep:** Multi-layer, high-speed, power layout, SMT/through-hole assembly, functional testing.
- **Missing Data:**
  - Typical turnaround time / Layer limits: `CONTENT REQUIRED FROM OWNER`
- **Actions:** Ensure clean canonical and add Product Schema.

### Page 4: SMPS Power Supply (Status: Action Required)
- **File:** `product-smps.html`
- **Problem:** Currently an unstyled orphan with "Available on request" for all specifications.
- **Recommendation:**
  - If SMPS modules are an active product line, convert to `product-smps/index.html`, add verified electrical specifications (`CONTENT REQUIRED FROM OWNER`), and link it in `products/index.html`.
  - If discontinued, remove `product-smps.html` and its entry in `sitemap.xml` to avoid indexing an empty placeholder.

---

## 12. Contact & Lead Generation Plan

### Current Defect
The existing mechanism relies on:
```javascript
window.open('https://wa.me/918476003531?text=' + encodeURIComponent(t), '_blank', 'noopener');
```
This fails silently when popup blockers trigger, works poorly on desktop environments without WhatsApp Web pre-configured, leaks confidential project requirements into GET URLs, and produces zero persistent records for Onpower Technologies.

### Comparison of Form Handling Options

| Solution | Cost | Complexity | Privacy / Security | Spam Protection | Storage / Backup | Email Alerts | GitHub Pages Fit | Recommended? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Web3Forms** | Free (Unlimited) | Very Low (HTML API key) | High (HTTPS POST, no sensitive URL query) | Honeypot + hCaptcha | Cloud dashboard | Direct to inbox | 100% Native Static | **YES (Recommended)** |
| **Formspree** | Free tier (50/mo) | Low (Form action URL) | High (HTTPS POST) | Built-in reCAPTCHA | Cloud dashboard | Direct to inbox | 100% Native Static | Viable Alternative |
| **Cloudflare Worker** | Free tier | Moderate (Requires DNS on CF) | Maximum (Custom encryption) | Custom rate-limiting | KV / D1 / Webhook | Worker Mailchannels | Requires Cloudflare | Overkill for now |
| **Current WhatsApp** | Free | Trivial | Poor (GET parameter leak) | None | Zero (Lost if closed) | None | Native | **NO (Fails silently)** |

### Recommended Lead Architecture: Dual-Channel System

```
                         [User Fills Quote Form]
                                    |
                    +---------------+---------------+
                    |                               |
        (Submit Form Button)               (Chat on WhatsApp)
                    |                               |
          Asynchronous POST                         |
          to Web3Forms API                  Opens Direct WhatsApp
                    |                       Chat with Greeting:
        +-----------+-----------+           "Hi Onpower Technologies,
        |                       |            I'd like to ask a question."
  (Success Alert)       (Email Dispatch)    (No sensitive spec leakage)
  In-page confirmation   to contact@
  "We'll reply in 24h"   onpowertech.com
```

#### Implementation Details for Phase 3:
1. **Form Enhancement in [contact/index.html](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/contact/index.html):**
   - Add a Phone Number input field (`<input type="tel" id="phone" name="phone" placeholder="+91 ...">`).
   - Add a hidden honeypot spam-prevention field.
   - Add a distinct status container `<div id="form-status" role="alert"></div>`.
2. **Asynchronous Handler in [js/main.js](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder%20%286%29/MyGithubPages-main/MyGithubPages-main/js/main.js):**
   - Prevent default submit.
   - Execute an asynchronous `fetch()` POST to the form gateway.
   - Upon success: Render a confirmation message and reset the form.
   - Upon network error: Display an explicit fallback message: *"Unable to send form automatically. Please email us directly at contact@onpowertech.com or click below to chat on WhatsApp."*

---

## 13. Performance Plan

### Measurable Performance Targets

```
+------------------------------------------------------------------------------------+
| PERFORMANCE BUDGET                                                                 |
+-------------------------------------+------------------+---------------------------+
| Metric                              | Current Value    | Target Value              |
+-------------------------------------+------------------+---------------------------+
| Logo file size (images/logo.png)    | 342.9 KB         | < 20 KB (WebP/SVG)        |
| Total initial image payload         | ~780 KB          | < 250 KB                  |
| External CSS / Icon font weight     | ~230 KB          | < 15 KB (Inline SVGs)     |
| Largest Contentful Paint (LCP)      | ~1.8s            | < 1.2s                    |
| Cumulative Layout Shift (CLS)       | ~0.08            | < 0.01                    |
| First Input Delay / INP             | < 50ms           | < 50ms                    |
| Google Lighthouse Performance Score | ~82              | > 95                      |
+-------------------------------------+------------------+---------------------------+
```

### Action Items
1. **Asset Compression:** Compress `logo.png` into an optimized WebP and high-density 2x PNG fallback.
2. **Dimension Sync:** Replace incorrect HTML `width="790" height="390"` with exact asset aspect ratios.
3. **Preloading & Fonts:** Ensure `<link rel="preconnect">` for Google Fonts is preserved.
4. **Icon Optimization:** In Phase 4, replace the ~230 KB Font Awesome stylesheet with lightweight inline SVG symbols, cutting third-party network requests entirely.

---

## 14. Accessibility Plan (WCAG 2.1 AA)

### Accessibility Deficiencies & Planned Fixes

```
+------------------------------------------------------------------------------------+
| ACCESSIBILITY REMEDIATION MATRIX                                                   |
+----------------------+--------------------+----------------------------------------+
| Area                 | Defect             | Planned Remediation                    |
+----------------------+--------------------+----------------------------------------+
| Image Descriptions   | Duplicated Alt Text| Write distinct alt text for all cards  |
| ARIA Labels          | Typo "Converte"    | Fix aria-label in index.html           |
| MIME Types           | type="/image/png"  | Correct to type="image/png" in about/  |
| Keyboard Navigation  | Drawer trap        | Add Escape key listener to close menu  |
| Form Accessibility   | Missing telephone  | Associate labels cleanly with <input>  |
| Status Messaging     | Silent submission  | Add aria-live="polite" to form-status  |
+----------------------+--------------------+----------------------------------------+
```

---

## 15. Security & Privacy Plan

### 1. Data Privacy & Confidentiality
- Eliminate the practice of placing client project descriptions, budgets, and email addresses in unencrypted GET query strings.
- Transmit all customer communications over encrypted HTTPS POST payloads.

### 2. Subresource Integrity (SRI)
All external third-party assets must include SHA-384 or SHA-512 SRI integrity hashes:
```html
<link rel="stylesheet" 
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" 
      integrity="sha512-Avb2QiuDEEvB4bZJYdft2mNjVShBftLdPG8FJ0V7irTLQ8Uo0qcPxh4Plq7G5tGm0rU+1SPhVotteLpBERwTkw==" 
      crossorigin="anonymous" 
      referrerpolicy="no-referrer">
```

### 3. Content Security Policy (CSP)
Add a baseline CSP meta-tag to protect against cross-site scripting and unauthorized external injections:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               img-src 'self' data: https://www.onpowertech.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; 
               font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; 
               script-src 'self' 'unsafe-inline' https://api.web3forms.com; 
               connect-src 'self' https://api.web3forms.com;">
```

---

## 16. Testing & CI Plan

To ensure that dead links, broken canonicals, or typo regressions never recur:

### 1. Automated Link Checking via GitHub Actions
Create a lightweight GitHub Actions workflow (`.github/workflows/verify.yml`) that runs on every push:
```yaml
name: Verify Links & HTML

on: [push, pull_request]

jobs:
  link-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Link Checker
        uses: lycheeverse/lychee-action@v1
        with:
          args: --verbose --no-progress './**/*.html'
```

### 2. Manual Verification Protocol (Pre-Deployment)
- [ ] Every internal link verified to resolve without 404.
- [ ] Mobile navigation tested on iOS Safari and Android Chrome.
- [ ] Form submission verified with a test lead received at `contact@onpowertech.com`.
- [ ] WhatsApp direct link verified on mobile and desktop.
- [ ] Sitemap parsed without errors via Google Search Console sitemap validator.

---

## 17. Maintainability Plan

### The Templating Dilemma: Vanilla MPA vs. Static Site Generator (SSG)

Currently, the website consists of 9 HTML files. Each file contains duplicated `<header>` and `<footer>` markups.

```
                    ARCHITECTURE DECISION MATRIX
+--------------------------+-----------------------+-------------------------+
| Consideration            | Keep Vanilla HTML     | Migrate to 11ty / Astro |
+--------------------------+-----------------------+-------------------------+
| Current Learning Curve   | Zero (Pure HTML)      | Low-Medium (Node/npm)   |
| Dependencies             | 0 npm packages        | ~50 npm packages        |
| Build Step Required      | No build step         | Required build command  |
| Header / Footer updates  | Must edit 9 files     | Edit 1 template file    |
| GitHub Pages simplicity  | Immediate git push    | Needs GitHub Actions CI |
| Recommended For:         | < 10 static pages     | > 15 catalog items      |
+--------------------------+-----------------------+-------------------------+
```

### Strategic Recommendation
- **For Immediate Implementation (Phases 1–6):** Retain the **Vanilla HTML/CSS/JS architecture**. The site only has 9 files. A full migration to Astro/11ty at this stage would introduce unnecessary build complexity, node dependencies, and deployment risks when the primary issues are broken URLs and lead loss.
- **For Future Expansion (Phase 8):** If the catalog expands beyond 15 products or blog/case studies are added, migrate to **Eleventy (11ty)** or **Astro** to centralize layouts.

---

## 18. File-by-File Implementation Plan

This table details the exact changes scheduled for future implementation across actual repository files:

```
+----------------------------------------------------------------------------------------------------+
| FILE MODIFICATION MATRIX                                                                           |
+------------------------------------+----------+----------------------------------------------------+
| File Path                          | Priority | Planned Technical Change                           |
+------------------------------------+----------+----------------------------------------------------+
| product-12V_5A_DC-DC_Converter/    | P0       | 1. Fix line 186 footer link: `/index` -> `/`       |
|   index.html                       |          | 2. Fix line 72 highlight: "AC-DC" -> "DC-DC"       |
|                                    |          | 3. Fix line 7 canonical: remove literal spaces     |
|                                    |          | 4. Update image dimensions and unique alt text     |
+------------------------------------+----------+----------------------------------------------------+
| service.html                       | P0       | 1. Fix line 1 meta-refresh target to `/services`   |
|                                    |          | 2. Fix line 1 canonical and anchor to `/services`  |
+------------------------------------+----------+----------------------------------------------------+
| sitemap.xml                        | P0 / P1  | 1. Remove dead link `product-led-driver.html`      |
|                                    |          | 2. Add `product-12V_2A_AC-DC_Converter`            |
|                                    |          | 3. Add `product-12V_5A_DC-DC_Converter`            |
|                                    |          | 4. Standardize trailing slash convention           |
+------------------------------------+----------+----------------------------------------------------+
| product-12V_2A_AC-DC_Converter/    | P0 / P1  | 1. Fix line 7 canonical: remove literal spaces     |
|   index.html                       |          | 2. Update image dimensions and unique alt text     |
|                                    |          | 3. Add Product JSON-LD structured data             |
+------------------------------------+----------+----------------------------------------------------+
| contact/index.html                 | P0 / P1  | 1. Standardize canonical URL (remove slash)        |
|                                    |          | 2. Add Phone input, honeypot spam protection       |
|                                    |          | 3. Add accessible form status container            |
|                                    |          | 4. Standardize WhatsApp business phone number      |
+------------------------------------+----------+----------------------------------------------------+
| js/main.js                         | P0 / P1  | 1. Refactor quote handler to HTTPS async fetch POST|
|                                    |          | 2. Add visual submitting/success feedback states   |
|                                    |          | 3. Add Escape key listener to close mobile menu    |
|                                    |          | 4. Fix variable shadowing (nav `n` vs name `n`)    |
+------------------------------------+----------+----------------------------------------------------+
| product-smps.html                  | P1       | Relocate to `product-smps/index.html` with clean   |
|                                    |          | URLs OR deprecate completely per owner decision    |
+------------------------------------+----------+----------------------------------------------------+
| 404.html [NEW FILE]                | P1       | Create branded custom 404 page for GitHub Pages    |
+------------------------------------+----------+----------------------------------------------------+
| index.html                         | P2       | 1. Fix duplicate image alt text                    |
|                                    |          | 2. Fix ARIA typo `Converte` -> `Converter`         |
|                                    |          | 3. Add SRI hash to Font Awesome stylesheet         |
|                                    |          | 4. Add Twitter Card and complete OG tags           |
+------------------------------------+----------+----------------------------------------------------+
| products/index.html                | P2       | 1. Update meta description (remove old LED driver) |
|                                    |          | 2. Fix duplicate image alt text                    |
|                                    |          | 3. Add SRI hash to Font Awesome stylesheet         |
+------------------------------------+----------+----------------------------------------------------+
| services/index.html                | P2       | 1. Add SRI hash to Font Awesome stylesheet         |
|                                    |          | 2. Add Service schema markup                       |
+------------------------------------+----------+----------------------------------------------------+
| about/index.html                   | P2       | 1. Fix line 5 invalid MIME type `type="/image/png"`|
|                                    |          | 2. Add SRI hash to Font Awesome stylesheet         |
+------------------------------------+----------+----------------------------------------------------+
| product-custom-pcb/index.html      | P2       | 1. Add Product JSON-LD structured data             |
|                                    |          | 2. Add SRI hash to Font Awesome stylesheet         |
+------------------------------------+----------+----------------------------------------------------+
| images/logo.png                    | P2       | Compress from 343 KB to < 20 KB (WebP/SVG/PNG)     |
+------------------------------------+----------+----------------------------------------------------+
| .github/workflows/verify.yml       | P3       | Automated link checking and validation action      |
|   [NEW FILE]                       |          |                                                    |
+------------------------------------+----------+----------------------------------------------------+
```

---

## 19. New Files Required

To execute the plan cleanly without introducing technical debt, only **two** new files will be created:

1. **`404.html` (Project Root):**
   - **Purpose:** Native custom error page automatically served by GitHub Pages whenever a requested path does not exist.
   - **Content:** Branded header, clear "Page Not Found" alert, search/navigation links to Home, Products, Services, and Contact.
2. **`.github/workflows/verify.yml` (CI Directory):**
   - **Purpose:** Automated GitHub Actions link-checking workflow to prevent future link breakages during repository pushes.

---

## 20. Risks & Dependencies

```
+------------------------------------------------------------------------------------+
| RISK REGISTER                                                                      |
+------------------------+--------+--------------------------------------------------+
| Risk                   | Impact | Mitigation Strategy                              |
+------------------------+--------+--------------------------------------------------+
| Form service downtime  | Medium | Provide fallback direct email & WhatsApp link    |
| Free form tier limits  | Low    | Web3Forms free tier is unlimited; zero risk      |
| Browser cache latency  | Low    | GitHub Pages cache TTL is 10 minutes; fast update|
| SEO transition blip    | Low    | Maintain redirects and clean canonicals          |
+------------------------+--------+--------------------------------------------------+
```

---

## 21. Final Recommended Architecture

The long-term recommended architecture remains a **pure static multi-page application** hosted on **GitHub Pages**, enhanced with modern serverless form capture:

```
                           +----------------------------------------+
                           |          Client Web Browser            |
                           +----------------------------------------+
                                        |             |
                                  HTTPS |             | HTTPS (Async POST)
                                        v             v
                           +------------------+  +-----------------------+
                           |   GitHub Pages   |  | Web3Forms / Formspree |
                           |  (www.onpower    |  | (Encrypted Form API)  |
                           |     tech.com)    |  +-----------------------+
                           +------------------+              |
                             |        |                      | Email Dispatch
                             |        |                      v
                             v        v             +--------------------+
                         [Clean    [Optimized       | contact@onpower    |
                          Pages]    Assets]         | tech.com (Inbox)   |
                                                    +--------------------+
```

---

## 22. Definition of Done (DoD)

The improvement project shall be deemed complete only when every condition below is satisfied and verified:

- [ ] **Zero Dead Links:** Every internal link, header item, and footer anchor across all 9 pages returns HTTP 200.
- [ ] **No `/index` or `.html` Links:** No user-facing navigation element contains `.html` or `/index`.
- [ ] **Functional Form Capture:** Submitting the quote form on `/contact` triggers an asynchronous HTTPS POST, displays in-page confirmation, and dispatches a lead notification email.
- [ ] **Privacy Compliant:** No customer names, emails, or project specs are appended to URLs.
- [ ] **Accurate Sitemap:** `sitemap.xml` contains all active products and zero 404 links.
- [ ] **Clean Canonicals:** All canonical tags are formatted with valid URIs without whitespace.
- [ ] **Accurate Product Specs:** The DC-DC converter is correctly labeled as a DC-DC module.
- [ ] **Optimized Logo:** Total logo asset transfer size is under 20 KB.
- [ ] **Custom 404:** Visiting any invalid URL on `www.onpowertech.com` renders the branded `404.html`.
- [ ] **Accessible Descriptions:** All product cards possess distinct, descriptive `alt` attributes.
- [ ] **Valid Markup:** Zero W3C HTML errors; valid MIME type for favicon.
- [ ] **Deployment Verified:** GitHub Pages build succeeds cleanly with custom domain intact.

---

## 23. Final Pre-Implementation Checklist

Review before executing code modifications:
1. Stakeholder approval obtained on the dual-channel contact form approach.
2. Decision confirmed regarding whether `product-smps.html` is retained or decommissioned.
3. Owner electrical parameters received for dimensions and isolation specs.
4. Git safety branch created.
