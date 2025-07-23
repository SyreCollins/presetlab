"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Home, Sparkles, FolderOpen, User, Share2, Zap, Palette, Settings, LogOut, Calendar } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  {
    title: "Home",
    icon: Home,
    href: "/dashboard",
    description: "Overview & quick actions",
  },
  {
    title: "Generate Preset",
    icon: Sparkles,
    href: "/dashboard/generate",
    description: "Create new presets",
  },
  {
    title: "My Presets",
    icon: FolderOpen,
    href: "/dashboard/presets",
    description: "Your preset library",
  },
  {
    title: "Account",
    icon: User,
    href: "/dashboard/account",
    description: "Settings & profile",
  },
  {
    title: "Affiliate",
    icon: Share2,
    href: "/dashboard/affiliate",
    description: "Earn with referrals",
  },
]

interface UserStats {
  totalPresets: number
  presetsThisMonth: number
  currentPlan: string
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [userStats, setUserStats] = useState<UserStats>({
    totalPresets: 0,
    presetsThisMonth: 0,
    currentPlan: "free",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserStats()
    }
  }, [user])

  const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/user/dashboard")
      if (response.ok) {
        const data = await response.json()
        setUserStats({
          totalPresets: data.totalPresets,
          presetsThisMonth: data.presetsThisMonth,
          currentPlan: data.currentPlan,
        })
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getDisplayName = () => {
    if (user?.user_metadata?.name) return user.user_metadata.name
    if (user?.email) return user.email.split("@")[0]
    return "User"
  }

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case "free":
        return "Free Plan"
      case "starter":
        return "Starter Plan"
      case "pro":
        return "Pro Plan"
      default:
        return "Free Plan"
    }
  }

  return (
    <Sidebar className="border-r border-border/50 h-screen fixed left-0 top-0 z-50 w-64">
      <SidebarHeader className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center soft-shadow">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black gradient-text tracking-tight">PresetLab</h1>
            <p className="text-xs text-muted-foreground font-medium tracking-wide">AI-Powered Presets</p>
          </div>
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="px-4 flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigation.map((item, index) => (
                <SidebarMenuItem key={item.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className="h-16 rounded-xl transition-all duration-200 hover:bg-accent/30 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:border-primary/20 data-[active=true]:border hover-lift"
                    >
                      <Link href={item.href} className="flex items-center space-x-4 px-4">
                        <div className={`p-2 rounded-lg ${pathname === item.href ? "bg-primary/20" : "bg-accent/30"}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-bold tracking-tight">{item.title}</div>
                          <div className="text-xs text-muted-foreground font-medium">{item.description}</div>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-8 p-5 rounded-xl glass-effect card-glow soft-shadow">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Palette className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-bold tracking-tight">Quick Stats</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Presets Created</span>
              <span className="font-bold bg-accent/30 px-2 py-0.5 rounded-md tracking-tight">
                {loading ? "..." : userStats.totalPresets}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">This Month</span>
              <span className="font-bold bg-accent/30 px-2 py-0.5 rounded-md tracking-tight">
                {loading ? "..." : userStats.presetsThisMonth}
              </span>
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto hover:bg-accent/30 transition-colors card-glow"
            >
              <div className="flex items-center space-x-3 w-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-cyan-500 text-white font-bold">
                    {getUserInitials(user?.user_metadata?.name || user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="text-sm font-bold tracking-tight">{getDisplayName()}</div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {loading ? "..." : getPlanDisplayName(userStats.currentPlan)}
                  </div>
                </div>
                <Settings className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/account">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/account">
                <Calendar className="mr-2 h-4 w-4" />
                Subscription
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {isSigningOut ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
