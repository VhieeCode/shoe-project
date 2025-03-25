import { createServerClient } from '@supabase/ssr'
import { supabaseUrl, supabaseKey } from '../config/supabase'

export function createServerClient() {
  return createServerClient(supabaseUrl, supabaseKey)
}