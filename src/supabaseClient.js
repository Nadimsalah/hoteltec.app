import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials are missing! Please check your .env file and RESTART the terminal (npm run dev).')
} else {
    // Debug log to verify the key format (masked for safety)
    console.log('Supabase Client Initializing with URL:', supabaseUrl)
    console.log('Supabase Key:', supabaseAnonKey.substring(0, 15) + '...' + supabaseAnonKey.substring(supabaseAnonKey.length - 5))
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
)
