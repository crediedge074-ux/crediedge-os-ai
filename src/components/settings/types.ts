// ─── Shared TypeScript interfaces for Settings Hub ───────────────────────────

export interface SettingsSection {
  id: string;
  label: string;
  description: string;
  group: string;
}

export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  channels: { email: boolean; push: boolean; sms: boolean };
}

export interface BusinessHour {
  day: string;
  open: boolean;
  from: string;
  to: string;
}

export interface AIConfig {
  id: string;
  label: string;
  description: string;
  type: "select" | "toggle" | "slider";
  value: string | boolean | number;
  options?: string[];
  min?: number;
  max?: number;
}
