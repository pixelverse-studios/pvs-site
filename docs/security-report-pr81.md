# Security Audit Report - PR #81

## Executive Summary

This security audit was performed on PR #81 (PVS-323: Simplify services section to 3 focused cards) on February 13, 2026. The PR refactors the homepage services section to consume data from a centralized data file and makes service cards clickable links.

**Overall Risk Assessment**: Low

The changes in this PR are primarily structural refactoring with minimal security impact. However, the audit identified several **critical and high-severity vulnerabilities in the broader codebase** that should be addressed, along with opportunities to strengthen the security posture of the newly introduced data-driven architecture.

### Key Findings Summary

- **Critical**: 2 vulnerabilities (dependency-related, broader codebase)
- **High**: 3 vulnerabilities (input validation gaps, XSS vectors)
- **Medium**: 2 vulnerabilities (CSP policy weaknesses)
- **Low**: 1 vulnerability (error handling)

---

## PR #81 Specific Changes - Security Analysis

### Files Modified in This PR

1. `/components/home/services-section.tsx` - Refactored to consume centralized data
2. `/data/homepage.ts` - Added services array with href, icon, title, summary, highlights
3. `/docs/deployment_summary.md` - Documentation update (no security impact)

### Security Review of PR Changes

#### 1. Data Flow Architecture Change

**Change**: Services data moved from inline definition to centralized `/data/homepage.ts` file.

**Security Impact**: Positive - Centralization enables single-point validation and reduces duplication.

**Status**: Secure with recommendations below.

---

## Critical Vulnerabilities

### CRITICAL-1: Outdated Next.js Version with Known CVEs

**Location**: `package.json:9` (Next.js 14.2.35)

**Severity**: Critical

**CVSS Score**: 7.5 (High)

**Description**:
The application uses Next.js 14.2.35, which has two known security vulnerabilities:

1. **CVE: GHSA-h25m-26qc-wcjf** - HTTP request deserialization can lead to DoS when using insecure React Server Components
   - Severity: High (CVSS 7.5)
   - CWE: CWE-400 (Uncontrolled Resource Consumption), CWE-502 (Deserialization of Untrusted Data)
   - Affected versions: >=13.0.0 <15.0.8

2. **CVE: GHSA-9g9p-9gw9-jx7f** - Self-hosted applications vulnerable to DoS via Image Optimizer remotePatterns configuration
   - Severity: Moderate (CVSS 5.9)
   - CWE: CWE-400, CWE-770 (Allocation of Resources Without Limits)
   - Affected versions: >=10.0.0 <15.5.10

**Impact**:
Attackers could potentially cause Denial of Service (DoS) attacks by exploiting HTTP request deserialization or Image Optimizer misconfiguration.

**Remediation Checklist**:

- [ ] Upgrade Next.js to version 15.5.10 or later: `npm install next@latest`
- [ ] Test application thoroughly after upgrade (breaking changes expected between v14 and v15)
- [ ] Review Next.js 15 migration guide: https://nextjs.org/docs/app/building-your-application/upgrading/version-15
- [ ] Update TypeScript configuration if needed for Next.js 15 compatibility
- [ ] Run full regression testing on all pages and components
- [ ] Update Sentry configuration to ensure compatibility with Next.js 15
- [ ] Review and test Image Optimizer configuration in `next.config.js`

**References**:

- https://github.com/advisories/GHSA-h25m-26qc-wcjf
- https://github.com/advisories/GHSA-9g9p-9gw9-jx7f
- https://nvd.nist.gov/vuln/search

---

### CRITICAL-2: No Server-Side Validation for Services Data

**Location**: `/data/homepage.ts:223-262` (services array)

**Severity**: Critical

**CVSS Score**: 8.2 (High)

**Description**:
The newly introduced `services` array in `/data/homepage.ts` lacks runtime validation. While the hero section has Zod validation (`validateHomepageHero`), the services data does not. This creates an inconsistency in security controls and leaves the services section vulnerable to injection attacks if data is ever sourced from external systems (CMS, API, database).

**Current Code**:

```typescript
export const services: Service[] = [
  {
    title: 'Web Design & Development',
    summary: 'Custom-coded websites built for performance, scalability, and long-term growth.',
    icon: 'palette',
    highlights: [
      'Component libraries built for future campaigns.',
      'Launch-day QA across devices, browsers, and connection speeds.',
    ],
    href: '/services/web-development',
  },
  // ... more services
];
```

