import { useAuthContext } from "@/contexts/AuthContext";
import { updateBusinessSettings } from "@/services/settings";
import type { BusinessSettingsUpdate } from "@/lib/database.types";

export function useBusinessSettings() {
  const { settings, membership, loading, refreshSettings } = useAuthContext();

  const save = async (updates: BusinessSettingsUpdate) => {
    if (!membership?.business_id) throw new Error("No business");
    await updateBusinessSettings(membership.business_id, updates);
    await refreshSettings();
  };

  return { settings, loading, save };
}
