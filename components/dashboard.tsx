"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Download, Calendar, CreditCard } from "lucide-react"
import { motion } from "framer-motion"

interface DashboardStats {
  totalPresets: number
  totalDownloads: number
  presetsThisMonth: number
  downloadsThisMonth: number
  currentPlan: string
  recentPresets: Array<{
    id: string
    preset_name: string
    preset_type: string
    created_at: string
    downloads_count: number
  }>
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalPresets: 0,
    totalDownloads: 0,
    presetsThisMonth: 0,
    downloadsThisMonth: 0,
    currentPlan: "free",
    recentPresets: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/user/dashboard")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPlanLimits = (plan: string) => {
    switch (plan) {
      case "pro":
        return { presets: 100, downloads: 1000 }
      case "premium":
        return { presets: 500, downloads: 5000 }
      default:
        return { presets: 10, downloads: 50 }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const limits = getPlanLimits(stats.currentPlan)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 min-h-screen bg-background">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <SidebarTrigger />
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Presets</CardTitle>
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPresets}</div>
                    <p className="text-xs text-muted-foreground">+{stats.presetsThisMonth} this month</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalDownloads}</div>
                    <p className="text-xs text-muted-foreground">+{stats.downloadsThisMonth} this month</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold capitalize">{stats.currentPlan}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.currentPlan === "free" ? "Upgrade for more features" : "Active subscription"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.presetsThisMonth}</div>
                    <p className="text-xs text-muted-foreground">Presets created</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Usage Progress */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                  <CardDescription>Track your current usage against plan limits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Presets Created</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.presetsThisMonth} / {limits.presets}
                      </span>
                    </div>
                    <Progress value={(stats.presetsThisMonth / limits.presets) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Downloads</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.downloadsThisMonth} / {limits.downloads}
                      </span>
                    </div>
                    <Progress value={(stats.downloadsThisMonth / limits.downloads) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Presets */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Presets</CardTitle>
                  <CardDescription>Your latest creations</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.recentPresets.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentPresets.map((preset) => (
                        <div key={preset.id} className="flex items-center justify-between p-4 rounded-lg border">
                          <div className="flex-1">
                            <h4 className="font-semibold">{preset.preset_name}</h4>
                            <p className="text-sm text-muted-foreground">{formatDate(preset.created_at)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{preset.preset_type.toUpperCase()}</Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {preset.downloads_count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No presets created yet</p>
                      <p className="text-sm">Start creating your first preset!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
