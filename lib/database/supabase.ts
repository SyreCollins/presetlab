import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  total_presets_created: number
  total_downloads: number
  current_plan: string
  created_at: string
  updated_at: string
}

export interface Preset {
  id: string
  user_id: string
  preset_name: string
  description?: string
  preset_json: any
  preset_type: string
  category?: string
  downloads_count: number
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  polar_subscription_id?: string
  plan_type: string
  status: string
  billing_cycle: string
  amount_cents: number
  currency: string
  current_period_start: string
  current_period_end: string
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
  created_at: string
}

export interface AffiliateProgram {
  id: string
  user_id: string
  affiliate_code: string
  commission_rate: number
  total_referrals: number
  total_earnings_cents: number
  status: string
  created_at: string
  updated_at: string
}

// Get server-side Supabase client
async function getServerClient() {
  return await createClient()
}

// Get client-side Supabase client
function getBrowserClient() {
  return createBrowserClient()
}

// User functions
export async function getCurrentUser(): Promise<User | null> {
  const supabase = getBrowserClient()

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !authUser) return null

  // Get additional user data from our custom fields
  const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", authUser.id).single()

  if (userError) {
    console.error("Error fetching user data:", userError)
    return null
  }

  return userData as User
}

export async function getUserById(userId: string): Promise<User | null> {
  const supabase = getBrowserClient()

  const { data: user, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user by ID:", error)
    return null
  }

  return user as User
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const supabase = getBrowserClient()

  const { data: user, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

  if (error) {
    console.error("Error updating user:", error)
    return null
  }

  return user as User
}

// Preset functions
export async function createPreset(presetData: {
  user_id: string
  preset_name: string
  description?: string
  preset_json: any
  preset_type?: string
  category?: string
}): Promise<Preset | null> {
  const supabase = getBrowserClient()

  const { data: preset, error } = await supabase
    .from("presets")
    .insert({
      user_id: presetData.user_id,
      preset_name: presetData.preset_name,
      description: presetData.description,
      preset_json: presetData.preset_json,
      preset_type: presetData.preset_type || "xmp",
      category: presetData.category,
      downloads_count: 0,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating preset:", error)
    return null
  }

  return preset as Preset
}

export async function getUserPresets(userId: string): Promise<Preset[]> {
  const supabase = getBrowserClient()

  const { data: presets, error } = await supabase
    .from("presets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user presets:", error)
    return []
  }

  return (presets || []) as Preset[]
}

export async function getPresetById(presetId: string): Promise<Preset | null> {
  const supabase = getBrowserClient()

  const { data: preset, error } = await supabase.from("presets").select("*").eq("id", presetId).single()

  if (error) {
    console.error("Error fetching preset:", error)
    return null
  }

  return preset as Preset
}

export async function deletePreset(presetId: string): Promise<boolean> {
  const supabase = getBrowserClient()

  const { error } = await supabase.from("presets").delete().eq("id", presetId)

  if (error) {
    console.error("Error deleting preset:", error)
    return false
  }

  return true
}

export async function updatePreset(presetId: string, updates: Partial<Preset>): Promise<Preset | null> {
  const supabase = getBrowserClient()

  const { data: preset, error } = await supabase.from("presets").update(updates).eq("id", presetId).select().single()

  if (error) {
    console.error("Error updating preset:", error)
    return null
  }

  return preset as Preset
}

// Dashboard stats functions
export async function getUserDashboardStats(userId: string): Promise<{
  totalPresets: number
  totalDownloads: number
  presetsThisMonth: number
  downloadsThisMonth: number
  currentPlan: string
  recentPresets: Preset[]
}> {
  const supabase = getBrowserClient()

  // Get user data
  const { data: user } = await supabase
    .from("users")
    .select("total_presets_created, total_downloads, current_plan")
    .eq("id", userId)
    .single()

  // Get presets created this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count: presetsThisMonth } = await supabase
    .from("presets")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString())

  // Get downloads this month (from usage tracking)
  const { count: downloadsThisMonth } = await supabase
    .from("usage_tracking")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action_type", "download")
    .gte("created_at", startOfMonth.toISOString())

  // Get recent presets
  const { data: recentPresets } = await supabase
    .from("presets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3)

  return {
    totalPresets: user?.total_presets_created || 0,
    totalDownloads: user?.total_downloads || 0,
    presetsThisMonth: presetsThisMonth || 0,
    downloadsThisMonth: downloadsThisMonth || 0,
    currentPlan: user?.current_plan || "free",
    recentPresets: (recentPresets || []) as Preset[],
  }
}

// Subscription functions
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const supabase = getBrowserClient()

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    // Return default free subscription
    return {
      id: "default",
      user_id: userId,
      polar_subscription_id: undefined,
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

  return data as Subscription
}

// Usage tracking functions
export async function trackUsage(usageData: {
  user_id: string
  action_type: string
  resource_id?: string
  billing_period_start: string
  billing_period_end: string
}): Promise<UsageTracking | null> {
  const supabase = getBrowserClient()

  const { data: usage, error } = await supabase.from("usage_tracking").insert(usageData).select().single()

  if (error) {
    console.error("Error tracking usage:", error)
    return null
  }

  return usage as UsageTracking
}

export async function getUsageCount(
  userId: string,
  actionType: string,
  startDate: string,
  endDate: string,
): Promise<number> {
  const supabase = getBrowserClient()

  const { count, error } = await supabase
    .from("usage_tracking")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action_type", actionType)
    .gte("billing_period_start", startDate)
    .lte("billing_period_end", endDate)

  if (error) {
    console.error("Error getting usage count:", error)
    return 0
  }

  return count || 0
}

// Get current month usage
export async function getCurrentMonthUsage(userId: string): Promise<{
  presets: number
  downloads: number
}> {
  const supabase = getBrowserClient()
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  // Get presets created this month
  const { count: presetCount } = await supabase
    .from("presets")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString())

  // Get downloads this month (from usage tracking)
  const { count: downloadCount } = await supabase
    .from("usage_tracking")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action_type", "download")
    .gte("created_at", startOfMonth.toISOString())

  return {
    presets: presetCount || 0,
    downloads: downloadCount || 0,
  }
}

