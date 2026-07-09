import type {
  WebsiteScore, WebsiteDiscovery, JourneyStep, ConversionMetric,
  WebsiteOpportunity, SeoMetric, ContentIssue,
  WebsitePrediction, WebsiteMission, DnaContribution,
  WebsiteMemoryItem, WebsiteImpactMetric,
} from "./types";

// ─── Website DNA™ Scores ──────────────────────────────────────────────────────

export const websiteScores: WebsiteScore[] = [
  { label: "Health Score", score: 65, color: "#E31B23", trend: -4, description: "Overall website health requires attention." },
  { label: "Conversion Score", score: 52, color: "#f97316", trend: -9, description: "Visitors are not converting efficiently." },
  { label: "SEO Score", score: 61, color: "#f59e0b", trend: -6, description: "Rankings dropped — content action needed." },
  { label: "Speed Score", score: 54, color: "#ef4444", trend: -12, description: "Load time 4.2s — above acceptable threshold." },
  { label: "Mobile Score", score: 58, color: "#f97316", trend: -8, description: "Mobile bounce rate increased 22% this month." },
  { label: "Accessibility Score", score: 74, color: "#10b981", trend: 2, description: "Minor contrast and ARIA label improvements needed." },
  { label: "Trust Score", score: 69, color: "#3b82f6", trend: 1, description: "Add more testimonials and trust signals." },
  { label: "CrediEdge Contribution", score: 67, color: "#8b5cf6", trend: -4, description: "Website currently reducing your overall score." },
];

// ─── Website Discoveries ──────────────────────────────────────────────────────

export const websiteDiscoveries: WebsiteDiscovery[] = [
  {
    id: "wd1",
    title: "Homepage bounce rate increased 22% — visitors leaving immediately",
    explanation: "Between 1–9 July, homepage bounce rate climbed from 31% to 53%. The AI identified that a recent image addition increased load time by 1.8 seconds. Mobile users, who account for 64% of traffic, are disproportionately affected. Each percentage point of bounce rate increase costs approximately 2 potential leads per month.",
    businessImpact: "-£620 est./mo",
    impactType: "negative",
    confidence: 89,
    relatedPages: ["Homepage", "Service Pages"],
  },
  {
    id: "wd2",
    title: "Contact page converts at 3.1% — industry average is 8.4%",
    explanation: "The contact form has 9 fields. AI analysis of 1,200 comparable contact forms shows that reducing to 4 essential fields increases completion rate by 2.7x. Your current contact page is your highest-traffic page after the homepage, making this the single highest-ROI change available.",
    businessImpact: "+£2,800 potential/mo",
    impactType: "negative",
    confidence: 87,
    relatedPages: ["Contact Page", "Homepage"],
  },
  {
    id: "wd3",
    title: "Pricing page converts 4.1x better than average — an underdeveloped asset",
    explanation: "Visitors who reach the pricing page convert at 4.1x the rate of homepage visitors, yet only 11% of homepage visitors ever navigate to pricing. Adding a clear pricing link in the main navigation and hero section could redirect 3x more visitors to your best-converting page.",
    businessImpact: "+£3,200 potential/mo",
    impactType: "positive",
    confidence: 83,
    relatedPages: ["Pricing Page", "Homepage", "Navigation"],
  },
  {
    id: "wd4",
    title: "Google rankings dropped — 4 keywords fell from positions 3–5 to 7–9",
    explanation: "A competitor published 6 new service pages in June targeting your primary keywords. This caused 4 of your top-performing keywords to slip to page 1 lower positions, reducing organic click share by 31%. Estimated organic traffic reduction: 190 visitors/month, worth approximately £640 in potential bookings.",
    businessImpact: "-£640/mo",
    impactType: "negative",
    confidence: 84,
    relatedPages: ["Homepage", "Service Pages", "Blog"],
  },
  {
    id: "wd5",
    title: "Mobile visitors leave 47% faster than desktop — layout issue identified",
    explanation: "Average mobile session duration is 42 seconds vs 81 seconds on desktop. The AI identified that the hero section CTA button is below the fold on devices under 390px width, affecting 38% of mobile visitors. Moving the CTA above the fold could recover an estimated 14 additional monthly leads.",
    businessImpact: "+£1,960 potential/mo",
    impactType: "negative",
    confidence: 81,
    relatedPages: ["Homepage", "Service Pages"],
  },
];

// ─── Visitor Journey ──────────────────────────────────────────────────────────

