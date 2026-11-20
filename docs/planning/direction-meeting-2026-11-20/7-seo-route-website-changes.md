# SEO Route: Website Changes

Nov 19, 2026 · @Phil

If we pick the SEO route, the site needs trust fixes and a free audit offer first, then an SEO-led homepage and offer page. Nothing should claim results or run ads until we have dated proof. This is the companion to the Direction A: Website Changes doc, built the same way from an audit of `main`.

## Start here

Work from `main`, not the `dev-1404-user-insights` branch: `main` is live and 8 commits ahead. Every file reference below was checked on `main`.

Related docs:

- [Friday: What PixelVerse Sells](https://claude.ai/artifact/7y6qH9SE466ZJeDSb3YvLe): Tab 1 has the four directions; the [SEO route plan](https://claude.ai/artifact/7y6qH9SE466ZJeDSb3YvLe#7dcc96ca-5ceb) and [SEO route leads](https://claude.ai/artifact/7y6qH9SE466ZJeDSb3YvLe#129e051d-b003) tabs are the business side of this doc.
- [Direction A: Website Changes](https://claude.ai/artifact/UVD7rHsrmBkVE7VQ5d3DqZ): the same audit for direction A.

What the site says today:

|  | Live on `main` | SEO route |
| --- | --- | --- |
| Lead offer | Web design, development and SEO | Local SEO for Bergen County service businesses |
| Homepage H1 | "Web Design, Development & SEO" | Local SEO first, keeping "Web Design" in the H1 or title |
| SEO prices | $275 / $550 / $875 a month + $800 setup | Plan prices from the SEO route plan tab (to decide) |
| Website prices | $1,000 / $2,300 / $4,350 | Unchanged; sold as the rebuild step |
| Main call to action | "Get Started" (contact form) | Free local SEO audit |
| SEO proof | None on the site | Only once we have dated results |

Scope: every public page, the forms, tracking, the blog and the internal SEO log page. Most changes are copy in `/data/` files. URLs stay the same. Overlap with direction A: 4 of the 5 must-fix items apply here too (all but the ads security setting, which only matters if we run ads).

## At a glance

Twelve changes must land before we market SEO; four of them are the direction A trust fixes. Effort: S under half a day, M 1–3 days, L more than 3 days or needs content from clients.

| Change | Where | Priority | Effort |
| --- | --- | --- | --- |
| One approved quote per client; remove unsourced numbers ("2-3 jobs a week", "bookings more than doubled") | Homepage, About, case studies | Must before launch | S |
| Unfeature Domani or label it our own product; fix "hair salon" in llms.txt | Case studies, llms.txt | Must before launch | S |
| Privacy page | New `/privacy`, footer, forms | Must before launch | S |
| One reply-time promise, plus a separate audit turnaround | Contact pages and forms | Must before launch | S |
| Free local SEO audit offer | `/contact/review`, optional `/local-seo-audit` | Must before launch | M |
| SEO offer page: hero for everyone, audit as main CTA, minimum deliverables, contract terms | `/services/seo` | Must before launch | M |
| Retitle the related case studies block honestly | `/services/seo` | Must before launch | S |
| Audit tracking parameter and key events | Analytics, GA4 | Must before launch | S |
| Fresh Search Console baseline; give our service account access | Search Console | Must before launch | S |
| Homepage hero, service card order, menu CTA "Free SEO Audit" | Homepage, menu | Must before launch | S |
| City page CTAs to the audit, with the city passed through | 5 city pages | Must before launch | S |
| SEO role and experience in a team bio | About | Must before launch | S |
| City pages to 1,500+ words; links between nearby cities | 5 city pages | Should | L |
| Cliffside Park page (our own town) | New area page | Should | M |
| How we do local SEO page with a month-by-month timeline | New `/local-seo-process` | Should | M |
| Publish the 3 staged SEO posts; add an SEO cost post | Blog | Should | M |
| Footer town links, metadata, schema and llms.txt rewritten SEO-first | Site-wide | Should | S |
| "Website fixes" setup line and a monthly budget field | Pricing data, contact form | Should | S |
| Results page and a Jones SEO case study, once we have dated data | New `/results` | Should | M |
| Ad landing page, Google Ads click IDs, ads security setting | Only if we run ads | Nice | M |

## New pages

The route needs a free audit offer and a privacy page first; a process page and a Cliffside Park page next; a results page only once there's data. Existing redirects block the obvious URLs, so the new pages use slugs that avoid them.

Redirects already in `next.config.js` on `main`:

- `/pricing` and `/packages` permanently redirect to `/contact/details` (lines 172–180)
- `/audit` permanently redirects to `/contact/review` (lines 209–212)
- `/services/seo/:city` sends every `/services/seo/<anything>` back to `/services/seo` (lines 204–207), so `/services/seo/pricing` or `/services/seo/audit` can't work without narrowing that rule

| Page | URL | What it holds | Priority | Effort |
| --- | --- | --- | --- | --- |
| Free local SEO audit | Keep `/contact/review` as the form; optional landing page `/local-seo-audit` (`/audit` keeps pointing at the form) | What the audit checks, its format (short video or one-page report), turnaround, free with no obligation; form adds business name, main service, target towns and Google Business Profile | Must | M |
| Privacy | `/privacy` | What the forms collect, which analytics tools run (Tag Manager, GA4, Clarity, SiteBehaviour, Sentry), how leads are stored, how to ask for deletion; the audit asks for account access, which makes this more important | Must | S–M |
| SEO plans | On `/services/seo` with a `#plans` anchor, or `/local-seo-plans` if it needs its own page | Per-plan deliverables, setup fee, minimum term, what's not included, the "website fixes" line | Should (Must if ads point at pricing) | M |
| How we do local SEO | `/local-seo-process` | Month 0 setup, months 1–3, 3–6 and 6+; what the client provides; a sample report labeled illustrative; how we decide a site needs fixing. Much of the copy already exists in `data/seo-content.ts` (lines 98–133) | Should | M |
| Cliffside Park | `/areas/bergen-county/cliffside-park` | Our own town: easiest to rank, and the best demonstration of our own local SEO. Today `/services/cliffside-park` is a temporary redirect to `/services` | Should | M |
| Results | `/results` | Our own dated change log paired with dated Search Console outcomes, plus client before-and-after with written permission. Don't build it until the numbers are worth showing | Should (blocked on data) | M |
| Ad landing page | `/lp/local-seo-bergen`, hidden from search and the sitemap | One offer (the audit), one form, no menu. Only if we run SEO ads, which the audit advises against until we have proof | Nice | M |

The existing website review form (`components/contact/contact-review-form.tsx`) asks for name, email, website and phone, plus checkboxes such as "SEO & search visibility". It shares the generic contact H1, "Let's Talk Through Your Situation". An audit page needs its own H1 and promise. Also rewrite the homepage FAQ answer that mentions a "paid discovery session" (`data/homepage-faq.ts:41-44`), so the free audit and the paid setup line up.

## Pricing data

Almost every price comes from one file, `data/package-pricing.ts`, so new SEO prices are mostly one edit. Three places are hard-coded and will drift.

What the file holds on `main`:

- Website packages: $1,000 / $2,300 / $4,350 (lines 1–5)
- Care plans: $49 / $69 / $99 (lines 7–11)
- SEO plans: `oneLocation` $275, `threeLocations` $550, `fiveLocations` $875 (lines 13–17)
- SEO strategy setup: $800 (line 19)
- Quarterly and annual discounts (lines 38–67), used only by the website care plans, not SEO

Where SEO and website prices show (all read from the file): `/services/seo` hero and plan cards, `/services/web-development`, the homepage service cards and FAQ, `/services` path cards, `/faq`, and the Bergen hub plus four city FAQs.

Hard-coded:

- The live post "How much does a website cost in New Jersey" (`data/blog-posts.ts:160,178,196`)
- The Ridgewood FAQ quotes website prices only, with no SEO price (`data/area-pages-content.ts:468`)
- The contact form's budget options are all one-time amounts (`components/contact/contact-details-form.tsx:31-37`)

| Change | Where | Priority | Effort |
| --- | --- | --- | --- |
| Show the SEO price first everywhere (homepage cards, `/services` cards, FAQ order); today websites always come first | `data/homepage.ts:238-262`, `data/service-paths.ts`, `data/homepage-faq.ts` | Must | S |
| Add contract terms: minimum term, cancellation notice, whether prepay discounts apply to SEO. None are stated today | Pricing file, `/services/seo` footnote and FAQ | Must | S |
| Pick one plan model. The keys count locations, but the cards (Essentials, Ongoing Local SEO, Expanded SEO) are sold by workload. Counting towns (1, 3, 5) fits the five-city strategy and is easier to compare | Pricing file, `data/seo-content.ts:139-192` | Should | S |
| Add a "website fixes for SEO" line between the setup fee and a full rebuild, even if it's "quoted after the audit, typically from $X" | Pricing file, SEO and web development content | Should | S |
| Add a monthly budget question for SEO leads | Contact form, `budget_range` in analytics | Should | S–M |
| Read the blog post's prices from the pricing file, or remove them | `data/blog-posts.ts` | Nice | S |
| Add the SEO price to the Ridgewood FAQ | `data/area-pages-content.ts:468` | Nice | S |

If we adopt the priced-from-hours plans in the SEO route plan tab (Local $650, Growth $1,150, Market $1,750, Foundation $1,500), the plan cards' copy changes along with the numbers.

## SEO offer page

`/services/seo` is already honest and thorough, about 1,600 words. It's missing what a retainer buyer looks for: who it's for, what they get each month, the term, and proof.

What it says now:

- **Title:** "Local SEO Services | New Jersey"
- **H1:** "Local SEO for New Jersey Businesses"
- **Hero:** opens "For New Jersey businesses with an existing website"; main button "Discuss Your Situation" goes to the general contact form; second button "Request a Website Review"
- **Sections:** narrative → plan cards (Essentials $275, Ongoing Local SEO $550, Expanded SEO $875, Custom) → what the engagement covers → an illustrative report outline → related case studies → how we evaluate → FAQ (8 questions)
- **Keep:** the FAQ "Do you guarantee search rankings? No, and any SEO provider that does is overpromising", the line that no package guarantees a ranking or a number of leads, and "3–6 months" as the timeline

| Change | Detail | Priority | Effort |
| --- | --- | --- | --- |
| Hero for everyone | Speak to a local service business that isn't getting calls from Google; drop "with an existing website" | Must | S |
| Audit as the main button | "Get a free local SEO audit"; "Discuss Your Situation" becomes the second button (lines 74, 146, 226 of `data/seo-content.ts`) | Must | S |
| Minimum deliverables per plan | Today the FAQ says "There is no fixed publishing or backlink quota". Keep the honesty, add minimums: pages a month, profile posts, citations, reports, calls | Must | M (we decide what we can deliver) |
| Contract terms | Minimum term, cancellation, prepay | Must | S |
| Retitle the case studies block | "Local projects built with search in mind" overstates three website builds; e.g. "Sites we built for local search" | Must | S |
| Month-by-month timeline | Setup, months 1–3, 3–6, 6+, with what the client sees in each | Should | S |
| Sample report | A screenshot or PDF labeled illustrative, until a real client's can be shown | Should | M |
| Who it's for | Name the industries we have work in: home services, home care, photography | Should | S |
| Results block | Only once dated results exist | Should (blocked on data) | M |
| Title | "Local SEO Services in Bergen County, NJ"; change once and measure | Nice | S |
| Service schema | Name it "Local SEO Services" to match the H1 (it's "Local Website Optimization & SEO" today) and add plan offers | Nice | S |

Words to keep avoiding, here and in any ad: "guaranteed page 1", "rank #1", "results in 30 days", "X% more leads", and made-up urgency. Google Ads also rejects unverifiable ranking guarantees.

## Homepage and site-wide

Everything on the site leads with web design today. Switching to SEO is mostly copy in data files. The homepage is the only page that gets clicks, so its title and H1 change once, in their own release, and get measured.

### Hero

|  | Today (`data/homepage.ts:96-112`) | SEO route |
| --- | --- | --- |
| H1 | "Web Design, Development & SEO" | Local SEO first, keeping "Web Design" and "SEO" in the H1 or title |
| Tagline | "Built for growing New Jersey businesses" | Calls from Google and Maps for Bergen County service businesses |
| Main button | "Get Started" → contact form | "Get a free local SEO audit" |
| Second button | "Request a Website Review" | "See SEO plans" |
| Title | "Custom Web Design & SEO in New Jersey" | "Local SEO & Web Design in Bergen County, NJ" |

### Section order

Today (`app/page.tsx:85-94`): Hero, Why, Case study, Insight, Process, Testimonials, Areas, FAQ, Services, Final CTA. Services sits near the bottom.

- Move Services up, or put a short SEO plan teaser right under the hero
- Rewrite Insight and Process around local search: evaluate, fix what blocks rankings, monthly SEO, report
- Areas We Serve becomes a proof section once the city pages rank
- Service cards: Local SEO first; web design becomes "Website fixes and rebuilds"; drop or fold the "Ongoing Support" card

### Menu and footer

- Menu button "Get Started" becomes "Free SEO Audit" (`components/layout-wrapper.tsx:30`); Local SEO first in the Services dropdown
- Footer: link the five town names it already lists (`components/ui/footer.tsx:75`), add Privacy, and point its button at the audit

### Metadata, llms.txt and schema

- Site-wide default title and description (`app/layout.tsx:49-93`): rebalance to "Local SEO & Web Design for Bergen County businesses"
- `public/llms.txt`: line 17 calls Domani a "hair salon" with online booking, which is wrong. Fix that now whatever we decide. Then put SEO first, list the city pages, and add Iffer's Pictures
- Organization and WebSite schema descriptions (`lib/structured-data.ts`): rewrite SEO-first; consider ProfessionalService with the five cities in `areaServed`, still with no street address
- City service schema promises citations and content strategy; make sure it doesn't promise more than the plans include
- Use one spelling, "PixelVerse Studios", everywhere (some meta descriptions say "Pixelverse")

One decision for us: the public phone number has a 914 (Westchester, NY) area code. It doesn't hurt rankings, but it reads as non-local to New Jersey buyers. If it changes, it changes everywhere at once.

## Services pages

The service pages keep their URLs and most of their content; they change order and framing.

- **`/services`:** put the SEO card first (today web development, from $1,000, comes first) and retitle the hero around getting found locally (today "Choosing the Right Path for Your Website"). Should, S.
- **`/services/web-development`:** keep the URL and the packages; it ranks for web design searches and supports the city pages. Add an "SEO-ready rebuilds" framing for when an audit finds the site holding rankings back, and link back to `/services/seo` and the audit. Should, S–M.
- **Custom tools:** no tools page under this route. Domani is handled under Portfolio and proof.

## City and area pages

The city pages are this route's shop window, and all five are under the 1,500-word target, with Fort Lee, the top priority, the thinnest. None shows local proof yet.

| Page | Words of copy | Shown on the page (approx.) |
| --- | --- | --- |
| Fort Lee (priority 1) | 1,008 | 1,180 |
| Englewood (2) | 1,127 | 1,300 |
| Hackensack (3) | 1,142 | 1,310 |
| Ridgewood (5) | 1,209 | 1,380 |
| Paramus (4) | 1,252 | 1,420 |
| Bergen County hub | 1,200 | 1,350 |

What's fine: the schema (Service with `areaServed`, breadcrumbs, FAQ). No per-city LocalBusiness with an address, on purpose, since we have no office in those towns. The CLAUDE.md "Pending: per-city LocalBusiness schema" item can be closed as won't do.

| Change | Priority | Effort |
| --- | --- | --- |
| Buttons go to the free audit with the town passed along (e.g. `/contact/review?city=fort-lee`); today it's a generic "Start Your \[City\] Project" | Must | S |
| Grow the five pages past 1,500 words with useful additions: a local SEO checklist for the town's business mix, an example search ("Fort Lee dentist"), the first 90 days, 2–3 more FAQs on Google Business Profile and reviews. Fort Lee first | Should | L |
| Show Local SEO before Web Design on the page, keeping the H1 "Web Design & Local SEO for \[City\], NJ" | Should | S |
| "Nearby areas we serve" links between towns; today each page links only up to the hub | Should | S |
| Local proof only when true: a named client near the town with permission, or our own dated ranking | Should (blocked on data) | M |
| Cliffside Park page | Should | M |

Copy on these pages already says the examples "are not a claim that every project was delivered in \[city\]". That's honest; keep it until there's real local proof.

## Portfolio and proof

No case study on the site shows an SEO result, and two say so outright; the only result claims are testimonials we can't back up. For an SEO offer, that's the biggest trust problem on the site.

All four case studies are featured on the homepage (`data/case-studies.ts`).

| Case study | SEO result shown | Issue for the SEO route |
| --- | --- | --- |
| Jones Pressure Washing | None. The outcome text says the page structure "does not establish an organic booking rate" | Kyle is quoted three different ways: the case study ("booking 2-3 jobs a week from the website alone"), the homepage ("The phone actually rings now") and About (under a "placeholders" comment). The case study's own text contradicts the first. Best SEO candidate if Kyle shares his data |
| Iffer's Pictures | None | Tagged SEO, but it's a design story. Jennifer's quote appears on the homepage and About, also under the placeholders comment |
| Domani | Not SEO | Our own product shown as client work; "significantly more likely" retention claim has no data behind it |
| 360 Degree Care | None; says performance after handoff is outside the case study | Links a Netlify demo, not the live client site, so it can't be ongoing proof |

Other homepage testimonials: Going Gold Choreography says "bookings more than doubled" with no source. Gladstone (Cape May) and Rising Tide (Tampa) are fine for trust but don't help a Bergen-first SEO story.

| Change | Priority | Effort |
| --- | --- | --- |
| One quote per client, approved in writing, used the same way everywhere; remove any we can't confirm | Must | S + client emails |
| Remove or source "2-3 jobs a week" and "bookings more than doubled" before any SEO marketing (Google Ads and FTC endorsement rules) | Must | S |
| Unfeature Domani or label it our own product; remove or source the retention claim | Must | S |
| Dated SEO results on the Jones case study if Kyle agrees: Search Console before and after, profile calls, top searches | Should | M |
| Tag case studies `seo` only where there's an ongoing SEO engagement | Should | S |
| Start dated baselines for the 3 current SEO clients now, so a results case study is possible in 3–6 months | Should | S |

## About, contact and FAQ

An SEO buyer asks who does the SEO, how fast we reply, and what the audit involves; the site answers none of those today.

### About

- The team bios list Sami for UX design and Phil for development, with no SEO role or experience. Add SEO responsibility and experience to one bio. Must, S.
- The testimonials sit under a "placeholders" comment (see Portfolio and proof). Must.
- The placeholder Google rating (5.0, 0 reviews) is now replaced at runtime by live Google data and hidden at 0 reviews, so it's no longer a risk. Remove the placeholder values anyway. Nice, S.
- Our own review count matters more here, since we'd be selling review work: 7 reviews today, the last in February. Should, ongoing.

### Contact

The site makes two different reply promises to new leads:

- "Within one business day" (`components/contact/contact-hero.tsx:28`)
- "Within 1–2 business days" (`contact-details-form.tsx:351` and `contact-review-form.tsx:231`)

Pick one lead reply promise, and state a separate audit turnaround (e.g. "audit within 3 business days"). Keep the care-plan support terms separate. Must, S. The three contact pages also share one H1; the audit needs its own. Should, S.

### FAQ

`/faq` shows homepage questions, then web development, then SEO last.

- Put "SEO & Local Optimization" first
- Add: what's in the free audit, whether we need access to their Google accounts, and the contract term
- Remove "paid discovery session" from the homepage FAQ (`data/homepage-faq.ts:43`)

Should, S.

## Tracking

Today GA4 can't tell an SEO audit request from a general website review, and nothing records when an audit turns into a signed retainer. Those are the two numbers that decide whether this route works.

What's in place on `main`: twelve named events in `lib/analytics.ts`; leads from the details form carry `interest_category` (web design, SEO or unsure); first and last touch campaign data goes to the API with every form.

| Change | Priority | Effort |
| --- | --- | --- |
| Mark `generate_lead` (SEO interest), `website_review_request` and `strategy_call_scheduled` as GA4 key events, and confirm they arrive from the live site | Must | S |
| Send an `audit_type` (or interest) and `city` with `website_review_request`; today the "SEO & search visibility" choice isn't sent. Or a separate `seo_audit_request` event | Must | S |
| Give our Search Console service account access to our own property and every client's, so reports run automatically (it has access to none today) | Must | S |
| Record "retainer signed" as a stage in the dashboard's prospect pipeline, so audit-to-retainer conversion is visible | Should | M |
| Monthly snapshot of our own city rankings and clicks, for the proof sprint and a future results page | Should | S–M |
| Decide on call tracking. Never put a tracking number on regular pages or in schema, since the phone number has to match everywhere | Should | S |
| Capture Google Ads click IDs (`gclid`, `gbraid`, `wbraid`) and add the Google Ads domains to the security settings | Only if we run ads | S |

## Blog

The blog stopped in April: 10 live posts, the last on 2026-04-10, and only 2 about SEO (353 and 522 words). Selling ongoing SEO with a blog that stalled for 7 months undercuts the pitch.

- **Ready to go:** 8 finished posts sit unpublished in `data/blog-posts-staged.ts`, scheduled for April–May 2026. Three are local SEO: Google Business Profile optimization in Bergen County, a 2026 local SEO checklist, and why a business website isn't showing up on Google. The law firm post quotes $300–$1,500 a month for SEO, outside our prices; check it before publishing.
- **Links:** 7 of the 10 live posts don't link to any service, area or contact page.

| Change | Priority | Effort |
| --- | --- | --- |
| Publish the 3 staged SEO posts first, with fresh dates and links to `/services/seo`, the audit and the city pages | Should | S–M |
| Merge or expand the two thin SEO posts; fix a link that still points at the old `/services/bergen-county` | Should | M |
| New post: "How much does local SEO cost in NJ?", mirroring the website cost post (our longest post and an impression earner), with prices read from the pricing file | Should | M |
| A steady pace, e.g. 2 posts a month on local service searches in the five towns and our target industries | Should | Ongoing |
| Add links from older posts to `/services/seo` or the audit where relevant | Nice | S |

The internal SEO log page (`/docs/seo`) can't serve as proof: it's hidden from search, has no numbers, and still says "Prepared changes; not deployed" about changes that are live. Fix that note. A future `/results` page can reuse its dated change log next to real outcomes.

## Protecting search rankings

The homepage is the only page earning clicks, so changes there go out alone and get measured. Pull a fresh 16-month Search Console export before any change; the export in the repo is a year old.

- **Homepage title and H1:** keep "Web Design" and "SEO"; change in one release with no URL or link changes alongside; note the date; compare 28 days before and after.
- **Redirects:** don't remove the 301s on `/pricing`, `/packages` or `/audit`; `/audit` was a printed QR destination. If `/services/seo/:city` is narrowed, list the city slugs so old URLs still redirect.
- **City pages:** expand rather than replace; keep URLs and H1 keyword pairs; change titles one city at a time.
- **New SEO pages:** give each its own job so they don't compete with `/services/seo` (audit = "free local SEO audit", process = "how local SEO works", results = proof). `/services/seo` stays the one page for "local SEO services".
- **Removing case studies:** unfeature rather than delete; if a page goes, redirect it to `/portfolio`.
- **Schema:** validate after changes and never add a street address, which would undo the service-area setup.
- **Paid SEO ads:** a business risk rather than a rankings one. "SEO agency" clicks are expensive and draw other agencies and resellers. Launch organically first and revisit ads after 2–3 dated results.

## Decisions that block site work

Most of these are also open in the SEO route plan tab; the site can't be finished until they're answered.

| Decision | Options | Blocks |
| --- | --- | --- |
| SEO plan prices | Priced from hours ($650 / $1,150 / $1,750 + $1,500 Foundation) or today's +15% ($325 / $625 / $1,000) | Pricing file, plan cards, FAQ, city FAQs |
| Plan model | By number of towns (1 / 3 / 5) or by workload | Plan card copy and keys |
| Minimum deliverables per plan | Pages a month, profile posts, citations, reports, calls | `/services/seo`, process page, contracts |
| Minimum term | 3 or 6 months, then month to month | Pricing footnote, FAQ, contract |
| What the free audit includes | Format, what's checked, turnaround | Audit page, form fields, reply promise |
| Lead reply promise | One business day, or same day for new leads | Contact pages, forms |
| Testimonials | Which quotes clients approve in writing | Homepage, About, case studies |
| Domani | Unfeature, relabel as our own product, or remove | Homepage carousel, portfolio |
| Who owns SEO on the team | Which bio carries it | About |
| Public phone number | Keep the 914 number or switch to a New Jersey number everywhere | Footer, schema, Google Business Profile, citations |
| Paid SEO ads | None until there's proof, or a small test with a hidden landing page | Ad landing page, tracking, security settings |

## Order of work

Trust fixes and measurement come first, because they're needed in any direction; the offer and the homepage go out as separate releases; proof pages wait for data.

1. **Trust fixes:** testimonials and unsourced numbers, Domani and llms.txt, `/privacy`, one reply promise. All small.
2. **Measurement baseline:** fresh Search Console export; service account access; ranking snapshot for the five cities plus Cliffside Park; baselines for the 3 SEO clients; key events and the audit parameter.
3. **The offer:** audit page and reworked review form; `/services/seo` hero, button, deliverables, terms and timeline; the website fixes line; the monthly budget field.
4. **Site-wide switch to SEO first:** menu button, homepage hero and service order, footer links, metadata, schema. Its own release, dated and measured.
5. **Proof pages:** deeper city pages with audit buttons and links between towns; Cliffside Park; the process page; the SEO blog posts.
6. **Results page and a Jones SEO case study,** once dated results exist (end of the proof sprint in the SEO route plan tab).
7. **Paid ads, if at all:** only after step 6, with the click ID and security setting fixes.

Every release gets an entry in `docs/deployment_summary.md` and the SEO log page, so ranking changes can be traced to it.
