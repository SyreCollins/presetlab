import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkSubscriptionAccess } from "@/lib/subscription"

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

    // Get subscription access information
    const subscriptionCheck = await checkSubscriptionAccess(user.id)

    return NextResponse.json({
      current: subscriptionCheck.currentUsage,
      limit: subscriptionCheck.limits.presetsPerMonth,
      plan: subscriptionCheck.planType,
      hasAccess: subscriptionCheck.hasAccess,
      storageGB: subscriptionCheck.limits.storageGB,
    })
  } catch (error) {
    console.error("Error in usage API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}