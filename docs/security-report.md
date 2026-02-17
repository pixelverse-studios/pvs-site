# Security Audit Report - PR #80

**PR Title:** PVS-322: Refactor Hero Section with 5-Star Badge
**Branch:** pvs-322 → epic/pvs-320
**Audit Date:** 2026-02-13
**Auditor:** Claude Sonnet 4.5 Security Analysis
**Scope:** Client-side security review of homepage hero section refactoring

---

## Executive Summary

This security audit reviewed PR #80, which refactors the hero section to consume data from a centralized data structure (`data/homepage.ts`) and renders dynamic content including badge text, headlines, and CTA links. The audit identified **4 critical vulnerabilities** and **multiple high-severity issues** that require immediate attention before merging.

**Risk Assessment:**

- **Critical:** 3 issues (Open Redirect, Next.js CVEs, Missing Security Headers)
- **High:** 2 issues (XSS risk, Dependency vulnerabilities)
- **Medium:** 2 issues (Type validation, Content injection)
- **Low:** 1 issue (Unicode security)

**Overall Security Posture:** REQUIRES IMMEDIATE REMEDIATION

The primary concerns are:

1. Dynamic href values without validation create open redirect vulnerability
2. Outdated Next.js version with 16 known critical CVEs
3. Missing security headers (CSP, X-Frame-Options, etc.)
4. No input sanitization for user-controlled content

---

## Critical Vulnerabilities

### 1. Open Redirect Vulnerability via Dynamic CTA Links

**Location:**

- `components/home/hero-section.tsx:48-49` (primaryCta.href)
- `components/home/hero-section.tsx:52` (secondaryCta.href)
- `data/homepage.ts:93-99` (CTA href definitions)

**Description:**

The hero section renders CTA links using dynamic `href` values from the `homepageHero` data structure without any validation or sanitization. While the current values are safe internal routes (`/contact`, `/audit`), nothing prevents a malicious actor who gains write access to the codebase from modifying these values to external URLs or JavaScript URIs.

**Vulnerable Code:**

```tsx
// components/home/hero-section.tsx
<Link href={homepageHero.primaryCta.href}>{homepageHero.primaryCta.label}</Link>
```

```ts
// data/homepage.ts
primaryCta: {
  label: 'Start Your Project',
  href: '/contact',  // No validation - could be changed to 'https://evil.com' or 'javascript:alert(1)'
},
```

**Impact:**

- **Open Redirect Attack:** Attacker could redirect users to phishing sites that mimic PixelVerse branding
- **Credential Harvesting:** Users could unknowingly submit credentials to malicious sites
- **SEO Poisoning:** Search engines may penalize the site if outbound links point to spam/malicious sites
- **Brand Reputation Damage:** Users lose trust if redirected to inappropriate content

**Attack Scenario:**

1. Attacker gains commit access or compromises CI/CD pipeline
2. Changes `primaryCta.href` to `"https://phishing-site.com/login"`
3. Users click "Start Your Project" button
4. Users are redirected to attacker's site that looks identical to PixelVerse
5. Users submit contact form with PII to attacker's server

**Remediation Checklist:**

- [ ] Create a URL validation utility in `lib/validation/url.ts`
- [ ] Add Zod schema for internal route validation:

  ```ts
  import { z } from 'zod';

  // Only allow internal routes or specific whitelisted external domains
  export const internalRouteSchema = z.string().refine(
    (url) => {
      // Allow relative paths starting with /
      if (url.startsWith('/')) {
        // Ensure no protocol or domain
        return !url.includes('://') && !url.startsWith('//');
      }
      // Optionally allow hash links
      if (url.startsWith('#')) {
        return true;
      }
      // Reject all other formats
      return false;
    },
    {
      message: 'Only internal routes (starting with /) or hash links are allowed',
    },
  );

  // For external links, use explicit whitelist
  export const externalLinkSchema = z.string().refine(
    (url) => {
      const allowedDomains = ['pixelversestudios.io', 'github.com/pixelverse-studios'];
      try {
        const parsedUrl = new URL(url);
        return allowedDomains.some((domain) => parsedUrl.hostname.endsWith(domain));
      } catch {
        return false;
      }
    },
    {
      message: 'External links must be from approved domains',
    },
  );
  ```

- [ ] Validate all href values at build time in `data/homepage.ts`:

  ```ts
  import { internalRouteSchema } from '@/lib/validation/url';

  export const homepageHero: HomepageHero = {
    // ... other fields
    primaryCta: {
      label: 'Start Your Project',
      href: internalRouteSchema.parse('/contact'), // Throws if invalid
    },
    secondaryCta: {
      label: 'Free Website Audit',
      href: internalRouteSchema.parse('/audit'), // Throws if invalid
    },
  };
  ```

