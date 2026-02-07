# Cold Email Outreach Plan for PixelVerse Studios

## Overview

This guide outlines a complete cold email outreach strategy for reaching 100 local small business prospects. The plan prioritizes deliverability, compliance, and ROI while staying within a $20-50/month budget.

---

## Part 1: Domain & Infrastructure Setup

### Why You Need a Secondary Domain

Your primary domain (pixelversestudios.io) should NEVER be used for cold outreach. If cold emails trigger spam complaints or get blacklisted, it will affect ALL emails from that domain—including client communications, invoices, and contracts.

### Recommended Secondary Domains

Choose one or two:

- getpixelverse.com
- trypixelverse.com
- pixelversestudios.co
- hipixelverse.com

**Cost:** $12-18/year per domain

### Domain Setup Checklist

**Week 1: Purchase & Age**

- [ ] Buy secondary domain from Namecheap, Cloudflare, or Squarespace Domains
- [ ] Set up 301 redirect to pixelversestudios.io
- [ ] Let domain "age" for 2 weeks before adding email (fresh domains raise spam flags)

**Week 2: Email Infrastructure**

- [ ] Create NEW Google Workspace account (separate from primary, $7/user/month)
- [ ] Add 2 email accounts using real names:
  - phil@getpixelverse.com
  - sami@getpixelverse.com
- [ ] Avoid generic addresses like sales@ or info@

**Week 2-3: DNS Authentication**

These three records are mandatory for cold email in 2026.

**SPF Record (add immediately):**
```
Type: TXT
Host: @
Value: v=spf1 include:_spf.google.com ~all
```

**DKIM Record (generate in Google Workspace Admin):**
```
Type: TXT
Host: google._domainkey
Value: [Generated key from Google Workspace]
```

**DMARC Record (add 48 hours after SPF/DKIM):**
```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@getpixelverse.com
```

**Verification:**
- Use MXToolbox.com to verify all records
- Use mail-tester.com to check deliverability score (aim for 9+/10)

---

## Part 2: Email Warmup

### Why Warmup Matters

New email accounts have zero reputation. Sending cold emails immediately will land you straight in spam. Warmup builds trust with email providers over time.

### Warmup Schedule

| Week | Emails/Day | Activity |
|------|------------|----------|
| 1 | 5-10 | Warmup tool only |
| 2 | 10-20 | Warmup tool only |
| 3 | 20-30 | Begin light outreach |
| 4+ | 30-50 | Scale outreach gradually |

**Minimum warmup period:** 2-3 weeks
**Recommended warmup period:** 4 weeks

### Warmup Tools

| Tool | Cost | Notes |
|------|------|-------|
| Instantly | Included with $30/mo plan | Unlimited accounts |
| Lemwarm | $25/inbox/month | Premium quality |
| Apollo.io | Free tier available | Basic warmup |

### Warmup Best Practices

- Never stop warmup—continue alongside campaigns
- Monitor deliverability score daily (aim for 90+)
- Don't rush—patience here prevents blacklisting later

---

## Part 3: Tool Recommendations

### For Your Budget ($20-50/month)

**Option 1: Start Free**

| Tool | Cost | What You Get |
|------|------|--------------|
| Apollo.io Free | $0 | 100 contacts/month, 2 sequences, prospect database |

Best for: Testing your messaging before spending money

**Option 2: Budget Stack (~$45/month)**

| Tool | Cost | What You Get |
|------|------|--------------|
| Google Workspace | $14/mo | 2 email accounts |
| Instantly | $30/mo | Unlimited warmup, sequences, sending |

Best for: Ready to run real campaigns

**Option 3: Best Value (~$40/month)**

| Tool | Cost | What You Get |
|------|------|--------------|
| Google Workspace | $14/mo | 2 email accounts |
| Saleshandy | $25/mo | 2,000 prospects, 6,000 emails, warmup for 5 accounts |

Best for: Scaling beyond 100 contacts

### Tool Comparison

| Feature | Apollo Free | Saleshandy | Instantly |
|---------|-------------|------------|-----------|
| Price | $0 | $25/mo | $30/mo |
| Contacts | 100/mo | 2,000 | 1,000 |
| Email accounts | 1 | Unlimited | Unlimited |
| Warmup | Basic | 5 accounts | Unlimited |
| Sequences | 2 | Unlimited | Unlimited |
| Best for | Testing | Value | Scale |

---

## Part 4: Email Copy Guidelines

### General Rules

