# Audit Log - App - 2025-10-14 09:48:48

## Prompt Summary

Runtime error surfaced noting that `useRef` can only be used inside Client Components for the “Why Custom” section.

## Actions Taken

1. Added the `'use client';` directive to `components/about/why-custom-section.tsx` so React hooks are valid in the file.

## Files Changed

- `components/about/why-custom-section.tsx` - Marked as a client component.

## Components/Features Affected

- About page “Why Custom” section.

## Testing Considerations

- Reload the page to ensure the `useRef/useInView` animation runs without Next.js hook errors.
- Confirm there are no hydration warnings after the change.

## Performance Impact

- None; directive only changes compilation mode.

## Next Steps

1. Audit other components using client-only hooks to confirm they are flagged appropriately.

## Notes

- Directive required because section now leverages `useInView` and `useRef`.

## Timestamp

Created: 2025-10-14 09:48:48
Page Section: why-custom