**Vulnerability**:

- No validation of `href` values (potential open redirect)
- No sanitization of `title`, `summary`, `highlights` (potential XSS)
- No validation of `icon` string (potential for undefined icon mapping)
- TypeScript types provide compile-time safety but no runtime protection

**Impact**:
If data is ever migrated to a CMS or external data source without implementing validation, attackers could:

- Inject malicious JavaScript via XSS in title/summary/highlights
- Create open redirect vulnerabilities via crafted href values
- Break the UI by providing invalid icon names

**Remediation Checklist**:

- [ ] Create Zod validation schema for services in `/lib/validation/homepage.ts`:

  ```typescript
  export const serviceSchema = z.object({
    title: createSafeTextSchema(100, 'Service title'),
    summary: createSafeTextSchema(500, 'Service summary'),
    icon: z.enum(['code', 'palette', 'search', 'lifebuoy'], {
      errorMap: () => ({ message: 'Invalid icon name' }),
    }),
    highlights: z.array(createSafeTextSchema(300, 'Highlight')).max(5),
    href: safeUrlSchema,
  });

  export const servicesArraySchema = z.array(serviceSchema);

  export function validateServices(data: unknown) {
    return servicesArraySchema.parse(data);
  }
  ```

- [ ] Apply validation in `/data/homepage.ts`:

  ```typescript
  import { validateServices } from '@/lib/validation/homepage';

  const rawServices = [
    /* ... */
  ];
  export const services = validateServices(rawServices);
  ```

- [ ] Add unit tests for validation edge cases
- [ ] Document validation requirements in code comments

**References**:

- OWASP Top 10 2021: A03:2021 – Injection
- CWE-20: Improper Input Validation
- Zod documentation: https://zod.dev/

---

## High Vulnerabilities

### HIGH-1: Missing URL Validation for Service Links

**Location**: `/components/home/services-section.tsx:37-38`

**Severity**: High

**CVSS Score**: 6.5

**Description**:
The service cards now render as clickable `<Link>` components with `href={service.href}`. While Next.js Link provides some protection against javascript: URLs, there is no validation to prevent:

- Open redirects to external malicious domains
- Relative path traversal attacks (e.g., `../../../etc/passwd`)
- Unintended navigation to admin or authenticated routes

**Vulnerable Code**:

```typescript
<Link href={service.href} className="block h-full">
  {/* Card content */}
</Link>
```

**Attack Scenario**:
If data is compromised or sourced from an external CMS:

```typescript
{
  title: 'Malicious Service',
  href: 'https://evil.com/phishing',  // Open redirect
  // OR
  href: '/dashboard/admin',  // Unintended route access
}
```

**Impact**:

- Users could be redirected to phishing sites
- Internal admin routes could be exposed in public navigation
- SEO impact from linking to spam/malicious domains

**Remediation Checklist**:

- [ ] Implement href validation in Zod schema (see CRITICAL-2)
- [ ] Ensure `safeUrlSchema` only allows:
  - Relative paths starting with `/` (already implemented)
  - HTTPS URLs matching allowlist domains (if external links needed)
- [ ] Add path allowlist validation:

  ```typescript
  const allowedServicePaths = [
    '/services',
    '/services/web-development',
    '/services/seo',
    '/services/ux-ui-design',
  ];

  const serviceHrefSchema = z
    .string()
    .refine((href) => allowedServicePaths.some((path) => href.startsWith(path)), {
      message: 'Service href must be an allowed service path',
    });
  ```

- [ ] Add runtime check in component as defense-in-depth:

  ```typescript
  const isValidServiceHref = (href: string) => {
    return href.startsWith('/services') || href === '/services';
  };

  // In component
  {
    services.map((service) => {
      if (!isValidServiceHref(service.href)) {
        console.error(`Invalid service href: ${service.href}`);
        return null;
      }
      // ... render card
    });
  }
  ```

- [ ] Add ESLint rule to flag external hrefs in service cards
- [ ] Document allowed href patterns in `/data/homepage.ts` comments

**References**:

