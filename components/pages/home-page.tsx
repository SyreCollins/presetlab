"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Camera, Video, Sparkles, TrendingUp, Clock, Download, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import SubscriptionBanner from "@/components/subscription-banner"

const quickActions = [
  {
    title: "Photo Preset",
    description: "Generate Lightroom XMP presets",
    icon: Camera,
    href: "/dashboard/generate?type=photo",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Video LUT",
    description: "Create color grading LUTs",
    icon: Video,
    href: "/dashboard/generate?type=video",
    gradient: "from-cyan-500 to-blue-500",
  },
]

interface DashboardStats {
  totalPresets: number
  totalDownloads: number
  presetsThisMonth: number
  currentPlan: string
  recentPresets: Array<{
    id: string
    preset_name: string
    preset_type: string
    created_at: string
    downloads_count: number
  }>
}

interface SubscriptionInfo {
  plan_type: string
  hasActiveSubscription: boolean
  status: string
}

export default function HomePage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalPresets: 0,
    totalDownloads: 0,
    presetsThisMonth: 0,
    currentPlan: "free",
    recentPresets: [],
  })
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    plan_type: "free",
    hasActiveSubscription: false,
    status: "inactive",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      const [statsResponse, subResponse] = await Promise.all([
        fetch("/api/user/dashboard"),
        fetch("/api/user/subscription")
      ])
      
      if (statsResponse.ok) {
        const data = await statsResponse.json()
        setStats(data)
      }
      
      if (subResponse.ok) {
        const subData = await subResponse.json()
        setSubscription(subData)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
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

  return (
    <div className="space-y-12">
      {/* Subscription Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <SubscriptionBanner />
      </motion.div>

      {/* Hero Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
        <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter text-balance">
          Create <span className="gradient-text">Stunning Presets</span>
          <br />
          with AI Magic
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-medium tracking-tight leading-relaxed">
          Transform your photos and videos with AI-generated presets. Upload your media, describe your vision, and get
          professional-grade presets instantly.
        </p>
        <Link href="/dashboard/generate">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-white px-12 py-6 rounded-2xl font-semibold text-lg soft-shadow hover:shadow-2xl transition-all duration-300"
          >
            Start Creating
            <ArrowRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-3xl font-bold mb-8 tracking-tight">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link href={action.href}>
                <Card className="h-40 border-border/30 hover:border-primary/50 transition-all duration-300 soft-shadow hover-lift card-glow bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-8 h-full flex items-center space-x-6">
                    <div
                      className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <action.icon className="w-12 h-12 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3 tracking-tight">{action.title}</h3>
                      <p className="text-muted-foreground font-medium">{action.description}</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <h2 className="text-3xl font-bold mb-8 tracking-tight">Your Creative Journey</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-border/30 glass-effect soft-shadow hover-lift card-glow bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl font-black mb-2 tracking-tight">{loading ? "..." : stats.totalPresets}</div>
                <div className="text-sm text-muted-foreground font-medium">Presets Created</div>
              </CardContent>
            </Card>
            <Card className="border-border/30 glass-effect soft-shadow hover-lift card-glow bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-cyan-500" />
                </div>
                <div className="text-4xl font-black mb-2 tracking-tight">{loading ? "..." : stats.totalDownloads}</div>
                <div className="text-sm text-muted-foreground font-medium">Total Downloads</div>
              </CardContent>
            </Card>
            <Card className="border-border/30 glass-effect soft-shadow hover-lift card-glow bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-4xl font-black mb-2 tracking-tight">
                  {loading ? "..." : stats.presetsThisMonth}
                </div>
                <div className="text-sm text-muted-foreground font-medium">This Month</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Recent Presets */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-3xl font-bold mb-8 tracking-tight">Recent Presets</h2>
          <Card className="border-border/30 soft-shadow card-glow bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-accent/30 animate-pulse"
                    >
                      <div className="flex-1">
                        <div className="h-4 bg-accent/50 rounded mb-2 w-3/4"></div>
                        <div className="h-3 bg-accent/30 rounded w-1/2"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-6 bg-accent/50 rounded w-12 mb-2"></div>
                        <div className="h-3 bg-accent/30 rounded w-8"></div>
                      </div>
                    </div>
                  ))
                ) : stats.recentPresets.length > 0 ? (
                  stats.recentPresets.map((preset, index) => (
                    <motion.div
                      key={preset.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-accent/30 transition-colors cursor-pointer hover-lift"
                    >
                      <div className="flex-1">
                        <div className="font-bold tracking-tight">{preset.preset_name}</div>
                        <div className="text-sm text-muted-foreground font-medium">{formatDate(preset.created_at)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block mb-2">
                          {preset.preset_type.toUpperCase()}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center justify-end font-medium">
                          <Download className="w-3 h-3 mr-1" />
                          {preset.downloads_count}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No presets created yet</p>
                    <p className="text-sm">Start creating your first preset!</p>
                  </div>
                )}
              </div>
              <Link href="/dashboard/presets">
                <Button
                  variant="ghost"
                  className="w-full mt-6 text-primary hover:text-primary hover:bg-primary/10 font-semibold"
                >
                  View All Presets
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
