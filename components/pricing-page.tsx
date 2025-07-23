"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, Zap, Star, Crown } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for getting started",
    price: { monthly: 9, yearly: 90 },
    icon: Zap,
    features: ["50 presets per month", "5GB storage", "Email support", "HD quality exports", "Basic templates"],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Great for regular creators",
    price: { monthly: 15, yearly: 150 },
    icon: Star,
    features: ["200 presets per month", "25GB storage", "Priority support", "4K quality exports", "Custom branding", "Advanced templates"],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "For power users and teams",
    price: { monthly: 24, yearly: 240 },
    icon: Crown,
    features: [
      "Unlimited presets",
      "100GB storage",
      "24/7 priority support",
      "8K quality exports",
      "Custom branding",
      "API access",
      "Team collaboration",
      "White-label solution",
    ],
    popular: false,
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    setLoading(planId)

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: planId,
          isYearly,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || "No checkout URL returned")
      }
    } catch (error) {
      console.error("Error creating checkout:", error)
      alert("Failed to start checkout. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const getSavings = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0
    return Math.round(((monthly * 12 - yearly) / (monthly * 12)) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 mb-8">Start creating amazing presets with AI-powered tools</p>

          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${!isYearly ? "font-semibold" : "text-gray-500"}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? "font-semibold" : "text-gray-500"}`}>Yearly</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Save up to 17%
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price = isYearly ? plan.price.yearly : plan.price.monthly
            const savings = getSavings(plan.price.monthly, plan.price.yearly)

            return (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? "border-purple-500 shadow-lg scale-105" : "border-gray-200"}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">${price}</span>
                      {price > 0 && <span className="text-gray-500 ml-1">/{isYearly ? "year" : "month"}</span>}
                    </div>
                    {isYearly && savings > 0 && (
                      <p className="text-sm text-green-600 mt-1">Save {savings}% vs monthly</p>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id}
                  >
                    {loading === plan.id
                      ? "Loading..."
                      : plan.id === "free"
                        ? "Get Started"
                        : `Subscribe to ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing
                cycle.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-2">What happens to my presets if I downgrade?</h3>
              <p className="text-gray-600">
                Your existing presets will remain accessible, but you'll be limited by your new plan's monthly creation
                limits.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
