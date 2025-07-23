"use client"

import { motion } from "framer-motion"
import { Palette, Monitor, Moon, Sun, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider"

const themeOptions = [
  {
    name: "System",
    value: "system" as const,
    icon: Monitor,
    description: "Adapts to your device settings",
    preview: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800",
  },
  {
    name: "Light",
    value: "light" as const,
    icon: Sun,
    description: "Clean and bright interface",
    preview: "bg-gradient-to-br from-white to-gray-50",
  },
  {
    name: "Dark",
    value: "dark" as const,
    icon: Moon,
    description: "Easy on the eyes",
    preview: "bg-gradient-to-br from-slate-900 to-slate-800",
  },
]

export function ThemeShowcase() {
  const { theme, setTheme } = useTheme()

  return (
    <Card className="border-border/50 soft-shadow card-glow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-primary" />
          <span>Theme Preferences</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {themeOptions.map((option, index) => {
            const Icon = option.icon
            const isSelected = theme === option.value

            return (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Button
                  variant="outline"
                  onClick={() => setTheme(option.value)}
                  className={`w-full p-4 h-auto rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-border/50 hover:border-primary/30 hover:bg-accent/30"
                  }`}
                >
                  <div className="flex items-center space-x-4 w-full">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${option.preview}`}>
                      <Icon className={`w-6 h-6 ${option.value === "light" ? "text-gray-700" : "text-white"}`} />
                    </div>

                    <div className="flex-1 text-left">
                      <div className="font-semibold">{option.name}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                </Button>

                {isSelected && (
                  <motion.div
                    layoutId="selectedThemeCard"
                    className="absolute inset-0 bg-primary/5 rounded-xl border-2 border-primary pointer-events-none"
                    transition={{ type: "spring", duration: 0.3 }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="text-sm">
            <div className="font-medium mb-1">Theme Benefits:</div>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>• Auto saves your preference across sessions</li>
              <li>• Smooth transitions between themes</li>
              <li>• Optimized for both creative work and eye comfort</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
