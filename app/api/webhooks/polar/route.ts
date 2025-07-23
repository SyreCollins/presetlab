import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get("polar-webhook-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // Verify webhook signature
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error("POLAR_WEBHOOK_SECRET not configured")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex")

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)
    const supabase = await createClient()

    console.log("Received Polar webhook:", event.type)

    switch (event.type) {
      case "checkout.completed":
        await handleCheckoutCompleted(event.data, supabase)
        break

      case "subscription.created":
        await handleSubscriptionCreated(event.data, supabase)
        break

      case "subscription.updated":
        await handleSubscriptionUpdated(event.data, supabase)
        break

      case "subscription.cancelled":
        await handleSubscriptionCancelled(event.data, supabase)
        break

      case "payment.succeeded":
        await handlePaymentSucceeded(event.data, supabase)
        break

      case "payment.failed":
        await handlePaymentFailed(event.data, supabase)
        break

      default:
        console.log("Unhandled webhook event:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
a
sync function handleCheckoutCompleted(data: any, supabase: any) {
  const { customer_email, metadata, amount, currency } = data

  if (!metadata?.user_id) {
    console.error("No user_id in checkout metadata")
    return
  }

  // Create or update subscription record
  const subscriptionData = {
    user_id: metadata.user_id,
    plan_type: metadata.plan_type,
    status: "active",
    billing_cycle: metadata.billing_cycle,
    amount_cents: amount,
    currency: currency || "USD",
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + (metadata.billing_cycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
    polar_subscription_id: data.subscription_id,
  }

  const { error } = await supabase
    .from("subscriptions")
    .upsert(subscriptionData, { onConflict: "user_id" })

  if (error) {
    console.error("Error creating subscription:", error)
  }
}

async function handleSubscriptionCreated(data: any, supabase: any) {
  const { id, customer, price, status, current_period_start, current_period_end } = data

  // Find user by email
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", customer.email)
    .single()

  if (!user) {
    console.error("User not found for subscription:", customer.email)
    return
  }

  const subscriptionData = {
    user_id: user.id,
    polar_subscription_id: id,
    plan_type: getPlanTypeFromPrice(price.id),
    status: status,
    billing_cycle: price.recurring?.interval || "monthly",
    amount_cents: price.amount,
    currency: price.currency,
    current_period_start: current_period_start,
    current_period_end: current_period_end,
  }

  const { error } = await supabase
    .from("subscriptions")
    .upsert(subscriptionData, { onConflict: "polar_subscription_id" })

  if (error) {
    console.error("Error creating subscription:", error)
  }
}async 
function handleSubscriptionUpdated(data: any, supabase: any) {
  const { id, status, current_period_start, current_period_end, canceled_at } = data

  const updateData: any = {
    status,
    current_period_start,
    current_period_end,
  }

  if (canceled_at) {
    updateData.canceled_at = canceled_at
  }

  const { error } = await supabase
    .from("subscriptions")
    .update(updateData)
    .eq("polar_subscription_id", id)

  if (error) {
    console.error("Error updating subscription:", error)
  }
}

async function handleSubscriptionCancelled(data: any, supabase: any) {
  const { id, canceled_at } = data

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      canceled_at: canceled_at || new Date().toISOString(),
    })
    .eq("polar_subscription_id", id)

  if (error) {
    console.error("Error cancelling subscription:", error)
  }
}

async function handlePaymentSucceeded(data: any, supabase: any) {
  const { id, subscription_id, amount, currency, description } = data

  // Find the subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("polar_subscription_id", subscription_id)
    .single()

  if (!subscription) {
    console.error("Subscription not found for payment:", subscription_id)
    return
  }

  // Record the payment
  const { error } = await supabase.from("payments").insert({
    user_id: subscription.user_id,
    subscription_id: subscription.id,
    polar_payment_id: id,
    amount_cents: amount,
    currency,
    status: "succeeded",
    description,
    processed_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error recording payment:", error)
  }
}async
 function handlePaymentFailed(data: any, supabase: any) {
  const { id, subscription_id, amount, currency, failure_reason } = data

  // Find the subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("polar_subscription_id", subscription_id)
    .single()

  if (!subscription) {
    console.error("Subscription not found for failed payment:", subscription_id)
    return
  }

  // Record the failed payment
  const { error } = await supabase.from("payments").insert({
    user_id: subscription.user_id,
    subscription_id: subscription.id,
    polar_payment_id: id,
    amount_cents: amount,
    currency,
    status: "failed",
    failure_reason,
    processed_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error recording failed payment:", error)
  }
}

function getPlanTypeFromPrice(priceId: string): string {
  // Map Polar price IDs to plan types
  const priceMapping: { [key: string]: string } = {
    [process.env.NEXT_PUBLIC_POLAR_STARTER_MONTHLY_PRICE_ID || ""]: "starter",
    [process.env.NEXT_PUBLIC_POLAR_STARTER_YEARLY_PRICE_ID || ""]: "starter",
    [process.env.NEXT_PUBLIC_POLAR_PRO_MONTHLY_PRICE_ID || ""]: "pro",
    [process.env.NEXT_PUBLIC_POLAR_PRO_YEARLY_PRICE_ID || ""]: "pro",
    [process.env.NEXT_PUBLIC_POLAR_PREMIUM_MONTHLY_PRICE_ID || ""]: "premium",
    [process.env.NEXT_PUBLIC_POLAR_PREMIUM_YEARLY_PRICE_ID || ""]: "premium",
  }

  return priceMapping[priceId] || "starter"
}async 
function handlePaymentFailed(data: any, supabase: any) {
  const { id, subscription_id, amount, currency, failure_reason } = data

  // Find the subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("polar_subscription_id", subscription_id)
    .single()

  if (!subscription) {
    console.error("Subscription not found for failed payment:", subscription_id)
    return
  }

  // Record the failed payment
  const { error } = await supabase.from("payments").insert({
    user_id: subscription.user_id,
    subscription_id: subscription.id,
    polar_payment_id: id,
    amount_cents: amount,
    currency,
    status: "failed",
    failure_reason,
    processed_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error recording failed payment:", error)
  }
}

function getPlanTypeFromPrice(priceId: string): string {
  // Map Polar price IDs to plan types
  const priceMapping: { [key: string]: string } = {
    [process.env.NEXT_PUBLIC_POLAR_STARTER_MONTHLY_PRICE_ID || ""]: "starter",
    [process.env.NEXT_PUBLIC_POLAR_STARTER_YEARLY_PRICE_ID || ""]: "starter",
    [process.env.NEXT_PUBLIC_POLAR_PRO_MONTHLY_PRICE_ID || ""]: "pro",
    [process.env.NEXT_PUBLIC_POLAR_PRO_YEARLY_PRICE_ID || ""]: "pro",
    [process.env.NEXT_PUBLIC_POLAR_PREMIUM_MONTHLY_PRICE_ID || ""]: "premium",
    [process.env.NEXT_PUBLIC_POLAR_PREMIUM_YEARLY_PRICE_ID || ""]: "premium",
  }

  return priceMapping[priceId] || "starter"
}