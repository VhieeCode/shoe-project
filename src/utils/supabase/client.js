"use client"

import { createClient } from "@supabase/supabase-js"

// Use environment variables for Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
