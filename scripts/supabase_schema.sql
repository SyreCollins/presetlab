-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE plan_type AS ENUM ('free', 'starter', 'pro');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');
CREATE TYPE billing_cycle AS ENUM ('monthly', 'yearly');
CREATE TYPE preset_type AS ENUM ('xmp', 'cube');
CREATE TYPE processing_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
CREATE TYPE referral_status AS ENUM ('clicked', 'signed_up', 'converted', 'paid');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Profile info
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  
  -- Preferences
  notification_preset_complete BOOLEAN DEFAULT true,
  notification_weekly_summary BOOLEAN DEFAULT true,
  notification_marketing BOOLEAN DEFAULT false,
  
  -- Stats
  total_presets_created INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  
  -- Metadata
  last_login_at TIMESTAMP WITH TIME ZONE,
  email_verified_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Subscription details
  plan_type plan_type NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',
  
  -- Billing
  billing_cycle billing_cycle,
  amount_cents INTEGER,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Dates
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  
  -- External IDs
  polar_subscription_id VARCHAR(255) UNIQUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Presets table
CREATE TABLE public.presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Preset details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  preset_type preset_type NOT NULL,
  category VARCHAR(50),
  
  -- Style information
  style_prompt TEXT NOT NULL,
  
  -- File storage
  file_url TEXT NOT NULL,
  file_size_bytes INTEGER,
  original_media_url TEXT,
  preview_image_url TEXT,
  
  -- Metadata
  downloads_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  
  -- Processing info
  processing_status processing_status DEFAULT 'completed',
  processing_error TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own presets" ON public.presets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own presets" ON public.presets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own presets" ON public.presets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own presets" ON public.presets
  FOR DELETE USING (auth.uid() = user_id);

-- Usage tracking table
CREATE TABLE public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Usage details
  action_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  
  -- Billing period tracking
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage" ON public.usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

-- Affiliate programs table
CREATE TABLE public.affiliate_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Affiliate details
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  commission_rate DECIMAL(5,4) DEFAULT 0.25,
  
  -- Stats
  total_signups INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_earnings_cents INTEGER DEFAULT 0,
  pending_earnings_cents INTEGER DEFAULT 0,
  paid_earnings_cents INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.affiliate_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own affiliate program" ON public.affiliate_programs
  FOR SELECT USING (auth.uid() = user_id);

-- Affiliate referrals table
CREATE TABLE public.affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  -- Referral tracking
  referral_code VARCHAR(50) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  
  -- Conversion tracking
  status referral_status DEFAULT 'clicked',
  converted_at TIMESTAMP WITH TIME ZONE,
  
  -- Commission
  commission_cents INTEGER DEFAULT 0,
  commission_paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals" ON public.affiliate_referrals
  FOR SELECT USING (auth.uid() = affiliate_user_id);

-- Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  
  -- Payment details
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status payment_status NOT NULL,
  
  -- External references
  polar_payment_id VARCHAR(255) UNIQUE,
  polar_invoice_id VARCHAR(255),
  
  -- Metadata
  description TEXT,
  failure_reason TEXT,
  
  -- Timestamps
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

-- API keys table (admin only)
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Key details
  name VARCHAR(100) NOT NULL,
  service VARCHAR(50) NOT NULL,
  encrypted_key TEXT NOT NULL,
  
  -- Usage tracking
  requests_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_presets_user_id ON public.presets(user_id);
CREATE INDEX idx_presets_created_at ON public.presets(created_at DESC);
CREATE INDEX idx_presets_type ON public.presets(preset_type);
CREATE INDEX idx_usage_user_id ON public.usage_tracking(user_id);
CREATE INDEX idx_usage_billing_period ON public.usage_tracking(billing_period_start, billing_period_end);
CREATE INDEX idx_affiliate_referral_code ON public.affiliate_programs(referral_code);
CREATE INDEX idx_referrals_affiliate_user ON public.affiliate_referrals(affiliate_user_id);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, email_verified_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'avatar_url',
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN NEW.email_confirmed_at ELSE NULL END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_presets_updated_at BEFORE UPDATE ON public.presets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliate_programs_updated_at BEFORE UPDATE ON public.affiliate_programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliate_referrals_updated_at BEFORE UPDATE ON public.affiliate_referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
