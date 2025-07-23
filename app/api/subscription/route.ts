import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserSubscription, checkUsageLimit } from "@/lib/polar/subscriptions"

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get subscription data
    const subscription = await getUserSubscription(user.id)

    // Get usage data
    const presetUsage = await checkUsageLimit(user.id, "presets")
    const downloadUsage = await checkUsageLimit(user.id, "downloads")

    return NextResponse.json({
      plan: subscription.plan,
      status: subscription.status,
      usage: {
        presets: presetUsage,
        downloads: downloadUsage,
      },
    })
  } catch (error) {
    console.error("Subscription API error:", error)
    return NextResponse.json({ error: "Failed to fetch subscription data" }, { status: 500 })
  }
}
