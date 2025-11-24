# Audit Log - Client Actions Always Visible - 2025-11-23 15:21:17

## Prompt Summary

User reported that action buttons (View/Edit) in the client table were not visible by default and only showed up on hover. This was a UX issue that needed to be fixed to make actions always accessible.

## Actions Taken

1. Located the action buttons in the clients table component
2. Removed `opacity-0` and `group-hover:opacity-100` classes from both View and Edit buttons
3. Verified build compilation succeeded
4. Updated deploy summary

## Files Changed

- `app/dashboard/clients/components/clients-table.tsx` - Removed hover-only visibility from action buttons
- `docs/deploy-summary.md` - Updated with UX improvement
- `docs/audits/landing/2025-11-23-15-21-17-client-actions-always-visible.md` - This audit file

## Components/Features Affected

### Action Buttons (Desktop Table View):
- **Before**: Buttons had `className="opacity-0 transition-opacity group-hover:opacity-100"` making them invisible until row hover
- **After**: Buttons are always visible with standard ghost button styling

### UX Improvement:
- Users can now immediately see available actions without needing to discover hover behavior
- More accessible - no hidden functionality
- Better for touch devices where hover doesn't exist
- Clearer interface for internal tool (Phil & Sami)

## Testing Considerations

- [ ] Verify View and Edit buttons are visible on all client rows
- [ ] Confirm buttons are still styled correctly (ghost variant)
- [ ] Test on mobile/tablet (buttons always visible, no hover required)
- [ ] Verify buttons are still functional (clickable)
- [ ] Check spacing and alignment looks good

## Performance Impact

- **Bundle Size**: Reduced slightly by removing classes (~20 bytes)
- No performance concerns
- Actually improves perceived performance (no waiting for hover to reveal actions)

## Next Steps

- Mobile card view already shows buttons by default (no change needed there)
- Consider adding actual click handlers for View and Edit buttons
- May want to add tooltip hints on what each button does

## Notes

**Design Decisions:**
- Removed opacity animations entirely rather than just making buttons visible
- Kept ghost button variant for subtle, non-intrusive appearance
- Mobile card layout already had visible buttons, so only desktop table needed updating
- This improves accessibility and usability for an internal tool

**Why This Was Wrong Initially:**
- Hidden buttons on hover is a pattern for consumer apps with many actions
- For internal tools with just 2 actions, always showing them is better UX
- Phil and Sami don't need to "discover" actions through hover
- Touch devices (iPads) can't hover

## Timestamp

Created: 2025-11-23 15:21:17
Page Section: dashboard/clients
Feature Type: UX Improvement
