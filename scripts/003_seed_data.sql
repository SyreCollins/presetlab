-- Seed data for development and testing

-- Insert a test user
INSERT INTO users (
  id,
  email,
  name,
  first_name,
  last_name,
  total_presets_created,
  total_downloads,
  email_verified_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'john.doe@example.com',
  'John Doe',
  'John',
  'Doe',
  24,
  156,
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert subscription for test user
INSERT INTO subscriptions (
  user_id,
  plan_type,
  status,
  billing_cycle,
  amount_cents,
  current_period_start,
  current_period_end
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'pro',
  'active',
  'monthly',
  4900,
  date_trunc('month', CURRENT_DATE),
  date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day'
) ON CONFLICT DO NOTHING;

-- Insert affiliate program for test user
INSERT INTO affiliate_programs (
  user_id,
  referral_code,
  total_signups,
  total_conversions,
  total_earnings_cents,
  pending_earnings_cents,
  paid_earnings_cents
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'johndoe123',
  47,
  23,
  124750,
  32500,
  92250
) ON CONFLICT (referral_code) DO NOTHING;

-- Insert sample presets
INSERT INTO presets (
  user_id,
  name,
  description,
  preset_type,
  category,
  style_prompt,
  file_url,
  downloads_count,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Cinematic Warm',
  'Warm tones with enhanced contrast',
  'xmp',
  'Cinematic',
  'warm cinematic look with soft highlights and rich shadows',
  '/presets/cinematic-warm.xmp',
  12,
  NOW() - interval '2 hours'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Moody Vintage',
  'Desaturated colors with film grain',
  'cube',
  'Vintage',
  'moody vintage film look with desaturated colors',
  '/presets/moody-vintage.cube',
  8,
  NOW() - interval '1 day'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Bright Summer',
  'Vibrant and airy summer vibes',
  'xmp',
  'Bright',
  'bright airy summer look with vibrant colors',
  '/presets/bright-summer.xmp',
  15,
  NOW() - interval '3 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Film Noir',
  'High contrast black and white',
  'cube',
  'Dramatic',
  'high contrast black and white film noir style',
  '/presets/film-noir.cube',
  6,
  NOW() - interval '5 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Golden Hour',
  'Warm golden light enhancement',
  'xmp',
  'Golden',
  'golden hour warm light with soft glow',
  '/presets/golden-hour.xmp',
  22,
  NOW() - interval '1 week'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Cyberpunk',
  'Neon colors and high saturation',
  'cube',
  'Futuristic',
  'cyberpunk neon colors with high saturation',
  '/presets/cyberpunk.cube',
  18,
  NOW() - interval '10 days'
)
ON CONFLICT DO NOTHING;

-- Insert usage tracking data
INSERT INTO usage_tracking (
  user_id,
  action_type,
  billing_period_start,
  billing_period_end
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440000',
  'preset_generation',
  date_trunc('month', CURRENT_DATE)::date,
  (date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day')::date
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'preset_generation',
  date_trunc('month', CURRENT_DATE)::date,
  (date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day')::date
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'preset_generation',
  date_trunc('month', CURRENT_DATE)::date,
  (date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day')::date
)
ON CONFLICT DO NOTHING;

-- Insert sample affiliate referrals
INSERT INTO affiliate_referrals (
  affiliate_user_id,
  referral_code,
  status,
  commission_cents,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440000',
  'johndoe123',
  'paid',
  2500,
  NOW() - interval '1 day'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'johndoe123',
  'converted',
  2500,
  NOW() - interval '2 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'johndoe123',
  'signed_up',
  0,
  NOW() - interval '3 days'
)
ON CONFLICT DO NOTHING;
