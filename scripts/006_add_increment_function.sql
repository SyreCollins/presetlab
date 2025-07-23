-- Create function to increment user downloads
CREATE OR REPLACE FUNCTION public.increment_user_downloads(user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.users 
    SET total_downloads = total_downloads + 1
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
