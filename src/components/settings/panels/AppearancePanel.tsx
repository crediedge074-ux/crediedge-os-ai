import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getUserPreferences, updateUserPreferences, type UserPreferences } from "@/services/userPreferences";
import { SectionHeader, SaveBar, SettingsRow, type Feedback } from "../primitives";
import { Switch } from "@/components/ui/switch";
import { PanelSkeleton } from "../primitives";

const ACCENT_KEY = "--brand";

function applyTheme(theme: string) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }
}

function applyAccent(colour: string) {
  const root = document.documentElement;
  root.style.setProperty(ACCENT_KEY, colour);
}

function applyCompact(compact: boolean) {
  const root = document.documentElement;
  if (compact) root.classList.add("compact");
  else root.classList.remove("compact");
}

export function AppearancePanel() {
  const { user } = useAuthContext();
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [theme, setTheme] = useState("system");
  const [accent, setAccent] = useState("#E31B23");
  const [compact, setCompact] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getUserPreferences(user.id).then((p) => {
      setPrefs(p);
      setTheme(p.theme);
      setAccent(p.accent_colour);
      setCompact(p.compact_mode);
      applyTheme(p.theme);
      applyAccent(p.accent_colour);
      applyCompact(p.compact_mode);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user?.id]);

  // Apply theme immediately on change (not just on save)
  useEffect(() => { applyTheme(theme); }, [theme]);
  useEffect(() => { applyAccent(accent); }, [accent]);
  useEffect(() => { applyCompact(compact); }, [compact]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const updated = await updateUserPreferences(user.id, { theme, accent_colour: accent, compact_mode: compact });
      setPrefs(updated);
      setFeedback("saved");
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PanelSkeleton />;

  const colors = [
    { value: "#E31B23", label: "CrediEdge Red" },
    { value: "#1A1A1A", label: "Midnight" },
    { value: "#2563EB", label: "Ocean" },
    { value: "#059669", label: "Forest" },
    { value: "#D97706", label: "Amber" },
    { value: "#7C3AED", label: "Violet" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Appearance" description="Personalise the look and feel of CrediEdgeOS." />

      <div>
        <label className="mb-2.5 block text-[13px] font-semibold text-foreground">Theme</label>
        <div className="flex gap-2">
          {[{ label: "Light", icon: Sun }, { label: "Dark", icon: Moon }, { label: "System", icon: Monitor }].map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setTheme(label.toLowerCase())}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-colors ${theme === label.toLowerCase() ? "border-brand bg-brand/10 text-brand" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2.5 block text-[13px] font-semibold text-foreground">Accent Colour</label>
        <div className="flex flex-wrap gap-2.5">
          {colors.map((c) => (
            <button
              key={c.value}
              title={c.label}
              onClick={() => setAccent(c.value)}
              className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${accent === c.value ? "border-foreground" : "border-transparent"}`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2.5 block text-[13px] font-semibold text-foreground">Layout</label>
        <div className="space-y-2">
          <SettingsRow label="Compact Mode" description="Reduce spacing and padding for a denser interface" action={<Switch checked={compact} onCheckedChange={setCompact} />} />
        </div>
      </div>

      <SaveBar onSave={handleSave} saving={saving} feedback={feedback} />
    </div>
  );
}
