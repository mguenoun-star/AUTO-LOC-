"use server"

// This is for backend use only, importing it from frontend will cause erros 

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/db/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

export const privateSupabaseClient = createClient<Database>(supabaseUrl, supabaseSecretKey);
