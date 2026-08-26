import { useState, useEffect } from "react";
import { X, User, Building2, Mail, Phone, MapPin, Tag, Save, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import type { Customer, CustomerInsert } from "@/lib/database.types";
import { useAuthContext } from "@/contexts/AuthContext";
import { checkDuplicateCustomer, type DuplicateCheckResult } from "@/services/customers";

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

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-3 border-b border-border/50 pb-1.5">
      <h4 className="text-[12px] font-bold uppercase tracking-wider text-foreground">{title}</h4>
      <p className="text-[11px] text-muted-foreground">{description}</p>
    </div>
  );
}

function Label({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1 block text-[11.5px] font-medium text-muted-foreground">
      {children}
      {required && <span className="ml-0.5 text-brand">*</span>}
    </label>
  );
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-[38px] w-full rounded-xl border border-border bg-secondary/30 px-3 text-[12.5px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-2 focus:ring-foreground/5 transition-all ${className}`}
    />
  );
}

function Select({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-[38px] w-full rounded-xl border border-border bg-secondary/30 px-3 text-[12.5px] text-foreground focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-2 focus:ring-foreground/5 transition-all ${className}`}
    >
      {children}
    </select>
  );
}

export function CustomerForm({ open, onClose, onSave, initial, saving }: CustomerFormProps) {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

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
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateCheckResult | null>(null);
  const [bypassedDuplicate, setBypassedDuplicate] = useState(false);

  useEffect(() => {
    if (initial) {
      setFirstName(initial.first_name ?? "");
      setLastName(initial.last_name ?? "");
      setCompanyName(initial.company_name ?? "");
      setEmail(initial.email ?? "");
      setPhone(initial.phone ?? "");
      setCustomerType(initial.customer_type || "individual");
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
    setDuplicateCheck(null);
    setBypassedDuplicate(false);
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

    if (customerType === "business" && !companyName.trim()) {
      setError("Please enter a company name for business customers.");
      return;
    }

    if (customerType === "individual" && !firstName.trim()) {
      setError("Please enter a first name for individual customers.");
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);

    // Run duplicate check if not already bypassed
    if (!bypassedDuplicate && businessId && !initial) {
      const fullNameCandidate = customerType === "business" && companyName
        ? companyName
        : [firstName, lastName].filter(Boolean).join(" ");

      const dupResult = await checkDuplicateCustomer(
        businessId,
        {
          email,
          phone,
          firstName,
          lastName,
          companyName,
          fullName: fullNameCandidate,
        },
        initial ? (initial as Customer).id : null
      );

      if (dupResult.hasDuplicate) {
        setDuplicateCheck(dupResult);
        return;
      }
    }

    const fullName = customerType === "business" && companyName
      ? companyName
      : [firstName, lastName].filter(Boolean).join(" ");

    const payload = {
      first_name: firstName.trim() || null,
      last_name: lastName.trim() || null,
      full_name: fullName.trim() || null,
      company_name: companyName.trim() || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
      customer_type: customerType,
      source: source || null,
      city: city.trim() || null,
      postcode: postcode.trim() || null,
      preferred_contact_method: preferredContact,
      tags,
      notes: notes.trim() || null,
      marketing_consent: marketingConsent,
      gdpr_consent: gdprConsent,
    };

    try {
      await onSave(payload);
    } catch (err: any) {
      setError(err?.message || "Failed to save customer. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10">
            {customerType === "business" ? (
              <Building2 className="h-4.5 w-4.5 text-brand" strokeWidth={1.75} />
            ) : (
              <User className="h-4.5 w-4.5 text-brand" strokeWidth={1.75} />
            )}
          </div>
          <div>
            <div className="text-[15px] font-bold text-foreground">
              {initial ? "Edit Customer Record" : "Add New Workspace Customer"}
            </div>
            <div className="text-[11.5px] text-muted-foreground">
              {initial ? "Update customer profile details" : "Create a central relationship entity in your workspace"}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit} className="max-h-[calc(100vh-160px)] overflow-y-auto">
          <div className="space-y-6 p-6">
            {/* DUPLICATE DETECTION WARNING BANNER */}
            {duplicateCheck && duplicateCheck.hasDuplicate && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-600">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Likely Duplicate Workspace Customer Detected ({duplicateCheck.confidenceScore}% confidence)
                </div>
                <p className="text-foreground/80 leading-relaxed">
                  {duplicateCheck.matchReason}
                </p>

                {duplicateCheck.matchingCustomer && (
                  <div className="rounded-xl border border-border bg-card p-3 flex items-center justify-between text-foreground">
                    <div>
                      <div className="font-bold text-[12.5px]">
                        {duplicateCheck.matchingCustomer.full_name || duplicateCheck.matchingCustomer.company_name}
                      </div>
                      <div className="text-[10.5px] text-muted-foreground">
                        {duplicateCheck.matchingCustomer.email || duplicateCheck.matchingCustomer.phone || "No contact info"}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-brand uppercase">Existing Match</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setDuplicateCheck(null)}
                    className="rounded-lg border border-border bg-card px-3 py-1.5 text-[11.5px] font-medium text-foreground hover:bg-secondary"
                  >
                    Edit Form
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBypassedDuplicate(true);
                      setDuplicateCheck(null);
                    }}
                    className="rounded-lg bg-amber-600 px-3 py-1.5 text-[11.5px] font-semibold text-white hover:opacity-90"
                  >
                    Proceed & Create Record
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 1: IDENTITY & TYPE */}
            <div>
              <SectionHeader title="Entity Identity & Type" description="Define whether this record represents an individual or a business entity." />

              <div className="space-y-3">
                <div className="flex rounded-xl border border-border bg-secondary/50 p-1 gap-1">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setCustomerType(t.value)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-semibold transition-all duration-150 ${
                        customerType === t.value
                          ? "bg-card text-foreground shadow-soft"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t.value === "business" ? <Building2 className="h-3.5 w-3.5" strokeWidth={1.75} /> : <User className="h-3.5 w-3.5" strokeWidth={1.75} />}
                      {t.label}
                    </button>
                  ))}
                </div>

                {customerType === "business" ? (
                  <div>
                    <Label required>Company Name</Label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Evans & Co. Logistics Ltd"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label required>First Name</Label>
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
              </div>
            </div>

            {/* SECTION 2: CONTACT DETAILS */}
            <div>
              <SectionHeader title="Contact Details" description="Primary contact channels for communications and notifications." />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Email Address</Label>
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
                  <Label>Phone Number</Label>
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
            </div>

            {/* SECTION 3: LOCATION & SOURCE */}
            <div>
              <SectionHeader title="Location & Relationship Source" description="Geographic tags and origin channels." />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>City / Town</Label>
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
                <div>
                  <Label>Source</Label>
                  <Select value={source} onChange={(e) => setSource(e.target.value)}>
                    <option value="">Select source...</option>
                    {SOURCES.map((s) => <option key={s} value={s.toLowerCase()}>{s}</option>)}
                  </Select>
                </div>
                <div>
                  <Label>Preferred Contact Channel</Label>
                  <Select value={preferredContact} onChange={(e) => setPreferredContact(e.target.value)}>
                    {CONTACT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </Select>
                </div>
              </div>
            </div>

            {/* SECTION 4: TAGS & NOTES */}
            <div>
              <SectionHeader title="Tags & Relationship Notes" description="Categorisation tags and internal notes." />
              <div className="space-y-3">
                <div>
                  <Label>Tags</Label>
                  <div className="rounded-xl border border-border bg-secondary/30 p-2.5">
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
                      className="w-full bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <Label>Relationship Notes</Label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Internal relationship notes, preferences or work expectations..."
                    className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-[12.5px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-2 focus:ring-foreground/5 resize-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: CONSENT & PRIVACY */}
            <div>
              <SectionHeader title="Consent & Privacy Controls" description="GDPR and marketing preferences recorded explicitly." />
              <div className="space-y-2.5 rounded-xl border border-border bg-secondary/20 p-3.5">
                {[
                  { id: "gdpr", label: "GDPR Consent recorded explicitly", value: gdprConsent, onChange: setGdprConsent },
                  { id: "marketing", label: "Marketing communications consent given", value: marketingConsent, onChange: setMarketingConsent },
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
                    <span className="text-[12px] font-medium text-foreground">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30 px-3.5 py-2.5 text-[12px] text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-card">
            <span className="text-[10.5px] text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-500" /> Workspace-scoped & encrypted
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="h-[38px] rounded-xl border border-border bg-card px-4 text-[12.5px] font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex h-[38px] items-center gap-2 rounded-xl bg-brand px-5 text-[12.5px] font-semibold text-white shadow-sm transition-opacity hover:opacity-85 disabled:opacity-60"
              >
                {saving ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Save className="h-3.5 w-3.5" strokeWidth={1.75} />
                )}
                {initial ? "Save Changes" : "Create Record"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
