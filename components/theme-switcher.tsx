"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Monitor, Moon, Sun, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "./theme-provider"

const themes = [
  {
    name: "System",
    value: "system" as const,
    icon: Monitor,
    description: "Follow system preference",
  },
  {
    name: "Light",
    value: "light" as const,
    icon: Sun,
    description: "Clean and bright",
  },
  {
    name: "Dark",
    value: "dark" as const,
    icon: Moon,
    description: "Easy on the eyes",
  },
]

export function ThemeSwitcher() {
  const { theme, setTheme, actualTheme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  const currentTheme = themes.find((t) => t.value === theme)
  const CurrentIcon = currentTheme?.icon || Monitor

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-xl border-accent/30 bg-accent/10 hover:bg-accent/30 overflow-hidden group"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentIcon className="h-4 w-4" />
            </motion.div>
          </AnimatePresence>

          {/* Hover effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-cyan-500/20 opacity-0 group-hover:opacity-100"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 p-2 rounded-xl border-border/50 bg-background/80 backdrop-blur-sm"
      >
        <DropdownMenuLabel className="flex items-center space-x-2 px-3 py-2">
          <Palette className="h-4 w-4 text-primary" />
          <span>Theme Settings</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="space-y-1">
          {themes.map((themeOption, index) => {
            const Icon = themeOption.icon
            const isSelected = theme === themeOption.value

            return (
              <motion.div
                key={themeOption.value}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DropdownMenuItem
                  onClick={() => setTheme(themeOption.value)}
                  className={`relative px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-accent/30"
                  }`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div
                      className={`p-2 rounded-lg transition-colors ${isSelected ? "bg-primary/20" : "bg-accent/30"}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{themeOption.name}</div>
                      <div className="text-xs text-muted-foreground">{themeOption.description}</div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                    )}
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="selectedTheme"
                      className="absolute inset-0 bg-primary/5 rounded-lg"
                      transition={{ type: "spring", duration: 0.3 }}
                    />
                  )}
                </DropdownMenuItem>
              </motion.div>
            )
          })}
        </div>

        <DropdownMenuSeparator className="my-2" />

        <div className="px-3 py-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Current:</span>
            <span className="capitalize font-medium">{actualTheme}</span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
