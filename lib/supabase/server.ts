import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If environment variables are missing, return a mock client
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables:", {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey
    })

    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: { message: "Supabase not configured" } }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        update: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        delete: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        eq: function() { return this },
        single: function() { return this },
        order: function() { return this },
        limit: function() { return this },
        gte: function() { return this },
      }),
    } as any
  }

  try {
    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          return cookies().get(name)?.value
        },
        set(name, value, options) {
          try {
            cookies().set(name, value, options)
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
            console.warn("Warning: Could not set cookie in server component", error)
          }
        },
        remove(name, options) {
          try {
            cookies().set(name, "", { ...options, maxAge: 0 })
          } catch (error) {
            // The `remove` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
            console.warn("Warning: Could not remove cookie in server component", error)
          }
        },
      },
    })
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    throw error
  }
}