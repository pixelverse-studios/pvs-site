# Direction A: Website Changes

Nov 17, 2026 · @Phil

To sell direction A, the site needs one new plan page with a live quote calculator demo, two hidden ad landing pages, and lead tracking that works before any ad money is spent. Most existing pages keep their URLs and only change copy: prices, SEO framed as an add-on, and proof told as tools and bookings instead of search impressions. This audit covers every public page, the forms, tracking and the blog.

Related: [Friday: What PixelVerse Sells](https://claude.ai/artifact/7y6qH9SE466ZJeDSb3YvLe) (Tab 1 has the four directions; the [Direction A plan](https://claude.ai/artifact/7y6qH9SE466ZJeDSb3YvLe#3d049615-ef89) tab is the business side of this doc), and the alternative audited the same way, [SEO Route: Website Changes](https://claude.ai/artifact/KiqPX7ScmatqR4Un2TzDxP).

## Start here

All Direction A work should start from `main`, not from the current `dev-1404-user-insights` branch. That branch is 8 commits behind the live site, and those commits changed prices, package names, schema and attribution.

What the live site (`main`) says today:

| Item | Live today | Direction A |
| --- | --- | --- |
| Website packages | Starter $1,000, Small Business $2,300, Custom Growth $4,350, plus a $49 / $69 / $99 monthly care plan | Launch from $2,500 + $179/mo, Grow from $3,250 + $349/mo, Operate $1,000 discovery + from $6,000 + from $649/mo, Tools-only $350–$750 per tool + $99/mo |
| SEO | $275 / $550 / $875 per month + $800 strategy setup, sold as a core service | Add-on: $325 / $625 / $1,000 per month |
| Prepay discount | 5% quarterly; 2 months free on annual | 10% / 15% or 5% / 10% (open) |
| Build time | "8–12 weeks" | "Live in 4–6 weeks" |
| Positioning | "Web Design, Development & SEO"; evaluate before we recommend | Websites that book, quote and keep clients updated, on one monthly plan |
| Public phone | (914) 297-8215 | Unchanged everywhere; any tracking number only on ad pages |

Two corrections to the Direction A plan tab: the site no longer says "from $750" (it says $1,000), and its prices already match QuickBooks. The live prices are centralized in `data/package-pricing.ts`, so most price changes happen in one file.

Scope: every public page, the contact forms, tracking, structured data and the blog, audited by four parallel reviews of the code. Nothing was changed on the site.

## At a glance

Ten changes must land before ads start; the rest can follow in later releases. Effort: S = under a day, M = a few days, L = a week or more.

| Area | What changes | Priority | Effort |
| --- | --- | --- | --- |
| Lead tracking | Confirm key events in production, capture Google Ads click IDs, save lead source in the API, lead alert | Must before ads | M (site S, API M) |
| Pricing data | One plan pricing file replaces the package prices; every page reads from it | Must before ads | M |
| Plan offer page | New page with plans, tool menu and a live quote calculator demo | Must before ads | L |
| Ad landing pages | Two hidden pages (home services, care agencies) with no menu and one form | Must before ads | M |
| Contact form | Ask for plan, current platform, tool needed, industry, staff size | Must before ads | M (plus API) |
| Price and SEO copy | Homepage, services, six city FAQs and the FAQ page show plan prices; SEO shown as an add-on | Must before ads | M |
| Proof | Case studies told as bookings and tools; PVS dashboard case study; Domani as our own product; testimonials verified | Must before ads | M |
| FAQ | Rewrite pricing, timeline and process answers; add plan, term, ownership and payment questions | Must before ads | M |
| Privacy and security headers | Privacy page; allow Google Ads in the site's security policy | Must before ads | S |
| Pricing blog post | Rewrite "How much does a website cost" around plans | Must before ads | S |
| Homepage and menu | Plan-led headline, new section order, "Plans & Pricing" in the menu | Should | M |
| About page | New story, real headshots of Phil and Sami | Should | M |
| Tools-only and custom software pages | Second front door for existing sites; quiet page for custom work | Should | M |
| Structured data | Plans described in schema with prices that match the page | Should | S–M |
| Page speed | Stop loading dashboard styles on public pages | Should | M |
| Blog and cleanup | New posts on booking and quote tools; delete unused components | Nice | M |

## New pages

The site gets four public pages and two hidden ad pages; no existing URL changes. Recommended slugs are below. The earlier ad plan used `/services/websites-with-tools`; `website-plans` fits a "Plans & Pricing" menu item and the `/pricing` redirect better. Pick one before launch, since changing it later needs a redirect.

| URL | Purpose | In search | In sitemap | Linked from |
| --- | --- | --- | --- | --- |
| `/services/website-plans` | The plan offer: plans, tool menu, live quote calculator, payment options, proof | Yes | Yes (priority 0.9) | Menu, homepage, `/services`, web development and SEO pages, city FAQs, blog |
| `/services/website-tools` | Tools-only plan: add booking and quotes to an existing site | Yes | Yes | Services menu, plan page, Wix/WordPress blog post |
| `/services/custom-software` | Quiet page for custom tooling; paid-pilot CTA, no public price | Yes | Yes | `/services` footer link, PVS dashboard case study (not the main menu) |
| `/portfolio/pvs-dashboard` | In-house case study | Yes | Automatic | Portfolio, custom software page |
| `/privacy` | Privacy policy covering GA4, Google Ads, Clarity, SiteBehaviour and forms | Either | Optional | Footer, ad page footer |
| `/lp/home-services` | Google Ads page with Jones Pressure Washing proof | No (noindex, follow) | No | Nothing; ads only |
| `/lp/care-agencies` | Google Ads page with 360 Degree Care proof | No (noindex, follow) | No | Nothing; ads only |

Redirects in `next.config.js`:

- `/pricing` and `/packages` now send visitors to `/contact/details`. Point both at `/services/website-plans`.
- Never build a page at `/pricing` while that permanent redirect exists; browsers cache it.
- Keep the city redirects (`/services/fort-lee` and the others) as they are. `website-plans` doesn't collide with them.

Ad URLs follow the existing naming: `/lp/home-services?utm_source=google&utm_medium=cpc&utm_campaign=lead_gen_2026&utm_content={ad}&utm_term={keyword}`, with auto-tagging on.

## Pricing data

All plan prices should live in one new file, `data/plan-pricing.ts`, and every page, schema block and ad page should read from it. Then a price change is one edit and the ad pages can't drift from the plan page.

What the file holds:

- **Plans:** Tools-only, Launch, Grow, Operate. Each has setup (a "from" price, a per-tool price, or discovery + setup for Operate), monthly price, included edit hours (0 / 1 / 2 / 3), included tools, what it adds on top of the plan below it, minimum term (12 months), and which plan is featured (Grow).
- **Spread option** on Launch and Grow: $229 or $298 extra per month for 12 months (about $408 and $647 a month in year one), about 10% surcharge.
- **Add-ons:** ongoing SEO ($325 / $625 / $1,000 a month by location count), extra pages ($315 standard, $400 service), extra edit time ($150/hour), extra tools, headshots (no price until resell or refer is decided), ad management (hide until Alisa's trial is done).
- **Prepay options:** monthly / quarterly / annual, applying to the monthly fee only, never setup.
- **Tool list:** name, best for, build or integrate, and status (available now / coming next / later), so the site never advertises a tool that doesn't exist yet.
- A helper that writes prices the same way everywhere, e.g. "From $2,500 + $179/mo".

Keep the old `packageStartingPrices` export pointing at the new numbers during the switch, so pages not yet updated keep building.

### Where prices show today

Every one of these must change before ads. Most read from `data/package-pricing.ts`; the ones marked "typed in" won't update on their own.

| Page | What it shows | Source |
| --- | --- | --- |
| Homepage services cards | "Website packages start at $1,000", recurring SEO price | Pricing file |
| Homepage FAQ | Three package prices; SEO tiers + $800 setup | Pricing file |
| `/services` | Package and SEO chips on the two path cards | Pricing file |
| `/services/web-development` | Hero price cue; four package cards with care plans; cost FAQ | Pricing file |
| `/services/seo` | Hero price cue; SEO tiers; cost FAQ | Pricing file |
| Six city and county pages | "What does a website cost" FAQ answers (also sent to Google as FAQ schema) | Pricing file |
| Pricing toggle | 5% quarterly, "2 months free" annual | Pricing file |
| Blog: website cost post | Market ranges plus our package and care plan prices | Typed in |
| Staged blog post "Do small businesses need a website" | "$500 and $4,000", "$49 to $179" | Typed in |
| Contact form budget | "Under $1,000" to "$10,000+" (one-time budget only) | Typed in |

### Pricing component

The current pricing cards (`service-package-pricing-section.tsx`) need to be generalized into a plan pricing component:

- Plan names come from data instead of a fixed list; the "Most Popular" badge follows a `featured` flag.
- Always show setup next to the monthly price. "From $179/mo" without the $2,500 setup invites complaints.
- Show the prepay saving on both options, not only after a click.
- Spread option as one line under Launch and Grow ("Or $0 setup: about $408/mo for the first 12 months"), not a toggle. It's capped at 3–4 clients and explained on the call.
- Operate card: "$1,000 paid discovery, then from $6,000 + from $649/mo".
- Plan buttons link to the contact form with the plan pre-filled (`?plan=grow`).

## The plan offer page

`/services/website-plans` is the page everything points to: ads, the menu, the homepage and the city pages. Most sections reuse existing service-page components; the quote calculator demo is the only large new build.

**Title:** "Websites With Booking & Quote Tools | Bergen County NJ" (about 55 characters). **Description:** plans from $179/mo plus setup, custom site, booking, quotes, missed-call text-back, for Bergen County service businesses. **H1:** "Websites That Book, Quote and Keep Clients Updated". **Search targets:** "website with online booking", "quote calculator for website", "small business website monthly plan", "home care agency website", "website for contractors". These stay separate from the web development page's "web design NJ" target so the two pages don't compete.

Sections, in order:

1. **Hero.** Price cue "Plans from $2,500 setup + $179/mo". Buttons: "See plans" (jumps to plans) and "Try the quote calculator" (jumps to the demo).
2. **Outcomes.** Fewer price-check calls, bookings without back-and-forth, missed calls answered by text, clients check status themselves, one owner view of what's coming in.
3. **Live quote calculator demo.** A pressure-washing example echoing Jones: surface type, square footage and add-ons give a price range. Its result links to the contact form with "I tried the quote calculator" pre-filled. Details below.
4. **Tool menu.** From the tool list, marked "Available now" (quote calculator, lead alerts and report, booking) or "Coming next" (missed-call text-back, deposits, reminders, review requests, photo estimates, service-area checker). Label build vs. integrate honestly.
5. **Plans and pricing.** Four cards: Tools-only, Launch, Grow (featured), Operate, with the prepay toggle and the spread line. Footnotes: 12-month minimum then month to month; Calendly, Cal.com and Stripe plans billed to the client directly; Tools-only setup credited on upgrade within 12 months.
6. **Every plan includes.** The six items from the plan tab, with "Basic SEO setup" linking to `/services/seo` for ongoing SEO.
7. **Add-ons.** Ongoing SEO, extra pages, extra edit time, extra tools, headshots ("priced per shoot"). Leave ad management off until the trial is done.
8. **Proof.** Jones Pressure Washing (home services) and 360 Degree Care (care agency), plus a short "we build and run our own software" strip for the PVS dashboard and Domani.
9. **How it works.** Kickoff and intake, design and build with one revision round, launch and tool walkthrough, monthly report. "Live in 4–6 weeks."
10. **FAQ.** Minimum term, adding tools to WordPress or Wix, what an edit hour covers, who pays for Calendly or Stripe, spread payments. Ownership and health-data answers wait for those decisions.
11. **Service areas.** Links to the county and five city pages (also strengthens them).
12. **Final call to action.** Book a 20-minute call.

### Quote calculator demo

- Price logic in a plain function with tests (`lib/quote-calculator.ts`), config in a data file, UI in one client component. The same logic can later become the real hosted tool for clients.
- The page shows the heading, explanation and a sample result in server HTML, so search engines see it without JavaScript. The interactive part loads below it with its height reserved, so nothing jumps.
- No new libraries, under about 25 KB of added JavaScript, no network calls, keyboard accessible, result announced to screen readers.
- Tracking: `quote_calculator_start` on first input and `quote_calculator_complete` when a price first shows. Nothing typed into it goes to Google Analytics.
- An optional "email me this estimate" turns the demo into a lead (`form_type: quote_demo`).

### Schema

Service schema with an offer catalog of the four plans, built from the same pricing file, each with its setup and monthly price. Add a test that fails if schema prices differ from page prices. There's no Google rich result for this; the value is clearer business information for Google and AI answers. Add it only once prices are final.

## Ad landing pages

Two pages, `/lp/home-services` and `/lp/care-agencies`, built in Phase 3 after the ads gate. Each matches its ads, has one offer and one form, and is invisible to search and to the rest of the site.

How to build them in this codebase:

- **No menu or footer.** `components/layout-wrapper.tsx` already hides them for `/login` and `/dashboard`. Add `/lp/` to that check and render a simple shell: logo (not a link out), phone link, one button that jumps to the form, and a footer with only the privacy link and copyright. Don't create a separate root layout; that would force full reloads and split GTM, Clarity and the campaign tracker.
- **Hidden from search.** Add a `robots` option to `createPageMetadata` (`lib/metadata.ts`) and set noindex, follow. Back it up with an `X-Robots-Tag: noindex` header for `/lp/*`. Don't block `/lp/` in robots.txt: Google needs to crawl the page to see the noindex, and the Ads crawler needs access.
- **Out of the sitemap and internal links.** The sitemap is a hand-written list, so they stay out unless added. Add a test that fails if any data file, menu or blog post links to `/lp/`.
- **Short form.** About four fields: name, email, phone, and "what's slowing you down", plus optional plan interest and a "spread setup over 12 months?" checkbox. The page passes `industry` and `form_type` (`lp_home_services` / `lp_care_agencies`) so every lead carries its campaign even if fields are skipped.
- **Proof inline, not linked.** Case study summary and quote on the page, no links that leave it.
- **Same prices and demo.** Import the plan pricing file and the quote calculator component, so the ad page can't disagree with the plan page.
- **Speed.** Static page, hero text in server HTML, no lazy-loaded content above the fold, form within the first two screens on a phone (the contact page form currently starts about 1,980px down), images sized. Target LCP under 2.0 seconds on mobile. Consider not loading SiteBehaviour here.
- **Hide the promo code field** unless a code arrived in the URL; a visible empty field sends people looking for discounts.

Care agency page: don't make any health-data or HIPAA claims until that decision is made. The Fort Lee page already says "HIPAA-aware design"; review that line too.

## Homepage and site-wide

The homepage sells the old offer: H1 "Web Design, Development & SEO", SEO as one of two core services, a diagnose-first process, and the services grid near the bottom. It should lead with the plan while keeping "Web Design" and a New Jersey location in the title and H1, since those carry its rankings. Content is in `data/homepage.ts`, so most changes are small.

### Hero

| Element | Today | Change to |
| --- | --- | --- |
| H1 | "Web Design, Development & SEO" | Keep a keyword: e.g. "Web Design That Books, Quotes and Updates Your Clients" |
| Tagline | "Built for growing New Jersey businesses" | "Custom websites for Bergen County service businesses, on one monthly plan." |
| Subhead | "We help New Jersey businesses understand what their website actually needs…" | The offer sentence, plus one line naming the tools. Keep "support how the business actually operates and grows". |
| Buttons | "Get Started" → contact; "Request a Website Review" | "See Plans & Pricing" → plan page; "Try the Quote Calculator" |
| Floating icons | Design and code icons (Figma, palette, code) | Mix in calendar, calculator, message, card and dashboard icons |
| Rating badge | Live Google rating | Keep |

### Section order

Today: Hero, Why, Case studies, Insight, Process, Testimonials, Areas, FAQ, Services, Final CTA. Proposed:

1. Hero (plan-led)
2. **New:** tool strip, "What your website does for you", one outcome per tool
3. **New:** plans teaser, Launch / Grow / Operate cards with prices and a Tools-only line (replaces the Services section)
4. Case studies, Jones then 360 Degree Care first; Iffer's off the homepage; Domani shown as "our own product" or removed
5. Process, rewritten as onboarding: kickoff, design and build, launch and walkthrough, ongoing edits and monthly report. Heading idea: "Live in 4–6 weeks, then we keep it running."
6. Testimonials, reordered: Jones, Going Gold (bookings doubled), Gladstone (responsiveness); consider dropping Rising Tide (Tampa)
7. Why, rewritten around service-business pain: missed calls, the same price questions, phone tag over bookings, no-shows, status calls
8. Areas we serve. Keep every city link. Retitle from "Bergen County Web Design & SEO" to drop "& SEO".
9. FAQ (see the FAQ section)
10. Final CTA: "Find the right plan in a 20-minute call", button "Book a Plan Call"

Remove the Insight section (a physical therapy clinic story ending in "we evaluate the full system"), or reuse its timeline for a "missed call to booked job" walkthrough.

### Menu

- Add a top-level **Plans & Pricing** to the plan page. It also shows in the footer automatically.
- Services dropdown: add "Websites with Built-in Tools" first and "Tools for Your Existing Site". Rename "Optimization & SEO" to "Local SEO" and keep its URL. Keep web development and its URL.
- Reorder: Services, Plans & Pricing, Portfolio, About, Blog, FAQ.
- Header button: "Get Started" → "See Plans" or "Get a Plan Quote".
- Gotcha: mobile menu icons are matched by label in `navbar.tsx` (`mobileNavIcons`). Renamed items need new entries or they fall back to a default icon.

### Footer

- Tagline "Building websites that work. / Designed for people, built to grow." → e.g. "Websites that run your business. / Built in Bergen County, on one monthly plan."
- Keep the service-area line and the name, address and phone exactly as they are.
- Add the privacy link.

### Metadata and AI summary

- Homepage title "Custom Web Design & SEO in New Jersey" → e.g. "Bergen County Web Design on a Monthly Plan". Description → the one-sentence offer.
- Site default title, Open Graph and Twitter titles "Custom Web Design & SEO" (`app/layout.tsx`) → "Custom Websites for Bergen County Service Businesses".
- Open Graph image is the logo stretched to 1200×630. A proper share card with the plan message helps referral and ad shares (Nice).
- `public/llms.txt` calls us an "SEO agency" and describes Domani as a hair salon. Rewrite to the plan offer and fix Domani.

### Site-wide schema

- Organization description → custom websites with built-in booking, quoting and client tools on monthly plans.
- Homepage and `/services` Service schema lists two offers ("Web Design & Development", "Website Optimization & SEO"). Add "Website plans" first, and describe SEO as an add-on.
- Don't bring back per-city LocalBusiness schema; `main` replaced it with Organization plus Service on purpose, and tests enforce it.

## Services pages

The three service pages get few search impressions (8, 9 and 6 in the last 28 days of the Nov 13 Search Console export), so they can be repositioned freely as long as URL, title and H1 stay.

### `/services` overview

- H1 "Choosing the Right Path for Your Website" holds no keyword. Change to e.g. "Website Plans for Bergen County Service Businesses".
- Replace the two path cards (web design, SEO) with three:
  1. **Website plans:** "From $2,500 setup + $179/mo", links to the plan page, mentions how we build via `/services/web-development`.
  2. **Tools for your current site:** "From $350 setup + $99/mo per tool", links to the tools page.
  3. **Ongoing local SEO (add-on):** "Add-on from $325/mo", links to `/services/seo`.
- Small add-ons row underneath: headshots, extra pages, extra edit time.
- Code: add icon keys beyond `code` and `search`, switch the grid to three columns.
- Add a quiet link to `/services/custom-software` at the bottom.

### `/services/web-development`

Keep it as the organic page for "web design NJ": same URL, title, H1 and keyword headings. Reposition the body as "how we build the website inside every plan".

| Today | Problem | Change |
| --- | --- | --- |
| Starter / Small Business / Custom Growth packages with care plans | Old model | Launch / Grow / Operate cards from the pricing file, plus "Already happy with your site? Add tools only" |
| "We use both custom development and website builders depending on the situation" | Plans promise custom builds, no templates | Remove or reword |
| FAQ "Most builds run 8–12 weeks" | Plan target is 4–6 weeks | "Most plan sites go live in 4–6 weeks" |
| FAQ "…so you're not dependent on us for routine updates" | Plans include monthly edit hours | Explain edit hours: 1 / 2 / 3 per month by plan, extra at $150/hour |
| "When a New Website Is the Right Move" | Points only to SEO as the alternative | Also point to Tools-only and the plan page |

Don't let this page target "website with booking" or "quote calculator"; that belongs to the plan page.

### `/services/seo` becomes an add-on page

Keep the URL, title "Local SEO Services | New Jersey", H1 and every heading, so the "local SEO NJ" target stays. Change only the framing:

- Hero cue: "Ongoing SEO: add-on from $325/mo".
- Intro: every plan already includes basic SEO setup; this add-on is the ongoing work (local content, city pages, ranking reports).
- Pricing: $325 (1 location), $625 (3), $1,000 (5). Decide whether the $800 strategy setup stays.
- FAQ "Do you work on Google Business Profile… not as a separate add-on" → GBP basics in every plan, ongoing GBP work in the SEO add-on.
- Add a "How this fits with website plans" block linking the plan and tools pages.
- Ads never point here.

Two decisions shape this page (see Decisions): whether SEO can be bought without a website plan, and whether prepay discounts apply to add-ons. If SEO needs a plan, the FAQ "Can you do SEO on a site you didn't build? Yes" must change, and that's the page's strongest message today.

## City and area pages

The county and five city pages carry almost all of the site's search impressions (Bergen County 209, Ridgewood 118, Paramus 76, Fort Lee 67, Hackensack 62, Englewood 52 in 28 days). Change copy only: no URL, title, H1, heading or keyword changes, and keep the "Local SEO Services for {city}" sections even though SEO becomes an add-on. All copy lives in `data/area-pages-content.ts`.

Every page gets three additions:

- **Cost FAQ rewritten** to plan pricing, with ongoing SEO as an add-on. These answers are sent to Google as FAQ schema, so they must match the plan page. (Must before ads.)
- **A new FAQ:** "Can my website take bookings or give instant quotes?", with a link to the plan page. City body text can't hold links, so a FAQ link is the only copy-only way to link the plan page from these pages.
- **One sentence naming home services and care agencies.** Today the copy targets restaurants, law firms, medical offices and retail.

Per-page notes:

| Page | Extra change |
| --- | --- |
| Bergen County | FAQ "What makes you different" says "we focus exclusively on web design and local SEO"; rewrite to the plan model. Add a plans sentence to the web design section. |
| Fort Lee (priority 1) | Web design text already mentions intake forms, reservations and scheduling; reword as "built-in booking and intake tools on a monthly plan". Review "HIPAA-aware design". |
| Englewood (2) | Web design text mentions online ordering and scheduling; add the plan framing. Add home-service businesses to the "near me" FAQ. |
| Hackensack (3) | FAQ "Can you redesign my existing site?" should mention Tools-only as the no-rebuild option. Add a care-agency mention to the healthcare text. |
| Paramus (4) | FAQ "Can you help my Paramus service business rank in Google Maps?" should mention the quote and booking tools and the SEO add-on price. |
| Ridgewood (5) | Add 360 Degree Care as local proof: a Ridgewood home care agency we built for. |

Template gotcha: the city template labels sections by position (first = "Web Design", anything else = "Local SEO"), and the county template links them the same way. Don't add a third service section until those templates read the label and link from data.

City schema stays as two services. At most, add "with built-in booking and quote tools" to the web design description. No prices in city schema.

After release: log it in the SEO changelog, list the six URLs in the deployment summary, request re-indexing, and watch Search Console for 2–4 weeks.

## Portfolio and proof

All four case studies are told as search-visibility stories, none mentions a tool or a plan, and Domani appears as client work on the homepage. Ad visitors judge us on this proof, so it has to show websites that book and quote.

### Data changes (`data/case-studies.ts`)

- Add `kind: 'client' | 'in-house'`, a `tools` list, an optional `plan`, and allow several outcomes (business result first, search result second).
- Replace the one-off image-crop check for Iffer's in the showcase with an image-position field.
- Order client work Jones, then 360 Degree Care, then Iffer's. The detail page's "Next" link follows this order.

### Existing case studies

| Case study | Today | Change |
| --- | --- | --- |
| Jones Pressure Washing | "How we helped a pressure washing company build search visibility across two counties"; result "5,200+ search impressions" | Lead with bookings: e.g. "How a pressure washing company books 2–3 jobs a week from its website". Confirm that number with data first. Add the quote calculator once it's live. Make the location consistent (Bergen & Essex vs. Bloomfield). |
| 360 Degree Care | "…a digital presence that matched their reputation"; "8,500+ search impressions"; links to a Netlify demo named "haven-home-healthcare"; no testimonial | Add care tools if planned (applications, intake, family updates); get a testimonial; link the live site or explain the demo link. No HIPAA claims yet. |
| Domani | "How we designed a distraction-free planning app"; industry "Productivity SaaS"; featured on the homepage | Reframe as our own product: "Domani: the planning app we built and run ourselves". Mention its admin console and Supabase backend (the same stack as the tools). Off the homepage client carousel. Check "76 early-access users" is current. |
| Iffer's Pictures | Photography; no metric | Keep as secondary proof. Tag its media dashboard as a built tool. Add its testimonial; spell "Iffer's" the same everywhere. |

### New case studies

- **PVS operations dashboard (in-house):** client management, per-client site and SEO tracking, prospect pipeline, automatic deployment emails. It's the basis for the owner dashboard and monthly report. Screenshots must not show client names. (Must.)
- **First plan client:** written once a tool is live for a real client, e.g. the Jones quote calculator. Part of the ads gate.

### Portfolio pages

- Intro H1 "Work built around real business goals" and copy mentioning "SaaS products" → copy about websites that book, quote and update clients.
- Split the page into "Client work" and "Built and run by us".
- Showcase cards: add tool chips and a plan chip; show "Our product" instead of a location for in-house work.
- Case study page: add a "Tools in this build" section and a plan callout; for in-house work, "The Challenge" becomes "Why we built it".
- Closing CTAs say "the next step is a conversation, not a proposal", but the new sales process promises a proposal in 2 days. Change to the 20-minute call, with the plan or tool pre-filled.
- Schema: in-house case studies currently mark Domani and the dashboard as client organizations. Use SoftwareApplication or PixelVerse itself.
- Portfolio metadata: mention booking and quote tools; keep the URL.

## About page

The About page tells a consultative "system thinking" story and shows initials instead of photos; it should tell the plan story and show real people. Content is in `data/about.ts`.

- **Story.** Hero "How We Work" with "Our role is to slow that moment down, ask the right questions" conflicts with answering within an hour and a proposal in 2 days. New angle: two builders in Bergen County who build websites that run your business, and who build and run their own software (PVS dashboard, Domani). Name the buyer: owner-run service businesses with 2–25 staff.
- **Sections.** Replace "system thinking" and "consultative web agency" framing with how a plan works: we build it, host it, keep it updated, add tools, send a monthly report. "Design, Development, and Optimization" becomes "Website + tools + support", with SEO as an add-on line. Keep "We don't view websites as one-time deliverables"; it already fits.
- **Team photos.** Sami and Phil show as gradient initials; the component already supports photos. Book the partner photographer for both. This is also where headshots are shown off: "Headshots by \[partner\]". Phil's bio should say he builds the tools (quote calculators, dashboards, portals).
- **Testimonials.** The code comment says "Client Testimonials (placeholders — replace with real quotes)", and Kyle (Jones) is quoted three different ways across the site. Confirm every quote is real and approved, keep one quote per client, or remove it before ads. Paid traffic makes this an endorsement-rules issue.
- **Google reviews.** The section only shows when there's a review count; check the profile short link works. Founding-client reviews feed it.
- **Metadata.** Drop keywords like "system thinking web design" and "consultative web agency"; spell PixelVerse consistently ("Pixelverse" appears in the hero).
- **CTA.** "Talk Through Your Situation" → "Book a 20-minute call" or "See plans".

## Contact form, call booking and response promises

The main form asks for a one-time project budget and "Web Design vs. SEO", so it can't tell us which plan, platform or tool a lead needs. It needs new fields, and the API and dashboard need to store them.

### Main form (`/contact/details`)

| Field | Today | Change |
| --- | --- | --- |
| What are you interested in? | Web Design & Development / SEO / Not sure yet | Tools-only (keep my site) / Launch / Grow / Operate / Not sure. Pre-fill from `?plan=`; keep old `?interest=` links working. |
| Current platform | Not asked | New, required: our site / WordPress / Wix / Squarespace / other custom / no website |
| Tool needed | Not asked | New, multi-select, matching the tool list |
| Industry | Not asked | New: home services or trades / home care or care agency / other local service / other |
| Staff size | Not asked | New: just me / 2–5 / 6–10 / 11–25 / 25+ |
| Budget range | "Under $1,000" to "$10,000+", required | Remove, or change to monthly ranges and make it optional. Optional "Spread the setup cost?" for Launch and Grow. |
| What are you hoping to improve? | Generic (outdated site, not in search results) | Business pains that match the tools: too many price calls, booking back-and-forth, missed calls, chasing deposits, status calls, site outdated, not found on Google. Make it optional. |
| Add-ons | Not asked | Optional: ongoing SEO, headshots, ad management |
| Promo code | Always visible | Hide unless a code arrived in the URL. Decide whether NJCC2026 is honored under plans; it has no expiry. |
| Button | "Start the Conversation" | "Book my 20-minute call" or "Get my plan options" |

Check the API's allowed values before changing any field; it may reject new ones. Changing budget values also breaks continuity in old reports.

### Call booking and other paths

- The site promises a 30-minute strategy call; Direction A uses a 20-minute call with a tool demo. Update the page, the "What to expect" list, and the Calendly event length.
- Add Calendly questions for plan, platform and industry, so booked calls carry the same data as forms. Pass stored UTMs to the Calendly popup.
- Make sure production has `NEXT_PUBLIC_CALENDLY_URL` set, so paid visitors never see "Online Scheduling Coming Soon".
- Free website review: reframe as a "site + tools check" and add the platform field. Keep the URL.

### Response promises

The site says three different things: "within one business day" (contact hero), "1–2 business days" (form success messages), and Direction A says within an hour. Change all of them to "within an hour during business hours" only after the lead alert is live; until then, don't promise it.

## FAQ

The FAQ page pulls from three data files (homepage FAQ, web development, SEO) that also feed the homepage and service pages, so one rewrite fixes all of them. Restructure `/faq` into five groups: Plans and pricing; Ownership, contracts and leaving; Tools and your current site; Build and support; SEO and add-ons. Retitle it from "Web Design & SEO FAQs" to e.g. "Website Plans & Tools FAQ".

### Rewrite or remove

| Question | Today | Change |
| --- | --- | --- |
| How much does a custom website typically cost? | Three package prices | Plan prices and the spread option |
| How much do SEO packages start at? | SEO tiers + $800 setup | "Is SEO included?" Basic setup in every plan; ongoing SEO add-on from $325/mo |
| How long does it take? | "8–12 weeks" | "Most plan sites go live in 4–6 weeks"; Operate longer because of discovery |
| What happens after I contact you? | Intro call, then paid discovery for everyone | Reply within an hour, 20-minute call, demo, proposal within 2 days; paid discovery only for Operate |
| Do I need a budget in mind? | "Budget comes into play once we know…" | Remove, or point to the published plans |
| How is working with PixelVerse different? | "We evaluate before we recommend… not a packaged scope" | One plan: site, hosting, tools, edits and report; custom-built; we run our own software |
| What's included in a website build? | Planning, design, development | "What's included in every plan?" Hosting, security, backups, uptime, basic SEO, edit hours, lead alerts, monthly report, support response time |
| Will the site be easy to update ourselves? | "…not dependent on us for routine updates" | Edit hours per plan, $150/hour beyond; say whether clients get self-edit access |
| Can you rebuild just part of a site? | Yes, when the foundation is sound | The Tools-only answer: keep your site, we add tools |
| Do you work on Google Business Profile? | "…not as a separate add-on" | Basics in every plan; ongoing work in the SEO add-on |
| Can you do SEO on a site you didn't build? | "Yes. Most of our optimization work is on existing sites" | Depends on the SEO decision |

Keep as they are: whether to redesign or start over (add the Tools-only option), how to know if the site is the problem, working outside NJ, SEO guarantees and time to results, copywriting.

### Add

- What's the difference between Launch, Grow and Operate?
- Is there a minimum term? (12 months, then month to month.)
- Can I spread the setup cost? (Launch and Grow, 12 months, about 10% more, balance due if you leave early.)
- I'm on Wix, WordPress or Squarespace. Can you add tools without rebuilding?
- What tools can you add, and which are available now?
- Are there other costs? (Your own Calendly, Cal.com, Stripe or SMS plan.)
- How fast do you respond to support requests? (Within 1 business day; site-down issues the same day.)
- Do you offer discounts? (Prepay only.)
- Can you do headshots or team photos? (Add-on through our partner photographer.)

Hold until decided, and match the plan version of the service agreement after the lawyer's review: who owns the website, what happens if I leave, can prices change, how do you handle health information for care agencies.

## Tracking and measurement

Ads can't be judged until a lead can be traced from click to signed plan. Today, form-completion events are still unverified in production, Google Ads click IDs aren't captured, and the dashboard can't show where a lead came from.

### Before ads

- [ ] Confirm `generate_lead`, `website_review_request` and `strategy_call_scheduled` arrive in GA4 from the live site, then mark them as key events (the QA doc still lists them as untested).
- [ ] Capture `gclid`, `gbraid` and `wbraid` in `lib/attribution.ts`, send them only to our API (never to GA4), and fall back to Google's `_gcl_aw` cookie when the session copy is gone. This lets us later report "signed plan" back to Google Ads.
- [ ] Keep attribution longer than one tab session: today it's tab-scoped with a 30-minute limit, and leads often come back days later.
- [ ] API stores the attribution on leads, reviews and booked calls; the prospect drawer shows first and latest source, landing page and campaign, with a channel filter. (API and dashboard work.)
- [ ] Link Google Ads to GA4, import the key events, auto-tagging on.
- [ ] GTM: the "Marketing Events" trigger is an exact-name list, so new events are silently dropped until it's updated. The GA4 tag sends no event parameters today; add them and register them as custom dimensions.
- [ ] New parameters must also be added to the allow-lists in `lib/analytics.ts`, or they're silently dropped.
- [ ] Lead alert by email or text to Phil and Sami, with source and landing page. (API work.)
- [ ] Call tracking: use Google Ads call assets now; optionally swap in a Google forwarding number on `/lp/*` only, so the public number stays the same everywhere else.
- [ ] Filter internal traffic in GA4 so our own visits don't skew cost per lead.
- [ ] Decide on Enhanced Conversions (hashed email). It contradicts the current "no personal data to Google" rule, so the default is no.

### New events

| Event | When | Parameters | Counts as a conversion |
| --- | --- | --- | --- |
| `pricing_view` | Plans section half in view, once per page | page, section | No |
| `plan_select` | A plan button is clicked | plan, billing option (monthly, prepay, spread) | No |
| `payment_option_interest` | Spread option clicked | plan | No |
| `quote_calculator_start` / `quote_calculator_complete` | First input / first price shown | calculator variant, page | Complete: secondary, observe only |
| `generate_lead` (existing) | Form success, including ad pages | form type, plan, industry, payment option | Yes, primary |
| `strategy_call_scheduled` (existing) | Calendly booking | contact path | Yes, primary |
| `website_review_request` (existing) | Review form | form type | Yes, secondary |

Form parameters change too: add `plan_interest`, `current_platform`, `tools_needed`, `industry`, `staff_size` and `addons`. Send both `plan_interest` and the old `interest_category` for a transition period, and rename the budget parameter if its values change, so old and new data don't mix. Some button tracking labels will change with the copy; note the release date when reading reports.

## Technical

- **Security policy blocks Google Ads (Must).** The site's content security policy (`next.config.js`) allows GTM, Clarity, Sentry, Calendly and SiteBehaviour, but not Google Ads. Without `googleadservices.com` and the `doubleclick.net` domains, conversions silently won't record. Add Cal.com and the future tools subdomain when those arrive. Check the browser console on an ad page in GTM Preview afterwards.
- **Privacy page (Must).** There is none. Needed for Google Ads, remarketing and forms, and to disclose GA4, Clarity, SiteBehaviour and stored click IDs. Link it from the footer and the ad page footer.
- **Dashboard styles on every public page (Should).** `app/layout.tsx` loads Mantine's stylesheet (about 234 KB) and provider for the whole site, but public pages barely use it. Move both into the dashboard and login layouts, then test the dashboard. This is the biggest speed win for ad pages.
- **Noindex option in metadata (Must).** See Ad landing pages.
- **Tracking exclusions (Should).** `/docs/seo` and `/styleguide` are tracked by GA4, Clarity and SiteBehaviour. Add them to the excluded routes in `lib/tracking-config.ts`. Never exclude `/lp`.
- **Canonical domain in reports (Should).** Canonical URLs and the sitemap use `https://pixelversestudios.io` without www, while the deployment summary template uses www. Use non-www in "Changed URLs" so re-indexing requests don't hit redirects.
- **Tests.** The repo has Vitest tests for SEO controls, structured data and attribution. Extend them: ad pages not in the sitemap, no internal links to `/lp/`, schema prices match page prices.
- **Unused components (Nice).** Six old services components and `bergen-towns-section.tsx` aren't rendered anywhere. The towns section links to redirect URLs and claims "ADA & HIPAA-ready" forms. Delete them so nobody reuses them.
- **Styleguide (Nice).** Add the plan cards, tool badges, landing shell, short form and calculator demo.

## Blog

Only the pricing post must change before ads; the rest is cleanup and new posts. Nine of ten posts aren't indexed yet (Nov 13 review), so editing them carries little ranking risk. The exception is the Wix vs. WordPress post, which drives most impressions: keep its slug, title and H1.

The blog's closing button says "Book a free consultation" and links to `/contact`, which redirects. Point it at the plan page and allow a different call to action per post. Two posts also link `/contact` inline.

### Published posts

| Post | Fit | Change | Priority |
| --- | --- | --- | --- |
| How much does a website cost in NJ | Our package and care plan prices | Rewrite the pricing sections around plans and the spread option; keep the market ranges; set the updated date | Must before ads |
| Wix vs. WordPress vs. custom | Criticizes the platforms Tools-only serves; says "You own everything, code included" | Add "Already on Wix or WordPress? Add booking and quotes without rebuilding" linking the tools page; fix the ownership claim once decided | Should |
| Custom development vs. website builders | Supports tools and portals; same ownership claim | Add the plan angle and link; fix ownership | Should |
| Why SEO matters for small businesses | SEO as the core service | Close with: basic SEO in every plan, ongoing SEO as an add-on | Should |
| Focus on growth, not DIY | Supports a monthly partner | Plan CTA; mention edit hours | Should |
| Analytics retainer reporting | Supports the monthly report | Describe the plan report; link the plan page | Should |
| Choosing a web design company in NJ | Neutral | Add "ask about response times and edit hours"; fix the `/contact` link | Nice |
| Local SEO title and meta playbook; UX vs. UI; AI security | Neutral | New CTA only; no health-data claims in the AI post | Nice |

### Staged posts (written, never published)

- **Publish first, after updating:** contractor website design (add quote calculator, booking and missed-call sections), "Do small businesses need a website" (fix "$500 and $4,000" and "$49 to $179"), best business websites in Bergen County (add the tools angle).
- **Hold for SEO add-on content:** website not showing up on Google, Google Business Profile optimization, local SEO checklist. The "GBP is 32% of local ranking" figure needs a source.
- **Hold:** restaurant and law firm web design. Off the priority buyer.

### New post ideas

1. Website with online booking for Bergen County service businesses: cost and setup
2. Quote calculator for your website: how instant estimates win more jobs (with the demo and Jones)
3. Home care agency website: what families and caregivers need to see (360 Degree Care; no health-data claims yet)
4. Website subscription vs. one-time build: what costs less over 3 years?
5. Add booking and quotes to your Wix or WordPress site without rebuilding (organic only; Wix is a negative keyword in ads)
6. Pressure washing website that books jobs: what to include
7. Client portal for small service businesses: when it's worth it
8. Know which calls and forms came from your website: lead tracking for small businesses
9. Missed-call text-back for contractors (once the tool is live)
10. Taking deposits online for appointments (once the tool is live)

Each post targets one keyword and links to the plan or tools page.

## Protecting search rankings

The city pages and the homepage hold almost all of our search visibility, so every Direction A release follows these rules:

- No existing URL changes. New pages only add URLs.
- Homepage title and H1 keep "Web Design" plus New Jersey or Bergen County. The best local queries today are "web design fort lee nj" (position 6.8) and "seo company fort lee" (5.6).
- City and county pages: copy additions only, 1–3 sentences per section. No title, H1, heading or keyword changes; keep the Local SEO sections.
- Keep every internal link to the city pages and to `/services/web-development` and `/services/seo` (menu, homepage areas section, service area links).
- The plan page and the web development page target different searches, so they don't compete.
- Ship homepage title and description changes separately from H1 and body changes, so movement can be traced to one change.
- Ad pages are noindex and never linked, so they can't compete with city pages.
- Structured data prices always match visible prices.
- After each release: log it in the SEO changelog and on `/docs/seo`, list changed URLs (non-www) in the deployment summary, request re-indexing, watch Search Console for 2–4 weeks.
- `docs/planning/bergen-seo-todo.md` still says SEO retainers take priority over website builds. Mark it superseded so SEO work doesn't optimize the wrong page.

## Decisions that block site work

Most are already open in the Direction A tracker; the ones marked new came out of this audit.

| Decision | Blocks | In tracker |
| --- | --- | --- |
| Final plan prices | Pricing file, plan page, every price on the site, schema | Yes |
| Prepay discount: 10% / 15% or 5% / 10%; does it apply to add-ons and Tools-only? | Pricing toggle on every page | Yes (add-ons part is new) |
| Can ongoing SEO be bought without a website plan? | How `/services/seo` is framed; one FAQ | New |
| Keep the $800 SEO strategy setup? | SEO add-on pricing | New |
| Plan page slug: `website-plans` or `websites-with-tools` | Menu, redirects, ads | New |
| Publish the spread option on the site, or only explain it on calls? | Plan cards, FAQ | Yes |
| Site ownership and what happens if a client leaves | FAQ, blog ownership claims | Yes |
| Health data for care agencies | Care agency ad page, 360 case study, FAQ | Yes |
| Headshots: resell or refer | Whether a price shows | Yes |
| Is the NJCC2026 promo honored under plans? | Promo field, contact forms | New |
| Self-edit access for clients | Web development FAQ | New |
| Call tracking method | Ad pages, Google Ads setup | New |

## Order of work

This follows the plan tab's rollout: the plan page ships with Phase 2, and the ad pages only after the ads gate (2–3 plan clients, one tool live, tracking confirmed).

1. **Rebase on `main`.** Start every Direction A branch from the live code.
2. **Measurement (Phase 1, in parallel with tool building).** Key events, click IDs, API attribution and dashboard source, lead alert, GTM trigger and parameters, security policy for Google Ads, privacy page, internal traffic filter.
3. **Plan pricing file and pricing component**, once prices are final.
4. **Plan offer page** with the quote calculator demo, plan schema, sitemap entry, and the `/pricing` redirect repointed.
5. **Price and SEO copy everywhere it shows:** homepage services cards and FAQ, services pages, six city cost FAQs, FAQ page rewrite, pricing blog post.
6. **Proof:** case study changes, PVS dashboard case study, Domani as our product, verified testimonials, team photos.
7. **Contact form and call booking:** new fields (with the API), 20-minute call, response promises once the lead alert works.
8. **Tools-only and custom software pages.**
9. **Ads gate check.**
10. **Ad landing pages** (Phase 3): shell, two pages, short form, speed work including moving the dashboard styles.
11. **Homepage message, section order and menu**, one release at a time, watching Search Console after each.
12. **Blog** updates and new posts, then cleanup (unused components, styleguide).

Every release appends to `docs/deployment_summary.md` and the SEO changelog.
