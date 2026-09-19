import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Profile, Business, Membership, BusinessSettings } from "@/lib/database.types";
import { getProfile } from "@/services/profiles";
import { getBusiness, getPrimaryMembership } from "@/services/business";
import { getBusinessSettings } from "@/services/settings";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  membership: Membership | null;
  business: Business | null;
  settings: BusinessSettings | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  refreshBusiness: () => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (userId: string) => {
    try {
      const [prof, mem] = await Promise.all([
        getProfile(userId),
        getPrimaryMembership(userId),
      ]);
      setProfile(prof);
      setMembership(mem);
      if (mem?.business_id) {
        const [biz, bizSettings] = await Promise.all([
          getBusiness(mem.business_id),
          getBusinessSettings(mem.business_id),
        ]);
        setBusiness(biz);
        setSettings(bizSettings);
      }
    } catch (err) {
      console.error("Failed to load user data:", err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const prof = await getProfile(user.id);
      setProfile(prof);
    }
  };

  const refreshBusiness = async () => {
    if (membership?.business_id) {
      const biz = await getBusiness(membership.business_id);
      setBusiness(biz);
    }
  };

  const refreshSettings = async () => {
    if (membership?.business_id) {
      const s = await getBusinessSettings(membership.business_id);
      setSettings(s);
    }
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        await loadUserData(s.user.id);
      }
      if (mounted) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        (async () => {
          await loadUserData(s.user.id);
        })();
      } else {
        setProfile(null);
        setMembership(null);
        setBusiness(null);
        setSettings(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, user, profile, membership, business, settings, loading, refreshProfile, refreshBusiness, refreshSettings }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
