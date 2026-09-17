# Deferred read-only dashboard navigation audit

Requested 2026-09-17. Start after the current paired Domani feedback foundation PR work is finished; do not expand the current implementation into a performance audit.

User observation: navigating from Feedback to Releases took approximately three seconds before the new content appeared. Similar delays occur throughout the dashboard.

Audit scope: measure representative tab/page transitions in a production build as well as local development, separate cold compilation from warm navigation, and trace request waterfalls, authentication round trips, server-rendered fetches, prefetch behavior, loading boundaries and render/bundle costs. Report evidence and prioritized recommendations without changing application code or production configuration. Do not assume removing the feedback proxy fixes general navigation latency.