export const journeySteps: JourneyStep[] = [
  { label: "Google Search", visitors: 1240, dropOff: 0, isDropPoint: false },
  { label: "Homepage", visitors: 1240, dropOff: 22, isDropPoint: true },
  { label: "Service Page", visitors: 487, dropOff: 31, isDropPoint: true },
  { label: "Pricing Page", visitors: 136, dropOff: 18, isDropPoint: false },
  { label: "Contact Form", visitors: 93, dropOff: 67, isDropPoint: true },
  { label: "Form Submitted", visitors: 31, dropOff: 0, isDropPoint: false },
  { label: "Booking Confirmed", visitors: 22, dropOff: 0, isDropPoint: false },
];

// ─── Conversion Metrics ───────────────────────────────────────────────────────

export const conversionMetrics: ConversionMetric[] = [
  { label: "Monthly Visitors", value: "1,240", trend: "-18%", up: false, explanation: "SEO rankings declined — organic traffic fell 190 visits this month." },
  { label: "Leads Generated", value: "31", trend: "-12%", up: false, explanation: "Contact form completions fell — form has too many fields." },
  { label: "Conversions", value: "22", trend: "-9%", up: false, explanation: "Slower load time and weak CTAs reducing conversion from lead to booking." },
  { label: "Conversion Rate", value: "1.8%", trend: "-0.4%", up: false, explanation: "Industry average is 3.2% — significant improvement opportunity available." },
  { label: "Avg. Time on Site", value: "1m 42s", trend: "-0:31", up: false, explanation: "Down from 2m 13s — mobile users are leaving faster due to layout issues." },
  { label: "Bounce Rate", value: "53%", trend: "+22%", up: false, explanation: "Increased since image was added to homepage — load time now 4.2 seconds." },
  { label: "Top Exit Page", value: "Contact", trend: "", up: false, explanation: "67% of visitors who reach the contact page leave without submitting the form." },
  { label: "Revenue Generated", value: "£3,960", trend: "-£820", up: false, explanation: "Direct website-attributed revenue this month — down from £4,780 in June." },
];

// ─── AI Opportunities ─────────────────────────────────────────────────────────

export const websiteOpportunities: WebsiteOpportunity[] = [
  {
    id: "wo1",
    title: "Simplify contact form — reduce from 9 to 4 fields",
    estimatedRevenue: "£2,800/mo",
    conversionIncrease: "+170%",
    difficulty: "Easy",
    timeRequired: "30 min",
    confidence: 91,
    reasoning: "9-field forms average 3.1% completion. 4-field forms average 8.4%. At current traffic, recovering this gap is worth 22 additional monthly leads.",
  },
  {
    id: "wo2",
    title: "Compress images — reduce load time from 4.2s to under 2.5s",
    estimatedRevenue: "£1,960/mo",
    conversionIncrease: "+32%",
    difficulty: "Easy",
    timeRequired: "1 hour",
    confidence: 88,
    reasoning: "Homepage images are uncompressed — 3.8MB total. Compressing to WebP format reduces load time by 1.8s, recovering 22% of mobile bounce.",
  },
  {
    id: "wo3",
    title: "Add pricing page link to main navigation",
    estimatedRevenue: "£3,200/mo",
    conversionIncrease: "+18%",
    difficulty: "Easy",
    timeRequired: "15 min",
    confidence: 83,
    reasoning: "Pricing page converts 4.1x better than average but only 11% of visitors find it. Navigation link would triple pricing page traffic.",
  },
  {
    id: "wo4",
    title: "Rewrite homepage hero — stronger CTA above the fold on mobile",
    estimatedRevenue: "£1,400/mo",
    conversionIncrease: "+22%",
    difficulty: "Medium",
    timeRequired: "2 hours",
    confidence: 79,
    reasoning: "CTA is below fold on 38% of mobile devices. Moving it above fold with a clearer action message recovers an estimated 14 leads per month.",
  },
  {
    id: "wo5",
    title: "Publish 3 new service pages targeting dropped keywords",
    estimatedRevenue: "£640/mo",
    conversionIncrease: "+14%",
    difficulty: "Hard",
    timeRequired: "1 week",
    confidence: 84,
    reasoning: "4 keywords dropped from top-3 to positions 7–9. Publishing competitor-beating content should recover rankings in 4–6 weeks.",
  },
  {
    id: "wo6",
    title: "Add 8 customer testimonials with photos to homepage",
    estimatedRevenue: "£1,100/mo",
    conversionIncrease: "+12%",
    difficulty: "Easy",
    timeRequired: "45 min",
    confidence: 77,
    reasoning: "Current trust score is 69. Pages with 6+ testimonials with photos convert 12% better on average. You have 23 5-star reviews to pull from.",
  },
];

// ─── SEO Metrics ──────────────────────────────────────────────────────────────

