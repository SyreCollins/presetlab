import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
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

    // Get the usage data from the request
    const { action_type, resource_id, metadata } = await request.json()

    if (!action_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate billing period (start of month to end of month)
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Track the usage
    const { data: usage, error } = await supabase.from("usage_tracking").insert({
      user_id: user.id,
      action_type,
      resource_id: resource_id || null,
      billing_period_start: startOfMonth.toISOString().split("T")[0],
      billing_period_end: endOfMonth.toISOString().split("T")[0],
      metadata: metadata || {},
    }).select().single()

    if (error) {
      console.error("Error tracking usage:", error)
      return NextResponse.json({ error: "Failed to track usage" }, { status: 500 })
    }

    // If this is a download action, increment the user's total downloads count
    if (action_type === "download") {
      await supabase.rpc("increment_user_downloads_count", { user_id: user.id })
      
      // If resource_id is provided, increment the preset's download count
      if (resource_id) {
        await supabase.rpc("increment_preset_downloads_count", { preset_id: resource_id })
      }
    }

    return NextResponse.json({
      success: true,
      usage_id: usage.id,
      message: "Usage tracked successfully",
    })
  } catch (error) {
    console.error("Error in usage tracking API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}