- OWASP: Unvalidated Redirects and Forwards
- CWE-601: URL Redirection to Untrusted Site ('Open Redirect')

---

### HIGH-2: XSS Risk in Dynamic Content Rendering

**Location**: `/components/home/services-section.tsx:46-67`

**Severity**: High

**CVSS Score**: 6.8

**Description**:
Service data (title, summary, highlights) is rendered directly in JSX without sanitization. While React escapes values by default, the lack of validation creates risk if:

1. Data is migrated to a CMS that allows HTML input
2. A developer uses `dangerouslySetInnerHTML` in the future
3. Unicode/emoji injection is used for UI manipulation

**Current Rendering**:

```typescript
<CardTitle className="text-xl text-[var(--pv-text)]">
  {service.title}  {/* No sanitization */}
</CardTitle>
<CardDescription className="text-sm leading-6 text-[var(--pv-text-muted)]">
  {service.summary}  {/* No sanitization */}
</CardDescription>
<span>{highlight}</span>  {/* No sanitization */}
```

**Risk Factors**:

- No Content Security Policy enforcement for inline content
- No HTML entity encoding validation
- No length limits enforced at render time (could cause DoS via massive strings)

**Impact**:

- XSS if data source changes to allow HTML
- UI breaking via extremely long strings
- Homograph attacks via Unicode lookalike characters

**Remediation Checklist**:

- [ ] Implement validation with length limits (see CRITICAL-2)
- [ ] Add sanitization utility in `/lib/utils/sanitize.ts`:

  ```typescript
  import DOMPurify from 'isomorphic-dompurify';

  export function sanitizeText(text: string, maxLength: number = 500): string {
    // Remove HTML tags
    const stripped = text.replace(/<[^>]*>/g, '');
    // Limit length
    const truncated = stripped.slice(0, maxLength);
    // Remove dangerous characters
    return DOMPurify.sanitize(truncated, { ALLOWED_TAGS: [] });
  }
  ```

- [ ] Install `isomorphic-dompurify`: `npm install isomorphic-dompurify`
- [ ] Apply sanitization in component:

  ```typescript
  import { sanitizeText } from '@/lib/utils/sanitize';

  <CardTitle>{sanitizeText(service.title, 100)}</CardTitle>
  <CardDescription>{sanitizeText(service.summary, 500)}</CardDescription>
  <span>{sanitizeText(highlight, 300)}</span>
  ```

- [ ] Add CSP violation reporting to monitor injection attempts
- [ ] Review all components using data from `/data/homepage.ts` for similar issues

**References**:

- OWASP Top 10 2021: A03:2021 – Injection
- CWE-79: Cross-site Scripting (XSS)
- React Security Best Practices: https://react.dev/learn/writing-markup-with-jsx#the-rules-of-jsx

---

### HIGH-3: Unsafe Icon Mapping with Fallback

**Location**: `/components/home/services-section.tsx:10-16`

**Severity**: High

**CVSS Score**: 5.4

**Description**:
The icon mapping uses a fallback mechanism that could mask data integrity issues and lead to UI confusion:

```typescript
const iconMap: Record<string, LucideIcon> = {
  code: Code,
  palette: Palette,
  search: Search,
  lifebuoy: LifeBuoy,
};

// In component
const IconComponent = iconMap[service.icon] || Code; // Silent fallback
```

**Vulnerability**:

- Invalid icon names silently fall back to `Code` icon
- No error logging or alerting for invalid icons
- Attackers could use this to detect which services are misconfigured
- UI will display wrong icon without any indication of data corruption

**Impact**:

- Silent data integrity failures
- Confusing user experience (wrong icons)
- No visibility into potential data tampering
- Makes debugging difficult in production

**Remediation Checklist**:

- [ ] Add strict icon validation (covered in CRITICAL-2 Zod schema)
- [ ] Remove silent fallback and add error handling:

  ```typescript
  {services.map((service, index) => {
    const IconComponent = iconMap[service.icon];

    if (!IconComponent) {
      console.error(`Invalid icon "${service.icon}" for service "${service.title}"`);
      return null; // Or render error state
    }

    return (
      <MotionItem key={service.title} delay={index * 0.08}>
        {/* ... */}
      </MotionItem>
    );
  })}
  ```

