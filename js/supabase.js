// ─────────────────────────────────────────────
//  OPBASE — Supabase Configuration
//  Replace these two values with your own project
// ─────────────────────────────────────────────
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
