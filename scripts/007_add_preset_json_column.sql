-- Add JSON column to store preset data directly in database
-- This eliminates the need for file storage

ALTER TABLE public.presets 
ADD COLUMN preset_data JSONB;

-- Add index for better JSON query performance
CREATE INDEX idx_presets_preset_data ON public.presets USING GIN (preset_data);

-- Update existing presets to have empty JSON if needed
UPDATE public.presets 
SET preset_data = '{}'::jsonb 
WHERE preset_data IS NULL;