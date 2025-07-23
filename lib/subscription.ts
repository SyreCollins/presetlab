import { createClient } from "@/lib/supabase/server"

export interface SubscriptionLimits {
  presetsPerMonth: number
  storageGB: number
  canGenerate: boolean
}

export const PLAN_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    presetsPerMonth: 0, // Free users can't generate presets
    storageGB: 0,
    canGenerate: false,
  },
  starter: {
    presetsPerMonth: 50,
    storageGB: 5,
    canGenerate: true,
  },
  pro: {
    presetsPerMonth: 200,
    storageGB: 25,
    canGenerate: true,
  },
  premium: {
    presetsPerMonth: 999999,
    storageGB: 100,
    canGenerate: true,
  },
}

export async function getUserSubscription(userId: string) {
  const supabase = await createClient()

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error || !subscription) {
    // Return free plan as default
    return {
      id: "free",
      user_id: userId,
      plan_type: "free",
      status: "active",
      billing_cycle: "monthly",
      amount_cents: 0,
      currency: "USD",
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  return subscription
}

export async function checkSubscriptionAccess(userId: string): Promise<{
  hasAccess: boolean
  planType: string
  limits: SubscriptionLimits
  currentUsage: number
}> {
  const subscription = await getUserSubscription(userId)
  const planType = subscription.plan_type || "free"
  const limits = PLAN_LIMITS[planType] || PLAN_LIMITS.free

  // Get current month usage
  const supabase = await createClient()
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count: currentUsage } = await supabase
    .from("presets")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString())

  const hasAccess = limits.canGenerate && (currentUsage || 0) < limits.presetsPerMonth

  return {
    hasAccess,
    planType,
    limits,
    currentUsage: currentUsage || 0,
  }
}

export function getPlanDisplayName(planType: string): string {
  const names: Record<string, string> = {
    free: "Free",
    starter: "Starter",
    pro: "Pro",
    premium: "Premium",
  }
  return names[planType] || "Free"
}

export function getPlanPrice(planType: string, isYearly: boolean = false): number {
  const prices: Record<string, { monthly: number; yearly: number }> = {
    free: { monthly: 0, yearly: 0 },
    starter: { monthly: 9, yearly: 90 },
    pro: { monthly: 15, yearly: 150 },
    premium: { monthly: 24, yearly: 240 },
  }
  
  const plan = prices[planType] || prices.free
  return isYearly ? plan.yearly : plan.monthly
}