- **Length:** Under 80 words
- **Structure:** One problem, one solution, one CTA
- **Tone:** Helpful, not salesy
- **Format:** Plain text (no heavy HTML or images)

### Email Structure

```
[Personalized opening - 1 sentence showing you researched them]

[Specific problem you noticed on their website]

[What fixing it could mean for their business]

[One clear call-to-action]

[Signature with physical address and opt-out]
```

### Subject Lines That Work

**Effective examples:**
- Quick question about [Business Name]'s website
- [First Name], noticed something on [Company] site
- 3-second issue I spotted on your homepage
- Your [City] competitors are doing this differently
- [Business Name] mobile experience - quick thought

**What to avoid:**
- FREE, GUARANTEED, ACT NOW (spam triggers)
- ALL CAPS
- Multiple exclamation marks!!!
- Fake "Re:" or "Fwd:" prefixes
- Vague lines like "Great opportunity"

### Personalization That Matters

Spend 10-15 minutes researching each prospect:

**Check their website for:**
- Page load speed (use PageSpeed Insights)
- Mobile responsiveness issues
- Outdated design elements
- Missing contact info or broken links
- SEO gaps (missing meta descriptions)

**Check their business for:**
- Recent Google reviews (especially complaints)
- Social media activity
- Local news mentions
- How they compare to competitors

**Use what you find in your opening line:**
- "I noticed your Google reviews mention customers have trouble finding your hours on the website..."
- "While looking up [service] in [City], I noticed [Competitor] shows up first—their site has some advantages we could help you match..."
- "Saw your recent post about expanding to [area]. Your site might need some updates to capture that new traffic..."

---

## Part 5: Email Templates

### Template 1: Initial Outreach

**Subject:** Quick question about [Business Name]'s website

```
Hi [First Name],

I was looking at [Business Name]'s website and noticed it takes about 4 seconds to load on mobile. For local [industry] businesses, that typically means losing 40% of visitors before they even see your services.

We recently helped a [similar business type] in [nearby city] cut their load time in half, which led to a 35% increase in contact form submissions.

Would a 15-minute call next week make sense to see if we could do something similar for you?

Phil
PixelVerse Studios
[Your Address]

Reply "stop" to opt out of future emails.
```

### Template 2: Follow-Up #1 (Day 3)

**Subject:** Re: Quick question about [Business Name]'s website

```
Hi [First Name],

Wanted to make sure my note didn't get buried. Did the website speed issue I mentioned resonate?

Happy to share what we did for [similar business] if it would be helpful.

Phil
```

### Template 3: Follow-Up #2 (Day 7)

**Subject:** Re: Quick question about [Business Name]'s website

```
Hi [First Name],

Thought you might find this relevant—we helped [Local Business Type] in [Nearby City] increase their leads by 47% after updating their website.

Here's what we focused on:
- Cut page load time from 5 seconds to under 2
- Made the contact form mobile-friendly
- Added click-to-call buttons

Worth a quick conversation to see if any of this applies to [Business Name]?

Phil
```

### Template 4: Follow-Up #3 (Day 14)

**Subject:** Free 5-minute video for [Business Name]

```
Hi [First Name],

I know website projects can feel overwhelming. Would a free 5-minute video walkthrough of your current site be helpful?

I can record a quick screen share highlighting the top 3 things holding back your [City] visibility—no strings attached.

Just reply "yes" and I'll send it over.

Phil
```

### Template 5: Breakup Email (Day 25)

**Subject:** Should I close your file?

```
Hi [First Name],

I'll assume the timing isn't right and won't keep filling your inbox.

If your website becomes a priority down the road, feel free to reply to this thread. I'm happy to help whenever it makes sense.

All the best with [Business Name].

Phil
```

---

## Part 6: Sequence Timing

### Recommended Schedule

| Email | Day | Purpose |
|-------|-----|---------|
| Initial outreach | Day 0 | Introduce yourself, highlight specific problem |
| Follow-up #1 | Day 3 | Short bump, reference original email |
| Follow-up #2 | Day 7 | Add value with case study or results |
| Follow-up #3 | Day 14 | Different angle, offer free audit/video |
| Breakup email | Day 25 | Final attempt, leave door open |

### Best Days and Times

- **Best days:** Tuesday and Wednesday
- **Best times:** 7-11 AM local time (10 AM peak)
- **Avoid:** Mondays (inbox overload) and Fridays (checked out)

---

## Part 7: Compliance (CAN-SPAM)

### Required in Every Email

