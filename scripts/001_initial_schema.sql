-- PresetLab Database Schema
-- Run this script in your Neon database console

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Subscription details
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('free', 'starter', 'pro')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  
  -- Billing
  billing_cycle VARCHAR(10) CHECK (billing_cycle IN ('monthly', 'yearly')),
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

-- Presets table
CREATE TABLE presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Preset details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  preset_type VARCHAR(10) NOT NULL CHECK (preset_type IN ('xmp', 'cube')),
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
  
  -- Processing info
  processing_status VARCHAR(20) DEFAULT 'completed' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  processing_error TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking table
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
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

-- Affiliate programs table
CREATE TABLE affiliate_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
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

-- Affiliate referrals table
CREATE TABLE affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Referral tracking
  referral_code VARCHAR(50) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  
  -- Conversion tracking
  status VARCHAR(20) DEFAULT 'clicked' CHECK (status IN ('clicked', 'signed_up', 'converted', 'paid')),
  converted_at TIMESTAMP WITH TIME ZONE,
  
  -- Commission
  commission_cents INTEGER DEFAULT 0,
  commission_paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  
  -- Payment details
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  
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

-- API keys table
CREATE TABLE api_keys (
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
