# Audit Log - App - 2025-10-27 20:00:47

## Prompt Summary

User noted the Netlify domain options only show “Set primary domain” and “Go to DNS panel” and asked how to force HTTPS.

## Actions Taken

1. Clarified how Netlify handles HTTPS enforcement when a domain is set as primary.
2. Provided fallback instructions for enabling “Force TLS” in the HTTPS panel and, if needed, adding a `_redirects` file.

## Files Changed

- _None_

## Components/Features Affected

- Netlify hosting configuration (operational guidance only)

## Testing Considerations

- After configuring HTTPS enforcement, run `curl -I http://...` and `curl -I https://www...` to confirm 301 redirects.

## Performance Impact

- None.

## Next Steps

1. Use the HTTPS section in Netlify to confirm “Force TLS” is on.
2. Optionally add the `_redirects` rules in the repo if UI controls are unavailable.
3. Validate the fix in Google Search Console once redirects respond with 301.

## Notes

- Guidance only; no repository changes.

## Timestamp

Created: 2025-10-27 20:00:47
Page Section: root
