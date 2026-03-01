# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Set footer to Split Panel layout (Layout B) with Google Maps, contact info, and social links
- Removed theme toggle and dark theme picker from navbar and site
- Fixed broken sitemap that was returning zero pages to search engine crawlers
- Switched to native Next.js sitemap generation for reliable compatibility
- All 51 site pages now properly listed in sitemap.xml with correct www domain

## Notes for internal team

- components/layout-wrapper.tsx: swapped FooterLayoutPicker for Footer with layout="b"
- app/layout.tsx + components/ui/navbar.tsx: removed DarkThemePicker and ThemeToggle
- Root cause: next-sitemap package incompatible with Next.js 15 App Router (empty prerender manifest)
- Replaced next-sitemap with native app/sitemap.ts and app/robots.ts
- Removed stale public/sitemap.xml, public/sitemap-0.xml, public/robots.txt
- Removed postbuild sitemap script from package.json
- Domain corrected from pixelversestudios.io to www.pixelversestudios.io in sitemap and robots

## Changed URLs

- https://www.pixelversestudios.io/
- https://www.pixelversestudios.io/sitemap.xml
- https://www.pixelversestudios.io/robots.txt
