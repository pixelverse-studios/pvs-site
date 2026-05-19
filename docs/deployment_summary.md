# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Fixed a contact-form tracking error that could fire when visitors interacted with form fields while SiteBehaviour analytics was active.

## Notes for internal team
- Renamed internal React Hook Form fields from `name` to `fullName` on contact forms while preserving the outbound API payload key as `name`, avoiding browser `form.name` clobbering in third-party tracking scripts.

## Changed URLs
- https://www.pixelversestudios.io/contact/details
- https://www.pixelversestudios.io/contact/review
