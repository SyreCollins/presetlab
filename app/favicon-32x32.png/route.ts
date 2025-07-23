import { NextResponse } from "next/server"

export async function GET() {
  // Return a simple 1x1 transparent PNG
  const transparentPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU8j8wAAAABJRU5ErkJggg==",
    "base64"
  )
  
  return new NextResponse(transparentPng, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000",
    },
  })
}