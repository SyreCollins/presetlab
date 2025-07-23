import type { Metadata } from "next"
import AppLayout from "@/components/app-layout"
import PresetsPage from "@/components/pages/presets-page"

export const metadata: Metadata = {
  title: "My Presets - Manage Your Custom Photo & Video Presets",
  description:
    "View, download, and manage all your AI-generated custom presets. Access your XMP and CUBE files anytime.",
  keywords: ["preset library", "custom presets", "XMP files", "CUBE files", "preset management"],
  openGraph: {
    title: "My Presets - PresetLab",
    description: "View, download, and manage all your AI-generated custom presets.",
    images: ["/og-presets.png"],
  },
}

export default function Page() {
  return (
    <AppLayout>
      <PresetsPage />
    </AppLayout>
  )
}
