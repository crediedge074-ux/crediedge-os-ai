# CrediEdgeOS Backend Foundation Documentation

## 1. Overview & Architectural Philosophy
CrediEdgeOS is a multi-tenant Business Operating System designed for SMEs. Rather than behaving like isolated SaaS tools, all modules share a unified underlying data model.

The architecture uses:
- **Frontend / Framework**: React 19, TanStack Start, TanStack Router (file-based routing in `src/routes`), Vite, Tailwind CSS.
- **Backend & Persistence**: Supabase (PostgreSQL, Row Level Security, Auth, Realtime).
- **Multi-Tenancy**: `businesses` table is the root tenant object. All domain entities belong to a `business_id`.
- **Security Model**: Supabase Row Level Security (RLS) policies enforce tenant isolation at the database level via `memberships`.

---

## 2. Core Entities & Schema Architecture

### Root Tenants & Membership
- **`businesses`**: Root workspace object (stores company name, VAT, currency, settings).
- **`profiles`**: User details (linked 1:1 with `auth.users`).
- **`memberships`**: Connects `profiles` to `businesses` with roles (`owner`, `admin`, `member`). Allows a single user to belong to multiple businesses.
- **`settings`**: Business preferences, theme, AI provider, and prompt context.

### Operations & CRM
- **`customers`**: Core customer intelligence records (lifetime value, tags, GDPR consent, preferences).
- **`jobs`**: Core delivery entity connecting Customers, Calendar, Tasks, Invoices, and Reviews.
- **`tasks`**: Operational tasks with priorities, assignees, due dates, and links to Jobs/Customers.
- **`calendar_events`**: Operational calendar events linked to Jobs, Tasks, and Customers.

### Finance & Customer Experience
- **`invoices`**: Billing documents sent to customers. `amount_paid` and payment status are auto-maintained via PL/pgSQL database triggers from `payments`.
- **`payments`**: Single source of truth for revenue/cashflow (income vs expense).
- **`communications`**: Central activity & messaging timeline (email, SMS, WhatsApp, phone notes).
- **`reviews`**: Review request workflows linked to completed Jobs and Customers.

### Intelligence & System Operations
- **`goals`**: Business target metrics (revenue, review count, efficiency).
- **`ai_recommendations` & `ai_recommendation_outcomes`**: Recommendation engine records and feedback loop history.
- **`business_metrics`**: Daily snapshots of CrediEdge Score, revenue MTD, conversion, and review ratings.
- **`notifications`**: Command Centre notifications.
- **`activity_logs`**: Reusable cross-module activity timeline (feeds CRM customer timeline and Command Centre activity feed).
- **`integrations`**: Platform configurations for third-party tools (Stripe, WhatsApp, QuickBooks, Google Calendar).

---

## 3. Authentication & Multi-Tenancy Security (RLS)

### Authentication
- Uses Supabase Auth (`supabase.auth`).
- On user signup, the PostgreSQL trigger `handle_new_user()` fires automatically to create:
  1. Profile entry in `profiles`
  2. Business workspace in `businesses`
  3. Membership record linking user as `owner` in `memberships`
  4. Business settings in `settings`

### Row Level Security (RLS)
Security is enforced strictly in PostgreSQL via Row Level Security (RLS) policies. Every query checks that the authenticated user (`auth.uid()`) is an active member of the target `business_id`:

```sql
CREATE POLICY "members_select_entity" ON table_name FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = table_name.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
);
```

---

## 4. Local Development & Setup Commands

### Environment Variables
Configure the following in `.env` or `.env.local`:

```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Running Locally
To install dependencies, execute type checks, and start the development server:

```bash
# Install dependencies
bun install

# Run TypeScript type check
npx tsc --noEmit

# Test production build
npm run build

# Start local dev server
bun run dev
```