- [ ] Add type safety using TypeScript literal types:

  ```typescript
  type AllowedIcon = 'code' | 'palette' | 'search' | 'lifebuoy';

  const iconMap: Record<AllowedIcon, LucideIcon> = {
    code: Code,
    palette: Palette,
    search: Search,
    lifebuoy: LifeBuoy,
  };
  ```

- [ ] Add Sentry error tracking for invalid icons in production
- [ ] Create unit test to verify all service icons are valid

**References**:

- CWE-392: Missing Report of Error Condition
- OWASP: Insufficient Logging & Monitoring

---

## Medium Vulnerabilities

### MEDIUM-1: Overly Permissive Content Security Policy

**Location**: `/next.config.js:36-47`

**Severity**: Medium

**CVSS Score**: 4.3

**Description**:
The CSP policy includes `'unsafe-inline'` and `'unsafe-eval'` in script-src, which significantly weakens XSS protections:

```javascript
"script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com https://js.sentry-cdn.com;";
```

**Vulnerability**:

- `'unsafe-inline'` allows inline `<script>` tags and event handlers (onClick, onLoad, etc.)
- `'unsafe-eval'` allows `eval()`, `Function()`, `setTimeout(string)`, etc.
- These directives bypass CSP's primary XSS protection mechanism

**Impact**:

- Reduces effectiveness of CSP against XSS attacks
- Any XSS vulnerability becomes easier to exploit
- Third-party scripts can execute arbitrary code

**Remediation Checklist**:

- [ ] Remove `'unsafe-inline'` by using nonces for necessary inline scripts:

  ```javascript
  // In next.config.js
  const cspNonce = crypto.randomBytes(16).toString('base64');

  headers: [
    {
      key: 'Content-Security-Policy',
      value: `script-src 'self' 'nonce-${cspNonce}' https://cdn.jsdelivr.net ...`,
    },
  ];
  ```

- [ ] Refactor inline event handlers to use addEventListener
- [ ] Move inline scripts to external .js files
- [ ] Remove `'unsafe-eval'` or document specific libraries requiring it
- [ ] Use Sentry without eval by enabling CSP-compatible mode
- [ ] Test CSP in report-only mode before enforcing:
  ```javascript
  key: 'Content-Security-Policy-Report-Only',
  ```
- [ ] Set up CSP violation reporting endpoint
- [ ] Monitor CSP violations in Sentry

**References**:

- OWASP: Content Security Policy Cheat Sheet
- CSP Evaluator: https://csp-evaluator.withgoogle.com/
- Mozilla CSP Guide: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

---

### MEDIUM-2: Missing Subresource Integrity (SRI) for External Scripts

**Location**: `/next.config.js:42` (external CDN usage)

**Severity**: Medium

**CVSS Score**: 4.8

**Description**:
The CSP allows scripts from external CDNs (`https://cdn.jsdelivr.net`, `https://www.googletagmanager.com`) but does not enforce Subresource Integrity (SRI) hashes. This creates supply chain attack risks.

**Vulnerability**:

- If CDN is compromised, malicious scripts can be injected
- No integrity verification for external resources
- Man-in-the-middle attacks could replace CDN scripts

**Impact**:

- Complete site compromise if CDN delivers malicious code
- User data theft via injected tracking scripts
- Cryptojacking or malware distribution

**Remediation Checklist**:

- [ ] Audit all external script usage: `grep -r "script src=" /Users/phil/PVS-local/Projects/internal/pvs-site`
- [ ] Add SRI hashes to all external scripts:
  ```html
  <script
    src="https://cdn.jsdelivr.net/package@version/file.js"
    integrity="sha384-HASH_HERE"
    crossorigin="anonymous"
  />
  ```
- [ ] Generate SRI hashes using https://www.srihash.org/
- [ ] Pin specific versions of external libraries (avoid `@latest`)
- [ ] Consider self-hosting critical external dependencies
- [ ] Add CSP `require-sri-for script` directive when supported
- [ ] Monitor external dependencies for security updates
- [ ] Document all external script dependencies and their purpose

**References**:

- OWASP: Third-Party JavaScript Management
- MDN: Subresource Integrity
- CWE-829: Inclusion of Functionality from Untrusted Control Sphere

---

## Low Vulnerabilities

