-- Add rating column to presets table for user feedback
ALTER TABLE presets 
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);

-- Add index for better performance on rating queries
CREATE INDEX IF NOT EXISTS idx_presets_rating ON presets(rating) WHERE rating IS NOT NULL;

-- Add some sample ratings to existing presets for demo purposes
UPDATE presets 
SET rating = CASE 
  WHEN RANDOM() > 0.8 THEN 5
  WHEN RANDOM() > 0.6 THEN 4
  WHEN RANDOM() > 0.3 THEN 5
  ELSE 4
END
WHERE rating IS NULL AND id IN (SELECT id FROM presets ORDER BY RANDOM() LIMIT 10);