export const seoMetrics: SeoMetric[] = [
  { label: "Primary Keywords Ranking", value: "4 dropped", status: "critical", detail: "4 keywords fell from positions 3–5 to 7–9 this month." },
  { label: "Meta Descriptions", value: "3 missing", status: "warning", detail: "3 service pages have no meta description — reduces click-through rate." },
  { label: "Page Titles", value: "2 duplicate", status: "warning", detail: "Homepage and About page share the same title tag." },
  { label: "Broken Links", value: "1 found", status: "warning", detail: "One internal link on the blog points to a deleted page." },
  { label: "Indexing Status", value: "All indexed", status: "good", detail: "All 11 pages are indexed by Google." },
  { label: "Internal Linking", value: "Weak", status: "critical", detail: "Pricing page has only 1 internal link — Google cannot discover it easily." },
  { label: "Page Structure (H1/H2)", value: "2 pages missing H1", status: "warning", detail: "About and FAQ pages are missing H1 headings." },
  { label: "Schema Markup", value: "Missing", status: "critical", detail: "No LocalBusiness or Service schema — missing rich results opportunity." },
  { label: "Core Web Vitals", value: "Failing", status: "critical", detail: "LCP: 4.2s (poor). CLS: 0.21 (poor). FID: 89ms (needs improvement)." },
  { label: "Backlinks", value: "14 domains", status: "warning", detail: "Low domain authority. Competitor averages 47 referring domains." },
];

// ─── Content Issues ───────────────────────────────────────────────────────────

export const contentIssues: ContentIssue[] = [
  { id: "ci1", page: "Homepage", type: "weak-headline", issue: "Headline reads 'Welcome to [Business Name]' — generic and unconvincing", suggestion: "Replace with a benefit-led headline: 'Fast, Reliable [Service] — Trusted by 200+ [Location] Customers'", impact: "high" },
  { id: "ci2", page: "Contact Page", type: "poor-cta", issue: "CTA button reads 'Submit' — no urgency or benefit", suggestion: "Replace with 'Get Your Free Quote Today' or 'Book My Appointment →'", impact: "high" },
  { id: "ci3", page: "Service Pages", type: "missing-proof", issue: "No testimonials or case studies on service pages", suggestion: "Add 2–3 customer quotes with star ratings directly below each service description", impact: "high" },
  { id: "ci4", page: "Homepage", type: "missing-faq", issue: "No FAQ section — visitors have unanswered questions about pricing and process", suggestion: "Add 6-question FAQ covering price, timing, what's included, and what to expect", impact: "medium" },
  { id: "ci5", page: "About Page", type: "low-trust", issue: "No team photos, credentials, or certifications visible", suggestion: "Add owner photo, years in business, accreditations, and a brief personal story", impact: "medium" },
  { id: "ci6", page: "Service Pages", type: "confusing", issue: "Service descriptions are technical — visitors don't understand the benefit", suggestion: "Rewrite in plain English: 'What you get', 'How it works', 'What it costs'", impact: "medium" },
];

// ─── Website Predictions ──────────────────────────────────────────────────────

export const websitePredictions: WebsitePrediction[] = [
  { label: "Monthly Traffic", current: "1,240/mo", predicted: "1,050/mo", confidence: 82, direction: "down", reasoning: "SEO rankings will continue declining without content intervention. Estimated further 16% organic traffic loss.", timeframe: "Next 30 days" },
  { label: "Lead Generation", current: "31/mo", predicted: "47/mo", confidence: 79, direction: "up", reasoning: "Fixing the contact form alone (9→4 fields) is predicted to increase monthly leads by 52%.", timeframe: "After form fix" },
  { label: "Conversion Rate", current: "1.8%", predicted: "3.1%", confidence: 77, direction: "up", reasoning: "Speed + CTA + form improvements combined could bring conversion rate close to industry average.", timeframe: "After full fixes" },
  { label: "SEO Rankings", current: "Pos 7–9", predicted: "Pos 4–6", confidence: 71, direction: "up", reasoning: "Publishing 3 new content pages should recover dropped keyword positions within 6 weeks.", timeframe: "6 weeks" },
  { label: "Revenue from Website", current: "£3,960/mo", predicted: "£7,200/mo", confidence: 74, direction: "up", reasoning: "Cumulative impact of all opportunity fixes estimated at +£3,240/mo additional revenue.", timeframe: "90 days" },
  { label: "Mobile Bounce Rate", current: "53%", predicted: "31%", confidence: 85, direction: "up", reasoning: "Image compression alone is expected to bring mobile bounce rate back to pre-July levels.", timeframe: "After speed fix" },
];

// ─── Website Missions ─────────────────────────────────────────────────────────

