# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- **Added authenticated dashboard link to navbar** - Team members signed in via Google can now access the dashboard directly from the main navigation
- **Dashboard icon appears only when logged in** - The icon automatically shows/hides based on authentication status with a smooth fade animation
- **Works on both desktop and mobile** - Desktop shows an icon with tooltip; mobile shows full "Dashboard" link in the hamburger menu
- **Fixed navbar visibility during navigation** - Navbar now correctly shows/hides when navigating between dashboard and public pages without requiring a page refresh

## Notes for internal team
- Created new `components/ui/auth-dashboard-link.tsx` component with real-time Supabase auth state subscription
- Updated `components/ui/navbar.tsx` to include AuthDashboardLink in both desktop and mobile views
- Uses LayoutDashboard icon from Lucide (consistent with dashboard sidebar)
- Includes tooltip on hover, gradient active state when on dashboard pages
- Uses `animate-in fade-in` for smooth appearance transitions
- **Bug fix**: Moved navbar visibility logic from server component to client component (`components/layout-wrapper.tsx`) to handle client-side navigation properly
- Bonus: Many pages now statically generate instead of being server-rendered (performance improvement)

## Changed URLs
- https://www.pixelversestudios.io/ (all pages with public navbar)
- https://www.pixelversestudios.io/dashboard (and all dashboard sub-pages)
