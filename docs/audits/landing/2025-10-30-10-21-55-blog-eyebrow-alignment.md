# Audit Log - App - 2025-10-30 10:21:55

## Prompt Summary

User requested fixing the eyebrow styling on the blog’s latest posts section so it follows the standard pill treatment instead of stretching full width.

## Actions Taken

1. Updated the shared `SectionHeader` component to align items to the start by default, preventing eyebrow pills from stretching across the container.
2. Confirmed the component still centers correctly when the optional `align="center"` prop is used.
3. Logged the change in the Bergen SEO planning tracker.

## Files Changed

- `components/ui/section-header.tsx` - Set the base flex alignment to `items-start` so eyebrow badges hug their content by default.
- `docs/planning/bergen-seo-todo.md` - Recorded the eyebrow alignment fix for future reference.

## Components/Features Affected

- Section headers across the marketing site
- Blog latest posts section eyebrow styling

## Testing Considerations

- Review pages using `SectionHeader` in both left and center alignments to ensure spacing remains consistent.
- Verify dark and light theme rendering of eyebrow pills.

## Performance Impact

- None; alignment change only.
- SEO unaffected.

## Next Steps

- If future variants need right alignment, extend the component API with an appropriate option.

## Notes

- Existing lint warning for `components/ui/structured-data.tsx` remains unresolved.

## Timestamp

Created: 2025-10-30 10:21:55
Page Section: blog
