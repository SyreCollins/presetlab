import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get preset by ID
    const { data: preset, error } = await supabase
      .from("presets")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("Error fetching preset:", error)
      return NextResponse.json({ error: "Failed to fetch preset" }, { status: 500 })
    }

    return NextResponse.json(preset)
  } catch (error) {
    console.error("Get preset API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete preset
    const { error } = await supabase.from("presets").delete().eq("id", params.id).eq("user_id", user.id)

    if (error) {
      console.error("Error deleting preset:", error)
      return NextResponse.json({ error: "Failed to delete preset" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete preset API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { preset_name, description, preset_json, preset_type, category } = body

    // Update preset
    const { data: preset, error } = await supabase
      .from("presets")
      .update({
        preset_name,
        description,
        preset_json,
        preset_type,
        category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating preset:", error)
      return NextResponse.json({ error: "Failed to update preset" }, { status: 500 })
    }

    return NextResponse.json(preset)
  } catch (error) {
    console.error("Update preset API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
