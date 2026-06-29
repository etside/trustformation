# Trust Formation — Lovable.dev Full Build Prompt

## PROJECT OVERVIEW

Build a complete, production-ready corporate services website for **Trust Formation** — an international company registration and business formation agency. The site must have a premium dark theme as default with a light mode toggle, full Bengali/English language switching, smooth animations, popups, and a comprehensive admin panel with edit access to every section.

---

## BRAND IDENTITY

- **Company Name:** Trust Formation
- **Tagline:** "Your Trusted Partner for Global Business Formation"
- **Primary Color:** `#0D1B2A` (deep navy)
- **Accent Color:** `#E8963E` (warm orange/amber)
- **Secondary:** `#1B2838` (dark slate)
- **Text on dark:** `#E2E8F0` (light gray)
- **Text secondary:** `#94A3B8` (muted blue-gray)
- **Dark BG:** `#0A0F1C`
- **Card BG:** `#111827`
- **Font:** Inter (Google Fonts) — weights 300-900
- **Border Radius:** 16px cards, 50px pill buttons
- **Logo (light):** `/trust-white-logo.png` (for dark backgrounds)
- **Logo (dark):** `/trust-black-logo.png` (for light backgrounds)
- **Design Style:** Premium dark glassmorphism, gradient accents, smooth micro-interactions, floating elements, hero with globe visual

---

## WEBSITE PAGES (Complete Sitemap)

### 1. Homepage (`/`)
### 2. Services Detail Page (`/services/[slug]`)
### 3. Pricing Page (`/pricing`)
### 4. About Us (`/about`)
### 5. Contact (`/contact`)
### 6. Blog (`/blog`) — placeholder
### 7. FAQ (`/faq`)
### 8. Admin Panel (`/admin/*`)
### 9. 404 Page

---

## HOMEPAGE STRUCTURE (Section by Section)

### A. Sticky Header (Glassmorphism Pill)
- Floating pill-shaped header with `backdrop-filter: blur(20px)`
- Logo on left (white version on dark, black on light)
- Nav links: Home, Services, Pricing, Why Us, FAQ, Contact
- CTA button: "Get Started" (orange gradient)
- Mobile hamburger menu with slide-down animation
- Scroll state: slightly darker background on scroll

### B. Hero Section
- Full viewport height, dark gradient background with subtle radial orange glow
- Left side:
  - Badge pill: "Trusted Business Formation Partner" with check icon
  - Headline: "Launch Your Business Globally with Confidence" (highlight "Business Globally" in orange)
  - Subheadline: "We handle company registration, compliance, and formation across the USA, UK, Canada, and Bangladesh — so you can focus on growing your business."
  - Two CTAs: "Get Started Today" (orange gradient) + "View Services" (outline)
  - Stats row: 5,000+ Happy Clients | 50+ Countries | 10+ Years | 99.8% Success Rate
- Right side:
  - Animated globe illustration with floating orange glow
  - Floating glass card (left): Star rating "Highly Recommended"
  - Floating glass card (right): "10+ Years Experience"
- Animations: Staggered fade-up cascade (0.1s delays), globe pulse, float effect

### C. Client Logos Carousel
- Infinite horizontal scroll of partner/client logos
- Logos: Wise, Payoneer, Stripe, PayPal, Amazon (or placeholder SVGs)
- Subtle opacity, hover to full opacity
- CSS animation: 25s linear infinite scroll

### D. Services Section
- Section label: "What We Offer"
- Title: "Our Services" (highlight "Services" in orange)
- 2-column header: title left, description right
- Grid of 8 service cards (responsive: 4 cols → 2 → 1):
  1. 🇺🇸 USA Company Formation (LLC Setup)
  2. 🇬🇧 UK Company Registration (Ltd Setup)
  3. 🇨🇦 Canada Company Formation
  4. 🇧🇩 Bangladesh Company Registration (RJSC + Memorandum)
  5. E-Trade License
  6. Audit Support
  7. Apostille & Attestation Services
  8. Notary & Translation Services
- Card design: dark card, icon/flag top-left, arrow top-right, title, description
- Hover: lift up 8px, border glow, arrow rotates 45deg and turns orange
- Click: navigates to service detail page

### E. Why Choose Us
- 6 cards in 3-column grid
- Each card: icon (orange gradient bg), title, description
- Cards: Fast Processing, Transparent Pricing, 100% Legal Compliance, Dedicated Support, Global Network, Proven Track Record
- Hover: lift + border glow

