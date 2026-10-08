// Integration catalogue — static metadata for all supported providers.
// This is NOT connection state. It defines what providers exist and what they
// can provide. Actual connection status comes from the `integrations` table.

export type IntegrationCategory =
  | "CRM"
  | "Communication"
  | "Calendar"
  | "Finance"
  | "Website"
  | "Social Media"
  | "Review Platforms"
  | "AI"
  | "Automation"
  | "Storage"
  | "Developer";

export type AuthMethod = "oauth2" | "api_key" | "webhook" | "built_in" | "coming_soon";

export interface CatalogueEntry {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  logoInitials: string;
  logoColor: string;
  authMethod: AuthMethod;
  available: boolean;
  permissions: string[];
  dataProvided: string;
  modules: string[];
  featured?: boolean;
}

export const INTEGRATION_CATEGORIES: IntegrationCategory[] = [
  "All",
  "CRM",
  "Communication",
  "Calendar",
  "Finance",
  "Website",
  "Social Media",
  "Review Platforms",
  "AI",
  "Automation",
  "Storage",
  "Developer",
] as unknown as IntegrationCategory[];

export const INTEGRATION_CATALOGUE: CatalogueEntry[] = [
  // ─── CRM ───────────────────────────────────────────────────────────────────
  { id: "gohighlevel", name: "GoHighLevel", description: "CRM, pipeline management, marketing automation and conversations.", category: "CRM", logoInitials: "GHL", logoColor: "#E31B23", authMethod: "coming_soon", available: false, permissions: ["Read contacts", "Write contacts", "Read conversations", "Send messages", "Manage pipelines"], dataProvided: "Contacts, pipeline, conversations, marketing data", modules: ["Relationships", "Communications"], featured: true },
  { id: "hubspot", name: "HubSpot", description: "Inbound CRM with contact management and marketing tools.", category: "CRM", logoInitials: "HS", logoColor: "#FF7A59", authMethod: "coming_soon", available: false, permissions: ["Read contacts", "Write contacts", "Read deals", "Manage workflows"], dataProvided: "Contacts, deals, marketing data", modules: ["Relationships"] },
  { id: "salesforce", name: "Salesforce", description: "Enterprise CRM platform for sales and customer management.", category: "CRM", logoInitials: "SF", logoColor: "#00A1E0", authMethod: "coming_soon", available: false, permissions: ["Read contacts", "Write contacts", "Manage opportunities"], dataProvided: "Contacts, opportunities, accounts", modules: ["Relationships"] },
  { id: "pipedrive", name: "Pipedrive", description: "Sales-focused CRM with visual pipeline management.", category: "CRM", logoInitials: "PD", logoColor: "#1A1A1A", authMethod: "coming_soon", available: false, permissions: ["Read contacts", "Write contacts", "Read pipelines"], dataProvided: "Contacts, deals, pipeline", modules: ["Relationships"] },
  { id: "zoho", name: "Zoho CRM", description: "All-in-one CRM with sales, marketing and support tools.", category: "CRM", logoInitials: "ZC", logoColor: "#E42527", authMethod: "coming_soon", available: false, permissions: ["Read contacts", "Write contacts", "Manage modules"], dataProvided: "Contacts, leads, deals", modules: ["Relationships"] },

  // ─── Communication ─────────────────────────────────────────────────────────
  { id: "gmail", name: "Gmail", description: "Google email with conversation threading and labels.", category: "Communication", logoInitials: "GM", logoColor: "#EA4335", authMethod: "coming_soon", available: false, permissions: ["Read emails", "Send emails", "Manage labels"], dataProvided: "Email conversations, contacts", modules: ["Communications"], featured: true },
  { id: "outlook", name: "Outlook", description: "Microsoft email, calendar and contacts platform.", category: "Communication", logoInitials: "OL", logoColor: "#0078D4", authMethod: "coming_soon", available: false, permissions: ["Read emails", "Send emails", "Read calendar"], dataProvided: "Email conversations, calendar events", modules: ["Communications", "Calendar"] },
  { id: "whatsapp", name: "WhatsApp Business", description: "WhatsApp Business API for customer messaging.", category: "Communication", logoInitials: "WA", logoColor: "#25D366", authMethod: "coming_soon", available: false, permissions: ["Send messages", "Receive messages"], dataProvided: "Customer messages, conversation history", modules: ["Communications"] },
  { id: "twilio", name: "Twilio", description: "SMS, voice calls and programmable messaging API.", category: "Communication", logoInitials: "TW", logoColor: "#F22F46", authMethod: "coming_soon", available: false, permissions: ["Send SMS", "Receive SMS", "Make calls"], dataProvided: "SMS, voice call records", modules: ["Communications"] },
  { id: "slack", name: "Slack", description: "Team messaging with channel-based collaboration.", category: "Communication", logoInitials: "#", logoColor: "#4A154B", authMethod: "coming_soon", available: false, permissions: ["Post messages", "Read channels"], dataProvided: "Team notifications, alerts", modules: ["Notifications"] },
  { id: "teams", name: "Microsoft Teams", description: "Microsoft collaboration with meetings and messaging.", category: "Communication", logoInitials: "MT", logoColor: "#464EB8", authMethod: "coming_soon", available: false, permissions: ["Post messages", "Create meetings"], dataProvided: "Team messages, meeting schedules", modules: ["Communications", "Calendar"] },
  { id: "intercom", name: "Intercom", description: "Customer messaging and support platform.", category: "Communication", logoInitials: "IC", logoColor: "#1F8DED", authMethod: "coming_soon", available: false, permissions: ["Read conversations", "Send messages"], dataProvided: "Customer conversations, support tickets", modules: ["Communications"] },
  { id: "zendesk", name: "Zendesk", description: "Customer support and ticketing platform.", category: "Communication", logoInitials: "ZD", logoColor: "#03363D", authMethod: "coming_soon", available: false, permissions: ["Read tickets", "Update tickets"], dataProvided: "Support tickets, customer interactions", modules: ["Communications"] },
  { id: "mailchimp", name: "Mailchimp", description: "Email marketing and automation platform.", category: "Communication", logoInitials: "MC", logoColor: "#FFE01B", authMethod: "coming_soon", available: false, permissions: ["Read campaigns", "Manage audiences"], dataProvided: "Email campaigns, audience data", modules: ["Marketing"] },
  { id: "klaviyo", name: "Klaviyo", description: "Email and SMS marketing automation.", category: "Communication", logoInitials: "KL", logoColor: "#1F77B4", authMethod: "coming_soon", available: false, permissions: ["Read campaigns", "Read profiles"], dataProvided: "Email/SMS campaigns, customer profiles", modules: ["Marketing"] },
  { id: "brevo", name: "Brevo", description: "Email marketing, SMS and CRM platform.", category: "Communication", logoInitials: "BR", logoColor: "#0B996E", authMethod: "coming_soon", available: false, permissions: ["Read campaigns", "Send emails"], dataProvided: "Email campaigns, contact lists", modules: ["Marketing"] },

  // ─── Calendar ──────────────────────────────────────────────────────────────
  { id: "google-calendar", name: "Google Calendar", description: "Appointment scheduling and booking synchronisation.", category: "Calendar", logoInitials: "GC", logoColor: "#4285F4", authMethod: "coming_soon", available: false, permissions: ["Read events", "Create events", "Delete events"], dataProvided: "Calendar events, appointments", modules: ["Calendar"], featured: true },
  { id: "ms-calendar", name: "Microsoft Calendar", description: "Outlook calendar with meeting management.", category: "Calendar", logoInitials: "MC", logoColor: "#0078D4", authMethod: "coming_soon", available: false, permissions: ["Read events", "Create events"], dataProvided: "Calendar events, meetings", modules: ["Calendar"] },
  { id: "apple-calendar", name: "Apple Calendar", description: "iCloud calendar sync for Apple device users.", category: "Calendar", logoInitials: "AC", logoColor: "#1A1A1A", authMethod: "coming_soon", available: false, permissions: ["Read events", "Create events"], dataProvided: "Calendar events", modules: ["Calendar"] },
  { id: "calendly", name: "Calendly", description: "Automated appointment scheduling and booking.", category: "Calendar", logoInitials: "CL", logoColor: "#006BFF", authMethod: "coming_soon", available: false, permissions: ["Read events", "Read invitees"], dataProvided: "Scheduled appointments, invitee data", modules: ["Calendar"] },

  // ─── Finance ───────────────────────────────────────────────────────────────
  { id: "stripe", name: "Stripe", description: "Payment processing, subscriptions and billing.", category: "Finance", logoInitials: "S", logoColor: "#635BFF", authMethod: "coming_soon", available: false, permissions: ["Read payments", "Read customers", "Read subscriptions"], dataProvided: "Payments, customers, subscriptions, revenue", modules: ["Finance", "Revenue"], featured: true },
  { id: "xero", name: "Xero", description: "Invoicing, payroll, expenses and financial reporting.", category: "Finance", logoInitials: "X", logoColor: "#13B5EA", authMethod: "coming_soon", available: false, permissions: ["Read invoices", "Create invoices", "Read contacts"], dataProvided: "Invoices, payments, accounting data", modules: ["Finance"] },
  { id: "quickbooks", name: "QuickBooks", description: "Small business accounting and tax management.", category: "Finance", logoInitials: "QB", logoColor: "#2CA01C", authMethod: "coming_soon", available: false, permissions: ["Read invoices", "Read reports"], dataProvided: "Invoices, payments, financial reports", modules: ["Finance"] },
  { id: "paypal", name: "PayPal", description: "Online payments, invoicing and merchant services.", category: "Finance", logoInitials: "PP", logoColor: "#003087", authMethod: "coming_soon", available: false, permissions: ["Read transactions", "Send invoices"], dataProvided: "Transactions, payments", modules: ["Finance"] },
  { id: "chargebee", name: "Chargebee", description: "Subscription billing and recurring payment management.", category: "Finance", logoInitials: "CB", logoColor: "#1A73E8", authMethod: "coming_soon", available: false, permissions: ["Read subscriptions", "Read invoices"], dataProvided: "Subscriptions, invoices, revenue", modules: ["Finance"] },

  // ─── Website ───────────────────────────────────────────────────────────────
  { id: "google_analytics", name: "Google Analytics", description: "Website traffic, behaviour and conversion analytics.", category: "Website", logoInitials: "GA", logoColor: "#E37400", authMethod: "coming_soon", available: false, permissions: ["Read reports", "Read real-time data"], dataProvided: "Traffic, sessions, engagement, conversions", modules: ["Website DNA"], featured: true },
  { id: "google_search_console", name: "Google Search Console", description: "Search queries, impressions, clicks and indexing data.", category: "Website", logoInitials: "SC", logoColor: "#4CAF50", authMethod: "coming_soon", available: false, permissions: ["Read search analytics", "Read crawl data"], dataProvided: "Search queries, rankings, indexing status", modules: ["Website DNA"] },
  { id: "google_tag_manager", name: "Google Tag Manager", description: "Tag management and tracking code deployment.", category: "Website", logoInitials: "GTM", logoColor: "#4285F4", authMethod: "coming_soon", available: false, permissions: ["Read tags", "Publish containers"], dataProvided: "Tracking tags, event configuration", modules: ["Website DNA"] },
  { id: "microsoft_clarity", name: "Microsoft Clarity", description: "Heatmaps, session recordings and UX analytics.", category: "Website", logoInitials: "MC", logoColor: "#0078D4", authMethod: "coming_soon", available: false, permissions: ["Read heatmaps", "Read sessions"], dataProvided: "Heatmaps, session replays, UX metrics", modules: ["Website DNA"] },
  { id: "google_business_profile", name: "Google Business Profile", description: "Business profile, reviews, local search and profile performance.", category: "Website", logoInitials: "GBP", logoColor: "#4285F4", authMethod: "coming_soon", available: false, permissions: ["Read reviews", "Read profile data", "Reply to reviews"], dataProvided: "Reviews, ratings, local search visibility, profile activity", modules: ["Reviews", "Reputation", "Website DNA"], featured: true },
  { id: "wordpress", name: "WordPress", description: "CMS integration for content and form management.", category: "Website", logoInitials: "WP", logoColor: "#21759B", authMethod: "coming_soon", available: false, permissions: ["Read pages", "Read forms"], dataProvided: "Pages, posts, form submissions", modules: ["Website DNA"] },
  { id: "webflow", name: "Webflow", description: "No-code website builder with CMS capabilities.", category: "Website", logoInitials: "WF", logoColor: "#4353FF", authMethod: "coming_soon", available: false, permissions: ["Read pages", "Read CMS"], dataProvided: "Pages, CMS content, form data", modules: ["Website DNA"] },
  { id: "shopify", name: "Shopify", description: "E-commerce platform for online retail management.", category: "Website", logoInitials: "SH", logoColor: "#5C6AC4", authMethod: "coming_soon", available: false, permissions: ["Read orders", "Read products", "Read customers"], dataProvided: "Orders, products, customer data", modules: ["Finance", "Relationships"] },
  { id: "woocommerce", name: "WooCommerce", description: "WordPress e-commerce plugin for online stores.", category: "Website", logoInitials: "WC", logoColor: "#7F54B3", authMethod: "coming_soon", available: false, permissions: ["Read orders", "Read products"], dataProvided: "Orders, products, customer data", modules: ["Finance", "Relationships"] },
  { id: "wix", name: "Wix", description: "Website builder with e-commerce and booking tools.", category: "Website", logoInitials: "WX", logoColor: "#0C6EFC", authMethod: "coming_soon", available: false, permissions: ["Read pages", "Read orders"], dataProvided: "Pages, store data, bookings", modules: ["Website DNA"] },
  { id: "squarespace", name: "Squarespace", description: "Website builder with commerce and scheduling.", category: "Website", logoInitials: "SQ", logoColor: "#1A1A1A", authMethod: "coming_soon", available: false, permissions: ["Read pages", "Read orders"], dataProvided: "Pages, commerce data", modules: ["Website DNA"] },

  // ─── Social Media ──────────────────────────────────────────────────────────
  { id: "facebook", name: "Facebook", description: "Facebook Page, Ads and Messenger integration.", category: "Social Media", logoInitials: "FB", logoColor: "#1877F2", authMethod: "coming_soon", available: false, permissions: ["Read page", "Post content", "Read messages"], dataProvided: "Page posts, messages, ad performance", modules: ["Marketing"] },
  { id: "instagram", name: "Instagram", description: "Instagram Business for posts, stories and DMs.", category: "Social Media", logoInitials: "IG", logoColor: "#E1306C", authMethod: "coming_soon", available: false, permissions: ["Read profile", "Post content"], dataProvided: "Profile data, posts, engagement metrics", modules: ["Marketing"] },
  { id: "linkedin", name: "LinkedIn", description: "LinkedIn Company Page and professional networking.", category: "Social Media", logoInitials: "LI", logoColor: "#0A66C2", authMethod: "coming_soon", available: false, permissions: ["Read profile", "Post content"], dataProvided: "Page analytics, post engagement", modules: ["Marketing"] },
  { id: "tiktok", name: "TikTok", description: "TikTok Business Centre for content and analytics.", category: "Social Media", logoInitials: "TT", logoColor: "#1A1A1A", authMethod: "coming_soon", available: false, permissions: ["Read profile", "Read analytics"], dataProvided: "Profile data, video analytics", modules: ["Marketing"] },
  { id: "x", name: "X (Twitter)", description: "X Business for posts, replies and analytics.", category: "Social Media", logoInitials: "X", logoColor: "#1A1A1A", authMethod: "coming_soon", available: false, permissions: ["Read profile", "Post content"], dataProvided: "Posts, mentions, engagement", modules: ["Marketing"] },
  { id: "youtube", name: "YouTube", description: "YouTube channel management and video analytics.", category: "Social Media", logoInitials: "YT", logoColor: "#FF0000", authMethod: "coming_soon", available: false, permissions: ["Read channel", "Read analytics"], dataProvided: "Channel data, video performance", modules: ["Marketing"] },
  { id: "meta_ads", name: "Meta Ads", description: "Facebook and Instagram advertising management.", category: "Social Media", logoInitials: "MA", logoColor: "#1877F2", authMethod: "coming_soon", available: false, permissions: ["Read ad campaigns", "Read insights"], dataProvided: "Ad spend, campaign performance, audience data", modules: ["Marketing"] },
  { id: "google_ads", name: "Google Ads", description: "Google search and display advertising.", category: "Social Media", logoInitials: "GAds", logoColor: "#4285F4", authMethod: "coming_soon", available: false, permissions: ["Read campaigns", "Read performance"], dataProvided: "Ad spend, click data, conversion tracking", modules: ["Marketing"] },

  // ─── Review Platforms ──────────────────────────────────────────────────────
  { id: "google_reviews", name: "Google Reviews", description: "Google Business Profile reviews and response management.", category: "Review Platforms", logoInitials: "GR", logoColor: "#4285F4", authMethod: "coming_soon", available: false, permissions: ["Read reviews", "Post replies"], dataProvided: "Reviews, ratings, response status", modules: ["Reviews", "Reputation"], featured: true },
  { id: "trustpilot", name: "Trustpilot", description: "Trustpilot reviews, invitations and reply management.", category: "Review Platforms", logoInitials: "TP", logoColor: "#00B67A", authMethod: "coming_soon", available: false, permissions: ["Read reviews", "Send invitations"], dataProvided: "Reviews, ratings, review invitations", modules: ["Reviews", "Reputation"] },
  { id: "facebook_reviews", name: "Facebook Reviews", description: "Facebook Page recommendations and review responses.", category: "Review Platforms", logoInitials: "FR", logoColor: "#1877F2", authMethod: "coming_soon", available: false, permissions: ["Read reviews", "Post replies"], dataProvided: "Page recommendations, reviews", modules: ["Reviews", "Reputation"] },
  { id: "yelp", name: "Yelp", description: "Yelp Business reviews and local search presence.", category: "Review Platforms", logoInitials: "YP", logoColor: "#D32323", authMethod: "coming_soon", available: false, permissions: ["Read reviews", "Read profile"], dataProvided: "Reviews, business profile data", modules: ["Reviews", "Reputation"] },
  { id: "tripadvisor", name: "TripAdvisor", description: "TripAdvisor reviews and hospitality management.", category: "Review Platforms", logoInitials: "TA", logoColor: "#34E0A1", authMethod: "coming_soon", available: false, permissions: ["Read reviews", "Post replies"], dataProvided: "Reviews, ratings, hospitality data", modules: ["Reviews", "Reputation"] },

  // ─── AI ────────────────────────────────────────────────────────────────────
  { id: "openai", name: "OpenAI", description: "GPT-4 and advanced reasoning models for AI features.", category: "AI", logoInitials: "AI", logoColor: "#1A1A1A", authMethod: "api_key", available: false, permissions: ["Chat completions", "Embeddings", "Function calling"], dataProvided: "AI model completions, embeddings, reasoning", modules: ["AI Governance", "Intelligence"], featured: true },
  { id: "anthropic", name: "Anthropic", description: "Claude AI models for analysis and generation.", category: "AI", logoInitials: "AN", logoColor: "#D97706", authMethod: "api_key", available: false, permissions: ["Chat completions", "Document analysis"], dataProvided: "AI model completions, document analysis", modules: ["AI Governance", "Intelligence"] },
  { id: "gemini", name: "Google Gemini", description: "Google's multimodal AI for text, image and data.", category: "AI", logoInitials: "GG", logoColor: "#4285F4", authMethod: "api_key", available: false, permissions: ["Chat completions", "Multimodal analysis"], dataProvided: "AI model completions, multimodal analysis", modules: ["AI Governance", "Intelligence"] },
  { id: "perplexity", name: "Perplexity", description: "Real-time AI search and market intelligence.", category: "AI", logoInitials: "PX", logoColor: "#20B2AA", authMethod: "api_key", available: false, permissions: ["Search queries", "Real-time data"], dataProvided: "AI-powered search results, market data", modules: ["Intelligence"] },

  // ─── Automation ────────────────────────────────────────────────────────────
  { id: "zapier", name: "Zapier", description: "No-code automation between thousands of apps.", category: "Automation", logoInitials: "ZP", logoColor: "#FF4A00", authMethod: "coming_soon", available: false, permissions: ["Trigger zaps", "Receive webhooks"], dataProvided: "Workflow triggers, automation events", modules: ["Automation"] },
  { id: "make", name: "Make.com", description: "Visual automation builder with advanced logic.", category: "Automation", logoInitials: "MK", logoColor: "#6D00CC", authMethod: "coming_soon", available: false, permissions: ["Trigger scenarios", "Receive webhooks"], dataProvided: "Scenario triggers, automation events", modules: ["Automation"] },
  { id: "n8n", name: "n8n", description: "Open-source workflow automation with self-hosting.", category: "Automation", logoInitials: "n8", logoColor: "#EA4B71", authMethod: "coming_soon", available: false, permissions: ["Trigger workflows", "Receive webhooks"], dataProvided: "Workflow triggers, automation events", modules: ["Automation"] },

  // ─── Storage ───────────────────────────────────────────────────────────────
  { id: "google_drive", name: "Google Drive", description: "Cloud storage for documents, files and backups.", category: "Storage", logoInitials: "GD", logoColor: "#4285F4", authMethod: "coming_soon", available: false, permissions: ["Read files", "Write files"], dataProvided: "File storage, document access", modules: ["Storage"] },
  { id: "dropbox", name: "Dropbox", description: "File hosting, sharing and collaboration platform.", category: "Storage", logoInitials: "DB", logoColor: "#0061FF", authMethod: "coming_soon", available: false, permissions: ["Read files", "Write files"], dataProvided: "File storage, sharing data", modules: ["Storage"] },
  { id: "onedrive", name: "OneDrive", description: "Microsoft cloud storage with Office 365 integration.", category: "Storage", logoInitials: "OD", logoColor: "#0078D4", authMethod: "coming_soon", available: false, permissions: ["Read files", "Write files"], dataProvided: "File storage, document access", modules: ["Storage"] },

  // ─── Developer ─────────────────────────────────────────────────────────────
  { id: "rest_api", name: "REST API", description: "Custom REST API integration for bespoke connections.", category: "Developer", logoInitials: "API", logoColor: "#1A1A1A", authMethod: "built_in", available: false, permissions: ["Full API access", "Read data", "Write data"], dataProvided: "Programmatic access to CrediEdgeOS data", modules: ["Developer"] },
  { id: "webhooks", name: "Webhooks", description: "Receive real-time event notifications from external services.", category: "Developer", logoInitials: "WH", logoColor: "#7C3AED", authMethod: "webhook", available: false, permissions: ["Receive webhooks", "Process events"], dataProvided: "Inbound event notifications", modules: ["Developer"] },
  { id: "api_keys", name: "API Keys", description: "Generate and manage API keys for partner integrations.", category: "Developer", logoInitials: "KEY", logoColor: "#D97706", authMethod: "built_in", available: false, permissions: ["Generate keys", "Revoke keys"], dataProvided: "API key management for external access", modules: ["Developer"] },
];