- [ ] Add TypeScript branded types to enforce validation:

  ```ts
  // lib/types/url.ts
  export type InternalRoute = string & { readonly __brand: 'InternalRoute' };

  export function createInternalRoute(path: string): InternalRoute {
    const validated = internalRouteSchema.parse(path);
    return validated as InternalRoute;
  }

  // data/homepage.ts
  export interface HomepageHero {
    badge: string;
    headline: string;
    subheadline: string;
    primaryCta: {
      label: string;
      href: InternalRoute; // Type-safe!
    };
    secondaryCta: {
      label: string;
      href: InternalRoute;
    };
  }
  ```

- [ ] Add ESLint rule to prevent direct Next.js Link usage without validation
- [ ] Create a safe `<SafeLink>` wrapper component that validates all href props
- [ ] Document the URL validation requirements in `CLAUDE.md`

**References:**

- [OWASP: Unvalidated Redirects and Forwards](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/04-Testing_for_Client-side_URL_Redirect)
- [CWE-601: URL Redirection to Untrusted Site](https://cwe.mitre.org/data/definitions/601.html)

---

### 2. Next.js Framework Vulnerabilities (16 Critical CVEs)

**Location:**

- `package.json` - Next.js version 14.1.0

**Description:**

The project uses Next.js 14.1.0, which has **16 known critical security vulnerabilities** including:

- Server-Side Request Forgery (SSRF)
- Cache Poisoning
- Denial of Service (DoS)
- Authorization Bypass
- Information Exposure

**NPM Audit Output:**

```
next  0.9.9 - 15.5.9
Severity: critical
- Next.js Server-Side Request Forgery in Server Actions (GHSA-fr5h-rqp8-mj6g)
- Next.js Cache Poisoning (GHSA-gp8f-8m3g-qvj9)
- Denial of Service condition in Next.js image optimization (GHSA-g77x-44xx-532m)
- Next.js Allows a Denial of Service (DoS) with Server Actions (GHSA-7m27-7ghc-44w9)
- Information exposure in Next.js dev server due to lack of origin verification (GHSA-3h52-269p-cp9r)
- Next.js Affected by Cache Key Confusion for Image Optimization API Routes (GHSA-g5qg-72qw-gw5v)
- Next.js authorization bypass vulnerability (GHSA-7gfc-8cq8-jh5f)
- Next.js Improper Middleware Redirect Handling Leads to SSRF (GHSA-4342-x723-ch2f)
- Next.js Content Injection Vulnerability for Image Optimization (GHSA-xv57-4mr9-wg8v)
- Next.js Race Condition to Cache Poisoning (GHSA-qpjv-v59x-3qc4)
- Authorization Bypass in Next.js Middleware (GHSA-f82v-jwr5-mffw)
- Next Vulnerable to Denial of Service with Server Components (GHSA-mwv6-3258-q52c)
- Next has a Denial of Service with Server Components (GHSA-5j59-xgg2-r9c4)
- Next.js self-hosted applications vulnerable to DoS via Image Optimizer (GHSA-9g9p-9gw9-jx7f)
- Next.js HTTP request deserialization can lead to DoS with insecure RSC (GHSA-h25m-26qc-wcjf)
```

**Impact:**

- **SSRF Attacks:** Attackers could force the server to make requests to internal services
- **Cache Poisoning:** Malicious actors could poison CDN/browser caches with malicious content
- **DoS Attacks:** Application could be taken offline via resource exhaustion
- **Authorization Bypass:** Protected routes (`/dashboard`) could be accessed without authentication
- **Data Exposure:** Sensitive information could leak through dev server or middleware

**Attack Scenario (SSRF):**

1. Attacker exploits Server Actions SSRF vulnerability
2. Sends crafted request to internal metadata service (e.g., `http://169.254.169.254/latest/meta-data/`)
3. Retrieves AWS credentials or other cloud provider secrets
4. Uses credentials to access production databases or S3 buckets
5. Exfiltrates client data or deploys backdoors

**Remediation Checklist:**

- [ ] **URGENT:** Update Next.js to latest stable version (15.1.x or latest 14.2.x LTS)

  ```bash
  npm install next@latest
  # or for LTS stability
  npm install next@14.2.35
  ```

- [ ] Update React to latest 18.x version to patch XSS vulnerabilities:

  ```bash
  npm install react@latest react-dom@latest
  ```

- [ ] Run full test suite after upgrade to catch breaking changes
- [ ] Review Next.js 15 migration guide if upgrading to v15: https://nextjs.org/docs/app/building-your-application/upgrading
- [ ] Test image optimization endpoints for DoS vulnerabilities
- [ ] Verify middleware authentication still works correctly after upgrade
- [ ] Add `npm audit` to CI/CD pipeline to catch future vulnerabilities:

  ```yaml
  # .github/workflows/security-audit.yml
  name: Security Audit
  on: [push, pull_request]
  jobs:
    audit:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - run: npm audit --audit-level=high
        - run: npm audit signatures
  ```

- [ ] Configure Dependabot for automated security updates:

  ```yaml
  # .github/dependabot.yml
  version: 2
  updates:
    - package-ecosystem: 'npm'
      directory: '/'
      schedule:
        interval: 'weekly'
      open-pull-requests-limit: 10
      versioning-strategy: increase-if-necessary
  ```

- [ ] Set up Snyk or Socket.dev for continuous dependency monitoring

**References:**

- [Next.js Security Advisories](https://github.com/vercel/next.js/security/advisories)
- [NPM Audit Documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit)

---

### 3. Missing Security Headers

**Location:**

- `next.config.js` - No security headers configuration

**Description:**

The Next.js configuration does not implement critical security headers that protect against common web attacks. The application is missing:

- **Content-Security-Policy (CSP):** Prevents XSS, clickjacking, and code injection
- **X-Frame-Options:** Prevents clickjacking attacks
- **X-Content-Type-Options:** Prevents MIME-sniffing attacks
- **Referrer-Policy:** Controls information leakage via Referer header
- **Permissions-Policy:** Restricts access to browser features
- **Strict-Transport-Security (HSTS):** Forces HTTPS connections

**Impact:**

- **XSS Attacks:** Without CSP, injected scripts can execute freely
- **Clickjacking:** Site can be embedded in malicious iframes
- **MIME Sniffing:** Browsers may execute non-executable files as scripts
- **Data Leakage:** Sensitive URLs leaked via Referer header
- **Privilege Escalation:** Malicious scripts can access camera, microphone, geolocation

**Attack Scenario (Clickjacking):**

1. Attacker creates malicious site with invisible iframe containing `/contact` page
2. Overlays fake "Win a Prize!" button over the real "Start Your Project" CTA
3. User clicks, unknowingly submitting contact form to attacker's endpoint
4. Attacker harvests user's email, phone, business information

**Remediation Checklist:**

- [ ] Add comprehensive security headers to `next.config.js`:

  ```javascript
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    // ... existing config
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN', // Prevent clickjacking
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff', // Prevent MIME sniffing
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
            },
            {
              key: 'Content-Security-Policy',
              value: [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sitebehaviour.com https://www.googletagmanager.com",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                "img-src 'self' data: https: blob:",
                "font-src 'self' https://fonts.gstatic.com",
                "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://sitebehaviour.com",
                "frame-src 'self'",
                "base-uri 'self'",
                "form-action 'self'",
                "frame-ancestors 'self'",
                'upgrade-insecure-requests',
              ].join('; '),
            },
          ],
        },
      ];
    },
  };
  ```

- [ ] **Important:** Audit all third-party scripts currently in use:
  - SiteBehaviour analytics script (`components/sitebehaviour-script.tsx`)
  - Google Tag Manager
  - Sentry error tracking
  - Supabase client

- [ ] Remove `'unsafe-inline'` and `'unsafe-eval'` from CSP after audit:
  - Move all inline scripts to external files
  - Use nonces for necessary inline scripts:

    ```tsx
    // Use Next.js Script component with nonce
    import Script from 'next/script';
    import { headers } from 'next/headers';

    export default function RootLayout({ children }) {
      const nonce = headers().get('x-nonce');
      return (
        <html>
          <body>
            {children}
            <Script src="/analytics.js" strategy="afterInteractive" nonce={nonce} />
          </body>
        </html>
      );
    }
    ```

- [ ] Test CSP in report-only mode first to avoid breaking existing functionality:

  ```javascript
  {
    key: 'Content-Security-Policy-Report-Only',
    value: '...'  // Same policy as above
  }
  ```

- [ ] Set up CSP violation reporting endpoint:

  ```javascript
  'report-uri https://your-csp-report-endpoint.com/report';
  ```

- [ ] Add CSP to Netlify/Vercel deployment configuration as backup
- [ ] Use [securityheaders.com](https://securityheaders.com) to validate implementation
- [ ] Use [Mozilla Observatory](https://observatory.mozilla.org/) for comprehensive security scoring

**References:**

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [Next.js Security Headers Guide](https://nextjs.org/docs/advanced-features/security-headers)
- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CWE-1021: Improper Restriction of Rendered UI Layers](https://cwe.mitre.org/data/definitions/1021.html)

---

## High Vulnerabilities

### 4. XSS Risk from Unvalidated Content Rendering

**Location:**

- `components/home/hero-section.tsx:37` (badge rendering)
- `components/home/hero-section.tsx:40-42` (headline rendering)
- `components/home/hero-section.tsx:45` (subheadline rendering)
- `data/homepage.ts:88-91` (content definitions)

**Description:**

The hero section renders user-controlled content from `homepageHero` data structure directly into the DOM without sanitization. While React provides automatic XSS protection for text nodes, there are several edge cases that create risk:

1. **Emoji Unicode Injection:** The badge contains emoji characters (`⭐⭐⭐⭐⭐`) that could be replaced with malicious Unicode characters
2. **No Type Validation:** TypeScript interfaces don't validate content at runtime
3. **Future Risk:** If content source changes from static file to CMS/database, XSS becomes critical

**Vulnerable Code:**

```tsx
// No sanitization or validation
<Badge variant="default" className="...">
  {homepageHero.badge}  // Currently: "⭐⭐⭐⭐⭐ Rated 5.0 by clients"
</Badge>

<h1 className="...">
  <span className="...">
    {homepageHero.headline}  // Could contain malicious markup if source changes
  </span>
</h1>

<p className="...">{homepageHero.subheadline}</p>
```

**Impact:**

- **Stored XSS:** If content source moves to database, unvalidated content could execute scripts
- **Unicode Attacks:** Malicious Unicode characters could break layout or trigger browser bugs
- **Content Injection:** HTML entities could be used for phishing attacks
- **BiDi Override Attacks:** Right-to-left override characters could obscure malicious content

**Attack Scenario (Future Risk):**

1. PixelVerse moves content to Supabase CMS for easier management
2. Compromised admin account modifies `homepageHero.headline`
3. Injects payload: `"Web Design <img src=x onerror=alert(document.cookie)>"`
4. React escapes the HTML, but future developer uses `dangerouslySetInnerHTML` for "rich text"
5. XSS executes on all homepage visits, stealing session cookies

**Remediation Checklist:**

- [ ] Create content validation schemas in `lib/validation/content.ts`:

  ```ts
  import { z } from 'zod';

  // Maximum lengths prevent DoS and layout breaking
  const MAX_BADGE_LENGTH = 100;
  const MAX_HEADLINE_LENGTH = 120;
  const MAX_SUBHEADLINE_LENGTH = 500;

  // Disallow dangerous characters
  const textContentSchema = z
    .string()
    .trim()
    .refine((val) => !val.includes('<') && !val.includes('>'), 'HTML tags are not allowed')
    .refine(
      (val) => !/[\u202E\u202D\u200E\u200F]/.test(val),
      'Bidirectional override characters are not allowed',
    );

  export const badgeSchema = textContentSchema.max(
    MAX_BADGE_LENGTH,
    `Badge must be ${MAX_BADGE_LENGTH} characters or fewer`,
  );

  export const headlineSchema = textContentSchema.max(
    MAX_HEADLINE_LENGTH,
    `Headline must be ${MAX_HEADLINE_LENGTH} characters or fewer`,
  );

  export const subheadlineSchema = textContentSchema.max(
    MAX_SUBHEADLINE_LENGTH,
    `Subheadline must be ${MAX_SUBHEADLINE_LENGTH} characters or fewer`,
  );

  // For rich text content (future-proofing)
  export const richTextSchema = z
    .string()
    .trim()
    .max(5000)
    .transform((val) => {
      // Use DOMPurify or similar sanitizer
      if (typeof window !== 'undefined' && window.DOMPurify) {
        return window.DOMPurify.sanitize(val, {
          ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
          ALLOWED_ATTR: [],
        });
      }
      return val;
    });
  ```

- [ ] Validate all content in `data/homepage.ts`:

  ```ts
  import { badgeSchema, headlineSchema, subheadlineSchema } from '@/lib/validation/content';

  export const homepageHero: HomepageHero = {
    badge: badgeSchema.parse('⭐⭐⭐⭐⭐ Rated 5.0 by clients'),
    headline: headlineSchema.parse('Web Design & Development, Done With Intention'),
    subheadline: subheadlineSchema.parse(
      'We build fast, scalable websites for businesses that need more than a template. Custom code, UX-first design, and SEO foundations that actually work.',
    ),
    // ... rest of config
  };
  ```

- [ ] Add runtime validation for CMS content:

  ```ts
  // lib/api/cms.ts
  export async function getHomepageContent() {
    const rawContent = await supabase.from('homepage_content').select('*').single();

    // Validate before using
    const validated = {
      badge: badgeSchema.parse(rawContent.badge),
      headline: headlineSchema.parse(rawContent.headline),
      subheadline: subheadlineSchema.parse(rawContent.subheadline),
      // ...
    };

    return validated;
  }
  ```

- [ ] **Never use `dangerouslySetInnerHTML` for user-controlled content**
- [ ] Add ESLint rule to warn about `dangerouslySetInnerHTML` usage:

  ```json
  // .eslintrc.json
  {
    "rules": {
      "react/no-danger": "error"
    }
  }
  ```

- [ ] Install DOMPurify for future rich text sanitization:

  ```bash
  npm install dompurify isomorphic-dompurify
  npm install --save-dev @types/dompurify
  ```

- [ ] Document content security policy in `CLAUDE.md`:

  ```markdown
  ## Content Security Policy

  ALL user-facing content must be validated using Zod schemas from `lib/validation/content.ts`.

  - Static content in data files: Validate at build time
  - CMS/database content: Validate at runtime before rendering
  - Never use `dangerouslySetInnerHTML` without DOMPurify sanitization
  - Maximum length limits prevent DoS and layout issues
  ```

**References:**

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [React Security: dangerouslySetInnerHTML](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html)
- [CWE-79: Improper Neutralization of Input During Web Page Generation](https://cwe.mitre.org/data/definitions/79.html)

---

### 5. Dependency Vulnerabilities

**Location:**

- `package.json` - Multiple dependencies with known CVEs

**Description:**

Beyond Next.js, several other dependencies have security vulnerabilities:

- **glob (10.2.0 - 10.4.5):** Command injection via CLI (HIGH severity)
- **js-yaml (4.0.0 - 4.1.0):** Prototype pollution in merge (MODERATE severity)
- **@next/eslint-plugin-next:** Depends on vulnerable glob version

**NPM Audit Output:**

```
glob  10.2.0 - 10.4.5
Severity: high
glob CLI: Command injection via -c/--cmd executes matches with shell:true
fix available via `npm audit fix --force`

js-yaml  4.0.0 - 4.1.0
Severity: moderate
js-yaml has prototype pollution in merge (<<)
fix available via `npm audit fix`
```

**Impact:**

- **Prototype Pollution:** Attackers could modify Object.prototype, affecting all objects
- **Command Injection:** If glob is used in build scripts, arbitrary commands could execute
- **Supply Chain Attack:** Vulnerabilities in dev dependencies can compromise build pipeline

**Remediation Checklist:**

- [ ] Run `npm audit fix` to update js-yaml:

  ```bash
  npm audit fix
  ```

- [ ] Update glob via eslint-config-next (breaking change - test thoroughly):

  ```bash
  npm audit fix --force
  # Then test: npm run lint && npm run build
  ```

- [ ] Pin exact dependency versions in `package.json` to prevent unexpected updates:

  ```json
  {
    "dependencies": {
      "next": "14.2.35", // Remove ^ to lock version
      "react": "18.3.1"
    }
  }
  ```

- [ ] Add `package-lock.json` to version control if not already present
- [ ] Use `npm ci` in CI/CD instead of `npm install` for reproducible builds
- [ ] Set up automated dependency updates with security checks:

  ```yaml
  # .github/workflows/dependencies.yml
  name: Dependency Review
  on: [pull_request]
  jobs:
    dependency-review:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/dependency-review-action@v3
          with:
            fail-on-severity: moderate
  ```

- [ ] Consider using Snyk or Socket.dev for continuous monitoring:
  ```bash
  npx @socketsecurity/cli audit
  ```

**References:**

- [NPM Audit Documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [GitHub Advisory Database](https://github.com/advisories)

---

## Medium Vulnerabilities

### 6. No Runtime Type Validation for Data Structures

**Location:**

- `data/homepage.ts` - TypeScript interfaces without runtime validation

**Description:**

The `HomepageHero` interface provides compile-time type safety, but no runtime validation. If the data source changes from a static TypeScript file to a database, API, or CMS, invalid data could cause:

- Application crashes
- XSS vulnerabilities
- Open redirect attacks
- UI breaking bugs

**Current Code:**

```ts
export interface HomepageHero {
  badge: string;
  headline: string;
  subheadline: string;
  primaryCta: {
    label: string;
    href: string; // No constraint - could be any string
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

// TypeScript trusts this at compile time, but can't validate at runtime
export const homepageHero: HomepageHero = {
  badge: '⭐⭐⭐⭐⭐ Rated 5.0 by clients',
  headline: 'Web Design & Development, Done With Intention',
  // ...
};
```

**Impact:**

- **Silent Failures:** Invalid data passes TypeScript checks but breaks at runtime
- **Security Bypass:** Type system can't prevent malicious URLs or XSS payloads
- **Production Crashes:** Missing required fields cause undefined reference errors

**Remediation Checklist:**

- [ ] Create comprehensive Zod schemas for all data structures:

  ```ts
  // lib/validation/homepage.ts
  import { z } from 'zod';
  import { internalRouteSchema } from './url';
  import { badgeSchema, headlineSchema, subheadlineSchema } from './content';

  export const ctaSchema = z.object({
    label: z.string().min(1).max(50),
    href: internalRouteSchema,
  });

  export const homepageHeroSchema = z.object({
    badge: badgeSchema,
    headline: headlineSchema,
    subheadline: subheadlineSchema,
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema,
  });

  // Type inference from schema (single source of truth)
  export type HomepageHero = z.infer<typeof homepageHeroSchema>;
  ```

- [ ] Validate static data at build time:

  ```ts
  // data/homepage.ts
  import { homepageHeroSchema, type HomepageHero } from '@/lib/validation/homepage';

  const rawHomepageHero = {
    badge: '⭐⭐⭐⭐⭐ Rated 5.0 by clients',
    headline: 'Web Design & Development, Done With Intention',
    subheadline: 'We build fast, scalable websites...',
    primaryCta: {
      label: 'Start Your Project',
      href: '/contact',
    },
    secondaryCta: {
      label: 'Free Website Audit',
      href: '/audit',
    },
  };

  // Validate and export - throws if invalid, caught at build time
  export const homepageHero: HomepageHero = homepageHeroSchema.parse(rawHomepageHero);
  ```

- [ ] Create helper for future CMS integration:

  ```ts
  // lib/api/cms.ts
  import { homepageHeroSchema } from '@/lib/validation/homepage';

  export async function getHomepageHero() {
    const raw = await fetchFromCMS('homepage_hero');

    // Runtime validation - returns typed data or throws descriptive error
    return homepageHeroSchema.parse(raw);
  }
  ```

- [ ] Add build-time validation to CI/CD:

  ```json
  // package.json
  {
    "scripts": {
      "validate-data": "tsx scripts/validate-data.ts",
      "prebuild": "npm run validate-data && npm run type-check"
    }
  }
  ```

- [ ] Document validation requirements in `CLAUDE.md`

**References:**

- [Zod Documentation](https://zod.dev/)
- [TypeScript Runtime Validation](https://www.youtube.com/watch?v=bxFVpPqdjP0)

---

### 7. Potential Content Injection via Badge Component

**Location:**

- `components/ui/badge.tsx` - Client component rendering user content

**Description:**

The Badge component is marked as `'use client'` and renders content via the spread operator `{...props}`. While React escapes text content by default, the component accepts all HTML attributes through `React.HTMLAttributes<HTMLSpanElement>`, which could be exploited if props are ever sourced from user input.

**Vulnerable Pattern:**

```tsx
'use client';

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
    // ^^^ Spreads all props - could include dangerous attributes if source changes
  ),
);
```

**Impact:**

- **Event Handler Injection:** If props come from URL params or CMS, could inject `onClick`, `onMouseOver`
- **Data Attribute Injection:** Malicious `data-*` attributes could be used for social engineering
- **ARIA Attribute Abuse:** Could inject misleading accessibility attributes

**Attack Scenario (Future Risk):**

```tsx
// If badge props ever come from URL params or database
<Badge {...urlParams}>  {/* Dangerous! */}
  Trusted content
</Badge>

// Attacker crafts URL:
// ?onClick=alert('XSS')&data-malicious=true

// Results in:
<span onClick="alert('XSS')" data-malicious="true">Trusted content</span>
```

**Remediation Checklist:**

- [ ] Restrict Badge component to only accept safe props:

  ```tsx
  // components/ui/badge.tsx
  export interface BadgeProps extends VariantProps<typeof badgeVariants> {
    className?: string;
    children: React.ReactNode;
    // Explicitly list safe props instead of extending HTMLAttributes
    id?: string;
    'aria-label'?: string;
    role?: string;
  }

  const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant, children, id, 'aria-label': ariaLabel, role }, ref) => (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        id={id}
        aria-label={ariaLabel}
        role={role}
      >
        {children}
      </span>
    ),
  );
  ```

- [ ] Or add explicit prop filtering:

  ```tsx
  const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant, children, ...rawProps }, ref) => {
      // Whitelist safe props
      const safeProps = {
        id: rawProps.id,
        'aria-label': rawProps['aria-label'],
        role: rawProps.role,
      };

      return (
        <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...safeProps}>
          {children}
        </span>
      );
    },
  );
  ```

- [ ] Add ESLint rule to prevent spreading user-controlled props:

  ```json
  {
    "rules": {
      "react/jsx-props-no-spreading": [
        "warn",
        {
          "custom": "enforce",
          "exceptions": ["Component"]
        }
      ]
    }
  }
  ```

- [ ] Audit all UI components for similar patterns:
  ```bash
  grep -r "...props" components/ui/ --include="*.tsx"
  ```

**References:**

- [React Security Best Practices](https://react.dev/learn/passing-props-to-a-component#forwarding-props-with-the-jsx-spread-syntax)
- [OWASP: DOM-based XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)

---

## Low Vulnerabilities

### 8. Unicode Security Concerns in Badge Content

**Location:**

- `data/homepage.ts:88` - Emoji characters in badge text

**Description:**

The badge content uses star emoji characters (`⭐⭐⭐⭐⭐`) which are valid Unicode but could be replaced with:

- **Homograph Characters:** Similar-looking Unicode that deceives users
- **Invisible Characters:** Zero-width joiners, directional overrides
- **RTL Override:** Right-to-left text that hides malicious content

**Current Code:**

```ts
badge: '⭐⭐⭐⭐⭐ Rated 5.0 by clients',
```

**Impact:**

- **Low Severity:** Primarily a visual/UX concern rather than exploitable vulnerability
- **Phishing Risk:** If content source changes to CMS, homograph attacks become possible
- **Screen Reader Confusion:** Some Unicode may not render correctly for accessibility tools

**Example Attack (Future Risk):**

```ts
// Attacker modifies badge in CMS
badge: '⭐⭐⭐⭐⭐ Rated 5.0 by clients\u202E gnihsihp si siht',
//                                      ^^^ RTL override makes text appear as "this is phishing"
```

**Remediation Checklist:**

- [ ] Add Unicode validation to content schemas:

  ```ts
  // lib/validation/content.ts
  const safeUnicodeSchema = z.string().refine((val) => {
    // Block dangerous Unicode categories
    const dangerousPatterns = [
      /[\u202A-\u202E]/, // Directional formatting
      /[\u200B-\u200F]/, // Zero-width characters
      /[\uFEFF]/, // Zero-width no-break space
      /[\u2060-\u2069]/, // Word joiners and invisible formatting
    ];
    return !dangerousPatterns.some((pattern) => pattern.test(val));
  }, 'Text contains potentially dangerous Unicode characters');

  export const badgeSchema = safeUnicodeSchema
    .max(MAX_BADGE_LENGTH)
    .refine((val) => !val.includes('<') && !val.includes('>'), 'HTML tags are not allowed');
  ```

- [ ] Use HTML entities for star ratings instead of emoji:

  ```tsx
  // More reliable across browsers and screen readers
  badge: '★★★★★ Rated 5.0 by clients',
  // or
  badge: '⭐⭐⭐⭐⭐ Rated 5.0 by clients',  // Current - acceptable if validated
  ```

- [ ] Add aria-label for accessibility:

  ```tsx
  <Badge variant="default" className="..." aria-label="Rated 5 out of 5 stars by clients">
    {homepageHero.badge}
  </Badge>
  ```

- [ ] Consider SVG star icons for better control:
  ```tsx
  <Badge variant="default" className="...">
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} className="h-3 w-3 fill-yellow-400" />
      ))}
      <span className="ml-2">Rated 5.0 by clients</span>
    </div>
  </Badge>
  ```

**References:**

- [Unicode Security Considerations (RFC 8264)](https://www.rfc-editor.org/rfc/rfc8264.html)
- [Trojan Source Attacks](https://trojansource.codes/)

---

## General Security Recommendations

Beyond the specific vulnerabilities found in PR #80, the following improvements will strengthen overall security posture:

### Infrastructure & Configuration

- [ ] **Enable HTTPS Everywhere**
  - Configure HSTS with preload
  - Set up automatic HTTP to HTTPS redirects
  - Use Strict-Transport-Security with minimum 1-year max-age

- [ ] **Implement Rate Limiting**
  - Add rate limiting to contact form endpoint
  - Protect against brute force and DoS attacks
  - Consider Cloudflare or Vercel Edge Middleware

- [ ] **Configure CORS Properly**
  - Restrict API endpoints to same-origin only
  - Whitelist specific origins if cross-origin access needed
  - Never use `Access-Control-Allow-Origin: *` in production

- [ ] **Secure Cookie Configuration**
  ```ts
  // middleware.ts or API routes
  res.setHeader('Set-Cookie', ['sessionId=...; Secure; HttpOnly; SameSite=Strict; Max-Age=3600']);
  ```

### Authentication & Authorization

- [ ] **Audit Supabase Middleware** (from `middleware.ts`)
  - Verify JWT validation is working correctly
  - Ensure protected routes require valid session
  - Test authorization bypass scenarios
  - Add CSRF protection for state-changing operations

- [ ] **Implement Session Timeout**
  - Force re-authentication after inactivity period
  - Clear session data on logout
  - Invalidate old sessions server-side

- [ ] **Add Multi-Factor Authentication (MFA)**
  - Enable MFA for admin/dashboard access
  - Use Supabase built-in MFA features
  - Require MFA for sensitive operations

### Data Protection

- [ ] **Encrypt Sensitive Data at Rest**
  - Use Supabase encryption features for PII
  - Never store plaintext passwords or API keys
  - Implement field-level encryption for contact form data

- [ ] **Sanitize All Outputs**
  - Even though React escapes by default, be explicit
  - Use DOMPurify for any rich text content
  - Validate and sanitize URL parameters before use

- [ ] **Implement Logging & Monitoring**
  - Log authentication attempts (success and failure)
  - Monitor for unusual patterns (rapid requests, failed logins)
  - Set up Sentry alerts for security-related errors
  - Never log sensitive data (passwords, tokens, PII)

### Development Practices

- [ ] **Security Code Reviews**
  - Require security review for all PRs
  - Use this audit template for future reviews
  - Create checklist for common vulnerabilities

- [ ] **Add Pre-commit Hooks**

  ```bash
  # .husky/pre-commit
  npm audit --audit-level=high
  npm run type-check
  npm run lint
  ```

- [ ] **Regular Security Audits**
  - Run `npm audit` weekly
  - Review Dependabot PRs promptly
  - Schedule quarterly penetration testing

- [ ] **Secrets Management**
  - Never commit `.env` files
  - Use environment variables for all secrets
  - Rotate API keys regularly
  - Use secret scanning tools (GitGuardian, TruffleHog)

### Testing

- [ ] **Add Security Tests**

  ```ts
  // tests/security/xss.test.ts
  describe('XSS Protection', () => {
    it('should escape HTML in badge content', () => {
      const malicious = '<script>alert("XSS")</script>';
      render(<Badge>{malicious}</Badge>);
      expect(screen.queryByRole('script')).toBeNull();
    });
  });
  ```

- [ ] **Test Authentication Flows**
  - Verify protected routes redirect to login
  - Test session expiration handling
  - Validate CSRF token implementation

- [ ] **Fuzz Testing**
  - Test URL parameters with malicious inputs
  - Verify form validation handles edge cases
  - Check for SQLi in search/filter features (if any)

### Documentation

- [ ] **Create Security Policy**
  - Document vulnerability disclosure process
  - Add `SECURITY.md` to repository
  - Define responsible disclosure timeline

- [ ] **Security Training**
  - Train team on OWASP Top 10
  - Review common attack vectors
  - Practice secure coding standards

- [ ] **Incident Response Plan**
  - Define steps for security incidents
  - Identify key stakeholders
  - Create communication templates

---

## Security Posture Improvement Plan

Prioritized roadmap to address findings and improve overall security:

### Phase 1: Critical Fixes (Before PR Merge) - 1-2 days

1. **Update Next.js to 14.2.35 or later**
   - `npm install next@14.2.35`
   - Run full test suite
   - Deploy to staging for validation

2. **Implement URL Validation**
   - Create `internalRouteSchema` in `lib/validation/url.ts`
   - Validate all href values in `data/homepage.ts`
   - Add TypeScript branded types for compile-time safety

3. **Add Security Headers**
   - Configure CSP, X-Frame-Options, HSTS in `next.config.js`
   - Start with CSP in report-only mode
   - Monitor violations for 24 hours before enforcing

### Phase 2: High Priority Fixes (Week 1) - 3-5 days

4. **Content Validation**
   - Create Zod schemas for all text content
   - Validate badge, headline, subheadline at build time
   - Add runtime validation helpers for future CMS integration

5. **Dependency Audit**
   - Run `npm audit fix` for moderate vulnerabilities
   - Update glob via eslint-config-next (test thoroughly)
   - Set up Dependabot for automated updates

6. **Component Security**
   - Refactor Badge component to whitelist safe props
   - Audit all UI components for similar patterns
   - Add ESLint rules to prevent prop spreading

### Phase 3: Medium Priority Improvements (Week 2-3) - 5-7 days

7. **Runtime Type Safety**
   - Implement comprehensive Zod schemas for all data structures
   - Add build-time validation to CI/CD
   - Create helpers for future API/CMS integration

8. **Authentication Hardening**
   - Audit Supabase middleware implementation
   - Add session timeout and refresh logic
   - Implement CSRF protection for forms

9. **Monitoring & Logging**
   - Configure CSP violation reporting
   - Set up Sentry alerts for security events
   - Add logging for authentication attempts

### Phase 4: Long-term Security Posture (Month 1-2) - Ongoing

10. **Automated Security Scanning**
    - Add npm audit to CI/CD pipeline
    - Integrate Snyk or Socket.dev
    - Set up automated security testing

11. **Security Documentation**
    - Create `SECURITY.md` with disclosure policy
    - Document security requirements in `CLAUDE.md`
    - Train team on secure coding practices

12. **Regular Audits**
    - Schedule quarterly security reviews
    - Conduct penetration testing
    - Review and update security policies

---

## Testing Checklist

Before merging PR #80, verify:

- [ ] Next.js updated to 14.2.35+ and all tests pass
- [ ] All href values validated with `internalRouteSchema`
- [ ] Security headers configured and tested with [securityheaders.com](https://securityheaders.com)
- [ ] Content validation schemas implemented and passing
- [ ] No `dangerouslySetInnerHTML` usage without DOMPurify
- [ ] Badge component restricts props to safe whitelist
- [ ] `npm audit` shows no high or critical vulnerabilities
- [ ] CSP report-only mode active and violations monitored
- [ ] TypeScript strict mode enabled and passing
- [ ] All ESLint security rules enabled and passing
- [ ] Manual XSS testing on badge, headline, subheadline fields
- [ ] Open redirect testing on CTA links
- [ ] Test with malicious Unicode in badge content
- [ ] Verify middleware still protects `/dashboard` routes
- [ ] Lighthouse security audit score ≥90

---

## Conclusion

PR #80 introduces **significant security risks** that must be addressed before merging. While the refactoring improves code organization by centralizing data, it also creates attack vectors through unvalidated dynamic content rendering.

**Key Takeaways:**

1. **Do not merge without fixing critical issues** (Next.js update, URL validation, security headers)
2. **Implement defense in depth** - validate at build time, runtime, and in components
3. **Future-proof against CMS migration** - assume all data sources are untrusted
4. **Automate security checks** - integrate npm audit, Dependabot, and security testing into CI/CD

**Estimated Remediation Time:**

- **Critical fixes:** 1-2 days (before merge)
- **High priority:** 3-5 days (week 1)
- **Complete security posture:** 2-4 weeks (ongoing)

**Next Steps:**

1. Review this audit with team
2. Prioritize fixes based on roadmap above
3. Implement critical fixes before merging PR #80
4. Schedule follow-up audit after fixes deployed
5. Establish recurring security review process

---

**Report Generated:** 2026-02-13
**Auditor:** Claude Sonnet 4.5 (Security Analysis Module)
**Contact:** For questions about this audit, reference ticket PVS-322 and PR #80
