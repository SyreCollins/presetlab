import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    default: "PresetLab - AI-Powered Photo & Video Presets | Custom Lightroom & LUT Generator",
    template: "%s | PresetLab",
  },
  description:
    "Create custom photo and video presets with AI. Upload your image, describe your vision, get personalized XMP and CUBE files instantly. Perfect for Lightroom, Premiere Pro, and more.",
  keywords: [
    "AI presets",
    "custom presets",
    "Lightroom presets",
    "photo editing",
    "video editing",
    "LUT generator",
    "XMP presets",
    "CUBE files",
    "AI photo editing",
    "custom filters",
    "photography presets",
    "video color grading",
    "Premiere Pro presets",
    "Final Cut Pro",
    "DaVinci Resolve",
    "photo filters",
    "AI colorist",
    "preset generator",
    "custom aesthetic",
    "signature style",
  ],
  authors: [{ name: "PresetLab Team" }],
  creator: "PresetLab",
  publisher: "PresetLab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://presetlab.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "PresetLab - AI-Powered Photo & Video Presets",
    description:
      "Create custom photo and video presets with AI. Upload your image, describe your vision, get personalized XMP and CUBE files instantly.",
    siteName: "PresetLab",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PresetLab - AI-Powered Custom Presets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PresetLab - AI-Powered Photo & Video Presets",
    description:
      "Create custom photo and video presets with AI. Upload your image, describe your vision, get personalized XMP and CUBE files instantly.",
    images: ["/og-image.png"],
    creator: "@presetlab",
    site: "@presetlab",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
  classification: "Photo & Video Editing Software",
  referrer: "origin-when-cross-origin",

  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#8b5cf6" }],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#8b5cf6",
    "msapplication-config": "/browserconfig.xml",
  },
    generator: 'v0.dev'
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap" rel="stylesheet" />

        {/* Additional SEO Meta Tags */}
        <meta name="application-name" content="PresetLab" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PresetLab" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#8b5cf6" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://api.fontshare.com" />

        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "PresetLab",
              description:
                "AI-powered photo and video preset generator. Create custom XMP and CUBE files for Lightroom, Premiere Pro, and more.",
              url: "https://presetlab.vercel.app",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "9.00",
                priceCurrency: "USD",
                priceValidUntil: "2025-12-31",
                availability: "https://schema.org/InStock",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "500",
                bestRating: "5",
                worstRating: "1",
              },
              author: {
                "@type": "Organization",
                name: "PresetLab Team",
              },
              publisher: {
                "@type": "Organization",
                name: "PresetLab",
                logo: {
                  "@type": "ImageObject",
                  url: "https://presetlab.vercel.app/logo.png",
                },
              },
              screenshot: "https://presetlab.vercel.app/og-image.png",
              featureList: [
                "AI-powered preset generation",
                "Custom XMP and CUBE file creation",
                "Lightroom integration",
                "Video editing presets",
                "Style description to preset conversion",
                "Multiple format support",
              ],
            }),
          }}
        />

        {/* Additional Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PresetLab",
              url: "https://presetlab.vercel.app",
              logo: "https://presetlab.vercel.app/logo.png",
              description: "AI-powered photo and video preset generator",
              foundingDate: "2024",
              sameAs: [
                "https://twitter.com/presetlab",
                "https://instagram.com/presetlab",
                "https://linkedin.com/company/presetlab",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "support@presetlab.com",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="presetlab-theme">
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
