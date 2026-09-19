import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) || "https://dummy.supabase.co";
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "dummy-key";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
