import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("total_presets_created, total_downloads")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.error("Error fetching user data:", userError)
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
    }

    // Get presets created this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: presetsThisMonth } = await supabase
      .from("presets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString())

    // Get downloads this month (from usage tracking)
    const { count: downloadsThisMonth } = await supabase
      .from("usage_tracking")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("action_type", "download")
      .gte("created_at", startOfMonth.toISOString())

    // Get user subscription to determine current plan
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_type, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // Get recent presets (using correct column names from schema)
    const { data: recentPresets } = await supabase
      .from("presets")
      .select("id, name, description, created_at, preset_type, category, downloads_count")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3)

    return NextResponse.json({
      totalPresets: userData?.total_presets_created || 0,
      totalDownloads: userData?.total_downloads || 0,
      presetsThisMonth: presetsThisMonth || 0,
      downloadsThisMonth: downloadsThisMonth || 0,
      currentPlan: subscription?.plan_type || "free",
      recentPresets: (recentPresets || []).map(preset => ({
        ...preset,
        preset_name: preset.name // Map name to preset_name for compatibility
      })),
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