### F. How It Works (Process Steps)
- 4-step horizontal flow with numbered circles
- Steps: Consultation → Documentation → Formation → Ongoing Support
- Connecting gradient lines between steps
- Each step: number in circle (bordered), title, description

### G. Pricing Section
- Tab switcher: 🇺🇸 USA | 🇬🇧 UK | 🇨🇦 Canada | 🇧🇩 Bangladesh
- Animated tab switching (fade transition)
- Pricing cards per country:
  - **USA:** Basic ($199), Growth ($449), Elite ($749)
  - **UK:** Basic (£179), Standard (£229), Premium (£299)
  - **Canada:** Starter ($299), Business ($549)
  - **Bangladesh:** Startup (BDT 25,000), Enterprise (BDT 45,000)
- Card design: tier label, name, tagline, price (large), original price strikethrough, feature checklist, CTA button
- Popular card: orange border, "Most Popular" badge
- Bottom: trust badges (Secure Payment, Data Protection, Instant Confirmation, No Hidden Fees)

### H. Testimonials
- 3-column grid of review cards
- Each card: star rating, quote (italic, left border), avatar (initial circle), name, role, company
- 4 testimonials seeded

### I. FAQ (Collapsible Accordion)
- Max-width 800px centered
- Each item: question button, chevron icon, expandable answer
- Only one open at a time
- Smooth max-height transition
- 10 FAQs seeded across categories: general, usa, uk, bangladesh, services

### J. CTA Section
- "Ready to Start Your Business Journey?"
- "Get a free consultation..."
- Orange gradient CTA button
- Subtle radial glow background

### K. Contact Section
- 2-column layout: info left, form right
- Left: phone, email, address, social links (Facebook, WhatsApp, LinkedIn)
- Form fields: Name, Email, Phone, Service Interest (dropdown), Message
- Service dropdown options: USA LLC, UK Ltd, Canada, Bangladesh, E-Trade, Audit, Apostille, Notary, Other
- Submit button with paper plane icon
- Success message on submit

### L. Footer
- 4-column grid: Brand + about text | Services links | Company links | Contact info
- Social icons row (Facebook, LinkedIn, Twitter/X, WhatsApp)
- Bottom bar: copyright text | Privacy Policy | Terms | Refund Policy

---

## SERVICE DETAIL PAGE (`/services/[slug]`)

For each of the 8 services, a dedicated page with:
- Hero banner with service icon/flag and title
- Detailed description
- Features list (6 items per service)
- Related pricing packages
- FAQ section filtered to that service
- CTA to contact form
- Breadcrumb navigation

---

## LIGHT/DARK MODE TOGGLE

- Toggle button in header (sun/moon icon)
- Default: Dark mode
- Light mode colors:
  - BG: `#F8FAFE`
  - Card: `#FFFFFF`
  - Text: `#1E293B`
  - Text secondary: `#64748B`
  - Border: `rgba(0,0,0,0.08)`
- Logo swap: white logo on dark, black logo on light
- Persist preference in localStorage
- Smooth 0.3s transition on all theme properties
- Admin panel always light theme

---

## BENGALI / ENGLISH LANGUAGE SWITCH

- Toggle button in header (EN | বাং) pill switcher
- Default: English
- All text content switchable via language context/provider
- Bengali translations for:
  - Navigation items
  - Hero headline & subheadline
  - Section titles and labels
  - Service names and descriptions
  - FAQ questions and answers
  - Pricing labels
  - Footer text
  - Contact form labels
  - CTA buttons
- Persist language preference in localStorage
- Bengali font support (Noto Sans Bengali from Google Fonts)

### Bengali Translation Map (Seed Data)

