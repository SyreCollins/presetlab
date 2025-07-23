-- Create presets table
CREATE TABLE IF NOT EXISTS presets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    preset_name TEXT NOT NULL,
    description TEXT,
    preset_json JSONB NOT NULL,
    preset_type TEXT DEFAULT 'xmp' CHECK (preset_type IN ('xmp', 'cube')),
    category TEXT,
    downloads_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_presets_user_id ON presets(user_id);
CREATE INDEX IF NOT EXISTS idx_presets_created_at ON presets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_presets_preset_type ON presets(preset_type);

-- Add additional fields to users table if they don't exist
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS total_presets_created INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_downloads INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_plan TEXT DEFAULT 'free';

-- Create a function to update user stats when presets are added/removed
CREATE OR REPLACE FUNCTION update_user_preset_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE auth.users 
        SET total_presets_created = total_presets_created + 1
        WHERE id = NEW.user_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE auth.users 
        SET total_presets_created = GREATEST(total_presets_created - 1, 0)
        WHERE id = OLD.user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update user stats
DROP TRIGGER IF EXISTS trigger_update_user_preset_count ON presets;
CREATE TRIGGER trigger_update_user_preset_count
    AFTER INSERT OR DELETE ON presets
    FOR EACH ROW
    EXECUTE FUNCTION update_user_preset_count();

-- Enable RLS (Row Level Security)
ALTER TABLE presets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own presets" ON presets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own presets" ON presets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presets" ON presets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presets" ON presets
    FOR DELETE USING (auth.uid() = user_id);
