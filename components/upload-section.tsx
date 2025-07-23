"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, ImageIcon, Video, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { MediaFile } from "@/components/pages/generate-page"

interface UploadSectionProps {
  onUpload: (file: MediaFile) => void
  onPromptChange?: (prompt: string) => void
  uploadPrompt?: string
}

export default function UploadSection({ onUpload, onPromptChange, uploadPrompt = "" }: UploadSectionProps) {
  const [uploadedFile, setUploadedFile] = useState<MediaFile | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const mediaType = file.type.startsWith("image/") ? "image" : "video"
        const fileUrl = URL.createObjectURL(file)

        const mediaFile: MediaFile = {
          url: fileUrl,
          type: mediaType,
          name: file.name,
          file: file, // Store the actual file for API upload
        }

        setUploadedFile(mediaFile)
        onUpload(mediaFile)
      }
    },
    [onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      "video/*": [".mp4", ".mov", ".avi", ".mkv"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  })

  const removeFile = () => {
    setUploadedFile(null)
    // You might want to call onUpload with null here if needed
  }

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/20"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Drop your media here</h3>
              <p className="text-muted-foreground mb-4">Drag & drop or click to browse</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4" />
                <span>Select Image</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Video className="w-4 h-4" />
                <span>Select Video</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Supports JPG, PNG, MP4, MOV up to 50MB</p>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {uploadedFile.type === "image" ? (
                  <ImageIcon className="w-5 h-5 text-primary" />
                ) : (
                  <Video className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{uploadedFile.type} file</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={removeFile}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Optional text input for combined media + text generation */}
      <div className="space-y-2">
        <Label htmlFor="uploadPrompt" className="text-sm font-medium">
          Style Description (Optional)
        </Label>
        <Input
          id="uploadPrompt"
          placeholder="Describe the style you want... (e.g., warm cinematic look, vintage film)"
          value={uploadPrompt}
          onChange={(e) => onPromptChange?.(e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Add a text description to enhance your media-based preset generation
        </p>
      </div>

      <div className="bg-accent/10 p-4 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center">
          <Upload className="w-4 h-4 mr-2 text-primary" />
          Pro Tips:
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• High-resolution images work best (1080p+)</li>
          <li>• Videos should be 30 seconds or less</li>
          <li>• Good lighting helps AI understand your style</li>
          <li>• Combine with text for more precise results</li>
        </ul>
      </div>
    </div>
  )
}
