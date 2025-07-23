"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Search, Filter, MoreHorizontal, Trash2, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { convertToXMP } from "@/lib/convert-to-xmp"

interface Preset {
  id: string
  preset_name: string
  description?: string
  preset_json: any
  preset_type: string
  category?: string
  downloads_count: number
  created_at: string
  updated_at: string
}

export default function PresetsPage() {
  const { user } = useAuth()
  const [presets, setPresets] = useState<Preset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  useEffect(() => {
    if (user) {
      fetchPresets()
    }
  }, [user])

  const fetchPresets = async () => {
    try {
      const response = await fetch("/api/user/presets")
      if (response.ok) {
        const data = await response.json()
        setPresets(data)
      }
    } catch (error) {
      console.error("Failed to fetch presets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (preset: Preset) => {
    try {
      // Track download
      await fetch("/api/user/track-usage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action_type: "download",
          resource_id: preset.id,
        }),
      })

      // Convert to XMP and download
      const xmpContent = convertToXMP(preset.preset_json)
      const blob = new Blob([xmpContent], { type: "application/xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${preset.preset_name}.xmp`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download preset:", error)
    }
  }

  const handleDelete = async (presetId: string) => {
    if (!confirm("Are you sure you want to delete this preset?")) return

    try {
      const response = await fetch(`/api/user/presets/${presetId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPresets(presets.filter((p) => p.id !== presetId))
      }
    } catch (error) {
      console.error("Failed to delete preset:", error)
    }
  }

  const filteredPresets = presets.filter((preset) => {
    const matchesSearch = preset.preset_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || preset.preset_type === filterType
    const matchesCategory = filterCategory === "all" || preset.category === filterCategory
    return matchesSearch && matchesType && matchesCategory
  })

  const categories = Array.from(new Set(presets.map((p) => p.category).filter(Boolean)))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preset Library</h1>
          <p className="text-muted-foreground">Manage your saved presets</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search presets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Type: {filterType === "all" ? "All" : filterType.toUpperCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterType("all")}>All Types</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("xmp")}>XMP</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("cube")}>CUBE</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {categories.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Category: {filterCategory === "all" ? "All" : filterCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterCategory("all")}>All Categories</DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category} onClick={() => setFilterCategory(category || "")}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Presets Grid */}
      {filteredPresets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPresets.map((preset, index) => (
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{preset.preset_name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {preset.description || "No description provided"}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownload(preset)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(preset.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{preset.preset_type.toUpperCase()}</Badge>
                      {preset.category && <Badge variant="outline">{preset.category}</Badge>}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Download className="h-3 w-3" />
                      {preset.downloads_count}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(preset.created_at)}
                    </div>
                    <Button size="sm" onClick={() => handleDownload(preset)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <div className="mx-auto h-12 w-12 text-muted-foreground">
              <Search className="h-full w-full" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No presets found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm || filterType !== "all" || filterCategory !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't created any presets yet. Start by generating your first preset!"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
