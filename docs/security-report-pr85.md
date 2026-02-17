# Security Audit Report - PR #85: Testimonial Carousel Component

**Date:** 2026-02-14
**Auditor:** Claude Sonnet 4.5 (Security Engineer Mode)
**Component:** `components/home/testimonial-carousel.tsx`
**PR Number:** #85
**Commit:** 556b66a - PVS-327: Build Testimonial Carousel Component

---

## Executive Summary

The Testimonial Carousel component has been reviewed for security vulnerabilities with a focus on XSS risks, React security best practices, type safety, and client-side data validation. The component is a display-only carousel that renders testimonial data from a centralized data file (`/data/homepage.ts`) with no user input, API calls, or form submissions.

**Overall Risk Assessment:** **LOW**

The component demonstrates good security practices with React's built-in XSS protection through JSX rendering. However, **critical gaps exist** in runtime validation for testimonial data, which creates potential XSS vulnerabilities if the data source is ever compromised or moved to an external CMS.

### Key Findings Summary

- **0 Critical** vulnerabilities
- **1 High** vulnerability (Missing runtime validation for testimonial content)
- **2 Medium** vulnerabilities (Type safety gaps, missing Content Security Policy validation)
- **3 Low** vulnerabilities (Accessibility improvements, dependency updates, code quality)

---

## High Vulnerabilities

### H-1: Missing Runtime Validation for Testimonial Data

**Location:** `components/home/testimonial-carousel.tsx:7`
**Severity:** HIGH
**CWE:** CWE-79 (Improper Neutralization of Input During Web Page Generation)

**Description:**

The component imports testimonials directly from a static data file without runtime validation:

```tsx
import { testimonials } from '@/data/homepage';
```

While the hero section has runtime validation (`validateHomepageHero`), **testimonial data has no equivalent validation schema**. This creates a security gap if:

1. The data source is migrated to a CMS or external API in the future
2. A developer accidentally introduces malicious content during refactoring
3. The build process is compromised and data files are modified

The testimonial content is rendered directly in JSX:

```tsx
<p className="text-lg leading-8 text-[var(--pv-text-muted)] md:text-xl md:leading-9">
  &ldquo;{testimonial.quote}&rdquo;
</p>
```

While React escapes this by default, **there is no explicit validation** to prevent:

- Script injection attempts
- Excessively long content (DoS via DOM size)
- Open redirect URLs if company/role fields are ever linked
- HTML injection if the component is refactored to use `dangerouslySetInnerHTML`

**Impact:**

- **Medium likelihood**: Static data source reduces immediate risk
- **High severity**: XSS vulnerabilities can steal user sessions, inject malicious scripts, or deface the site
- **Long-term risk**: Component may be refactored to accept dynamic data without validation

**Remediation Checklist:**

- [ ] Create `testimonialSchema` in `/lib/validation/homepage.ts` using Zod:

  ```typescript
  export const testimonialSchema = z.object({
    quote: createSafeTextSchema(1000, 'Testimonial quote'),
    name: createSafeTextSchema(100, 'Testimonial name'),
    role: createSafeTextSchema(100, 'Testimonial role').optional(),
    company: createSafeTextSchema(100, 'Company name'),
    location: createSafeTextSchema(100, 'Location').optional(),
  });

  export const testimonialsArraySchema = z.array(testimonialSchema).max(20);
  ```

- [ ] Add runtime validation function:

  ```typescript
  export function validateTestimonials(data: unknown) {
    return testimonialsArraySchema.parse(data);
  }
  ```

- [ ] Validate testimonials at import in `/data/homepage.ts`:

  ```typescript
  import { validateTestimonials } from '@/lib/validation/homepage';

  const rawTestimonials = [
    // ... testimonial data
  ];

  export const testimonials = validateTestimonials(rawTestimonials);
  ```

- [ ] Add defensive check in component:

  ```tsx
  // Don't render if there are no testimonials OR if validation fails
  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  ```

- [ ] Add unit tests for validation schema edge cases (see Testing section below)

