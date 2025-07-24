import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
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

    // Get the preset data from the request
    const { preset_name, description, preset_json, preset_type, category } = await request.json()

    if (!preset_name || !preset_json || !preset_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save the preset to the database with JSON data directly
    const { data: preset, error } = await supabase.from("presets").insert({
      user_id: user.id,
      name: preset_name,
      description: description || "",
      preset_type,
      category: category || null,
      style_prompt: description || "",
      file_url: "", // Not needed since we store JSON directly
      processing_status: "completed",
      is_public: false,
      preset_data: preset_json, // Store the JSON data directly
    }).select().single()

    if (error) {
      console.error("Error saving preset:", error)
      return NextResponse.json({ error: "Failed to save preset" }, { status: 500 })
    }

    // Update the user's total presets created count
    await supabase.rpc("increment_user_presets_count", { user_id: user.id })

    return NextResponse.json({
      success: true,
      preset_id: preset.id,
      message: "Preset saved successfully",
    })
  } catch (error) {
    console.error("Error in preset save API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function GET(request: Request) {
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

    // Get the user's presets
    const { data: presets, error } = await supabase
      .from("presets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching presets:", error)
      return NextResponse.json({ error: "Failed to fetch presets" }, { status: 500 })
    }

    return NextResponse.json(presets)
  } catch (error) {
    console.error("Error in presets API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}