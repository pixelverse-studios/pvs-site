# Deploy Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Added Google sign-in authentication for team dashboard access at /login (hidden from public navigation)
- Updated workflow instructions in CLAUDE.md to ensure deploy summaries are maintained and reset after each build

## Notes for internal team
- Fixed environment variable configuration (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY now properly set)
- Created comprehensive Google OAuth setup guide: docs/technical/google-oauth-setup-guide.md
- Created SQL script to restrict dashboard access to Phil and Sami only: docs/technical/restrict-dashboard-access.sql
- Dashboard is at /dashboard (currently a simple placeholder)
- See docs/technical/google-oauth-setup-guide.md for complete setup instructions