```
Navigation:
- Home = হোম
- Services = সেবাসমূহ
- Pricing = মূল্য
- Why Us = কেন আমরা
- FAQ = সচরাচর জিজ্ঞাসা
- Contact = যোগাযোগ
- Get Started = শুরু করুন

Hero:
- Badge: "Trusted Business Formation Partner" = "বিশ্বস্ত ব্যবসা গঠন পার্টনার"
- Headline: "Launch Your Business Globally with Confidence" = "আত্মবিশ্বাসের সাথে আপনার ব্যবসা বিশ্বব্যাপী চালু করুন"
- Subheadline: "We handle company registration..." = "আমরা যুক্তরাষ্ট্র, যুক্তরাজ্য, কানাডা এবং বাংলাদেশে কোম্পানি নিবন্ধন, সম্মতি এবং গঠন পরিচালনা করি — যাতে আপনি আপনার ব্যবসা বৃদ্ধিতে মনোযোগ দিতে পারেন।"
- CTA: "Get Started Today" = "আজই শুরু করুন"
- CTA Secondary: "View Services" = "সেবা দেখুন"

Stats:
- Happy Clients = সন্তুষ্ট ক্লায়েন্ট
- Countries = দেশ
- Experience = অভিজ্ঞতা
- Success Rate = সফলতার হার

Services:
- "What We Offer" = "আমরা যা অফার করি"
- "Our Services" = "আমাদের সেবাসমূহ"
- Service titles translated individually

Why Us:
- "Why Choose Trust Formation" = "কেন Trust Formation বেছে নেবেন"
- Fast Processing = দ্রুত প্রক্রিয়াকরণ
- Transparent Pricing = স্বচ্ছ মূল্য
- 100% Legal Compliance = ১০০% আইনসম্মত
- Dedicated Support = নিবেদিত সহায়তা
- Global Network = বৈশ্বিক নেটওয়ার্ক
- Proven Track Record = প্রমাণিত ট্র্যাক রেকর্ড

Pricing:
- "Choose Your Package" = "আপনার প্যাকেজ বেছে নিন"
- Select Package = প্যাকেজ নির্বাচন করুন
- Most Popular = সবচেয়ে জনপ্রিয়
- state/government fees = রাজ্য/সরকারি ফি

Testimonials:
- "What Our Clients Say" = "আমাদের ক্লায়েন্টরা যা বলছেন"

FAQ:
- "Frequently Asked Questions" = "সচরাচর জিজ্ঞাসা"

CTA:
- "Ready to Start Your Business Journey?" = "আপনার ব্যবসায়িক যাত্রা শুরু করতে প্রস্তুত?"
- "Book Free Consultation" = "বিনামূল্যে পরামর্শ বুক করুন"

Contact:
- "Let's Connect" = "যোগাযোগ করুন"
- "Your Name" = "আপনার নাম"
- "Your Email" = "আপনার ইমেইল"
- "Phone Number" = "ফোন নম্বর"
- "Select Service of Interest" = "আগ্রহের সেবা নির্বাচন করুন"
- "Tell us about your business needs..." = "আমাদের আপনার ব্যবসায়িক প্রয়োজন সম্পর্কে জানান..."
- "Send Message" = "বার্তা পাঠান"

Footer:
- All footer links, copyright, and policy links translated
```

---

## ADMIN PANEL (Full CRUD for Everything)

### Admin Pages:
1. **Login** (`/admin/login`) — Email + password, light theme
2. **Dashboard** (`/admin`) — Tab-based with 8 sections

### Admin Tabs (Each with Add/Edit/Delete):

#### 1. General Settings
- Brand colors (primary, accent, background) — color pickers
- Logo upload (light version + dark version) with preview
- Hero content: headline, subheadline, CTA texts
- Stats: 4 label/value pairs
- Contact info: phone, email, address
- Social links: Facebook, LinkedIn, WhatsApp, Twitter
- Content: about text, services description, CTA headline/subheadline/button
- Process steps: 4 title/description pairs
- Footer: copyright text, site name

#### 2. Services
- List view with drag-to-reorder
- Add/Edit modal: title, icon (FA class), flag emoji, short description, detailed description, features (JSON array)
- Delete with confirmation
- 8 services pre-seeded

#### 3. Pricing Packages
- Filter by country tab
- Add/Edit modal: country dropdown, tier, name, price, original price, currency, tagline, features (JSON), popular checkbox
- Delete with confirmation
- 10 packages pre-seeded

#### 4. FAQs
- Add/Edit modal: question, answer (textarea), category dropdown (general/usa/uk/canada/bangladesh/services)
- Delete with confirmation
- 10 FAQs pre-seeded

#### 5. Testimonials
- Add/Edit modal: name, role, company, quote, rating (1-5), video URL, featured checkbox
- Delete with confirmation
- 4 testimonials pre-seeded

#### 6. Why Choose Us
- Add/Edit modal: title, icon (FA class), description
- Delete with confirmation
- 6 items pre-seeded

#### 7. Client Logos
- Add/Edit modal: name, logo URL, website URL
- Delete with confirmation
- 5 logos pre-seeded

#### 8. Contact Submissions
- List view with read/unread status
- Mark as read, delete
- Shows: name, email, phone, service interest, message, date

---

## ANIMATIONS & MICRO-INTERACTIONS

