import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkSubscriptionAccess } from "@/lib/subscription"

export async function POST(request: NextRequest) {
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

    // Check user's subscription access
    const subscriptionCheck = await checkSubscriptionAccess(user.id)

    if (!subscriptionCheck.hasAccess) {
      if (subscriptionCheck.planType === "free") {
        return NextResponse.json(
          {
            error: "Active subscription required. Please subscribe to generate presets.",
            requiresSubscription: true,
          },
          { status: 403 }
        )
      } else {
        return NextResponse.json(
          {
            error: `You've reached your ${subscriptionCheck.planType} plan limit of ${subscriptionCheck.limits.presetsPerMonth} presets this month. Please upgrade to continue.`,
            requiresUpgrade: true,
          },
          { status: 429 }
        )
      }
    }

    // Get form data from the request
    const formData = await request.formData()
    
    // Forward the request to the custom API
    const apiResponse = await fetch("https://presetlab-api.onrender.com/generate-preset", {
      method: "POST",
      body: formData,
    })

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      console.error("API Error:", apiResponse.status, errorText)
      return NextResponse.json(
        { error: `API Error: ${apiResponse.status} ${errorText}` },
        { status: apiResponse.status }
      )
    }

    const presetData = await apiResponse.json()

    // Return the API response along with usage information
    return NextResponse.json({
      ...presetData,
      usage: {
        current: subscriptionCheck.currentUsage,
        limit: subscriptionCheck.limits.presetsPerMonth,
        plan: subscriptionCheck.planType,
      },
    })
  } catch (error) {
    console.error("Error generating preset:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}