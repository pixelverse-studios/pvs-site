# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- **Dashboard deployment logs**: "Mark Indexed" now updates instantly without page refresh
- Clicking "Mark Indexed" or "Mark All as Indexed" immediately shows the URL as indexed
- API calls happen silently in the background

## Notes for internal team
- Implemented optimistic UI updates for deployment URL indexing
- Changed callback signature from `onUrlMarked()` to `onMarkedIndexed(deploymentId, url?)`
- Local state updates immediately; API call runs in background
- Error handling shows message but doesn't revert optimistic update (acceptable trade-off)

## Changed URLs
- https://www.pixelversestudios.io/dashboard
