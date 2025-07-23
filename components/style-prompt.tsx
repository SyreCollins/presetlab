"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Wand2, Lightbulb } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface StylePromptProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const PRESET_PROMPTS = [
  "Warm cinematic",
  "Moody vintage",
  "Bright and airy",
  "Film noir",
  "Vibrant summer",
  "Muted pastels",
  "High contrast B&W",
  "Golden hour glow",
  "Cyberpunk neon",
  "Soft romantic",
]

export default function StylePrompt({ value, onChange, disabled = false }: StylePromptProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-3 top-3 text-muted-foreground z-10">
          <Wand2 className="h-4 w-4" />
        </div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Describe your vision... (e.g., 'warm cinematic look with soft highlights and rich shadows')"
          className={`min-h-[120px] pl-10 pr-3 py-3 rounded-xl border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${focused ? "border-primary/50 bg-background/80" : "border-border/50"}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Popular Styles</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_PROMPTS.map((prompt, index) => (
            <motion.button
              key={prompt}
              onClick={() => onChange(prompt)}
              disabled={disabled}
              className="text-xs px-4 py-2 rounded-full bg-accent/20 hover:bg-primary/10 hover:text-primary border border-border/30 hover:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {prompt}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div className="rounded-xl overflow-hidden card-glow soft-shadow" whileHover={{ y: -2 }}>
        <div className="bg-gradient-to-r from-primary/5 to-cyan-500/5 p-4 border border-border/30 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 bg-primary/10 rounded-full">
              <Lightbulb className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-medium text-sm">Style Guide</span>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground pl-4">
            <li className="list-disc">Be specific about mood, colors, and lighting</li>
            <li className="list-disc">Mention specific film stocks or photographers for reference</li>
            <li className="list-disc">Include details about contrast, saturation, and tone</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}
