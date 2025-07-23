"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Upload, Sparkles, ArrowLeft, Download, Copy, Crown, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import UploadSection from "@/components/upload-section"
import StylePrompt from "@/components/style-prompt"
import PreviewSection from "@/components/preview-section"
import DownloadSection from "@/components/download-section"
import { convertToXMP } from "@/lib/convert-to-xmp"
import type { PresetResult } from "@/lib/types/preset"
import Link from "next/link"

export type MediaType = "image" | "video" | null

export interface MediaFile {
  url: string
  type: MediaType
  name: string
  file?: File // Store the actual file for API upload
}

export default function GeneratePage() {
  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null)
  const [stylePrompt, setStylePrompt] = useState<string>("")
  const [uploadPrompt, setUploadPrompt] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [presetResult, setPresetResult] = useState<PresetResult | null>(null)
  const [usage, setUsage] = useState<{ current: number; limit: number; plan: string; hasAccess: boolean } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsage()
  }, [])

  const fetchUsage = async () => {
    try {
      const response = await fetch("/api/user/usage")
      if (response.ok) {
        const data = await response.json()
        setUsage(data)
      }
    } catch (error) {
      console.error("Failed to fetch usage:", error)
    }
  }

  const handleMediaUpload = (file: MediaFile) => {
    setMediaFile(file)
    setPresetResult(null)
  }

  const handleStylePromptChange = (prompt: string) => {
    setStylePrompt(prompt)
  }

  const handleUploadPromptChange = (prompt: string) => {
    setUploadPrompt(prompt)
  }

  const handleDownload = () => {
    if (!presetResult) return

    try {
      // Convert to XMP and download
      const xmpContent = convertToXMP(presetResult.rawData)
      const blob = new Blob([xmpContent], { type: "application/xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${presetResult.presetName}.xmp`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Track download if needed
      fetch("/api/user/track-usage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action_type: "download",
          resource_id: presetResult.id
        }),
      }).catch(err => console.error("Failed to track download:", err))
    } catch (error) {
      console.error("Failed to download preset:", error)
      toast({
        title: "Download failed",
        description: "There was an error downloading your preset. Please try again.",
        variant: "destructive",
      })
    }
  }

  const generatePreset = async () => {
    // Determine which prompt to use based on current context
    const currentPrompt = uploadPrompt || stylePrompt

    if (!currentPrompt && !mediaFile) {
      toast({
        title: "Input required",
        description: "Please provide either a style description or upload media",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Create form data for the API request
      const formData = new FormData()

      if (currentPrompt) {
        formData.append("user_prompt", currentPrompt)
      }

      // Add image if available
      if (mediaFile?.file && mediaFile.type === "image") {
        formData.append("image", mediaFile.file)
      }

      // Call our API endpoint
      const response = await fetch("/api/generate-preset", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const data = await response.json()

      // Handle subscription-related errors
      if (data.requiresSubscription) {
        toast({
          title: "Subscription Required",
          description: data.error,
          variant: "destructive",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = "/pricing"}
            >
              View Plans
            </Button>
          ),
        })
        return
      }

      if (data.requiresUpgrade) {
        toast({
          title: "Upgrade Required",
          description: data.error,
          variant: "destructive",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = "/pricing"}
            >
              Upgrade Plan
            </Button>
          ),
        })
        return
      }

      // Create preset result from API response
      const presetName = data.preset_name || `preset_${Date.now()}`
      
      setPresetResult({
        id: data.id || undefined,
        presetName,
        presetType: "xmp",
        description: data.description || currentPrompt || "",
        color_grading: data.color_grading || {},
        effects: data.effects || {},
        lightroom_adjustments: data.lightroom_adjustments || {},
        rawData: data,
      })

      toast({
        title: "Preset generated!",
        description: `Your XMP preset is ready to download.`,
      })

      // Refresh usage after successful generation
      fetchUsage()
    } catch (error) {
      console.error("Error generating preset:", error)
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "There was an error generating your preset. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Generate Preset</h1>
          <p className="text-muted-foreground">Upload your media and create AI-powered presets</p>
        </div>
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Panel - Controls */}
        <motion.div
          className="xl:col-span-1 space-y-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Usage Status */}
          {usage && (
            <Card className="border-border/50 soft-shadow mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Usage</span>
                  <Badge variant={usage.hasAccess ? "default" : "destructive"}>
                    {usage.plan.charAt(0).toUpperCase() + usage.plan.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {usage.current} / {usage.limit === 999999 ? "∞" : usage.limit} presets
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {usage.limit === 999999 ? "Unlimited" : `${Math.max(0, usage.limit - usage.current)} remaining`}
                  </span>
                </div>
                {usage.limit !== 999999 && (
                  <Progress value={(usage.current / usage.limit) * 100} className="h-2" />
                )}
                {!usage.hasAccess && (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {usage.plan === "free" 
                          ? "Subscription required to generate presets"
                          : "Monthly limit reached. Upgrade for more presets."
                        }
                      </p>
                    </div>
                    <Link href="/pricing" className="mt-2 inline-block">
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                        {usage.plan === "free" ? "Subscribe Now" : "Upgrade Plan"}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="border-border/50 soft-shadow hover-lift card-glow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Create Your Preset</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 p-1 h-12">
                  <TabsTrigger
                    value="upload"
                    className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    Upload
                  </TabsTrigger>
                  <TabsTrigger
                    value="style"
                    className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    Style
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4 pt-2">
                  <UploadSection
                    onUpload={handleMediaUpload}
                    onPromptChange={handleUploadPromptChange}
                    uploadPrompt={uploadPrompt}
                  />
                </TabsContent>

                <TabsContent value="style" className="space-y-4 pt-2">
                  <StylePrompt value={stylePrompt} onChange={handleStylePromptChange} disabled={false} />
                </TabsContent>
              </Tabs>

              <motion.div className="mt-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={generatePreset}
                  disabled={(!stylePrompt && !uploadPrompt && !mediaFile) || isProcessing || (usage && !usage.hasAccess)}
                  className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-white py-6 rounded-xl font-medium soft-shadow disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing Magic...
                    </>
                  ) : usage && !usage.hasAccess ? (
                    <>
                      <Crown className="h-5 w-5 mr-2" />
                      {usage.plan === "free" ? "Subscribe to Generate" : "Upgrade to Continue"}
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Generate Preset
                    </>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>

          {presetResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Download Your Preset
                  </CardTitle>
                  <CardDescription>
                    Your AI-generated preset is ready! Download it as an XMP file to use in Lightroom.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">XMP Format</Badge>
                    <Badge variant="outline">Lightroom Compatible</Badge>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download XMP
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const settingsText = JSON.stringify(presetResult.rawData, null, 2)
                        navigator.clipboard.writeText(settingsText)
                          .then(() => {
                            toast({
                              title: "Settings copied",
                              description: "Preset settings copied to clipboard",
                            })
                          })
                          .catch(err => {
                            console.error("Failed to copy settings:", err)
                          })
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Right Panel - Preview */}
        <motion.div
          className="xl:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <PreviewSection mediaFile={mediaFile} presetResult={presetResult} isProcessing={isProcessing} />
        </motion.div>
      </div>
    </div>
  )
}