1. **Accurate "From" name** - Must represent your business
2. **Non-deceptive subject line** - Must reflect email content
3. **Physical address** - Your valid business address
4. **Opt-out mechanism** - Clear way to unsubscribe
5. **Honor opt-outs** - Process within 24 hours

### What's Legal

B2B cold email is legal under CAN-SPAM as long as you follow the rules above. You do NOT need prior consent to email businesses.

### What to Avoid

- Purchased or scraped email lists
- Misleading subject lines
- Missing opt-out option
- Ignoring unsubscribe requests
- Sending to personal emails without consent

### Penalties

Up to $53,088 per violation. Take compliance seriously.

---

## Part 8: Metrics & Expectations

### Realistic Benchmarks

| Metric | Average | Good | Excellent |
|--------|---------|------|-----------|
| Open rate | 30-40% | 40-50% | 50%+ |
| Reply rate | 3-4% | 5-8% | 10%+ |
| Bounce rate | <2% | <1% | <0.5% |
| Spam complaints | <0.1% | <0.05% | 0% |

### What This Means for 100 Prospects

With good execution (5-8% reply rate):
- 5-8 replies from your list
- 2-4 positive responses
- 1-2 meetings booked
- Potential: 1 new client

### Red Flags to Watch

Stop campaigns immediately if you see:
- Bounce rate over 3%
- Spam complaint rate over 0.1%
- Open rate below 10%
- Deliverability score dropping

---

## Part 9: Implementation Timeline

### Month 1: Setup (No Outreach Yet)

**Week 1:**
- [ ] Purchase secondary domain
- [ ] Set up domain redirect
- [ ] Let domain age

**Week 2:**
- [ ] Create Google Workspace account
- [ ] Set up 2 email addresses
- [ ] Configure SPF and DKIM records

**Week 3:**
- [ ] Add DMARC record
- [ ] Verify all DNS with MXToolbox
- [ ] Sign up for warmup tool
- [ ] Begin warmup process

**Week 4:**
- [ ] Continue warmup
- [ ] Build/clean prospect list
- [ ] Write email templates
- [ ] Set up sequences in chosen tool

### Month 2: Launch

**Week 5:**
- [ ] Verify deliverability score is 90+
- [ ] Send first batch (20-30 prospects)
- [ ] Monitor open rates and bounces

**Week 6-8:**
- [ ] Scale to remaining prospects
- [ ] Monitor reply rates
- [ ] Respond to replies within 24 hours
- [ ] A/B test subject lines

### Month 3+: Optimize

- [ ] Review what's working
- [ ] Refine templates based on responses
- [ ] Expand prospect list
- [ ] Consider scaling budget/tools

---

## Part 10: Total Cost Summary

### Lean Budget (~$22/month)

| Item | Cost |
|------|------|
| Secondary domain | $1.50/mo |
| Google Workspace (2 users) | $14/mo |
| Apollo.io Free | $0 |
| Manual warmup | $0 |
| **Total** | **~$22/month** |

### Recommended Budget (~$45/month)

| Item | Cost |
|------|------|
| Secondary domain | $1.50/mo |
| Google Workspace (2 users) | $14/mo |
| Instantly (warmup + sequences) | $30/mo |
| **Total** | **~$45/month** |

### Full Setup Cost (One-Time)

| Item | Cost |
|------|------|
| Domain registration | $12-18 |
| First month tools | $22-45 |
| **Total to start** | **$35-65** |

---

## Quick Reference Checklist

### Before Sending Any Emails

- [ ] Secondary domain purchased and aged 2+ weeks
- [ ] Google Workspace set up with real name accounts
- [ ] SPF, DKIM, DMARC all configured and verified
- [ ] Email warmup completed (minimum 2 weeks)
- [ ] Deliverability score 90+ on mail-tester.com
- [ ] Prospect list cleaned and verified
- [ ] Templates written with personalization placeholders
- [ ] Physical address in signature
- [ ] Opt-out mechanism in place

### For Each Campaign

- [ ] Personalize opening line for each prospect
- [ ] Keep emails under 80 words
- [ ] Use single, clear CTA
- [ ] Schedule 4-5 email sequence
- [ ] Set appropriate delays between emails
- [ ] Monitor metrics daily for first week

### Ongoing Maintenance

- [ ] Continue warmup alongside campaigns
- [ ] Honor opt-outs within 24 hours
- [ ] Check blacklist status monthly (MXToolbox)
- [ ] Review and clean bounce list weekly
- [ ] Refine templates based on reply data
