import { useState, useEffect } from "react";
import { X, User, Building2, Mail, Phone, MapPin, Tag, Save } from "lucide-react";
import type { Customer, CustomerInsert } from "@/lib/database.types";

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<CustomerInsert, "business_id">) => Promise<void>;
  initial?: Customer | null;
  saving?: boolean;
}

const SOURCES = ["Referral", "Organic", "Social media", "Google Ads", "Walk-in", "Event", "Other"];
const TYPES = [
  { value: "individual", label: "Individual" },
  { value: "business", label: "Business" },
];
const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "phone", label: "Phone" },
];

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">{children}</label>;
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-[38px] w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-2 focus:ring-foreground/5 ${className}`}
    />
  );
}

function Select({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-[38px] w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-2 focus:ring-foreground/5 ${className}`}
    >
      {children}
    </select>
  );
}

export function CustomerForm({ open, onClose, onSave, initial, saving }: CustomerFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [customerType, setCustomerType] = useState("individual");
  const [source, setSource] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [preferredContact, setPreferredContact] = useState("email");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setFirstName(initial.first_name ?? "");
      setLastName(initial.last_name ?? "");
      setCompanyName(initial.company_name ?? "");
      setEmail(initial.email ?? "");
      setPhone(initial.phone ?? "");
      setCustomerType(initial.customer_type);
      setSource(initial.source ?? "");
      setCity(initial.city ?? "");
      setPostcode(initial.postcode ?? "");
      setPreferredContact(initial.preferred_contact_method ?? "email");
      setTags(initial.tags ?? []);
      setNotes(initial.notes ?? "");
      setMarketingConsent(initial.marketing_consent);
      setGdprConsent(initial.gdpr_consent);
    } else {
      setFirstName(""); setLastName(""); setCompanyName(""); setEmail(""); setPhone("");
      setCustomerType("individual"); setSource(""); setCity(""); setPostcode("");
      setPreferredContact("email"); setTags([]); setNotes("");
      setMarketingConsent(false); setGdprConsent(false);
    }
    setError(null);
  }, [initial, open]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() && !companyName.trim()) {
      setError("Please enter a first name or company name.");
      return;
    }
    setError(null);
    const fullName = customerType === "business" && companyName
      ? companyName
      : [firstName, lastName].filter(Boolean).join(" ");

    await onSave({
      first_name: firstName || null,
      last_name: lastName || null,
      full_name: fullName || null,
      company_name: companyName || null,
      email: email || null,
      phone: phone || null,
      customer_type: customerType,
      source: source || null,
      city: city || null,
      postcode: postcode || null,
      preferred_contact_method: preferredContact,
      tags,
      notes: notes || null,
      marketing_consent: marketingConsent,
      gdpr_consent: gdprConsent,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-brand/10">
            <User className="h-4 w-4 text-brand" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-foreground">
              {initial ? "Edit Customer" : "Add New Customer"}
            </div>
            <div className="text-[11.5px] text-muted-foreground">
              {initial ? "Update customer details" : "Create a new customer record"}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[calc(100vh-160px)] overflow-y-auto">
          <div className="space-y-5 p-5">
            {/* Type */}
            <div>
              <Label>Customer Type</Label>
              <div className="flex rounded-xl border border-border bg-secondary/50 p-1 gap-1">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setCustomerType(t.value)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12.5px] font-medium transition-all duration-150 ${
                      customerType === t.value
                        ? "bg-card text-foreground shadow-soft"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.value === "business" ? <Building2 className="h-3 w-3" strokeWidth={1.75} /> : <User className="h-3 w-3" strokeWidth={1.75} />}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name fields */}
            {customerType === "business" ? (
              <div>
                <Label>Company Name *</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Evans & Co."
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>First Name *</Label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Sarah"
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Johnson"
                  />
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" strokeWidth={1.75} />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label>Phone</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" strokeWidth={1.75} />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07700 900123"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>City</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" strokeWidth={1.75} />
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="London"
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label>Postcode</Label>
                <Input
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="SW1A 1AA"
                />
              </div>
            </div>

            {/* Source + Preferred contact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Source</Label>
                <Select value={source} onChange={(e) => setSource(e.target.value)}>
                  <option value="">Select source...</option>
                  {SOURCES.map((s) => <option key={s} value={s.toLowerCase()}>{s}</option>)}
                </Select>
              </div>
              <div>
                <Label>Preferred Contact</Label>
                <Select value={preferredContact} onChange={(e) => setPreferredContact(e.target.value)}>
                  {CONTACT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="rounded-xl border border-border bg-secondary/30 p-2">
                {tags.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded-lg bg-brand/10 px-2 py-0.5 text-[11.5px] font-medium text-brand"
                      >
                        <Tag className="h-2.5 w-2.5" strokeWidth={1.75} />
                        {tag}
                        <button
                          type="button"
                          onClick={() => setTags(tags.filter((t) => t !== tag))}
                          className="ml-0.5 text-brand/60 hover:text-brand"
                        >
                          <X className="h-2.5 w-2.5" strokeWidth={2} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={addTag}
                  placeholder="Type a tag and press Enter..."
                  className="w-full bg-transparent text-[12.5px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label>Notes</Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any important notes about this customer..."
                className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-2 focus:ring-foreground/5 resize-none"
              />
            </div>

            {/* Consent */}
            <div className="space-y-2.5 rounded-xl border border-border bg-secondary/20 p-3.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Consent & Privacy</div>
              {[
                { id: "gdpr", label: "GDPR consent given", value: gdprConsent, onChange: setGdprConsent },
                { id: "marketing", label: "Marketing communications consent", value: marketingConsent, onChange: setMarketingConsent },
              ].map((item) => (
                <label key={item.id} className="flex cursor-pointer items-center gap-2.5">
                  <div
                    onClick={() => item.onChange(!item.value)}
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                      item.value ? "border-brand bg-brand" : "border-border bg-card"
                    }`}
                  >
                    {item.value && <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-[12.5px] text-foreground">{item.label}</span>
                </label>
              ))}
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12.5px] text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 border-t border-border px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="h-[38px] rounded-xl border border-border bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex h-[38px] items-center gap-2 rounded-xl bg-brand px-5 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-85 disabled:opacity-60"
            >
              {saving ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Save className="h-3.5 w-3.5" strokeWidth={1.75} />
              )}
              {initial ? "Save Changes" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
