import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { convertToXMP } from "@/lib/convert-to-xmp"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the preset
    const { data: preset, error } = await supabase
      .from("presets")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id) // Ensure user owns this preset
      .single()

    if (error || !preset) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 })
    }

    // Convert JSON to XMP
    const xmpContent = convertToXMP(preset.preset_data)
    
    // Track download
    await supabase.from("usage_tracking").insert({
      user_id: user.id,
      action_type: "download",
      resource_id: preset.id,
      billing_period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
      billing_period_end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split("T")[0],
    })

    // Increment download count
    await supabase.rpc("increment_preset_downloads_count", { preset_id: preset.id })
    await supabase.rpc("increment_user_downloads_count", { user_id: user.id })

    // Return XMP file
    return new NextResponse(xmpContent, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Disposition": `attachment; filename="${preset.name}.xmp"`,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error downloading preset:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}