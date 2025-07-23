"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Copy,
  Check,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  ExternalLink,
  CreditCard,
  Calendar,
  Filter,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import EarningsChart from "@/components/earnings-chart"
import ConversionFunnel from "@/components/conversion-funnel"

// Mock data
const affiliateStats = {
  totalSignups: 47,
  totalEarnings: 1247.5,
  pendingEarnings: 325.0,
  paidEarnings: 922.5,
  linkClicks: 1250,
  conversionRate: 3.76,
}

const weeklyEarnings = [
  { week: "Week 1", earnings: 125.5 },
  { week: "Week 2", earnings: 89.25 },
  { week: "Week 3", earnings: 156.75 },
  { week: "Week 4", earnings: 203.0 },
  { week: "Week 5", earnings: 178.25 },
  { week: "Week 6", earnings: 234.5 },
  { week: "Week 7", earnings: 260.25 },
]

const monthlyEarnings = [
  { month: "Jan", earnings: 450.25 },
  { month: "Feb", earnings: 623.5 },
  { month: "Mar", earnings: 789.75 },
  { month: "Apr", earnings: 1247.5 },
]

const affiliateActivity = [
  {
    id: 1,
    date: "2024-01-15",
    userEmail: "user****@gmail.com",
    status: "paid",
    commission: 25.0,
    plan: "Pro",
  },
  {
    id: 2,
    date: "2024-01-14",
    userEmail: "jane****@outlook.com",
    status: "converted",
    commission: 25.0,
    plan: "Pro",
  },
  {
    id: 3,
    date: "2024-01-13",
    userEmail: "mike****@yahoo.com",
    status: "signed_up",
    commission: 0,
    plan: "Free",
  },
  {
    id: 4,
    date: "2024-01-12",
    userEmail: "sara****@gmail.com",
    status: "paid",
    commission: 15.0,
    plan: "Starter",
  },
  {
    id: 5,
    date: "2024-01-11",
    userEmail: "alex****@hotmail.com",
    status: "converted",
    commission: 25.0,
    plan: "Pro",
  },
  {
    id: 6,
    date: "2024-01-10",
    userEmail: "emma****@gmail.com",
    status: "signed_up",
    commission: 0,
    plan: "Free",
  },
]

const conversionData = {
  clicks: 1250,
  signups: 47,
  conversions: 23,
  clickToSignup: 3.76,
  signupToConversion: 48.94,
}

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false)
  const [chartPeriod, setChartPeriod] = useState<"weekly" | "monthly">("weekly")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const referralLink = "https://presetlab.com/ref/johndoe123"

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Link copied!",
      description: "Your referral link has been copied to clipboard.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Paid</Badge>
      case "converted":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Converted</Badge>
      case "signed_up":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Signed Up</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredActivity =
    statusFilter === "all" ? affiliateActivity : affiliateActivity.filter((item) => item.status === statusFilter)

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-black mb-2 tracking-tight">Affiliate Program</h1>
          <p className="text-muted-foreground font-medium">Earn money by referring new users to PresetLab</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {affiliateStats.totalSignups} referrals
          </Badge>
        </div>
      </motion.div>

      {/* Referral Link Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border/50 soft-shadow card-glow bg-gradient-to-r from-primary/5 to-cyan-500/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExternalLink className="w-5 h-5 text-primary" />
              <span>Your Referral Link</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Input
                value={referralLink}
                readOnly
                className="flex-1 bg-background/50 border-border/50 font-mono text-sm"
              />
              <Button onClick={handleCopyLink} className="bg-primary hover:bg-primary/90 px-6">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground bg-background/30 rounded-lg p-4">
              <p className="font-medium mb-2">💰 Earn 25% commission on all paid subscriptions!</p>
              <ul className="space-y-1 text-xs">
                <li>• $15 for each Starter plan signup ($60/month)</li>
                <li>• $25 for each Pro plan signup ($100/month)</li>
                <li>• Payments processed monthly via PayPal or bank transfer</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="border-border/50 soft-shadow hover-lift card-glow bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Signups</p>
                <p className="text-3xl font-black tracking-tight">{affiliateStats.totalSignups}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 soft-shadow hover-lift card-glow bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <p className="text-3xl font-black tracking-tight">${affiliateStats.totalEarnings}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 soft-shadow hover-lift card-glow bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-black tracking-tight">${affiliateStats.pendingEarnings}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 soft-shadow hover-lift card-glow bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid Out</p>
                <p className="text-3xl font-black tracking-tight">${affiliateStats.paidEarnings}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts and Funnel */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Conversion Funnel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <ConversionFunnel data={conversionData} />
        </motion.div>

        {/* Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 soft-shadow card-glow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Earnings Overview</span>
              </CardTitle>
              <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as "weekly" | "monthly")}>
                <TabsList className="h-9">
                  <TabsTrigger value="weekly" className="text-xs">
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs">
                    Monthly
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <EarningsChart data={chartPeriod === "weekly" ? weeklyEarnings : monthlyEarnings} period={chartPeriod} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="border-border/50 soft-shadow card-glow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Affiliate Activity</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-accent/50">
                    <Filter className="w-4 h-4 mr-2" />
                    {statusFilter === "all" ? "All Status" : statusFilter.replace("_", " ")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("paid")}>Paid</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("converted")}>Converted</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("signed_up")}>Signed Up</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" className="border-accent/50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-accent/20">
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">User</TableHead>
                    <TableHead className="font-bold">Plan</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right">Commission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivity.map((activity) => (
                    <TableRow key={activity.id} className="hover:bg-accent/10">
                      <TableCell className="font-medium">{new Date(activity.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-mono text-sm">{activity.userEmail}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {activity.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(activity.status)}</TableCell>
                      <TableCell className="text-right font-bold">
                        {activity.commission > 0 ? `$${activity.commission.toFixed(2)}` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredActivity.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No activity found for the selected filter</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
