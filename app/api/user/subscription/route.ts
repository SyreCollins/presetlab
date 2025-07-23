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

    // Get user's active subscription
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching subscription:", error)
      return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
    }

    // If no active subscription, return free plan info
    if (!subscription) {
      return NextResponse.json({
        plan_type: "free",
        status: "inactive",
        hasActiveSubscription: false,
        message: "No active subscription found",
      })
    }

    // Check if subscription is still valid
    const now = new Date()
    const periodEnd = new Date(subscription.current_period_end)
    const isExpired = now > periodEnd

    return NextResponse.json({
      ...subscription,
      hasActiveSubscription: !isExpired,
      isExpired,
      daysUntilExpiry: Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    })
  } catch (error) {
    console.error("Error in subscription API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE() {
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

    // Get user's active subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("polar_subscription_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (!subscription?.polar_subscription_id) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
    }

    // Cancel subscription via Polar API
    const response = await fetch(`https://api.polar.sh/v1/subscriptions/${subscription.polar_subscription_id}/cancel`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.POLAR_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Polar API error:", response.status, errorData)
      return NextResponse.json({ error: "Failed to cancel subscription" }, { status: response.status })
    }

    return NextResponse.json({ message: "Subscription cancelled successfully" })
  } catch (error) {
    console.error("Error cancelling subscription:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}