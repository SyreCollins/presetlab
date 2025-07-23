"use client"

import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { AnimatedBackground } from "@/components/animated-background"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gradient-to-br from-background via-background to-background/95 relative">
        <AnimatedBackground />
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-h-screen ml-64">
          <TopBar />
          <main className="flex-1 p-6 overflow-auto bg-background/50 backdrop-blur-sm">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
