# Audit Log - App - 2025-10-14 09:23:32

## Prompt Summary

User reported that the “Why Custom” cards (bright bordered tiles) were animating twice when scrolled into view.

## Actions Taken

1. Reviewed the motion utilities and noticed nested `MotionSection` components were each binding to viewport events.
2. Added a `triggerOnViewport` flag to `MotionSection` so nested sections can rely on parent animation state without new observers.
3. Disabled the inner section’s viewport trigger within `components/about/why-custom-section.tsx`.

## Files Changed

- `components/ui/motion-section.tsx` - Added `triggerOnViewport` prop and conditional viewport behavior.
- `components/about/why-custom-section.tsx` - Set the inner grid section to rely on parent motion control.

## Components/Features Affected

- Motion utility (global)
- About page “Why Custom” cards

## Testing Considerations

- Scroll the About page section and verify cards animate only once.
- Confirm other sections using `MotionSection` still animate (default remains viewport-driven).
- Check mobile viewport to ensure stagger timing remains intact.

## Performance Impact

- Reduced redundant viewport observers, negligible runtime difference.
- No bundle-size changes.

## Next Steps

1. Spot-check other nested `MotionSection` usages to see if they benefit from the new prop.
2. Record animation QA for motion regression tracking.

## Notes

- `triggerOnViewport` defaults to true, so existing sections keep current behavior unless overridden.

## Timestamp

Created: 2025-10-14 09:23:32
Page Section: why-custom
