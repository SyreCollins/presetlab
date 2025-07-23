"use client"

import type React from "react"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { ArrowRight, Star, Zap, Camera, Sparkles, Heart, Download, Palette, Award, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth/auth-provider"

const painPoints = [
  "Spending hours tweaking settings, never quite getting the look you want",
  "Downloading preset packs that don't match your unique vision",
  "Feeling stuck in creative ruts with the same old editing styles",
  "Watching other creators nail that perfect aesthetic while you struggle",
]

const howItWorks = [
  {
    step: "01",
    title: "Upload Your Media",
    description: "Drop in your photo or video - any format, any style",
    icon: Camera,
    color: "from-purple-500 to-pink-500",
  },
  {
    step: "02",
    title: "Describe Your Vision",
    description: "Tell our AI exactly what mood and style you're after",
    icon: Sparkles,
    color: "from-cyan-500 to-blue-500",
  },
  {
    step: "03",
    title: "Get Your Custom Preset",
    description: "Download your personalized XMP or LUT file instantly",
    icon: Download,
    color: "from-green-500 to-emerald-500",
  },
]

const dreamOutcomes = [
  {
    title: "Your Signature Style",
    description: "Create presets that are uniquely yours - no more generic looks",
    icon: Palette,
    metric: "100% Custom",
  },
  {
    title: "Effortless Consistency",
    description: "Apply your perfect aesthetic across all your content instantly",
    icon: Zap,
    metric: "10x Faster",
  },
  {
    title: "Creative Confidence",
    description: "Never second-guess your editing choices again",
    icon: Heart,
    metric: "Zero Doubt",
  },
  {
    title: "Standout Content",
    description: "Make your work instantly recognizable in any feed",
    icon: Star,
    metric: "Pure Impact",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Wedding Photographer",
    avatar: "SC",
    content:
      "I used to spend 3+ hours editing each wedding gallery. Now I upload one photo, describe my vision, and have a custom preset in minutes. My clients are obsessed with the consistency.",
    rating: 5,
    highlight: "3+ hours → 15 minutes",
  },
  {
    name: "Marcus Rodriguez",
    role: "Travel Content Creator",
    avatar: "MR",
    content:
      "Finally found my signature look! The AI understood exactly what I meant by 'warm cinematic with moody shadows.' My engagement went up 40% since I started using these presets.",
    rating: 5,
    highlight: "+40% engagement",
  },
  {
    name: "Emma Thompson",
    role: "Brand Photographer",
    avatar: "ET",
    content:
      "This is magic. I describe the exact mood my client wants and get a preset that nails it every time. No more back-and-forth revisions or creative blocks.",
    rating: 5,
    highlight: "Zero revisions",
  },
]

// New testimonial wall data inspired by the reference
const testimonialWall = [
  {
    name: "Alex Kim",
    role: "Portrait Photographer",
    avatar: "AK",
    content: "Game changer for my portrait work!",
    rating: 5,
  },
  {
    name: "Maya Patel",
    role: "Food Blogger",
    avatar: "MP",
    content: "My food photos finally have that restaurant quality look",
    rating: 5,
  },
  {
    name: "Jake Wilson",
    role: "Wedding Videographer",
    avatar: "JW",
    content: "Clients are blown away by the cinematic feel",
    rating: 5,
  },
  {
    name: "Sofia Garcia",
    role: "Fashion Photographer",
    avatar: "SG",
    content: "Perfect for creating consistent brand aesthetics",
    rating: 5,
  },
  {
    name: "Ryan Chen",
    role: "Travel Blogger",
    avatar: "RC",
    content: "Every sunset looks like a movie scene now",
    rating: 5,
  },
  {
    name: "Lisa Park",
    role: "Product Photographer",
    avatar: "LP",
    content: "Saves me hours on every product shoot",
    rating: 5,
  },
  {
    name: "David Miller",
    role: "Real Estate Photographer",
    avatar: "DM",
    content: "Properties look magazine-ready instantly",
    rating: 5,
  },
  {
    name: "Anna Rodriguez",
    role: "Lifestyle Blogger",
    avatar: "AR",
    content: "Finally found my signature Instagram aesthetic",
    rating: 5,
  },
  {
    name: "Tom Anderson",
    role: "Event Photographer",
    avatar: "TA",
    content: "Consistent results across all lighting conditions",
    rating: 5,
  },
]

const faqs = [
  {
    question: "Will it actually match my unique style?",
    answer:
      "Yes! Our AI analyzes your specific image and style description to create presets tailored exactly to your vision. It's not generic - it's built for you.",
  },
  {
    question: "Does it work with my editing software?",
    answer:
      "Absolutely. We generate XMP files for Lightroom and CUBE files for video editing software like Premiere Pro, Final Cut, and DaVinci Resolve.",
  },
  {
    question: "What if I don't like the result?",
    answer:
      "Simply adjust your description and generate again during your trial. Plus, you can fine-tune any preset we create to get it exactly right.",
  },
  {
    question: "How is this different from preset packs?",
    answer:
      "Preset packs are one-size-fits-all. We create presets specifically for YOUR image and YOUR vision. It's like having a personal colorist who knows exactly what you want.",
  },
]

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Add interface for stats
interface AppStats {
  totalUsers: number
  totalPresets: number
  averageRating: number
  satisfactionRate: number
}

// Add the useState hook for billing toggle at the top of the component
export default function LandingPage() {
  const [billingAnnual, setBillingAnnual] = useState(false)
  const [stats, setStats] = useState<AppStats>({
    totalUsers: 12000,
    totalPresets: 250000,
    averageRating: 4.9,
    satisfactionRate: 98,
  })
  const { user, loading } = useAuth()

  // Fetch dynamic stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        // Keep fallback values
      }
    }

    fetchStats()
  }, [])

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`
    }
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 overflow-hidden">
      {/* Header */}
      <header className="relative border-b border-border/20 bg-background/80 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent tracking-tight">
              PresetLab
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-20 h-9 bg-muted/50 rounded animate-pulse" />
            ) : user ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" className="font-semibold text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg">
                    Start Free Trial
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - Clarify the Problem & Label the Solution */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-orange-50/50 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-orange-950/20" />
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />

        <div className="container max-w-7xl mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-300 dark:border-purple-700/50">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Preset Generation
              </Badge>

              <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9]">
                Stop Fighting With
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  Generic Presets
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 font-medium leading-relaxed">
                You know that perfect aesthetic in your head? The one you can never quite capture with existing presets?
              </p>

              <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed">
                <strong className="text-foreground">PresetLab's AI creates custom presets</strong> that match your exact
                vision. Upload your image, describe your style, get your perfect preset in minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                {user ? (
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white px-12 py-6 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/signup">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white px-12 py-6 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group"
                    >
                      Start 3-Day Free Trial
                      <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
                <p className="text-sm text-muted-foreground">3-day free trial • Cancel anytime</p>
              </div>
            </motion.div>

            {/* Pain Points */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-800/50 shadow-xl"
            >
              <h3 className="text-lg font-bold mb-6 text-muted-foreground">Sound familiar?</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                {painPoints.map((pain, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start space-x-3 p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30"
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{pain}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Numbers - Now Dynamic */}
      <AnimatedSection className="py-16 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-orange-600/5">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {formatNumber(stats.totalUsers)}+
              </div>
              <div className="text-sm font-semibold text-muted-foreground">Creators Using PresetLab</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {formatNumber(stats.totalPresets)}+
              </div>
              <div className="text-sm font-semibold text-muted-foreground">Presets Generated</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {stats.averageRating}★
              </div>
              <div className="text-sm font-semibold text-muted-foreground">Average Rating</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {stats.satisfactionRate}%
              </div>
              <div className="text-sm font-semibold text-muted-foreground">Satisfaction Rate</div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Problem Statement - Inspired by "Posting content shouldn't be this hard" */}
      <AnimatedSection className="py-20">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">
            Creating Your Perfect Aesthetic
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              {" "}
              Shouldn't Be This Hard
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <div className="w-3 h-3 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-bold mb-2">Hours of Trial & Error</h3>
                  <p className="text-sm text-muted-foreground">
                    Endlessly tweaking sliders, never getting it quite right
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <div className="w-3 h-3 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-bold mb-2">Generic Preset Packs</h3>
                  <p className="text-sm text-muted-foreground">
                    One-size-fits-all solutions that never match your vision
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <div className="w-3 h-3 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-bold mb-2">Inconsistent Results</h3>
                  <p className="text-sm text-muted-foreground">Every photo looks different, no cohesive style</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <div className="w-3 h-3 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-bold mb-2">Creative Frustration</h3>
                  <p className="text-sm text-muted-foreground">
                    Knowing exactly what you want but unable to achieve it
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* How It Works - Overview */}
      <AnimatedSection className="py-20 bg-gradient-to-b from-background to-gray-50/50 dark:to-gray-950/50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              From Vision to Preset in
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                3 Simple Steps
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              No more guesswork. No more settling. Just your perfect aesthetic, every time.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <Card className="h-full border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-sm font-bold text-muted-foreground mb-2">{step.step}</div>
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>

                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/dashboard/generate">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-xl font-bold shadow-lg"
              >
                Start Creating Now
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Compatible Software Logos */}
      <AnimatedSection className="py-16 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-orange-600/5">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
              Works With
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Your Favorite Tools
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our presets seamlessly integrate with all major photo and video editing software
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center">
            {/* Adobe Lightroom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/80 dark:bg-gray-800/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 p-3">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">Lr</span>
                </div>
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">Lightroom</p>
            </motion.div>

            {/* Adobe Photoshop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/80 dark:bg-gray-800/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 p-3">
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">Ps</span>
                </div>
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">Photoshop</p>
            </motion.div>

            {/* Adobe Premiere Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/80 dark:bg-gray-800/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 p-3">
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">Pr</span>
                </div>
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">Premiere Pro</p>
            </motion.div>

            {/* Final Cut Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/80 dark:bg-gray-800/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 p-3">
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">FCP</span>
                </div>
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">Final Cut Pro</p>
            </motion.div>

            {/* DaVinci Resolve */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/80 dark:bg-gray-800/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 p-3">
                <div className="w-full h-full bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">DV</span>
                </div>
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">DaVinci Resolve</p>
            </motion.div>

            {/* Capture One */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/80 dark:bg-gray-800/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 p-3">
                <div className="w-full h-full bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">C1</span>
                </div>
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">Capture One</p>
            </motion.div>

            {/* Affinity Photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/80 dark:bg-gray-800/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 p-3">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">AP</span>
                </div>
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">Affinity Photo</p>
            </motion.div>

            {/* More to come */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/80 dark:bg-gray-800/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 p-3">
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">+</span>
                </div>
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">More to come</p>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Dream Outcomes - Inspired by Linear */}
      <AnimatedSection className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Unlock Your
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Creative Potential
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Imagine the possibilities when you have a personal AI colorist at your fingertips.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dreamOutcomes.map((outcome, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <Card className="h-full border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <outcome.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{outcome.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-4">{outcome.description}</p>
                    <Badge className="bg-green-500/10 text-green-500 border-green-200 dark:border-green-700/50">
                      {outcome.metric}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Pricing Section - Transparent Pricing Tiers */}
      <AnimatedSection className="py-20 bg-gradient-to-b from-background to-gray-50/50 dark:to-gray-950/50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Simple,
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that's right for your creative journey. No hidden fees, cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <span className={`text-sm font-medium ${!billingAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <Switch
                checked={billingAnnual}
                onCheckedChange={setBillingAnnual}
                className="data-[state=checked]:bg-purple-600"
              />
              <span className={`text-sm font-medium ${billingAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                Yearly{" "}
                <Badge className="ml-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  Save 20%
                </Badge>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Starter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <Card className="h-full border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-lg font-bold mb-2">Starter</div>
                    <div className="text-4xl font-black mb-2">${billingAnnual ? "7" : "9"}</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>

                  <div className="border-t border-border/50 my-6"></div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">10 preset generations per month</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Basic style descriptions</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">XMP & CUBE formats</span>
                    </li>
                    <li className="flex items-start">
                      <X className="w-5 h-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Advanced style control</span>
                    </li>
                    <li className="flex items-start">
                      <X className="w-5 h-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Priority support</span>
                    </li>
                  </ul>

                  <Link href="/dashboard/generate" className="block">
                    <Button variant="outline" className="w-full py-6 rounded-xl font-bold">
                      Start 3-Day Trial
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro Plan - Most Popular */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -top-5 left-0 right-0 flex justify-center">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-1 rounded-full">
                  Most Popular
                </Badge>
              </div>
              <Card className="h-full border-2 border-purple-500/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-lg font-bold mb-2">Pro</div>
                    <div className="text-4xl font-black mb-2">${billingAnnual ? "19" : "24"}</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>

                  <div className="border-t border-border/50 my-6"></div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">50 preset generations per month</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Advanced style descriptions</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">XMP & CUBE formats</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Advanced style control</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Preset library storage</span>
                    </li>
                    <li className="flex items-start">
                      <X className="w-5 h-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Priority support</span>
                    </li>
                  </ul>

                  <Link href="/dashboard/generate" className="block">
                    <Button className="w-full py-6 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Start 3-Day Trial
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <Card className="h-full border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-lg font-bold mb-2">Enterprise</div>
                    <div className="text-4xl font-black mb-2">${billingAnnual ? "39" : "49"}</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>

                  <div className="border-t border-border/50 my-6"></div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Unlimited preset generations</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Advanced style descriptions</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">XMP & CUBE formats</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Advanced style control</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Unlimited preset library storage</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Priority support</span>
                    </li>
                  </ul>

                  <Link href="/dashboard/generate" className="block">
                    <Button variant="outline" className="w-full py-6 rounded-xl font-bold">
                      Start 3-Day Trial
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>All plans include a 3-day free trial. No questions asked.</p>
            <p className="mt-2">
              Need a custom plan for your team?{" "}
              <a href="#" className="text-purple-600 hover:underline">
                Contact us
              </a>{" "}
              for enterprise pricing.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Founder Story Section - Inspired by reference */}
      <AnimatedSection className="py-20 bg-gradient-to-r from-gray-50 to-purple-50/50 dark:from-gray-950 dark:to-purple-950/50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative">
                <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center mx-auto lg:mx-0 shadow-2xl">
                  <div className="w-72 h-72 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-8xl font-black text-white">JD</div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex items-center justify-center">
                  <Award className="w-12 h-12 text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700/50">
                  <Heart className="w-3 h-3 mr-1" />
                  Founder Story
                </Badge>
                <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">
                  Why I Built
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {" "}
                    PresetLab
                  </span>
                </h2>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Hey, I'm John.</strong> Three years ago, I was exactly where you
                  are now. Frustrated photographer spending countless hours trying to achieve that perfect look I had in
                  my head.
                </p>
                <p>
                  I'd buy preset pack after preset pack, hoping one would finally capture my vision. Nothing worked.
                  They were all generic, created for someone else's style, not mine.
                </p>
                <p>
                  <strong className="text-foreground">That's when it hit me:</strong> What if AI could understand my
                  exact vision and create a preset just for me? Not for everyone else - just for me.
                </p>
                <p>
                  After 18 months of development and testing with over 500 photographers, PresetLab was born. Now,
                  {formatNumber(stats.totalUsers)}+ creators have found their signature style.
                </p>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-purple-600">18</div>
                  <div className="text-xs text-muted-foreground">Months Building</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-purple-600">500+</div>
                  <div className="text-xs text-muted-foreground">Beta Testers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-purple-600">{formatNumber(stats.totalUsers)}+</div>
                  <div className="text-xs text-muted-foreground">Happy Creators</div>
                </div>
              </div>

              <div className="pt-6">
                <p className="text-sm italic text-muted-foreground">
                  "Every creator deserves to have their exact vision come to life. That's what PresetLab does."
                </p>
                <div className="mt-2 text-sm font-semibold">— John Doe, Founder</div>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonial Slider - Carousel */}
      <AnimatedSection className="py-20 bg-gradient-to-b from-gray-50/50 to-background dark:from-gray-950/50 dark:to-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Don't Just Take Our Word For It</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how PresetLab is transforming the workflows of creators just like you.
            </p>
          </div>

          <div className="relative">
            {/* Testimonial Cards */}
            <div className="flex overflow-x-auto snap-x snap-mandatory space-x-6 py-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="snap-start w-full sm:w-[70%] md:w-[50%] lg:w-[40%] flex-shrink-0">
                  <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-xl">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-semibold">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <h3 className="font-bold">{testimonial.name}</h3>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-4">{testimonial.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500" />
                          ))}
                        </div>
                        {testimonial.highlight && (
                          <Badge className="bg-blue-500/10 text-blue-500 border-blue-200 dark:border-blue-700/50">
                            {testimonial.highlight}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Optional: Navigation Arrows (Styling needed) */}
            {/* <div className="absolute top-1/2 -translate-y-1/2 left-2">
              <Button variant="ghost"><ArrowLeft /></Button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2">
              <Button variant="ghost"><ArrowRight /></Button>
            </div> */}
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonial Wall - Grid */}
      <AnimatedSection className="py-20 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-orange-600/5">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Join Thousands of Happy Creators</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              PresetLab is helping photographers and videographers around the world achieve their creative vision.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {testimonialWall.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-semibold text-sm">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">{testimonial.name}</h3>
                        <p className="text-[0.7rem] text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{testimonial.content}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection className="py-20">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know about creating custom presets with PresetLab.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border-b border-border/20 pb-6 last:border-none"
              >
                <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section - Final Call to Action */}
      <AnimatedSection className="py-24 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-orange-600/10">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">
            Ready to Create Your Signature Aesthetic?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Start your free trial today and experience the future of preset creation.
          </p>
          <Link href="/dashboard/generate">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group"
            >
              Start 3-Day Free Trial
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="py-12 border-t border-border/20">
        <div className="container max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">&copy; {new Date().getFullYear()} PresetLab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
