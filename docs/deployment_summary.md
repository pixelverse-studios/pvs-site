# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- **Fixed dashboard data visibility issue** where client data wasn't showing in production but worked locally
- Implemented automatic API URL detection that uses the correct server URL based on environment (development vs production)
- Dashboard pages now automatically connect to the correct API server without manual configuration

## Notes for internal team
- Created new `lib/api-config.ts` that automatically detects environment and uses correct API URL
- Updated all API calls in dashboard pages and components to use dynamic configuration
- API URL configuration now automatically uses `http://localhost:5001` in development and `https://pvs-server-62hx7.ondigitalocean.app` in production
- No environment variable changes needed in production - the configuration is automatic
- The issue was caused by hardcoded `NEXT_PUBLIC_API_BASE_URL=http://localhost:5001` which only worked locally
- All 7 files using API calls have been updated to use the new dynamic configuration

## Changed URLs
- https://pixelversestudios.io/dashboard/clients
- https://pixelversestudios.io/dashboard/clients/[id]
- https://pixelversestudios.io/dashboard/clients/[id]/websites/[websiteId]
- https://pixelversestudios.io/contact
- https://pixelversestudios.io/audit
