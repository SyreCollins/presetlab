"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface EarningsChartProps {
  data: Array<{ [key: string]: string | number }>
  period: "weekly" | "monthly"
}

export default function EarningsChart({ data, period }: EarningsChartProps) {
  const xAxisKey = period === "weekly" ? "week" : "month"

  return (
    <ChartContainer
      config={{
        earnings: {
          label: "Earnings",
          color: "hsl(var(--primary))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
          <XAxis dataKey={xAxisKey} className="text-xs font-medium" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs font-medium" tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
          <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => [`$${value}`, "Earnings"]} />
          <Line
            type="monotone"
            dataKey="earnings"
            stroke="var(--color-earnings)"
            strokeWidth={3}
            dot={{ fill: "var(--color-earnings)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "var(--color-earnings)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
