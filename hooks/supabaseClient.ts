import { createClient } from '@supabase/supabase-js';

// You get these from your Supabase project settings
const SUPABASE_URL = 'https://xyzcompany.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
