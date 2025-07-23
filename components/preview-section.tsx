"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SquareSplitHorizontalIcon as SplitHorizontal, Eye, Sparkles, ArrowLeftRight } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MediaFile, PresetResult } from "./pages/generate-page"

interface PreviewSectionProps {
  mediaFile: MediaFile | null
  presetResult: PresetResult | null
  isProcessing: boolean
}

export default function PreviewSection({ mediaFile, presetResult, isProcessing }: PreviewSectionProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isHovering, setIsHovering] = useState(false)
  const [viewMode, setViewMode] = useState<"slider" | "sideBySide">("slider")

  useEffect(() => {
    setSliderPosition(50)
  }, [mediaFile])

  if (!mediaFile) {
    return (
      <Card className="h-full min-h-[500px] border-border/50 soft-shadow hover-lift card-glow">
        <CardContent className="h-full flex items-center justify-center p-8">
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-8">
              <SplitHorizontal className="h-12 w-12 text-primary/70" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-4">Before & After Preview</h3>
            <p className="text-muted-foreground max-w-md">
              Upload your media to see a stunning before and after comparison of your AI-generated preset
            </p>
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 soft-shadow hover-lift card-glow overflow-hidden">
      <CardHeader className="border-b border-border/50 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-primary" />
          <span>Live Preview</span>
        </CardTitle>

        {presetResult && (
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "slider" | "sideBySide")} className="w-auto">
            <TabsList className="h-9 p-1">
              <TabsTrigger value="slider" className="text-xs px-3 rounded-lg">
                <SplitHorizontal className="w-4 h-4 mr-1" />
                Slider
              </TabsTrigger>
              <TabsTrigger value="sideBySide" className="text-xs px-3 rounded-lg">
                <ArrowLeftRight className="w-4 h-4 mr-1" />
                Side by Side
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>

      <div className="relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        {viewMode === "slider" ? (
          <>
            {/* Original Media */}
            <div className="w-full aspect-video bg-black flex items-center justify-center">
              {mediaFile.type === "image" ? (
                <img
                  src={mediaFile.url || "/placeholder.svg"}
                  alt="Original"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <video
                  src={mediaFile.url}
                  controls={!presetResult}
                  loop
                  muted
                  autoPlay={!!presetResult}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Processed Media (After) */}
            {presetResult && (
              <motion.div
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${sliderPosition}%` }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="w-full aspect-video bg-black flex items-center justify-center relative"
                  style={{ width: `${100 / (sliderPosition / 100)}%` }}
                >
                  {mediaFile.type === "image" ? (
                    <img
                      src={mediaFile.url || "/placeholder.svg"}
                      alt="Processed"
                      className="max-h-full max-w-full object-contain"
                      style={{ filter: "contrast(1.2) saturate(1.3) brightness(1.05) hue-rotate(10deg)" }}
                    />
                  ) : (
                    <video
                      src={mediaFile.url}
                      muted
                      autoPlay
                      loop
                      className="w-full h-full object-contain"
                      style={{ filter: "contrast(1.2) saturate(1.3) brightness(1.05) hue-rotate(10deg)" }}
                    />
                  )}
                </div>
              </motion.div>
            )}

            {/* Comparison Slider */}
            {presetResult && (
              <>
                <motion.div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                  style={{
                    left: `calc(${sliderPosition}% - 0.5px)`,
                    opacity: isHovering ? 1 : 0.8,
                  }}
                  whileHover={{ scale: 1.2 }}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <SplitHorizontal className="w-4 h-4 text-gray-600" />
                  </div>
                </motion.div>

                <div className="absolute left-0 right-0 bottom-8 px-8">
                  <Slider
                    value={[sliderPosition]}
                    min={0}
                    max={100}
                    step={0.1}
                    onValueChange={(value) => setSliderPosition(value[0])}
                    className="cursor-pointer"
                  />
                </div>

                <motion.div
                  className="absolute top-4 left-4 text-xs font-medium px-3 py-1.5 rounded-full bg-primary text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isHovering ? 1 : 0.7, x: 0 }}
                >
                  After
                </motion.div>

                <motion.div
                  className="absolute top-4 right-4 text-xs font-medium px-3 py-1.5 rounded-full bg-black/70 text-white"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: isHovering ? 1 : 0.7, x: 0 }}
                >
                  Before
                </motion.div>
              </>
            )}
          </>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <div className="aspect-video bg-black rounded-xl overflow-hidden">
                  {mediaFile.type === "image" ? (
                    <img
                      src={mediaFile.url || "/placeholder.svg"}
                      alt="Original"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <video src={mediaFile.url} controls loop muted className="w-full h-full object-contain" />
                  )}
                </div>
                <div className="absolute top-2 left-2 text-xs font-medium px-3 py-1 rounded-full bg-black/70 text-white">
                  Before
                </div>
              </div>

              <div className="relative">
                <div className="aspect-video bg-black rounded-xl overflow-hidden">
                  {mediaFile.type === "image" ? (
                    <img
                      src={mediaFile.url || "/placeholder.svg"}
                      alt="Processed"
                      className="w-full h-full object-contain"
                      style={{ filter: "contrast(1.2) saturate(1.3) brightness(1.05) hue-rotate(10deg)" }}
                    />
                  ) : (
                    <video
                      src={mediaFile.url}
                      controls
                      loop
                      muted
                      className="w-full h-full object-contain"
                      style={{ filter: "contrast(1.2) saturate(1.3) brightness(1.05) hue-rotate(10deg)" }}
                    />
                  )}
                </div>
                <div className="absolute top-2 left-2 text-xs font-medium px-3 py-1 rounded-full bg-primary text-white">
                  After
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Compare the original and processed versions side by side
            </div>
          </div>
        )}

        {/* Processing Overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="mb-6"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-cyan-500 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </motion.div>
              <h3 className="text-white font-semibold text-xl mb-3">AI is working its magic...</h3>
              <p className="text-white/70 text-center max-w-md">
                Analyzing your media and style preferences to create the perfect preset
              </p>
              <div className="mt-6 flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-primary rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
