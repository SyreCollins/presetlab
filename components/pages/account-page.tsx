"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Calendar, CreditCard, AlertTriangle, ExternalLink } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SubscriptionData {
  plan_type: string
  status: string
  hasActiveSubscription: boolean
  isExpired?: boolean
  daysUntilExpiry?: number
  current_period_end?: string
  billing_cycle?: string
  amount_cents?: number
  currency?: string
}

interface UsageData {
  current: number
  limit: number
  plan: string
  hasAccess: boolean
  storageGB: number
}

export default function AccountPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchAccountData()
    }
  }, [user])

  const fetchAccountData = async () => {
    try {
      const [subResponse, usageResponse] = await Promise.all([
        fetch("/api/user/subscription"),
        fetch("/api/user/usage")
      ])

      if (subResponse.ok) {
        const subData = await subResponse.json()
        setSubscription(subData)
      }

      if (usageResponse.ok) {
        const usageData = await usageResponse.json()
        setUsage(usageData)
      }
    } catch (error) {
      console.error("Error fetching account data:", error)
    } finally {
      setLoading(false)
    }
  } 
  
  const handleUpgrade = () => {
    router.push("/pricing")
  }

  const handleManageSubscription = () => {
    router.push("/pricing")
  }

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return
    }

    try {
      const response = await fetch("/api/user/subscription", {
        method: "DELETE",
      })

      if (response.ok) {
        alert("Subscription cancelled successfully")
        fetchAccountData() // Refresh data
      } else {
        alert("Failed to cancel subscription")
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error)
      alert("Failed to cancel subscription")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "starter": return "bg-blue-500"
      case "pro": return "bg-purple-500"
      case "premium": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "starter": return "Starter"
      case "pro": return "Pro"
      case "premium": return "Premium"
      default: return "Free"
    }
  }

  const formatPrice = (cents: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(cents / 100)
  }

  const usagePercentage = usage ? (usage.current / usage.limit) * 100 : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your subscription and account preferences</p>
      </div>

      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Subscription Status
          </CardTitle>
          <CardDescription>
            Manage your subscription and view usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={getPlanColor(subscription?.plan_type || "free")}>
                {getPlanName(subscription?.plan_type || "free")}
              </Badge>
              {subscription?.hasActiveSubscription ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-600">
                  Inactive
                </Badge>
              )}
            </div>
            {subscription?.amount_cents && (
              <div className="text-right">
                <p className="font-semibold">
                  {formatPrice(subscription.amount_cents, subscription.currency)}
                </p>
                <p className="text-sm text-muted-foreground">
                  per {subscription.billing_cycle}
                </p>
              </div>
            )}
          </div>

          {/* Expiry Warning */}
          {subscription?.hasActiveSubscription && subscription?.daysUntilExpiry && subscription.daysUntilExpiry <= 7 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Your subscription expires in {subscription.daysUntilExpiry} days
              </p>
            </div>
          )}

          {/* Usage Information */}
          {usage && subscription?.hasActiveSubscription && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Presets this month</span>
                <span className="text-sm text-muted-foreground">
                  {usage.current} / {usage.limit === 999999 ? "∞" : usage.limit}
                </span>
              </div>
              {usage.limit !== 999999 && (
                <Progress value={Math.min(usagePercentage, 100)} className="h-2" />
              )}
            </div>
          )}

          {/* Next Billing Date */}
          {subscription?.hasActiveSubscription && subscription?.current_period_end && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!subscription?.hasActiveSubscription ? (
              <Button onClick={handleUpgrade} className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                Subscribe Now
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleManageSubscription} className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Button>
                {subscription.plan_type !== "premium" && (
                  <Button onClick={handleUpgrade}>
                    Upgrade Plan
                  </Button>
                )}
                <Button variant="destructive" onClick={handleCancelSubscription}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-sm">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Member since</label>
            <p className="text-sm">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your recent payments</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Billing history will be available once you have an active subscription.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}