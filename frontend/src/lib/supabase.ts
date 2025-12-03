import { createClient } from '@supabase/supabase-js';

// Next.js hace estas variables disponibles en el cliente automáticamente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string || '';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.warn('⚠️ Supabase credentials are missing or using placeholder values. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

