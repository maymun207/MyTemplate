# CleanBlueprint — MyTemplate

> A comprehensive overview of the project's tech stack, directory structure, linting rules, and configurations.

---

## 1. Tech Stack

| Layer           | Technology                    | Version          |
| --------------- | ----------------------------- | ---------------- |
| **Framework**   | Next.js (App Router)          | 16.1.6           |
| **Language**    | TypeScript                    | ^5               |
| **Runtime**     | React                         | 19.2.3           |
| **Styling**     | Tailwind CSS v4 + PostCSS     | ^4               |
| **AI**          | Google Generative AI (Gemini) | ^0.24.1          |
| **Email**       | Nodemailer (Gmail SMTP)       | ^8.0.1           |
| **Animation**   | Framer Motion                 | ^12.34.3         |
| **Icons**       | Lucide React                  | ^0.575.0         |
| **Utilities**   | clsx                          | ^2.1.1           |
| **PDF**         | react-pdf / unpdf             | ^10.4.1 / ^1.4.0 |
| **Google APIs** | googleapis (Drive)            | ^171.4.0         |
| **Deployment**  | Vercel                        | —                |
| **Bundler**     | Turbopack (built-in)          | —                |

### Fonts

- **Headings:** Inter (sans-serif)
- **Body:** Source Sans 3 (sans-serif)

### Design Tokens (CSS Variables)

```css
--color-primary: #1e3a8a /* Deep Blue */ --color-secondary: #f97316 /* Orange */
  --color-accent: #00d1ff /* Cyan */ Background: #000000 /* Black */
  Text: #ffffff /* White */;
```

---

## 2. Directory Structure

```
MyAstro-website/
├── public/                          # Static assets
│   ├── EnsoFolder/                  # Custom assets
│   ├── images/                      # Image assets
│   └── *.svg                        # SVG icons
├── scripts/                         # Utility scripts (excluded from TS build)
│   ├── test-smtp.ts
│   └── verify-smtp-system.ts
├── docs/
│   └── TODO.md                      # Project TODO tracker
├── src/
│   ├── ai/                          # AI chatbot configuration
│   │   ├── persona.md               # ARDI bot persona definition
│   │   ├── knowledge-base.md        # Compiled knowledge base
│   │   ├── knowledge/               # Individual knowledge files
│   │   │   ├── 01-company-overview.md
│   │   │   ├── 02-products-services.md
│   │   │   ├── 03-technology.md
│   │   │   ├── 04-case-studies.md
│   │   │   ├── 05-faq.md
│   │   │   └── 06-roi-calculator.md
│   │   └── docs/                    # AI-accessible documents
│   │
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout (fonts, global styles)
│   │   ├── globals.css              # Global CSS + Tailwind v4 theme
│   │   ├── favicon.ico
│   │   ├── robots.ts                # SEO robots.txt generator
│   │   ├── sitemap.ts               # SEO sitemap generator
│   │   │
│   │   ├── [locale]/                # i18n dynamic route segment
│   │   │   ├── layout.tsx           # Locale layout (Header, Footer, Chat, SEO)
│   │   │   ├── page.tsx             # Home page
│   │   │   ├── not-found.tsx        # 404 page
│   │   │   ├── about/page.tsx
│   │   │   ├── careers/page.tsx
│   │   │   └── case-studies/
│   │   │       ├── page.tsx
│   │   │       ├── ceramic-tile-production/page.tsx
│   │   │       └── raw-materials-factory/page.tsx
│   │   │
│   │   └── api/                     # API Routes
│   │       ├── chat/route.ts        # AI chat endpoint (Gemini)
│   │       └── contact/route.ts     # Contact form endpoint (SMTP)
│   │
│   ├── components/
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ChatWidgetWrapper.tsx
│   │   ├── sections/                # Page sections
│   │   │   ├── HeroCarousel.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ROICalculator.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── CareersSection.tsx
│   │   │   ├── CaseStudyCeramic.tsx
│   │   │   └── CaseStudyRawMaterials.tsx
│   │   └── ui/                      # Reusable UI primitives
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Slider.tsx
│   │       ├── ChatWidget.tsx
│   │       ├── ContactModal.tsx
│   │       └── WorkshopModal.tsx
│   │
│   ├── lib/                         # Shared utilities & config
│   │   ├── constants.ts             # Site config, colors, contact info
│   │   ├── utils.ts                 # General utilities
│   │   ├── structured-data.ts       # JSON-LD schema generators
│   │   ├── EmailService.ts          # Nodemailer SMTP service
│   │   ├── roi-calculator.ts        # ROI calculation helpers
│   │   ├── roiCalculations.ts       # ROI formulas & logic
│   │   ├── google-drive-loader.ts   # Google Drive document loader
│   │   ├── Params.ts                # Param type helpers
│   │   ├── i18n/
│   │   │   ├── config.ts            # i18n locale configuration
│   │   │   └── dictionaries.ts      # Dictionary loader
│   │   └── dictionaries/
│   │       ├── en.json              # English translations
│   │       └── tr.json              # Turkish translations
│   │
│   ├── types/
│   │   └── index.ts                 # Global TypeScript interfaces
│   │
│   └── middleware.ts                # i18n locale detection & redirect
│
├── .env.example                     # Environment variable template
├── .gitignore
├── eslint.config.mjs                # ESLint flat config
├── next.config.ts                   # Next.js configuration
├── postcss.config.mjs               # PostCSS (Tailwind v4)
├── tsconfig.json                    # TypeScript configuration
├── package.json
└── package-lock.json
```

