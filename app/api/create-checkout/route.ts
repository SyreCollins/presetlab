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

    const { planType, isYearly } = await request.json()

    if (!planType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get the correct product ID from environment variables
    const envProductId = isYearly
      ? process.env[`NEXT_PUBLIC_POLAR_${planType.toUpperCase()}_YEARLY_PRODUCT_ID`]
      : process.env[`NEXT_PUBLIC_POLAR_${planType.toUpperCase()}_MONTHLY_PRODUCT_ID`]

    if (!envProductId) {
      console.error(`Product ID not found for plan: ${planType}, yearly: ${isYearly}`)
      return NextResponse.json({ error: "Product ID not configured for this plan" }, { status: 400 })
    }

    // Create checkout session with Polar using product_id
    const checkoutData = {
      product_id: envProductId,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancelled`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        plan_type: planType,
        billing_cycle: isYearly ? "yearly" : "monthly",
      },
    }

    const response = await fetch("https://api.polar.sh/v1/checkouts/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.POLAR_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkoutData),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Polar API error:", response.status, errorData)
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: response.status }
      )
    }

    const checkout = await response.json()

    return NextResponse.json({
      url: checkout.url,
      checkout_id: checkout.id,
    })
  } catch (error) {
    console.error("Error creating checkout:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}