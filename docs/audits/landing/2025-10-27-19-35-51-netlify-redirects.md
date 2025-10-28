# Audit Log - App - 2025-10-27 19:35:51

## Prompt Summary

User asked where to configure 301 redirects in Netlify so `http`/`www` variants route to the canonical HTTPS apex.

## Actions Taken

1. Outlined Netlify UI steps to designate the primary domain and enable automatic HTTPS redirects.
2. Provided optional `_redirects` file snippet for repository-level control.

## Files Changed

- _None_

## Components/Features Affected

- Domain redirect configuration (Netlify settings)

## Testing Considerations

- After updating Netlify settings or deploying `_redirects`, rerun `curl -I` on the variants to confirm 301 status.
- Validate the fix in Google Search Console once redirects are confirmed.

## Performance Impact

- None.

## Next Steps

1. Apply the Netlify configuration.
2. Deploy any `_redirects` file if using the repository approach.
3. Trigger “Validate Fix” in Search Console.

## Notes

- Guidance-only response; no code changes made.

## Timestamp

Created: 2025-10-27 19:35:51
Page Section: root
