-- Migration: Add SEO Focus to Websites Table
-- Run this in Supabase SQL Editor

-- Add seo_focus JSONB column to websites table
ALTER TABLE websites
ADD COLUMN IF NOT EXISTS seo_focus JSONB DEFAULT NULL;

-- Add a comment describing the column
COMMENT ON COLUMN websites.seo_focus IS 'SEO focus tracking data including primary/secondary cities and target keywords';

-- Example of the expected JSON structure:
/*
{
  "strategy": "Focus → Dominate → Expand",
  "goal": "Rank page 1 for 5 priority cities within 3-6 months",
  "primaryCities": [
    {
      "rank": 1,
      "city": "Fort Lee",
      "state": "NJ",
      "slug": "fort-lee",
      "currentPosition": 10.47,
      "population": "~40K",
      "whyPriority": "1 position from page 1 - highest momentum",
      "targetKeywords": [
        {
          "keyword": "web design Fort Lee NJ",
          "currentPosition": 10,
          "targetPosition": 3,
          "priority": "high"
        }
      ]
    }
  ],
  "secondaryCities": [
    {
      "rank": 6,
      "city": "Teaneck",
      "state": "NJ",
      "slug": "teaneck",
      "currentPosition": 16.5,
      "population": "~40K",
      "whyPriority": "Page already exists, needs optimization after Phase 1",
      "targetKeywords": []
    }
  ],
  "countyKeywords": [
    {
      "keyword": "website analytics agency Bergen County NJ",
      "currentPosition": 22,
      "targetPosition": 5,
      "priority": "medium"
    }
  ],
  "lastUpdated": "2025-12-01"
}
*/

-- Optional: Create an index for faster JSON queries if needed
-- CREATE INDEX IF NOT EXISTS idx_websites_seo_focus ON websites USING GIN (seo_focus);
