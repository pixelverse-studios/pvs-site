# Audit Log - App - 2025-10-30 10:32:09

## Prompt Summary

User requested that newly added blog posts automatically become the featured article and that the listing stay sorted newest to oldest.

## Actions Taken

1. Removed the manual `featured` flag from the existing dataset and simplified the featured post helper to always surface the most recent entry.
2. Confirmed the chronological sort still returns posts in descending order and recorded the change in the Bergen SEO tracker.

## Files Changed

- `data/blog-posts.ts` - Dropped the legacy `featured` flag and updated `getFeaturedBlogPost` to return the newest post.
- `docs/planning/bergen-seo-todo.md` - Logged the featured/ordering logic update for ongoing SEO documentation.

## Components/Features Affected

- Blog featured post selection
- Blog article ordering

## Testing Considerations

- Add a new post and verify it appears as the featured article and at the top of the Latest list.
- Regression check existing blog routes to ensure related posts still render without duplicates.

## Performance Impact

- None; helper logic only.
- SEO benefit from fresher content surfacing automatically.

## Next Steps

- Consider exposing a manual override if marketing wants to pin a specific story in the future.

## Notes

- Existing lint warning for `components/ui/structured-data.tsx` remains unsolved.

## Timestamp

Created: 2025-10-30 10:32:09
Page Section: blog
