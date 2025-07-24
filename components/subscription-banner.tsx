"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, AlertTriangle, CreditCard } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

interface SubscriptionData {
  plan_type: string
  hasActiveSubscription: boolean
}

export default function SubscriptionBanner() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchSubscription()
    }
  }, [user])

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/user/subscription")
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error("Error fetching subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !subscription) return null

  // Show upgrade banner for free users
  if (!subscription.hasActiveSubscription) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">
                  Subscribe to start generating presets
                </p>
                <p className="text-sm text-orange-700">
                  Choose a plan to unlock AI-powered preset generation
                </p>
              </div>
            </div>
            <Button 
              onClick={() => router.push("/pricing")}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              View Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show current plan for subscribed users
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">
                Active Subscription
              </p>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600">
                  {subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)} Plan
                </Badge>
                <span className="text-sm text-green-700">
                  Ready to generate presets
                </span>
              </div>
            </div>
          </div>
          <Button 
            variant="outline"
            onClick={() => router.push("/pricing")}
            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          >
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}