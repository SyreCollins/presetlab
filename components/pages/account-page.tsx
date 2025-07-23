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