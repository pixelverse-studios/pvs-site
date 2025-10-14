# Audit Log - App - 2025-10-13 21:25:24

## Prompt Summary

Addressed persistent flash/retrigger behaviour in the About page Why Custom card animations.

## Actions Taken

1. Ensured `MotionItem` initializes in the hidden state without using its own viewport observer.
2. Applied an inline opacity fallback to prevent pre-animation flashes on initial paint.
3. Re-ran `npm run lint` to confirm code cleanliness.

## Files Changed

- `components/ui/motion-section.tsx` - Added `initial="hidden"` and fallback opacity styling to MotionItem while leaving animation control to the parent MotionSection.

## Components/Features Affected

- MotionItem animation primitive
- About page Why Custom cards and any MotionItem usage

## Testing Considerations

- Scroll into the Why Custom section to confirm cards fade/slide in once without flicker.
- Check other MotionItem consumers for expected behaviour post-adjustment.
- Validate reduced-motion preference still skips the animation gracefully.

## Performance Impact

- Negligible; only animation configuration adjustments.
- Removing duplicate viewport observers reduces potential layout thrash.
- Improved perceived stability by eliminating flicker.

## Next Steps

- 1. Re-test in production build or deployed preview to confirm parity outside dev mode.
- 2. Monitor for any sections requiring custom MotionItem overrides.

## Notes

Inline opacity acts as a safety net so content stays hidden until the parent variant runs.

## Timestamp

Created: 2025-10-13 21:25:24
Page Section: why-custom
