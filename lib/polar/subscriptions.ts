import { createClient } from "@/lib/supabase/server"

export interface SubscriptionPlan {
  id: string
  name: string
  price_monthly: number
  price_yearly: number
  features: string[]
  limits: {
    presets_per_month: number
    storage_gb: number
  }
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: "free",
    name: "Free",
    price_monthly: 0,
    price_yearly: 0,
    features: ["3 presets per month", "1GB storage", "Basic support", "Standard quality exports"],
    limits: {
      presets_per_month: 3,
      storage_gb: 1,
    },
  },
  starter: {
    id: "starter",
    name: "Starter",
    price_monthly: 9,
    price_yearly: 90,
    features: ["50 presets per month", "10GB storage", "Priority support", "HD quality exports", "Custom branding"],
    limits: {
      presets_per_month: 50,
      storage_gb: 10,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price_monthly: 29,
    price_yearly: 290,
    features: [
      "Unlimited presets",
      "100GB storage",
      "24/7 priority support",
      "4K quality exports",
      "Custom branding",
      "API access",
      "Team collaboration",
    ],
    limits: {
      presets_per_month: -1, // unlimited
      storage_gb: 100,
    },
  },
}

export async function getUserSubscription(userId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from("user_subscriptions").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    return (
      data || {
        user_id: userId,
        plan: "free",
        status: "active",
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    )
  } catch (error) {
    console.error("Error fetching user subscription:", error)
    return {
      user_id: userId,
      plan: "free",
      status: "active",
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }
  }
}

export async function getUserUsage(userId: string) {
  const supabase = await createClient()

  try {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from("presets")
      .select("id")
      .eq("user_id", userId)
      .gte("created_at", startOfMonth.toISOString())

    if (error) {
      throw error
    }

    return {
      presets_this_month: data?.length || 0,
      storage_used_gb: 0, // TODO: Calculate actual storage usage
    }
  } catch (error) {
    console.error("Error fetching user usage:", error)
    return {
      presets_this_month: 0,
      storage_used_gb: 0,
    }
  }
}

export function canCreatePreset(subscription: any, usage: any): boolean {
  const plan = SUBSCRIPTION_PLANS[subscription.plan] || SUBSCRIPTION_PLANS.free

  if (plan.limits.presets_per_month === -1) {
    return true // unlimited
  }

  return usage.presets_this_month < plan.limits.presets_per_month
}

export async function updateUserSubscription(
  userId: string,
  data: {
    subscriptionPlan?: string
    subscriptionStatus?: string
    subscriptionId?: string
    polarCustomerId?: string
  },
) {
  const supabase = await createClient()

  const { error } = await supabase.from("user_subscriptions").update(data).eq("user_id", userId)

  if (error) {
    throw new Error(`Failed to update subscription: ${error.message}`)
  }
}

export async function checkUsageLimit(userId: string, type: "presets" | "downloads") {
  const supabase = await createClient()
  const subscription = await getUserSubscription(userId)
  const usage = await getUserUsage(userId)

  const limit = type === "presets" ? subscription.limits.presets_per_month : subscription.limits.storage_gb

  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, current: usage[type === "presets" ? "presets_this_month" : "storage_used_gb"], limit }
  }

  const current = usage[type === "presets" ? "presets_this_month" : "storage_used_gb"]
  return { allowed: current < limit, current, limit }
}

export async function incrementUsage(userId: string, type: "presets" | "downloads") {
  const supabase = await createClient()

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  // Try to update existing record first
  const { data: existing } = await supabase
    .from("user_usage")
    .select("id, preset_generations, downloads")
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString())
    .single()

  if (existing) {
    // Update existing record
    const updateData =
      type === "presets"
        ? { preset_generations: existing.preset_generations + 1 }
        : { downloads: existing.downloads + 1 }

    await supabase.from("user_usage").update(updateData).eq("id", existing.id)
  } else {
    // Create new record
    const insertData = {
      user_id: userId,
      preset_generations: type === "presets" ? 1 : 0,
      downloads: type === "downloads" ? 1 : 0,
    }

    await supabase.from("user_usage").insert(insertData)
  }
}