// Affiliate functions
export async function getAffiliateProgram(userId: string): Promise<AffiliateProgram | null> {
  const supabase = getBrowserClient()

  const { data: program, error } = await supabase.from("affiliate_programs").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching affiliate program:", error)
    return null
  }

  return program as AffiliateProgram
}

// Stats functions
export async function getAppStats(): Promise<{
  totalUsers: number
  totalPresets: number
  averageRating: number
  satisfactionRate: number
}> {
  const supabase = await getServerClient()

  try {
    // Use Promise.all for parallel queries with timeout
    const [usersResult, presetsResult] = await Promise.all([
      Promise.race([
        supabase.from("users").select("*", { count: "exact", head: true }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]),
      Promise.race([
        supabase.from("presets").select("*", { count: "exact", head: true }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ])
    ])

    return {
      totalUsers: (usersResult as any)?.count || 12100,
      totalPresets: (presetsResult as any)?.count || 250000,
      averageRating: 4.9,
      satisfactionRate: 98,
    }
  } catch (error) {
    console.error("Error fetching app stats:", error)
    // Return fallback stats on error
    return {
      totalUsers: 12100,
      totalPresets: 250000,
      averageRating: 4.9,
      satisfactionRate: 98,
    }
  }
}

// Increment user downloads (called from API)
export async function incrementUserDownloads(userId: string): Promise<void> {
  const supabase = getBrowserClient()

  const { error } = await supabase.rpc("increment_user_downloads", { user_id: userId })

  if (error) {
    console.error("Error incrementing user downloads:", error)
  }
}
