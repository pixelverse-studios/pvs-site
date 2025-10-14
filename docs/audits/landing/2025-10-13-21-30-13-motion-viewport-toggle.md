# Audit Log - App - 2025-10-13 21:30:13

## Prompt Summary

Resolved global animation regression and Why Custom card flicker by refining MotionItem trigger logic.

## Actions Taken

1. Added a `triggerOnViewport` toggle to `MotionItem` so sections can opt out of per-item viewport observers.
2. Updated Why Custom card animations to rely on the parent MotionSection stagger while disabling individual viewport triggers.
3. Re-ran `npm run lint` to confirm project health.

## Files Changed

- `components/ui/motion-section.tsx` - Introduced configurable viewport triggering for MotionItem and restored hidden/visible variants safely.
- `components/about/why-custom-section.tsx` - Disabled per-card viewport triggers to prevent double-fire flicker.

## Components/Features Affected

- MotionItem animation primitive across the site
- About page Why Custom card grid stagger

## Testing Considerations

- Confirm animations render normally across the site now that default viewport triggering is restored.
- Scroll the Why Custom section to ensure cards animate once without flashing.
- Validate that reduced-motion preferences still suppress movement appropriately.

## Performance Impact

- Removes redundant IntersectionObservers for sections opting out, reducing main-thread overhead.
- No bundle size impact expected.
- Smoother animation prevents distracting flicker and improves perceived quality.

## Next Steps

- 1. Audit other nested MotionSection usages; apply `triggerOnViewport={false}` where stagger-only control is preferred.
- 2. Capture a quick video to verify animation parity across browsers/devices.

## Notes

`triggerOnViewport` defaults to true, so existing standalone MotionItem usage continues to behave as before.

## Timestamp

Created: 2025-10-13 21:30:13
Page Section: why-custom
