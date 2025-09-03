import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      daily_tasks: {
        Row: {
          id: string
          task: string
          completed: boolean
          created_at: string
          user_id?: string
        }
        Insert: {
          id?: string
          task: string
          completed?: boolean
          created_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          task?: string
          completed?: boolean
          created_at?: string
          user_id?: string
        }
      }
      custom_time_blocks: {
        Row: {
          id: string
          time: string
          title: string
          description: string
          created_at: string
          user_id?: string
        }
        Insert: {
          id?: string
          time: string
          title: string
          description: string
          created_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          time?: string
          title?: string
          description?: string
          created_at?: string
          user_id?: string
        }
      }
    }
  }
}