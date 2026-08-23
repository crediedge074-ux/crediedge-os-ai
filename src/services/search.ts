import { supabase } from "@/lib/supabase";

export type SearchResultCategory =
  | "Customers"
  | "Invoices"
  | "Communications"
  | "Tasks"
  | "Reviews"
  | "Business Info"
  | "Settings"
  | "Features & DNA";

export interface SearchResultItem {
  id: string;
  category: SearchResultCategory;
  title: string;
  subtitle: string;
  description?: string;
  route: string;
  relevanceScore: number;
  metadata?: Record<string, any>;
}

export interface SearchResponse {
  query: string;
  interpretedCategory?: SearchResultCategory;
  results: SearchResultItem[];
  groupedResults: Record<SearchResultCategory, SearchResultItem[]>;
  totalResults: number;
}

interface FeatureDestination {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  keywords: string[];
}

const FEATURE_DESTINATIONS: FeatureDestination[] = [
  { id: "dna-command", title: "Command Centre", subtitle: "Main Executive Dashboard & Today's Priorities", route: "/", keywords: ["home", "dashboard", "command", "priorities", "overview", "briefing"] },
  { id: "dna-relationships", title: "Relationships (CRM)", subtitle: "Customer Directory & Contact Management", route: "/relationships", keywords: ["customers", "crm", "contacts", "relationships", "clients"] },
  { id: "dna-finance", title: "Finance & Invoices", subtitle: "Invoices, Revenue & Payment Collections", route: "/finance", keywords: ["finance", "invoices", "payments", "revenue", "money", "chase"] },
  { id: "dna-jobs", title: "Jobs & Work", subtitle: "Job Tracking & Project Management", route: "/jobs", keywords: ["jobs", "work", "projects", "contracts"] },
  { id: "dna-tasks", title: "Tasks & Operations", subtitle: "Operational Tasks & To-Do Lists", route: "/tasks", keywords: ["tasks", "operations", "todo", "activities"] },
  { id: "dna-communications", title: "Communications Hub", subtitle: "Inbound Enquiries & Messaging", route: "/communications", keywords: ["communications", "messages", "enquiries", "inbox", "chats"] },
  { id: "dna-reviews", title: "Reviews & CX", subtitle: "Customer Feedback & Ratings", route: "/reviews", keywords: ["reviews", "ratings", "feedback", "stars"] },
  { id: "dna-advisor", title: "Business Advisor", subtitle: "AI Briefings & Recommendations", route: "/advisor", keywords: ["advisor", "ai", "recommendations", "impact", "milestones"] },
  { id: "dna-health", title: "CrediEdge Score™ / Health", subtitle: "Business Health Score Breakdown", route: "/health", keywords: ["health", "score", "crediedge", "metrics", "breakdown"] },
  { id: "dna-calendar", title: "Calendar & Schedule", subtitle: "Appointments & Events", route: "/calendar", keywords: ["calendar", "schedule", "events", "bookings"] },
  { id: "dna-goals", title: "Goals & Growth", subtitle: "Strategic Business Objectives", route: "/goals", keywords: ["goals", "growth", "targets", "okrs"] },
  { id: "dna-website", title: "Website & SEO", subtitle: "Website Performance & Traffic", route: "/website", keywords: ["website", "seo", "traffic", "visitors"] },
  { id: "dna-integrations", title: "Integrations Hub", subtitle: "Connected Apps & Third-Party Services", route: "/integrations", keywords: ["integrations", "apps", "connect", "tools"] },
  { id: "dna-intelligence", title: "Business Intelligence", subtitle: "Advanced Analytics & Benchmarks", route: "/intelligence", keywords: ["intelligence", "analytics", "data", "benchmarks"] },
  { id: "dna-insights", title: "Insights & Reports", subtitle: "Performance Trends & Reports", route: "/insights", keywords: ["insights", "reports", "trends"] },
  { id: "dna-settings", title: "Business Settings", subtitle: "Workspace Profile & Preferences", route: "/settings", keywords: ["settings", "profile", "account", "configuration"] },
  { id: "dna-support", title: "Help & Support", subtitle: "Documentation & Customer Support", route: "/support", keywords: ["help", "support", "docs", "faq"] },
];