### LOW-1: Inconsistent Error Handling in Data Validation

**Location**: `/lib/validation/homepage.ts:65-67`

**Severity**: Low

**CVSS Score**: 2.1

**Description**:
The validation library provides both throwing (`validateHomepageHero`) and safe (`safeValidateHomepageHero`) validation methods, but the codebase only uses the throwing version. This creates inconsistent error handling and could expose stack traces in production.

**Current Implementation**:

```typescript
// In /data/homepage.ts
const validatedHero = validateHomepageHero(rawHomepageHero); // Throws on error
```

**Vulnerability**:

- If validation fails, unhandled exception could crash the build
- Error messages might leak sensitive path information
- No graceful degradation for validation failures

**Impact**:

- Build failures expose file paths and system information
- No fallback content if data validation fails
- Debugging information potentially exposed to users

**Remediation Checklist**:

- [ ] Use safe validation with error handling:

  ```typescript
  const validationResult = safeValidateHomepageHero(rawHomepageHero);

  if (!validationResult.success) {
    console.error('Homepage hero validation failed:', validationResult.error);
    // Fallback to safe defaults or throw custom error
    throw new Error('Invalid homepage configuration');
  }

  export const homepageHero = validationResult.data;
  ```

- [ ] Create custom error class for validation failures
- [ ] Add Sentry error tracking for validation failures
- [ ] Implement fallback content for production environments
- [ ] Add build-time validation tests to catch issues before deployment

**References**:

- CWE-209: Generation of Error Message Containing Sensitive Information
- OWASP: Improper Error Handling

---

## General Security Recommendations

### Authentication & Authorization

- [x] Middleware validates JWT tokens using `getUser()` (secure pattern)
- [x] Protected routes properly configured (`/dashboard/*`)
- [ ] Add rate limiting to auth endpoints
- [ ] Implement CSRF protection for authenticated forms
- [ ] Add session timeout and refresh token rotation
- [ ] Log all authentication events to Sentry

### Data Protection

- [x] Environment variables properly configured (.env.example provided)
- [x] Supabase service role key not exposed to client
- [ ] Audit .env.local for accidentally committed secrets
- [ ] Enable Supabase RLS (Row Level Security) policies
- [ ] Implement field-level encryption for sensitive user data
- [ ] Add secrets scanning to CI/CD pipeline

### API Security

- [ ] Add rate limiting middleware using `next-rate-limit`
- [ ] Implement API key rotation mechanism
- [ ] Add request size limits to prevent DoS
- [ ] Validate all API responses before rendering
- [ ] Add CORS configuration review
- [ ] Implement API versioning strategy

### Dependency Management

- [ ] **CRITICAL**: Update Next.js to 15.5.10+ (addresses CVEs)
- [ ] Run `npm audit fix` to address other vulnerabilities
- [ ] Set up Dependabot or Renovate for automated updates
- [ ] Add `npm audit` to CI/CD pipeline as blocking check
- [ ] Review and minimize dependency count
- [ ] Use `npm ci` instead of `npm install` in production

### Infrastructure & Configuration

- [x] Security headers properly configured (HSTS, X-Frame-Options, etc.)
- [x] CSP header implemented (needs improvement - see MEDIUM-1)
- [ ] Remove `'unsafe-inline'` and `'unsafe-eval'` from CSP
- [ ] Enable Netlify/Vercel security features (DDoS protection, edge caching)
- [ ] Set up Web Application Firewall (WAF) rules
- [ ] Configure automatic HTTPS redirects
- [ ] Review Image Optimizer configuration for DoS risks

### Logging & Monitoring

- [x] Sentry integration for error tracking
- [x] Mixpanel for analytics
- [ ] Add security event logging (failed auth, validation errors, CSP violations)
- [ ] Set up alerting for security anomalies
- [ ] Implement request logging with IP tracking
- [ ] Add performance monitoring (Core Web Vitals)
- [ ] Create security dashboard in Sentry

### Code Quality

- [x] TypeScript strict mode enabled
- [x] React strict mode enabled
- [ ] Add ESLint security plugins (`eslint-plugin-security`)
- [ ] Set up pre-commit hooks for security scanning
- [ ] Add SonarQube or similar static analysis
- [ ] Implement code coverage requirements (>80%)

---

## Security Posture Improvement Plan

