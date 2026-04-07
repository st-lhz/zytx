import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase 环境变量缺失，请确认 .env 文件配置正确')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