---

## 3. Internationalization (i18n)

| Setting               | Value                                              |
| --------------------- | -------------------------------------------------- |
| **Strategy**          | URL-based dynamic segment `[locale]`               |
| **Default locale**    | `tr` (Turkish)                                     |
| **Supported locales** | `en`, `tr`                                         |
| **Detection**         | `Accept-Language` header via `middleware.ts`       |
| **Dictionaries**      | JSON files at `src/lib/dictionaries/{locale}.json` |

The middleware intercepts all non-locale-prefixed, non-API, non-static requests and redirects to `/{locale}/...`.

---

## 4. Linting & Code Quality

### ESLint (Flat Config — `eslint.config.mjs`)

```
Extends:
  ├── eslint-config-next/core-web-vitals   (Performance + React best practices)
  └── eslint-config-next/typescript        (TypeScript-specific rules)

Ignored paths:
  ├── .next/**
  ├── out/**
  ├── build/**
  └── next-env.d.ts
```

### TypeScript (`tsconfig.json`)

| Option             | Value                     |
| ------------------ | ------------------------- |
| `target`           | ES2017                    |
| `module`           | esnext                    |
| `moduleResolution` | bundler                   |
| `strict`           | true                      |
| `jsx`              | react-jsx                 |
| `incremental`      | true                      |
| `isolatedModules`  | true                      |
| `skipLibCheck`     | true                      |
| `noEmit`           | true                      |
| Path alias         | `@/*` → `./src/*`         |
| Excluded           | `node_modules`, `scripts` |

---

## 5. Environment Variables

Defined in `.env.example`:

```
# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<email>
SMTP_PASS=<app-password>
SMTP_FROM=<email>
CONTACT_EMAIL=contact@ardictech.com.tr

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Generative AI (Gemini)
GOOGLE_API_KEY=<api-key>
```

> [!IMPORTANT]
> `.env*` files are git-ignored. Copy `.env.example` → `.env.local` and fill in real values.

---

## 6. Docker Configuration

> [!NOTE]
> This project currently has **no Docker configuration**. It is deployed via **Vercel** (serverless).

### Recommended Dockerfile (for future use)

If you need to containerize, use the official Next.js standalone output:

```dockerfile
# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

> Requires adding `output: "standalone"` to `next.config.ts`.

---

## 7. SEO Features

- **Dynamic `robots.ts`** — auto-generated robots.txt
- **Dynamic `sitemap.ts`** — auto-generated XML sitemap
- **JSON-LD** — Organization + LocalBusiness structured data injected in locale layout
- **OpenGraph meta tags** — per-locale OG tags with canonical URLs
- **Hreflang alternates** — `en` / `tr` language alternates

---

## 8. Key Architectural Patterns

| Pattern               | Implementation                                          |
| --------------------- | ------------------------------------------------------- |
| **App Router**        | File-based routing with dynamic `[locale]` segment      |
| **Server Components** | Default for pages and layouts                           |
| **Client Components** | Interactive widgets (Chat, Carousel, ROI Calculator)    |
| **API Routes**        | `route.ts` handlers for chat and contact                |
| **AI Knowledge Base** | Markdown files in `src/ai/knowledge/` loaded at runtime |
| **Email Service**     | `EmailService.ts` wraps Nodemailer with Gmail SMTP      |
| **Google Drive**      | `google-drive-loader.ts` for document fetching          |
| **Path Alias**        | `@/` maps to `src/` for clean imports                   |

---

## 9. NPM Scripts

| Script  | Command      | Purpose                      |
| ------- | ------------ | ---------------------------- |
| `dev`   | `next dev`   | Start dev server (Turbopack) |
| `build` | `next build` | Production build             |
| `start` | `next start` | Serve production build       |
| `lint`  | `eslint`     | Run ESLint checks            |

---

## 10. Git & Deployment

| Item           | Value                                                                         |
| -------------- | ----------------------------------------------------------------------------- |
| **Repository** | [maymun207/MyTemplate](https://github.com/maymun207/MyTemplate)               |
| **Branch**     | `main`                                                                        |
| **Hosting**    | Vercel (serverless)                                                           |
| **CI/CD**      | Vercel auto-deploy on push to `main`                                          |
| **Git ignore** | `node_modules`, `.next`, `.env*`, `.vercel`, `*.tsbuildinfo`, `next-env.d.ts` |
