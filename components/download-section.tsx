"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Download, Save, Copy, Check } from "lucide-react"
import { motion } from "framer-motion"
import { convertToXMP } from "@/lib/convert-to-xmp"
import { useAuth } from "@/components/auth/auth-provider"

interface DownloadSectionProps {
  presetData: any
  presetName: string
  onDownload: () => void
}

export default function DownloadSection({ presetData, presetName, onDownload }: DownloadSectionProps) {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saveToLibrary, setSaveToLibrary] = useState(false)
  const [customName, setCustomName] = useState(presetName)
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")

  const handleDownload = async () => {
    try {
      // Track download
      if (user) {
        await fetch("/api/user/track-usage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action_type: "download",
          }),
        })
      }

      // Convert to XMP and download
      const xmpContent = convertToXMP(presetData)
      const blob = new Blob([xmpContent], { type: "application/xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${presetName}.xmp`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      onDownload()
    } catch (error) {
      console.error("Failed to download preset:", error)
    }
  }

  const handleSaveToLibrary = async () => {
    if (!user) return

    setSaving(true)
    try {
      const response = await fetch("/api/user/presets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preset_name: customName,
          description,
          preset_json: presetData,
          preset_type: "xmp",
          category,
        }),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error("Failed to save preset:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleCopySettings = async () => {
    try {
      const settingsText = JSON.stringify(presetData, null, 2)
      await navigator.clipboard.writeText(settingsText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy settings:", error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
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
            <Button variant="outline" onClick={handleCopySettings}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Save to Library
            </CardTitle>
            <CardDescription>Save this preset to your personal library for easy access later.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input
                id="preset-name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter a name for your preset"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your preset's style and effect"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Portrait, Landscape, Vintage"
              />
            </div>

            <Button onClick={handleSaveToLibrary} disabled={saving || !customName.trim()} className="w-full">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved to Library!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save to Library
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>How to Use Your Preset</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p className="font-medium">1. Download the XMP file</p>
            <p className="text-muted-foreground">Click the download button to save the .xmp file to your computer.</p>
          </div>
          <div className="text-sm space-y-2">
            <p className="font-medium">2. Import into Lightroom</p>
            <p className="text-muted-foreground">
              In Lightroom, go to Develop module {">"} Presets panel {">"} Right-click {">"} Import Presets
            </p>
          </div>
          <div className="text-sm space-y-2">
            <p className="font-medium">3. Apply to your photos</p>
            <p className="text-muted-foreground">
              Select any photo and click your imported preset to apply the AI-generated look.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
