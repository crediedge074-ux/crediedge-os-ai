import type { Database as GeneratedDatabase } from "./database.generated";

/**
 * Application-level aliases for Supabase's generated schema types.
 *
 * Run `npm run types:generate` with SUPABASE_PROJECT_ID configured to refresh
 * `database.generated.ts` after a schema migration. Keeping aliases here means
 * application imports remain stable when the generated file is replaced.
 */
export type Database = GeneratedDatabase;

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type Business = Database["public"]["Tables"]["businesses"]["Row"];
export type BusinessUpdate = Database["public"]["Tables"]["businesses"]["Update"];
export type Membership = Database["public"]["Tables"]["memberships"]["Row"];
export type BusinessSettings = Database["public"]["Tables"]["settings"]["Row"];
export type BusinessSettingsUpdate =
  Database["public"]["Tables"]["settings"]["Update"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"];
export type CustomerUpdate = Database["public"]["Tables"]["customers"]["Update"];