**References:**

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [React Security Best Practices](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html)
- [CWE-79: Improper Neutralization](https://cwe.mitre.org/data/definitions/79.html)

---

## Medium Vulnerabilities

### M-1: Type Safety Gaps in Data Index Handling

**Location:** `components/home/testimonial-carousel.tsx:69-71`
**Severity:** MEDIUM
**CWE:** CWE-843 (Access of Resource Using Incompatible Type)

**Description:**

The component reads the `data-index` attribute from DOM elements and converts it to a number without validation:

```tsx
const index = Number(entry.target.getAttribute('data-index'));
if (!isNaN(index)) {
  setCurrentIndex(index);
}
```

While there is a `!isNaN()` check, there are no bounds checks to ensure the index is within the valid range `[0, testimonials.length - 1]`. This could lead to:

1. **Out-of-bounds array access** if the DOM is manipulated via developer tools
2. **State corruption** if `currentIndex` is set to an invalid value
3. **Navigation bugs** where dots don't sync with visible cards

**Impact:**

- **Low likelihood**: Requires manual DOM manipulation
- **Medium severity**: Can break carousel navigation and cause UI inconsistencies
- **No direct security impact**: React won't execute code, but could cause denial of service via broken UI

**Remediation Checklist:**

- [ ] Add bounds validation in Intersection Observer callback:

  ```tsx
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const rawIndex = entry.target.getAttribute('data-index');
        const index = Number(rawIndex);

        // Validate index is a number AND within bounds
        if (!isNaN(index) && index >= 0 && index < testimonials.length) {
          setCurrentIndex(index);
        } else {
          console.warn(`Invalid testimonial index: ${rawIndex}`);
        }
      }
    });
  }, options);
  ```

- [ ] Add type guard for `scrollToIndex` function:

  ```tsx
  const scrollToIndex = (index: number) => {
    // Bounds check before scrolling
    if (index < 0 || index >= testimonials.length) {
      console.warn(`Attempted to scroll to invalid index: ${index}`);
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('[data-testimonial-card]');
    const targetCard = cards[index] as HTMLElement;

    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setCurrentIndex(index);
    }
  };
  ```

- [ ] Clamp keyboard navigation to valid range (already implemented correctly):
  ```tsx
  // Lines 43-48 are correct - no changes needed
  const newIndex = currentIndex > 0 ? currentIndex - 1 : testimonials.length - 1;
  ```

**References:**

- [TypeScript Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [CWE-843: Access Using Incompatible Type](https://cwe.mitre.org/data/definitions/843.html)

---

### M-2: Insufficient Content Security Policy Validation

**Location:** Global configuration issue affecting `components/home/testimonial-carousel.tsx`
**Severity:** MEDIUM
**CWE:** CWE-1021 (Improper Restriction of Rendered UI Layers)

**Description:**

The Next.js configuration in `next.config.js` includes a Content Security Policy with `'unsafe-inline'` and `'unsafe-eval'` in the script-src directive:

```javascript
"script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com https://js.sentry-cdn.com; ";
```

While this is required for third-party analytics (GTM, Sentry), it **weakens XSS protections** by allowing:

- Inline event handlers (`onclick="..."`)
- Inline `<script>` tags without nonces
- `eval()` and `new Function()` execution

The Testimonial Carousel component itself doesn't use inline scripts, but the global CSP policy allows them, which could enable XSS if other components are compromised.

**Impact:**

- **Medium likelihood**: Third-party scripts often require these directives
- **Medium severity**: Reduces defense-in-depth against XSS attacks
- **Mitigation exists**: React's JSX escaping provides primary defense

**Remediation Checklist:**

- [ ] Audit third-party scripts to determine if `'unsafe-inline'` and `'unsafe-eval'` are truly required:

  ```bash
  # Check if GTM/Sentry require unsafe-eval
  # Consider using nonces instead of unsafe-inline
  ```

- [ ] Implement CSP nonce-based approach for inline scripts:

  ```javascript
  // In middleware.ts or layout.tsx
  const nonce = crypto.randomBytes(16).toString('base64');

  // Update CSP header
  "script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net; "

  // Add nonce to allowed scripts
  <script nonce={nonce}>...</script>
  ```

- [ ] Consider using Strict CSP with hashes for known inline scripts:

  ```javascript
  // Generate SHA-256 hash of inline script
  const hash = crypto.createHash('sha256').update(scriptContent).digest('base64');
  ("script-src 'self' 'sha256-${hash}';");
  ```

- [ ] Add CSP violation reporting to monitor blocked attempts:

  ```javascript
  headers: [
    {
      key: 'Content-Security-Policy-Report-Only',
      value: "default-src 'self'; report-uri /api/csp-report;",
    },
  ];
  ```

- [ ] Document why `'unsafe-eval'` is required (likely for Sentry or GTM) in a security policy file

**References:**

- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Google CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [CWE-1021: Improper Restriction of UI Layers](https://cwe.mitre.org/data/definitions/1021.html)

---

## Low Vulnerabilities

### L-1: Keyboard Event Listener Memory Leak Risk

**Location:** `components/home/testimonial-carousel.tsx:38-54`
**Severity:** LOW
**CWE:** CWE-401 (Missing Release of Memory after Effective Lifetime)

**Description:**

The keyboard event listener is attached to the global `window` object but relies on the component's internal state (`currentIndex`). While the cleanup function removes the listener, the dependency array could cause stale closures:

```tsx
useEffect(() => {
  if (!showNavigation) return;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const newIndex = currentIndex > 0 ? currentIndex - 1 : testimonials.length - 1;
      scrollToIndex(newIndex);
    }
    // ...
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [currentIndex, showNavigation]); // Re-runs on EVERY currentIndex change
```

**Issues:**

1. Effect re-runs on every `currentIndex` change, removing and re-adding the listener
2. Multiple component instances could add duplicate listeners
3. Potential race condition between state updates and event handler execution

**Impact:**

- **Low likelihood**: Single instance per page, cleanup function works correctly
- **Low severity**: Unlikely to cause user-facing issues, but inefficient
- **Performance concern**: Excessive listener churn on scroll/navigation

**Remediation Checklist:**

- [ ] Use functional state updates to avoid dependency on `currentIndex`:

  ```tsx
  useEffect(() => {
    if (!showNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNavigation]); // Only re-run if navigation is enabled/disabled
  ```

- [ ] Update `scrollToIndex` to use functional state update:

  ```tsx
  const scrollToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= testimonials.length) return;

      const container = scrollContainerRef.current;
      if (!container) return;

      const cards = container.querySelectorAll('[data-testimonial-card]');
      const targetCard = cards[index] as HTMLElement;

      if (targetCard) {
        targetCard.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
        setCurrentIndex(index);
      }
    },
    [testimonials.length],
  ); // Memoize with stable dependency
  ```

- [ ] Consider using `useRef` to store latest `currentIndex` for event handlers:

  ```tsx
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  ```

**References:**

- [React useEffect Hook Best Practices](https://react.dev/reference/react/useEffect#removing-unnecessary-dependencies)
- [CWE-401: Missing Release of Memory](https://cwe.mitre.org/data/definitions/401.html)

---

### L-2: Accessibility - Missing ARIA Live Region for Dynamic Updates

**Location:** `components/home/testimonial-carousel.tsx:90-177`
**Severity:** LOW
**WCAG:** 4.1.3 Status Messages (Level AA)

**Description:**

The carousel updates visible content dynamically as users navigate, but there is no ARIA live region to announce changes to screen reader users. When a testimonial changes:

1. Visual users see the new quote smoothly scroll into view
2. **Screen reader users have no notification** that content has changed
3. Navigation dots update without announcing the current position

This violates WCAG 2.1 Level AA guidelines for status messages.

**Current Accessibility Features (Good):**

- Proper `role="tablist"` on navigation dots
- `aria-selected` and `aria-current` attributes on active dot
- `aria-label` on each navigation button
- Semantic `<blockquote>` element for quotes

**Missing Features:**

- Live region to announce testimonial changes
- Current position announcement ("Testimonial 2 of 3")
- Focus management for keyboard navigation

**Impact:**

- **Medium likelihood**: All screen reader users affected
- **Low severity**: Content is still accessible, just less usable
- **WCAG compliance**: Fails Level AA (4.1.3 Status Messages)

**Remediation Checklist:**

- [ ] Add ARIA live region to announce testimonial changes:

  ```tsx
  export function TestimonialCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [announcement, setAnnouncement] = useState('');

    // Update announcement when index changes
    useEffect(() => {
      if (testimonials.length > 0) {
        setAnnouncement(
          `Viewing testimonial ${currentIndex + 1} of ${testimonials.length} from ${testimonials[currentIndex].name}`,
        );
      }
    }, [currentIndex]);

    return (
      <section aria-label="Client testimonials">
        {/* Screen reader announcements */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>

        {/* Rest of component */}
      </section>
    );
  }
  ```

- [ ] Add position indicator to navigation dots:

  ```tsx
  <div className="mt-8 flex items-center justify-center gap-3" role="tablist">
    <span className="sr-only">
      Testimonial {currentIndex + 1} of {testimonials.length}
    </span>
    {testimonials.map((_, index) => (
      <button
        key={index}
        role="tab"
        aria-label={`Go to testimonial ${index + 1} of ${testimonials.length}`}
        // ... rest of button props
      />
    ))}
  </div>
  ```

- [ ] Consider adding focus management for keyboard navigation:

  ```tsx
  const scrollToIndex = (index: number) => {
    // ... existing scroll logic

    // Optionally move focus to the active testimonial
    const targetCard = cards[index] as HTMLElement;
    if (targetCard) {
      targetCard.setAttribute('tabindex', '-1');
      targetCard.focus({ preventScroll: true }); // Already scrolled
    }
  };
  ```

- [ ] Add reduced motion support for users with vestibular disorders:

  ```tsx
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  targetCard.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'nearest',
    inline: 'center',
  });
  ```

**References:**

- [WCAG 2.1 Success Criterion 4.1.3](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)
- [ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [Inclusive Components: Carousels](https://inclusive-components.design/a-content-slider/)

---

### L-3: Outdated Dependencies with Known Vulnerabilities

**Location:** `package.json` (affects entire application including testimonial carousel)
**Severity:** LOW (for this component, MEDIUM for application overall)
**CVE:** Multiple (see details)

**Description:**

The `npm audit` scan identified **3 high-severity vulnerabilities** in development dependencies:

1. **glob** (v10.2.0 - 10.4.5): Command injection via `-c/--cmd` flag
   - **CVE:** GHSA-5j98-mcp5-4vw2
   - **CVSS:** 7.5 (High)
   - **CWE:** CWE-78 (OS Command Injection)
   - **Affected:** `@next/eslint-plugin-next` (dev dependency)
   - **Impact:** Low - only affects build tools, not runtime

2. **next** (v10.0.0 - v15.5.10): DoS via Image Optimizer
   - **CVE:** GHSA-9g9p-9gw9-jx7f
   - **CVSS:** 5.9 (Moderate)
   - **CWE:** CWE-400 (Uncontrolled Resource Consumption)
   - **Impact:** Medium - affects self-hosted deployments using `remotePatterns`

3. **eslint-config-next**: Transitive dependency on vulnerable `glob`
   - Inherits `glob` vulnerability
   - Fix available: Upgrade to v16.1.6

**Current Versions:**

```json
{
  "next": "14.x.x", // Should be >=15.5.10
  "eslint-config-next": "14.x.x" // Should be >=16.1.6
}
```

**Impact on Testimonial Carousel:**

- **Direct impact:** None (component doesn't use affected packages directly)
- **Indirect impact:** Build process could be compromised if `glob` vulnerability is exploited
- **Runtime impact:** Next.js DoS vulnerability could affect page serving

**Remediation Checklist:**

- [ ] Update Next.js to latest stable version (>=15.5.10):

  ```bash
  npm install next@latest
  ```

- [ ] Update ESLint config to match Next.js version:

  ```bash
  npm install --save-dev eslint-config-next@latest
  ```

- [ ] Verify fixes with audit:

  ```bash
  npm audit fix --force
  npm audit
  ```

- [ ] Test build and runtime after updates:

  ```bash
  npm run build
  npm run dev
  # Test all pages including testimonial carousel
  ```

- [ ] Review Next.js v15 breaking changes:
  - Check for deprecated APIs in codebase
  - Update TypeScript types if needed
  - Verify Framer Motion compatibility with React 19 (if Next.js 15 uses React 19)

- [ ] Set up automated dependency monitoring:
  ```yaml
  # .github/dependabot.yml
  version: 2
  updates:
    - package-ecosystem: 'npm'
      directory: '/'
      schedule:
        interval: 'weekly'
      open-pull-requests-limit: 10
  ```

**References:**

- [GHSA-5j98-mcp5-4vw2: glob Command Injection](https://github.com/advisories/GHSA-5j98-mcp5-4vw2)
- [GHSA-9g9p-9gw9-jx7f: Next.js Image Optimizer DoS](https://github.com/advisories/GHSA-9g9p-9gw9-jx7f)
- [Next.js v15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)

---

## General Security Recommendations

### 1. Implement Comprehensive Input Validation

**Priority:** HIGH

The project has validation for the hero section but not for other data structures. This creates inconsistent security posture.

- [ ] Create validation schemas for ALL homepage data structures:
  - `whySection`
  - `caseStudy`
  - `processSteps`
  - `services`
  - `finalCta`

- [ ] Use the same pattern as `validateHomepageHero`:

  ```typescript
  // In lib/validation/homepage.ts
  export const whySectionSchema = z.object({
    eyebrow: createSafeTextSchema(100, 'Eyebrow'),
    heading: createSafeTextSchema(200, 'Heading'),
    description: createSafeTextSchema(500, 'Description'),
    problemPoints: z
      .array(
        z.object({
          title: createSafeTextSchema(200, 'Problem title'),
          description: createSafeTextSchema(1000, 'Problem description'),
        }),
      )
      .max(10),
  });

  export function validateWhySection(data: unknown) {
    return whySectionSchema.parse(data);
  }
  ```

- [ ] Enforce validation in `data/homepage.ts`:

  ```typescript
  import {
    validateWhySection,
    validateCaseStudy,
    validateProcessSteps,
    validateServices,
    validateTestimonials,
    validateFinalCta,
  } from '@/lib/validation/homepage';

  const rawWhySection = {
    /* ... */
  };
  export const whySection = validateWhySection(rawWhySection);

  const rawTestimonials = [
    /* ... */
  ];
  export const testimonials = validateTestimonials(rawTestimonials);

  // ... validate all data structures
  ```

---

### 2. Add Unit Tests for Security Edge Cases

**Priority:** MEDIUM

The component lacks tests for security-critical behaviors like input validation and bounds checking.

- [ ] Create test file: `components/home/__tests__/testimonial-carousel.test.tsx`

- [ ] Test validation edge cases:

  ```typescript
  import { validateTestimonials } from '@/lib/validation/homepage';

  describe('Testimonial Validation', () => {
    it('should reject XSS attempts in quotes', () => {
      const malicious = [
        {
          quote: '<script>alert("XSS")</script>',
          name: 'Attacker',
          company: 'Evil Corp',
        },
      ];

      expect(() => validateTestimonials(malicious)).toThrow();
    });

    it('should reject excessively long quotes (DoS)', () => {
      const longQuote = 'a'.repeat(10000);
      const malicious = [
        {
          quote: longQuote,
          name: 'User',
          company: 'Company',
        },
      ];

      expect(() => validateTestimonials(malicious)).toThrow();
    });

    it('should reject javascript: protocol in potential links', () => {
      const malicious = [
        {
          quote: 'Great service',
          name: 'User',
          company: 'javascript:alert(1)',
        },
      ];

      expect(() => validateTestimonials(malicious)).toThrow();
    });

    it('should accept valid testimonials', () => {
      const valid = [
        {
          quote: 'Great work!',
          name: 'John Doe',
          company: 'Acme Corp',
          role: 'CEO',
          location: 'New York, NY',
        },
      ];

      expect(validateTestimonials(valid)).toEqual(valid);
    });
  });
  ```

- [ ] Test component behavior:

  ```typescript
  import { render, screen, fireEvent } from '@testing-library/react';
  import { TestimonialCarousel } from '../testimonial-carousel';

  describe('TestimonialCarousel Security', () => {
    it('should not render script tags in quotes', () => {
      render(<TestimonialCarousel />);

      const scriptTag = screen.queryByText(/<script>/i);
      expect(scriptTag).not.toBeInTheDocument();
    });

    it('should handle out-of-bounds navigation gracefully', () => {
      render(<TestimonialCarousel />);

      // Simulate DOM manipulation
      const dots = screen.getAllByRole('tab');
      fireEvent.click(dots[dots.length - 1]);

      // Should not crash
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  });
  ```

- [ ] Add accessibility tests:

  ```bash
  npm install --save-dev @axe-core/react jest-axe
  ```

  ```typescript
  import { axe, toHaveNoViolations } from 'jest-axe';
  expect.extend(toHaveNoViolations);

  it('should have no accessibility violations', async () => {
    const { container } = render(<TestimonialCarousel />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  ```

---

### 3. Enhance Content Security Policy

**Priority:** MEDIUM

The current CSP allows `'unsafe-inline'` and `'unsafe-eval'`, which weakens XSS protections.

- [ ] Audit which third-party scripts require these directives:

  ```bash
  # Check if GTM can work without unsafe-eval
  # Consider using Google Tag Manager Server-Side
  ```

- [ ] Implement nonce-based CSP for inline scripts:

  ```typescript
  // In middleware.ts
  import { NextResponse } from 'next/server';
  import crypto from 'crypto';

  export function middleware(request: Request) {
    const nonce = crypto.randomBytes(16).toString('base64');
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com;
      style-src 'self' 'nonce-${nonce}' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      font-src 'self' data:;
      connect-src 'self' https://www.google-analytics.com https://*.sentry.io https://*.supabase.co;
      frame-src 'self';
    `
      .replace(/\s{2,}/g, ' ')
      .trim();

    const response = NextResponse.next();
    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('x-nonce', nonce);

    return response;
  }
  ```

- [ ] Use nonce in components with inline styles:

  ```tsx
  // Access nonce from headers (if needed)
  import { headers } from 'next/headers';

  export function TestimonialCarousel() {
    const nonce = headers().get('x-nonce') || '';

    return (
      <>
        {/* Component JSX */}
        <style nonce={nonce}>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </>
    );
  }
  ```

- [ ] Monitor CSP violations:

  ```typescript
  // Create API route: app/api/csp-report/route.ts
  export async function POST(request: Request) {
    const report = await request.json();

    console.error('CSP Violation:', report);

    // Send to monitoring service
    // Sentry.captureException(new Error('CSP Violation'), {
    //   extra: report,
    // });

    return new Response('OK', { status: 200 });
  }
  ```

---

### 4. Implement Security Testing in CI/CD Pipeline

**Priority:** MEDIUM

Automated security testing catches vulnerabilities before they reach production.

- [ ] Add npm audit to GitHub Actions:

  ```yaml
  # .github/workflows/security.yml
  name: Security Audit

  on:
    push:
      branches: [main, dev/*]
    pull_request:
      branches: [main]

  jobs:
    audit:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
          with:
            node-version: '18'
        - run: npm ci
        - run: npm audit --audit-level=moderate
        - name: Check for vulnerabilities
          run: |
            npm audit --json > audit-report.json
            if [ $(jq '.metadata.vulnerabilities.high + .metadata.vulnerabilities.critical' audit-report.json) -gt 0 ]; then
              echo "High or critical vulnerabilities found"
              exit 1
            fi
  ```

- [ ] Add ESLint security plugin:

  ```bash
  npm install --save-dev eslint-plugin-security
  ```

  ```json
  // .eslintrc.json
  {
    "plugins": ["security"],
    "extends": ["plugin:security/recommended"]
  }
  ```

- [ ] Add React security linting:

  ```bash
  npm install --save-dev eslint-plugin-react-security
  ```

  ```json
  {
    "plugins": ["react-security"],
    "rules": {
      "react-security/no-danger": "error",
      "react-security/no-dangerously-set-innerhtml": "error"
    }
  }
  ```

---

### 5. Add Security Headers Testing

**Priority:** LOW

Verify that security headers are correctly applied in all environments.

- [ ] Create security header test:

  ```typescript
  // tests/security-headers.test.ts
  describe('Security Headers', () => {
    it('should include all required security headers', async () => {
      const response = await fetch('http://localhost:3000');

      expect(response.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('Strict-Transport-Security')).toContain('max-age=');
      expect(response.headers.get('Content-Security-Policy')).toBeTruthy();
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    });
  });
  ```

- [ ] Test CSP doesn't allow dangerous directives:

  ```typescript
  it('should not allow unsafe-inline in production CSP', async () => {
    const csp = response.headers.get('Content-Security-Policy');

    if (process.env.NODE_ENV === 'production') {
      expect(csp).not.toContain("'unsafe-inline'");
      expect(csp).not.toContain("'unsafe-eval'");
    }
  });
  ```

---

## Security Posture Improvement Plan

### Phase 1: Critical Fixes (Week 1)

1. **HIGH PRIORITY:** Implement testimonial validation schema
   - Create `testimonialSchema` in `/lib/validation/homepage.ts`
   - Validate testimonials at build time in `/data/homepage.ts`
   - Add defensive checks in component

2. **HIGH PRIORITY:** Update Next.js and dependencies
   - Upgrade to Next.js >=15.5.10
   - Upgrade eslint-config-next to >=16.1.6
   - Run full test suite to verify no regressions

### Phase 2: Medium Priority Fixes (Week 2)

3. **MEDIUM PRIORITY:** Add bounds checking to index handling
   - Validate `data-index` attributes are in range
   - Use functional state updates to avoid stale closures
   - Add error logging for invalid indices

4. **MEDIUM PRIORITY:** Enhance Content Security Policy
   - Audit third-party script requirements
   - Implement nonce-based CSP for inline scripts
   - Add CSP violation reporting endpoint

5. **MEDIUM PRIORITY:** Fix keyboard event listener performance
   - Use functional state updates
   - Memoize `scrollToIndex` callback
   - Remove dependency on `currentIndex`

### Phase 3: Accessibility & Testing (Week 3)

6. **LOW PRIORITY:** Add ARIA live regions
   - Announce testimonial changes to screen readers
   - Add position indicators to navigation
   - Implement reduced motion support

7. **LOW PRIORITY:** Create comprehensive test suite
   - Unit tests for validation edge cases
   - Component tests for security behaviors
   - Accessibility tests with jest-axe

### Phase 4: Infrastructure & Monitoring (Week 4)

8. **LOW PRIORITY:** Set up security testing in CI/CD
   - Add npm audit to GitHub Actions
   - Configure ESLint security plugins
   - Create security header tests

9. **ONGOING:** Monitor and maintain
   - Set up Dependabot for automated updates
   - Review security headers quarterly
   - Audit third-party scripts semi-annually

---

## Conclusion

The Testimonial Carousel component demonstrates solid React security practices with JSX escaping and proper TypeScript usage. However, the **lack of runtime validation for testimonial data** creates a critical security gap that must be addressed before migrating to a CMS or external data source.

### Summary of Actionable Items

**Immediate Actions (This Sprint):**

- [ ] Create and implement testimonial validation schema (H-1)
- [ ] Update Next.js to >=15.5.10 to fix CVE vulnerabilities (L-3)
- [ ] Add bounds checking to index handling (M-1)

**Short-term Actions (Next Sprint):**

- [ ] Enhance Content Security Policy with nonces (M-2)
- [ ] Optimize keyboard event listener performance (L-1)
- [ ] Add ARIA live regions for screen reader support (L-2)

**Long-term Actions (Backlog):**

- [ ] Create comprehensive test suite for security edge cases
- [ ] Set up automated security testing in CI/CD pipeline
- [ ] Implement security header validation tests

### Risk Assessment After Remediation

**Current Risk:** LOW (static data source provides defense-in-depth)
**Post-Remediation Risk:** VERY LOW (with validation, all attack vectors mitigated)

The component is safe for production deployment in its current form, but should implement validation before any data source changes.

---

**Audit Completed:** 2026-02-14
**Next Review Date:** 2026-05-14 (or when data source changes)
**Approved By:** Phil (Pending)
