"use client"

import { motion } from "framer-motion"
import { useTheme } from "./theme-provider"

export function AnimatedBackground() {
  const { actualTheme } = useTheme()

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background:
            actualTheme === "dark"
              ? "radial-gradient(ellipse at top, rgba(139, 92, 246, 0.1) 0%, transparent 70%)"
              : "radial-gradient(ellipse at top, rgba(139, 92, 246, 0.05) 0%, transparent 70%)",
        }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        className="absolute top-1/4 -right-1/4 w-96 h-96 rounded-full opacity-20"
        animate={{
          background:
            actualTheme === "dark"
              ? "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          scale: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          background: { duration: 0.5 },
        }}
      />

      <motion.div
        className="absolute bottom-1/4 -left-1/4 w-72 h-72 rounded-full opacity-10"
        animate={{
          background:
            actualTheme === "dark"
              ? "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
          scale: [1, 1.2, 1],
          rotate: [360, 180, 0],
        }}
        transition={{
          scale: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          rotate: { duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          background: { duration: 0.5 },
        }}
      />
    </div>
  )
}
