import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const runtimeEnv = import.meta.env as Record<string, string | undefined>;
const supabaseUrl = runtimeEnv.VITE_SUPABASE_URL ?? runtimeEnv.SUPABASE_URL;
const supabaseAnonKey = runtimeEnv.VITE_SUPABASE_ANON_KEY ?? runtimeEnv.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase authentication is not configured for this environment.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
