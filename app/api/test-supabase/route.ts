import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    const tests = {
      connection: { success: false, error: null },
      usersTable: { success: false, count: 0, error: null },
      presetsTable: { success: false, count: 0, error: null },
      subscriptionsTable: { success: false, count: 0, error: null },
      affiliatePrograms: { success: false, count: 0, error: null },
      usageTracking: { success: false, count: 0, error: null },
    }

    // Test basic connection
    try {
      const { data, error } = await supabase.from("users").select("count", { count: "exact", head: true })
      if (!error) {
        tests.connection.success = true
      } else {
        tests.connection.error = error.message
      }
    } catch (error: any) {
      tests.connection.error = error.message
    }

    // Test users table
    try {
      const { count, error } = await supabase.from("users").select("*", { count: "exact", head: true })

      if (!error) {
        tests.usersTable.success = true
        tests.usersTable.count = count || 0
      } else {
        tests.usersTable.error = error.message
      }
    } catch (error: any) {
      tests.usersTable.error = error.message
    }

    // Test presets table
    try {
      const { count, error } = await supabase.from("presets").select("*", { count: "exact", head: true })

      if (!error) {
        tests.presetsTable.success = true
        tests.presetsTable.count = count || 0
      } else {
        tests.presetsTable.error = error.message
      }
    } catch (error: any) {
      tests.presetsTable.error = error.message
    }

    // Test subscriptions table
    try {
      const { count, error } = await supabase.from("subscriptions").select("*", { count: "exact", head: true })

      if (!error) {
        tests.subscriptionsTable.success = true
        tests.subscriptionsTable.count = count || 0
      } else {
        tests.subscriptionsTable.error = error.message
      }
    } catch (error: any) {
      tests.subscriptionsTable.error = error.message
    }

    // Test affiliate programs table
    try {
      const { count, error } = await supabase.from("affiliate_programs").select("*", { count: "exact", head: true })

      if (!error) {
        tests.affiliatePrograms.success = true
        tests.affiliatePrograms.count = count || 0
      } else {
        tests.affiliatePrograms.error = error.message
      }
    } catch (error: any) {
      tests.affiliatePrograms.error = error.message
    }

    // Test usage tracking table
    try {
      const { count, error } = await supabase.from("usage_tracking").select("*", { count: "exact", head: true })

      if (!error) {
        tests.usageTracking.success = true
        tests.usageTracking.count = count || 0
      } else {
        tests.usageTracking.error = error.message
      }
    } catch (error: any) {
      tests.usageTracking.error = error.message
    }

    return NextResponse.json(tests)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