function interpretQuery(query: string): { filterCategory?: SearchResultCategory; sanitizedTerm: string } {
  const q = query.trim().toLowerCase();

  if (q.startsWith("invoice ") || q.startsWith("inv-") || q.includes("overdue invoice")) {
    return { filterCategory: "Invoices", sanitizedTerm: q.replace(/^invoice\s+/, "") };
  }
  if (q.startsWith("customer ") || q.startsWith("client ")) {
    return { filterCategory: "Customers", sanitizedTerm: q.replace(/^(customer|client)\s+/, "") };
  }
  if (q.startsWith("task ") || q.startsWith("todo ")) {
    return { filterCategory: "Tasks", sanitizedTerm: q.replace(/^(task|todo)\s+/, "") };
  }
  if (q.startsWith("review ") || q.startsWith("rating ")) {
    return { filterCategory: "Reviews", sanitizedTerm: q.replace(/^(review|rating)\s+/, "") };
  }

  return { sanitizedTerm: q };
}

function calculateScore(text: string, query: string): number {
  const target = text.toLowerCase();
  const q = query.toLowerCase();

  if (target === q) return 100;
  if (target.startsWith(q)) return 80;
  if (target.includes(q)) return 50;
  return 0;
}

export async function searchWorkspace(
  businessId: string | undefined,
  rawQuery: string
): Promise<SearchResponse> {
  const cleanQuery = rawQuery.trim();

  if (!cleanQuery || !businessId) {
    return {
      query: cleanQuery,
      results: [],
      groupedResults: {
        "Features & DNA": [],
        Customers: [],
        Invoices: [],
        Communications: [],
        Tasks: [],
        Reviews: [],
        "Business Info": [],
        Settings: [],
      },
      totalResults: 0,
    };
  }

  const { filterCategory, sanitizedTerm } = interpretQuery(cleanQuery);
  const searchPattern = `%${sanitizedTerm}%`;
  const results: SearchResultItem[] = [];

  try {
    // 1. Search Features & DNA Destinations
    FEATURE_DESTINATIONS.forEach((dest) => {
      let score = 0;
      if (dest.title.toLowerCase() === cleanQuery.toLowerCase()) score = 100;
      else if (dest.title.toLowerCase().startsWith(cleanQuery.toLowerCase())) score = 85;
      else if (dest.keywords.some((k) => k.includes(cleanQuery.toLowerCase()) || cleanQuery.toLowerCase().includes(k))) score = 70;

      if (score > 0) {
        results.push({
          id: dest.id,
          category: dest.route === "/settings" ? "Settings" : "Features & DNA",
          title: dest.title,
          subtitle: dest.subtitle,
          route: dest.route,
          relevanceScore: score,
        });
      }
    });

    // 2. Search Customers from Supabase
    if (!filterCategory || filterCategory === "Customers") {
      const { data: customers } = await supabase
        .from("customers")
        .select("*")
        .eq("business_id", businessId)
        .or(`full_name.ilike.${searchPattern},company_name.ilike.${searchPattern},email.ilike.${searchPattern},phone.ilike.${searchPattern}`)
        .limit(8);

      (customers || []).forEach((c) => {
        const name = c.full_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Customer";
        const nameScore = calculateScore(name, sanitizedTerm);
        const compScore = c.company_name ? calculateScore(c.company_name, sanitizedTerm) : 0;
        const maxScore = Math.max(nameScore, compScore, 40);

        results.push({
          id: `customer-${c.id}`,
          category: "Customers",
          title: name,
          subtitle: c.company_name ? `${c.company_name} · ${c.email || c.phone || "Customer"}` : c.email || c.phone || "Customer",
          route: "/relationships",
          relevanceScore: maxScore,
          metadata: { customerId: c.id },
        });
      });
    }

    // 3. Search Invoices from Supabase
    if (!filterCategory || filterCategory === "Invoices") {
      const { data: invoices } = await supabase
        .from("invoices")
        .select("*")
        .eq("business_id", businessId)
        .or(`invoice_number.ilike.${searchPattern},status.ilike.${searchPattern}`)
        .limit(8);

      (invoices || []).forEach((inv) => {
        const numScore = calculateScore(inv.invoice_number, sanitizedTerm);
        const maxScore = Math.max(numScore, 45);

        results.push({
          id: `invoice-${inv.id}`,
          category: "Invoices",
          title: `Invoice ${inv.invoice_number}`,
          subtitle: `Total: £${Number(inv.total_amount).toLocaleString()} · Status: ${inv.status} · Due: ${inv.due_date}`,
          route: "/finance",
          relevanceScore: maxScore,
          metadata: { invoiceId: inv.id },
        });
      });
    }

    // 4. Search Communications from Supabase
    if (!filterCategory || filterCategory === "Communications") {
      const { data: comms } = await supabase
        .from("communications")
        .select("*")
        .eq("business_id", businessId)
        .or(`subject.ilike.${searchPattern},body.ilike.${searchPattern}`)
        .limit(8);

      (comms || []).forEach((comm) => {
        const subjScore = comm.subject ? calculateScore(comm.subject, sanitizedTerm) : 0;
        const maxScore = Math.max(subjScore, 35);

        results.push({
          id: `comm-${comm.id}`,
          category: "Communications",
          title: comm.subject || `Inbound Message`,
          subtitle: `Channel: ${comm.channel || "Enquiry"} · Direction: ${comm.direction}`,
          route: "/communications",
          relevanceScore: maxScore,
        });
      });
    }

    // 5. Search Tasks from Supabase
    if (!filterCategory || filterCategory === "Tasks") {
      const { data: tasks } = await supabase
        .from("tasks")
        .select("*")
        .eq("business_id", businessId)
        .or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
        .limit(8);

      (tasks || []).forEach((t) => {
        const titleScore = calculateScore(t.title, sanitizedTerm);
        const maxScore = Math.max(titleScore, 40);

        results.push({
          id: `task-${t.id}`,
          category: "Tasks",
          title: t.title,
          subtitle: `Priority: ${t.priority || "Normal"} · Status: ${t.status}${t.due_date ? ` · Due ${t.due_date}` : ""}`,
          route: "/tasks",
          relevanceScore: maxScore,
        });
      });
    }

    // 6. Search Reviews from Supabase
    if (!filterCategory || filterCategory === "Reviews") {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("*")
        .eq("business_id", businessId)
        .or(`feedback.ilike.${searchPattern}`)
        .limit(8);

      (reviews || []).forEach((r) => {
        results.push({
          id: `review-${r.id}`,
          category: "Reviews",
          title: `Customer Review (${r.rating || 5}★)`,
          subtitle: r.feedback ? `"${r.feedback.slice(0, 60)}..."` : `${r.rating || 5} stars review`,
          route: "/reviews",
          relevanceScore: 35,
        });
      });
    }

    // Sort results deterministically by relevanceScore descending
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Group results by category
    const groupedResults: Record<SearchResultCategory, SearchResultItem[]> = {
      "Features & DNA": [],
      Customers: [],
      Invoices: [],
      Communications: [],
      Tasks: [],
      Reviews: [],
      "Business Info": [],
      Settings: [],
    };

    results.forEach((item) => {
      if (!groupedResults[item.category]) {
        groupedResults[item.category] = [];
      }
      groupedResults[item.category].push(item);
    });

    return {
      query: cleanQuery,
      interpretedCategory: filterCategory,
      results,
      groupedResults,
      totalResults: results.length,
    };
  } catch (err) {
    console.error("[searchWorkspace] error:", err);
    return {
      query: cleanQuery,
      results: [],
      groupedResults: {
        "Features & DNA": [],
        Customers: [],
        Invoices: [],
        Communications: [],
        Tasks: [],
        Reviews: [],
        "Business Info": [],
        Settings: [],
      },
      totalResults: 0,
    };
  }
}
