// Database type definitions for PresetLab

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
  first_name?: string
  last_name?: string
  notification_preset_complete: boolean
  notification_weekly_summary: boolean
  notification_marketing: boolean
  total_presets_created: number
  total_downloads: number
  last_login_at?: string
  email_verified_at?: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_type: "free" | "starter" | "pro"
  status: "active" | "canceled" | "past_due" | "trialing"
  billing_cycle?: "monthly" | "yearly"
  amount_cents?: number
  currency: string
  current_period_start?: string
  current_period_end?: string
  trial_end?: string
  canceled_at?: string
  polar_subscription_id?: string
  created_at: string
  updated_at: string
}

export interface Preset {
  id: string
  user_id: string
  name: string
  description?: string
  preset_type: "xmp" | "cube"
  category?: string
  style_prompt: string
  file_url: string
  file_size_bytes?: number
  original_media_url?: string
  preview_image_url?: string
  downloads_count: number
  is_public: boolean
  processing_status: "pending" | "processing" | "completed" | "failed"
  processing_error?: string
  created_at: string
  updated_at: string
}

export interface UsageTracking {
  id: string
  user_id: string
  action_type: string
  resource_id?: string
  billing_period_start: string
  billing_period_end: string
  metadata?: Record<string, any>
  created_at: string
}

export interface AffiliateProgram {
  id: string
  user_id: string
  referral_code: string
  commission_rate: number
  total_signups: number
  total_conversions: number
  total_earnings_cents: number
  pending_earnings_cents: number
  paid_earnings_cents: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AffiliateReferral {
  id: string
  affiliate_user_id: string
  referred_user_id?: string
  referral_code: string
  ip_address?: string
  user_agent?: string
  status: "clicked" | "signed_up" | "converted" | "paid"
  converted_at?: string
  commission_cents: number
  commission_paid_at?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  subscription_id?: string
  amount_cents: number
  currency: string
  status: "pending" | "succeeded" | "failed" | "refunded"
  polar_payment_id?: string
  polar_invoice_id?: string
  description?: string
  failure_reason?: string
  processed_at?: string
  created_at: string
  updated_at: string
}

export interface ApiKey {
  id: string
  name: string
  service: string
  encrypted_key: string
  requests_count: number
  last_used_at?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Input types for creating records
export type CreateUserInput = Omit<
  User,
  "id" | "created_at" | "updated_at" | "total_presets_created" | "total_downloads"
>
export type CreatePresetInput = Omit<
  Preset,
  "id" | "created_at" | "updated_at" | "downloads_count" | "processing_status"
>
export type CreateSubscriptionInput = Omit<Subscription, "id" | "created_at" | "updated_at">
export type CreateUsageTrackingInput = Omit<UsageTracking, "id" | "created_at">
export type CreateAffiliateReferralInput = Omit<AffiliateReferral, "id" | "created_at" | "updated_at">
export type CreatePaymentInput = Omit<Payment, "id" | "created_at" | "updated_at">

// Update types
export type UpdateUserInput = Partial<Omit<User, "id" | "created_at" | "email">>
export type UpdatePresetInput = Partial<Omit<Preset, "id" | "user_id" | "created_at">>
export type UpdateSubscriptionInput = Partial<Omit<Subscription, "id" | "user_id" | "created_at">>