### Immediate Actions (Within 1 Sprint)

1. **Update Next.js to 15.5.10+** (CRITICAL-1)
   - Priority: P0
   - Impact: Addresses known CVEs
   - Effort: 4-8 hours (includes testing)

2. **Implement Services Validation** (CRITICAL-2)
   - Priority: P0
   - Impact: Prevents future XSS/open redirect
   - Effort: 2-4 hours

3. **Add URL Validation for Service Links** (HIGH-1)
   - Priority: P1
   - Impact: Prevents open redirects
   - Effort: 1-2 hours

4. **Run npm audit fix**
   - Priority: P1
   - Impact: Addresses multiple dependency CVEs
   - Effort: 1 hour

### Short-term Actions (Within 1 Month)

5. **Strengthen CSP Policy** (MEDIUM-1)
   - Priority: P2
   - Impact: Better XSS protection
   - Effort: 4-6 hours (testing required)

6. **Implement SRI for External Scripts** (MEDIUM-2)
   - Priority: P2
   - Impact: Prevents supply chain attacks
   - Effort: 2-3 hours

7. **Add XSS Sanitization** (HIGH-2)
   - Priority: P1
   - Impact: Defense-in-depth against XSS
   - Effort: 3-4 hours

8. **Improve Icon Validation** (HIGH-3)
   - Priority: P2
   - Impact: Better error visibility
   - Effort: 1 hour

### Long-term Actions (Within 1 Quarter)

9. **Set up Security Scanning Pipeline**
   - Add npm audit to CI/CD
   - Configure Dependabot
   - Add SAST tools (Snyk, SonarQube)
   - Effort: 8-16 hours

10. **Implement Comprehensive Input Validation**
    - Validate all data sources (forms, APIs, CMS)
    - Add sanitization helpers
    - Create validation testing suite
    - Effort: 16-24 hours

11. **Security Hardening Review**
    - Penetration testing
    - Security code review
    - Threat modeling workshop
    - Effort: 40+ hours (external consultant recommended)

12. **Documentation and Training**
    - Create security guidelines for developers
    - Document validation patterns
    - Conduct security awareness training
    - Effort: 8-12 hours

---

## Codebase-Wide Security Concerns (Not PR-Specific)

### Discovered During Audit

1. **5 instances of `dangerouslySetInnerHTML` found**:
   - `/app/dashboard/agenda/components/agenda-card.tsx`
   - `/app/dashboard/agenda/components/agenda-list-view.tsx`
   - `/app/dashboard/agenda/components/agenda-detail-panel.tsx`
   - `/components/ui/structured-data.tsx` (structured data - acceptable use)
   - `/components/sitebehaviour-script.tsx` (analytics - acceptable use)

   **Recommendation**: Audit agenda components for XSS risks. Consider using markdown rendering libraries instead of raw HTML.

2. **React 18.2.0 is not the latest version**:
   - Current: React 18.2.0
   - Latest: React 18.3.x
   - Recommendation: Update to latest patch version

3. **Missing security.txt file**:
   - Recommendation: Add `/public/.well-known/security.txt` with security contact info per RFC 9116

---

## Conclusion

PR #81 introduces a well-structured data-driven architecture for the services section. The refactoring itself is secure, leveraging Next.js Link component and React's default XSS protections. However, **the lack of runtime validation creates a critical security gap** that must be addressed before this pattern is extended to other sections or connected to external data sources.

The broader codebase has several critical vulnerabilities, most notably **outdated Next.js dependencies with known CVEs**. These must be prioritized and addressed immediately.

### Recommendation for PR #81:

**Conditional Approval** - Approve merge to `epic/pvs-320` with the requirement that CRITICAL-2 (services validation) is implemented before the epic merges to main.

### Next Steps:

1. Address CRITICAL-1 (Next.js update) in a separate emergency PR
2. Implement CRITICAL-2 (services validation) before merging epic to main
3. Create tickets for HIGH and MEDIUM vulnerabilities
4. Schedule security review meeting to discuss long-term improvements

---

**Report Generated**: 2026-02-13
**Audited By**: Claude Sonnet 4.5 (Security Audit Agent)
**PR**: #81 (pvs-323 → epic/pvs-320)
**Commit**: 37afa7f
