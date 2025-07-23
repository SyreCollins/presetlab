"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeSwitcher } from "./theme-switcher"
import Link from "next/link"

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search presets..."
              className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/dashboard/generate">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
              <Badge variant="secondary" className="ml-2 bg-primary-foreground/20 text-primary-foreground">
                AI
              </Badge>
            </Link>
          </Button>

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}

export default TopBar
