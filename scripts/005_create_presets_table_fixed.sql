-- Create presets table
CREATE TABLE IF NOT EXISTS public.presets (
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
CREATE INDEX IF NOT EXISTS idx_presets_user_id ON public.presets(user_id);
CREATE INDEX IF NOT EXISTS idx_presets_created_at ON public.presets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_presets_preset_type ON public.presets(preset_type);

-- Update the existing users table to add the new fields if they don't exist
DO $$ 
BEGIN
    -- Add total_presets_created column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'total_presets_created') THEN
        ALTER TABLE public.users ADD COLUMN total_presets_created INTEGER DEFAULT 0;
    END IF;
    
    -- Add total_downloads column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'total_downloads') THEN
        ALTER TABLE public.users ADD COLUMN total_downloads INTEGER DEFAULT 0;
    END IF;
    
    -- Add current_plan column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'current_plan') THEN
        ALTER TABLE public.users ADD COLUMN current_plan TEXT DEFAULT 'free';
    END IF;
END $$;

-- Create a function to update user stats when presets are added/removed
CREATE OR REPLACE FUNCTION public.update_user_preset_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.users 
        SET total_presets_created = total_presets_created + 1
        WHERE id = NEW.user_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.users 
        SET total_presets_created = GREATEST(total_presets_created - 1, 0)
        WHERE id = OLD.user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to automatically update user stats
DROP TRIGGER IF EXISTS trigger_update_user_preset_count ON public.presets;
CREATE TRIGGER trigger_update_user_preset_count
    AFTER INSERT OR DELETE ON public.presets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_preset_count();

-- Enable RLS (Row Level Security)
ALTER TABLE public.presets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own presets" ON public.presets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own presets" ON public.presets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presets" ON public.presets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presets" ON public.presets
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger for presets
CREATE TRIGGER update_presets_updated_at 
    BEFORE UPDATE ON public.presets
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();
