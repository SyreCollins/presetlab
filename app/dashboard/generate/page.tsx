import type { Metadata } from "next"
import AppLayout from "@/components/app-layout"
import GeneratePage from "@/components/pages/generate-page"

export const metadata: Metadata = {
  title: "Generate AI Presets - Create Custom Photo & Video Filters",
  description:
    "Upload your photo or video and let AI create custom presets. Generate XMP files for Lightroom and CUBE files for video editing in seconds.",
  keywords: [
    "AI preset generator",
    "custom presets",
    "Lightroom XMP",
    "video LUT",
    "photo filters",
    "AI photo editing",
  ],
  openGraph: {
    title: "Generate AI Presets - PresetLab",
    description: "Upload your photo or video and let AI create custom presets instantly.",
    images: ["/og-generate.png"],
  },
  twitter: {
    title: "Generate AI Presets - PresetLab",
    description: "Upload your photo or video and let AI create custom presets instantly.",
    images: ["/og-generate.png"],
  },
}

export default function Page() {
  return (
    <AppLayout>
      <GeneratePage />
    </AppLayout>
  )
}
