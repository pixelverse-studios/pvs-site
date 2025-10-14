# Audit Log - App - 2025-10-13 21:32:06

## Prompt Summary

Restored card visibility while keeping the Why Custom animation from double-triggering.

## Actions Taken

1. Refined `MotionItem` to only attach viewport observers when explicitly enabled.
2. Ensured default motion behaviour mirrors previous site-wide animations.
3. Ran `npm run lint` to confirm no lint errors.

## Files Changed

- `components/ui/motion-section.tsx` - Guarded viewport props behind a flag so parent-driven animations work without hiding content.

## Components/Features Affected

- MotionItem primitive
- Any grid using staggered MotionSection sequences, including About → Why Custom cards

## Testing Considerations

- Reload the About page and verify cards render/animate once when scrolled into view.
- Confirm other sections (hero, services, etc.) still animate on viewport entry.
- Check reduced-motion preference for correct fallback.

## Performance Impact

- Eliminated excess IntersectionObserver registrations where not needed.
- No measurable bundle impact.
- Prevents hidden content states that could hurt UX or CLS.

## Next Steps

- 1. Validate across browsers/devices to make sure animation timing feels consistent.
- 2. Consider extracting a Storybook example to lock the expected behaviour.

## Notes

`triggerOnViewport` now defaults to true but leaves MotionItem free of observers when set to false, letting parent staggering drive the reveal.

## Timestamp

Created: 2025-10-13 21:32:06
Page Section: why-custom
