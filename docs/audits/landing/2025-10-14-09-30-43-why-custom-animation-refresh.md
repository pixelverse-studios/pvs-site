# Audit Log - App - 2025-10-14 09:30:43

## Prompt Summary

User requested a totally new animation treatment for the “Why Custom” cards because the previous fixes still resulted in double-triggering.

## Actions Taken

1. Replaced MotionSection/MotionItem usage for the card grid with a bespoke Framer Motion implementation.
2. Added `useInView`-driven card animations featuring a depthy flip/scale entrance and hover lift.
3. Ensured new animation delays cascade per card without relying on viewport observers that previously re-fired.

## Files Changed

- `components/about/why-custom-section.tsx` - Introduced the custom `WhyCustomCard` component, added variants, and rewired the card grid.

## Components/Features Affected

- About page “Why Custom” cards
- Animation utilities (card-level only)

## Testing Considerations

- Scroll the section in both themes to confirm cards animate once with the new motion.
- Verify hover lift and gradient glow remain smooth across browsers.
- Ensure mobile/touch interactions don’t trigger unintended replays.

## Performance Impact

- Minimal; single `useInView` observer per card.
- No bundle-size change.

## Next Steps

1. Evaluate whether other sections benefit from the new card animation pattern.
2. Capture updated motion QA clips for design review.

## Notes

- The new animation uses a 3D-style settle to differentiate from prior fades.

## Timestamp

Created: 2025-10-14 09:30:43
Page Section: why-custom
