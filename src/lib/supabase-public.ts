import { createClient } from '@supabase/supabase-js'

// Public configuration for GitHub Pages deployment
// These are PUBLIC keys, safe to expose
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if we have valid Supabase credentials
export const hasSupabase = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key'
}

// Create client only if credentials exist
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fallback to localStorage when Supabase is not configured
export const storage = {
  async get(key: string) {
    if (hasSupabase()) {
      try {
        const { data } = await supabase
          .from('user_data')
          .select('*')
          .eq('key', key)
          .single()
        return data?.value
      } catch {
        // Fall back to localStorage
      }
    }
    return localStorage.getItem(key)
  },
  
  async set(key: string, value: any) {
    if (hasSupabase()) {
      try {
        await supabase
          .from('user_data')
          .upsert({ key, value })
        return
      } catch {
        // Fall back to localStorage
      }
    }
    localStorage.setItem(key, JSON.stringify(value))
  }
}