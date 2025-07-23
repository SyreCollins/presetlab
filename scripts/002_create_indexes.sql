-- Performance indexes for PresetLab

-- User lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Subscription queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_polar_id ON subscriptions(polar_subscription_id);

-- Preset queries
CREATE INDEX IF NOT EXISTS idx_presets_user_id ON presets(user_id);
CREATE INDEX IF NOT EXISTS idx_presets_created_at ON presets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_presets_type ON presets(preset_type);
CREATE INDEX IF NOT EXISTS idx_presets_category ON presets(category);
CREATE INDEX IF NOT EXISTS idx_presets_status ON presets(processing_status);

-- Usage tracking
CREATE INDEX IF NOT EXISTS idx_usage_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_billing_period ON usage_tracking(billing_period_start, billing_period_end);
CREATE INDEX IF NOT EXISTS idx_usage_action_type ON usage_tracking(action_type);
CREATE INDEX IF NOT EXISTS idx_usage_created_at ON usage_tracking(created_at);

-- Affiliate tracking
CREATE INDEX IF NOT EXISTS idx_affiliate_referral_code ON affiliate_programs(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_user_id ON affiliate_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_user ON affiliate_referrals(affiliate_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user ON affiliate_referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON affiliate_referrals(status);

-- Payment queries
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_polar_payment_id ON payments(polar_payment_id);

-- API keys
CREATE INDEX IF NOT EXISTS idx_api_keys_service ON api_keys(service);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);
