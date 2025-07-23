"use client"

import { motion } from "framer-motion"
import { Eye, UserPlus, CreditCard, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ConversionFunnelProps {
  data: {
    clicks: number
    signups: number
    conversions: number
    clickToSignup: number
    signupToConversion: number
  }
}

export default function ConversionFunnel({ data }: ConversionFunnelProps) {
  const funnelSteps = [
    {
      label: "Link Clicks",
      value: data.clicks,
      icon: Eye,
      color: "bg-blue-500",
      width: 100,
    },
    {
      label: "Signups",
      value: data.signups,
      icon: UserPlus,
      color: "bg-green-500",
      width: (data.signups / data.clicks) * 100,
    },
    {
      label: "Conversions",
      value: data.conversions,
      icon: CreditCard,
      color: "bg-primary",
      width: (data.conversions / data.clicks) * 100,
    },
  ]

  return (
    <Card className="border-border/50 soft-shadow card-glow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span>Conversion Funnel</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {funnelSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg ${step.color}/10 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${step.color.replace("bg-", "text-")}`} />
                    </div>
                    <span className="font-medium text-sm">{step.label}</span>
                  </div>
                  <span className="font-bold">{step.value.toLocaleString()}</span>
                </div>

                <div className="relative h-3 bg-accent/20 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${step.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${step.width}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>

                {index < funnelSteps.length - 1 && (
                  <div className="flex justify-center mt-2">
                    <div className="w-px h-4 bg-border/50" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Click → Signup Rate</span>
            <span className="font-bold text-green-500">{data.clickToSignup}%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Signup → Conversion Rate</span>
            <span className="font-bold text-primary">{data.signupToConversion}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