### Scroll Reveal (IntersectionObserver)
- `data-animate="fade-up"`: translateY(30px) → 0, opacity 0 → 1
- `data-animate="fade-left"`: translateX(-40px) → 0
- `data-animate="fade-right"`: translateX(40px) → 0
- `data-animate="scale-in"`: scale(0.85) → 1
- Stagger delays: `data-delay="1"` through `data-delay="10"` (0.1s increments)

### Hero Cascade
- Staggered entrance: badge → title → sub → actions → stats → visual → float badges
- Each 0.15s delay

### Header
- Slide down on page load
- Background darkens on scroll

### Cards
- Hover: translateY(-8px), border glow, shadow increase
- Service icon: scale(1.1) rotate(5deg) on hover
- Service arrow: rotate(45deg) + orange bg on card hover

### FAQ Accordion
- Smooth max-height transition
- Chevron icon rotates 180deg
- Only one open at a time

### Pricing Tabs
- Fade transition between country packages
- Popular card: pulsing glow

### Client Logos
- Infinite horizontal scroll (CSS animation)
- Hover: opacity increase

### Scroll-to-Top
- Appears after 400px scroll
- Smooth scroll to top
- Orange gradient, hover lift

### Globe (Hero)
- Float animation (6s ease-in-out infinite)
- Pulse glow (4s)

### Reduced Motion
- Respect `prefers-reduced-motion: reduce`
- Disable all animations, show content immediately

---

## RESPONSIVE BREAKPOINTS

- Desktop: 1200px+ (4-col grids)
- Tablet: 768px-1199px (2-col grids, stack hero)
- Mobile: <768px (1-col, hamburger menu, stacked layout)
- Small: <480px (adjusted spacing)

---

## TECHNICAL REQUIREMENTS

- **Framework:** React/Next.js (or whatever Lovable uses)
- **Styling:** Tailwind CSS or CSS variables
- **State Management:** React Context for theme + language
- **Database:** Supabase or Lovable's built-in DB
- **Auth:** Built-in admin authentication
- **Image Upload:** For logos and service images
- **SEO:** Proper meta tags, Open Graph, structured data
- **Performance:** Lazy loading, optimized images, minimal JS
- **Accessibility:** ARIA labels, keyboard navigation, focus states
- **PWA-ready:** Manifest, service worker ready

---

## SEED DATA (Use This Exact Data)

### Services:
1. **USA Company Formation (LLC Setup)** — "Register your LLC or Corporation in the United States with full compliance. Includes EIN, registered agent, and operating agreement." — Flag: 🇺🇸
2. **UK Company Registration (Ltd Setup)** — "Set up your Limited Company in the United Kingdom quickly and easily with Companies House registration." — Flag: 🇬🇧
3. **Canada Company Formation** — "Start your business in Canada with expert guidance through federal or provincial incorporation." — Flag: 🇨🇦
4. **Bangladesh Company Registration (RJSC + Memorandum)** — "Register your company in Bangladesh with complete RJSC filing, memorandum, and legal assistance." — Flag: 🇧🇩
5. **E-Trade License** — "Obtain your e-commerce trade license to legally sell online across international markets."
6. **Audit Support** — "Professional audit support and regulatory compliance services for businesses of all sizes."
7. **Apostille & Attestation Services** — "Get apostille certification and embassy attestation for international document authentication."
8. **Notary & Translation Services** — "Professional notarization and certified translation services for legal and business documents."

### Contact Info:
- Phone: +1 (917) 718-9718
- Email: info@trustformation.net
- CEO Email: ceo@trustformation.net
- Address: 2554 Bedford Avenue, Brooklyn, NY, United States
- Facebook: https://www.facebook.com/TrustFormation/

---

## IMPORTANT NOTES

1. **Every text element** on the frontend must be switchable between English and Bengali
2. **Theme toggle** must affect all pages including admin (admin stays light)
3. **All modals** in admin must work with proper form validation
4. **Contact form** must submit to backend and show success message
5. **FAQ accordion** must only allow one open at a time
6. **Pricing tabs** must filter with smooth animation
7. **Service cards** must link to detail pages
8. **Scroll animations** must work on all sections
9. **Mobile responsive** — all layouts must work on phone screens
10. **Missing content** — use placeholder lorem ipsum text, but keep it contextually relevant
11. **Logo files** are at `/trust-white-logo.png` (light) and `/trust-black-logo.png` (dark) — use both
12. **Admin must have edit access to EVERYTHING** — no hardcoded content on frontend
