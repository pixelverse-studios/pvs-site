# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Added "Internal Projects" section to dashboard sidebar with Domani app management
- Reorganized sidebar navigation into logical sections with visual dividers
- Created Domani dashboard to view beta feedback and support requests
- Color-coded category badges (Bug, Feature, Love, General, Support)
- Platform indicators showing iOS or Android submissions
- Filter by category, status, platform, and source type
- Expandable rows to view full message and device details
- Status management (New, Reviewed, Resolved) with one-click updates
- Mobile-responsive card layout for smaller screens
- Added Domani overview page with summary statistics for feedback, waitlist, and users
- Created waitlist dashboard to view pre-launch signups with confirmation status
- Created users dashboard to view app users by tier (Free, Premium, Lifetime) and cohort
- Clickable stat cards link to detailed views for each data type
- Aligned feedback API client with server endpoint structure
- Added dedicated support requests API client for `/api/domani/support`
- Added sub-navigation tabs to Domani dashboard for easy section switching
- Added server-side pagination to all Domani tables with page size selector

## Notes for internal team

- PVS-214: Add server-side pagination to Domani tables
- PVS-215: Add sub-navigation tabs to Domani dashboard
- PVS-213: Add separate support requests API client
- PVS-212: Update feedback API client to use /api/domani/feedback endpoint
- PVS-205: Build Domani feedback dashboard view
- PVS-207: Add Waitlist types and API client
- PVS-208: Add Users types and API client
- PVS-209: Build Waitlist dashboard view
- PVS-210: Build Users dashboard view
- PVS-211: Add Domani overview page with summary stats
- Sidebar refactored to use section-based architecture (`NavSection[]`)
- Sections: Main navigation, Internal Projects, Coming Soon, Resources
- Visual dividers and section headers follow UX best practices
- Route structure updated:
  - `/dashboard/domani` - Overview with stat cards
  - `/dashboard/domani/feedback` - Feedback & support requests
  - `/dashboard/domani/waitlist` - Waitlist signups
  - `/dashboard/domani/users` - Active users
- Shared layout with sub-navigation tabs:
  - `app/dashboard/domani/layout.tsx` - Shared header and nav
  - `app/dashboard/domani/components/domani-nav.tsx` - Tab navigation
- Types added:
  - `lib/types/feedback.ts` - UnifiedFeedbackItem, FeedbackStatus
  - `lib/types/waitlist.ts` - WaitlistEntry, referral types
  - `lib/types/domani-users.ts` - UserProfile, UserTier, SignupCohort
- API clients added:
  - `lib/api/feedback.ts` - getFeedbackItems, updateFeedbackStatus
  - `lib/api/support.ts` - getSupportRequests, updateSupportStatus
  - `lib/api/waitlist.ts` - getWaitlistEntries
  - `lib/api/domani-users.ts` - getDomaniUsers
- API endpoints required on PVS server:
  - GET/PATCH `/api/domani/feedback`
  - GET/PATCH `/api/domani/support`
  - GET `/api/domani/waitlist`
  - GET `/api/domani/users`

## Changed URLs

- https://www.pixelversestudios.io/dashboard/domani
- https://www.pixelversestudios.io/dashboard/domani/feedback
- https://www.pixelversestudios.io/dashboard/domani/waitlist
- https://www.pixelversestudios.io/dashboard/domani/users
