-- Function to increment user's total_presets_created count
CREATE OR REPLACE FUNCTION increment_user_presets_count(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET total_presets_created = total_presets_created + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment user's total_downloads count
CREATE OR REPLACE FUNCTION increment_user_downloads_count(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET total_downloads = total_downloads + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment preset's downloads_count
CREATE OR REPLACE FUNCTION increment_preset_downloads_count(preset_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.presets
  SET downloads_count = downloads_count + 1
  WHERE id = preset_id;
END;
$$ LANGUAGE plpgsql;