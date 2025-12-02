# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- **Enhanced deployment tracking** with three-state indexing workflow: Pending, Requested, and Indexed
- Deployment cards now show distinct status colors for each stage of the GSC indexing process
- Added **"Request All"** button to mark all URLs as submitted to Google Search Console
- Added **"Copy URLs"** button to easily copy pending URLs for GSC submission
- Filter bar now includes four options: All, Pending, Requested, and Indexed
- Each URL shows its individual indexing status with timestamps for when it was requested and indexed

## Notes for internal team
- Database migration adds `indexing_status` column (pending/requested/indexed) and `indexing_requested_at` timestamp
- API endpoints updated: `PATCH /api/deployments/:id/status` and `PATCH /api/deployments/:id/urls/status`
- Old deployments automatically normalized: `indexed_at` set = 'indexed', else 'pending'
- Status progression is one-way only: pending → requested → indexed

## Changed URLs
- https://www.pixelversestudios.io/dashboard