export const websiteMissions: WebsiteMission[] = [
  {
    id: "wm1",
    campaign: "Increase Website Conversions",
    mission: "Optimise Homepage for Conversions",
    tasks: ["Compress homepage images to WebP", "Move CTA above fold on mobile", "Add 8 customer testimonials with photos", "Rewrite hero headline with benefit-led copy"],
    status: "active",
    estimatedRevenue: "£3,460/mo",
  },
  {
    id: "wm2",
    campaign: "Increase Website Conversions",
    mission: "Fix Contact Form",
    tasks: ["Reduce form from 9 to 4 fields", "Change submit button copy to 'Get Your Free Quote'", "Add trust badge below form", "Enable auto-confirmation email"],
    status: "planned",
    estimatedRevenue: "£2,800/mo",
  },
  {
    id: "wm3",
    campaign: "Recover SEO Rankings",
    mission: "Publish Service Content Pages",
    tasks: ["Research competitor keyword gaps", "Write 3 service-focused landing pages", "Add internal links from homepage", "Submit updated sitemap to Google"],
    status: "planned",
    estimatedRevenue: "£640/mo",
  },
];

// ─── Business DNA Contributions ───────────────────────────────────────────────

export const dnaContributions: DnaContribution[] = [
  { module: "Relationship DNA™", contribution: 42, color: "#E31B23", route: "/relationships" },
  { module: "Communication Intelligence™", contribution: 38, color: "#3b82f6", route: "/communications" },
  { module: "Reputation DNA™", contribution: 61, color: "#10b981", route: "/reviews" },
  { module: "Revenue DNA™", contribution: 55, color: "#f59e0b", route: "/insights" },
  { module: "Marketing DNA™", contribution: 78, color: "#8b5cf6", route: "/insights" },
  { module: "Operations DNA™", contribution: 29, color: "#06b6d4", route: "/tasks" },
  { module: "Automation DNA™", contribution: 33, color: "#6b7280", route: "/tasks" },
  { module: "Finance DNA™", contribution: 24, color: "#ec4899", route: "/health" },
];

// ─── AI Memory ────────────────────────────────────────────────────────────────

export const websiteMemoryItems: WebsiteMemoryItem[] = [
  { id: "wm1", insight: "Visitors convert 2.7x better after testimonials were added to service pages in April", learnedFrom: "A/B test — 312 visits compared", confidence: 93, category: "Conversions" },
  { id: "wm2", insight: "Mobile users respond to shorter hero sections — pages under 600px height on mobile convert 34% better", learnedFrom: "Mobile session analysis", confidence: 88, category: "Mobile" },
  { id: "wm3", insight: "Contact forms with 4 fields or fewer achieve 8.4% average completion — 9+ fields average 3.1%", learnedFrom: "1,200 form analysis dataset", confidence: 94, category: "Forms" },
  { id: "wm4", insight: "Landing pages with embedded video increase average session time by 1m 42s", learnedFrom: "Video landing page experiments", confidence: 82, category: "Content" },
  { id: "wm5", insight: "Pages with schema markup rank 23% higher on average than comparable pages without", learnedFrom: "SEO correlation analysis", confidence: 79, category: "SEO" },
  { id: "wm6", insight: "Every 1-second improvement in load time increases conversions by approximately 7%", learnedFrom: "Core Web Vitals data", confidence: 91, category: "Speed" },
];

// ─── Website Impact Metrics ───────────────────────────────────────────────────

export const websiteImpactMetrics: WebsiteImpactMetric[] = [
  { label: "Revenue Generated", value: 3960, prefix: "£", description: "Direct website-attributed this month", color: "#E31B23" },
  { label: "Leads Generated", value: 31, description: "Form submissions and enquiries", color: "#10b981" },
  { label: "Potential Revenue (Fixes)", value: 9700, prefix: "£", description: "Unlockable with recommended fixes", color: "#f59e0b" },
  { label: "Bounce Reduction Potential", value: 22, suffix: "%", description: "Mobile bounce recoverable with speed fix", color: "#3b82f6" },
  { label: "SEO Improvement (Fixes)", value: 31, suffix: "%", description: "Expected traffic recovery after content fix", color: "#8b5cf6" },
  { label: "Hours of AI Analysis", value: 47, description: "AI has analysed your website this month", color: "#06b6d4" },
  { label: "Issues Identified", value: 18, description: "Across performance, SEO, content, and UX", color: "#ef4444" },
  { label: "CrediEdge Score Impact", value: 67, suffix: "/100", description: "Current website contribution to your score", color: "#f97316" },
];

// ─── Suggested Chat Prompts ───────────────────────────────────────────────────

export const websiteSuggestedPrompts = [
  "Why aren't visitors converting?",
  "What is my biggest website problem?",
  "How do I fix my bounce rate?",
  "Why did my Google rankings drop?",
  "What would double my leads?",
  "How does my site compare to competitors?",
  "What should I fix first?",
  "How much revenue is my website losing?",
];
