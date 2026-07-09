import { useAuthContext } from "@/contexts/AuthContext";

export function useBusiness() {
  const { business, membership, loading, refreshBusiness } = useAuthContext();
  return { business, role: membership?.role ?? null, loading, refresh: refreshBusiness };
}
