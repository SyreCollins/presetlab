import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { polarClient } from "@/lib/polar/client"

export async function POST(request: NextRequest) {
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

    // Get user's Polar customer ID
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("polar_customer_id")
      .eq("id", user.id)
      .single()

    if (userError || !userData?.polar_customer_id) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    // Create customer portal session
    const portal = await polarClient.createCustomerPortalSession(userData.polar_customer_id)

    return NextResponse.json({ url: portal.url })
  } catch (error) {
    console.error("Customer portal error:", error)
    return NextResponse.json({ error: "Failed to create customer portal session" }, { status: 500 })
  }
}
