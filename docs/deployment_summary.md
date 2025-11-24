# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Added automated deployment tracking system with Git pre-push hooks
- Deployment notifications now automatically send to team via email when code is pushed
- Email includes deployment summary and list of URLs that need Google Search Console re-indexing
- Fixed production build errors (ESLint issues and React hooks warnings)

## Notes for internal team
- Created new deployment tracking workflow with Git hooks
- Added `scripts/pre-push.js` - Node.js script that runs on git push
- Added `scripts/install-hooks.js` - One-time installer for Git hooks
- Updated CLAUDE.md with complete deployment_summary.md workflow documentation
- Added environment variables: PVS_WEBSITE_ID, PVS_API_URL, PVS_BASE_URL
- Git hook automatically reads deployment_summary.md, sends to API, and resets file
- Removed console.log statements causing build errors (kept console.error for debugging)
- Fixed React useCallback dependency warning in deployments-section.tsx
- Fixed unescaped apostrophe in websites-list.tsx

## Changed URLs
- https://www.pixelversestudios.io/dashboard/clients
- https://www.pixelversestudios.io/dashboard/clients/[id]/websites/[websiteId]
