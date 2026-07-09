/*
# Create customers table

## Summary
Adds the `customers` table — the core business object for tracking customer relationships.
Each customer belongs to a `business` and is isolated per-business via RLS using the `memberships` table.

## New Tables

### customers
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | auto-generated |
| business_id | uuid FK businesses | tenant scope |
| first_name | text | |
| last_name | text | |
| full_name | text | derived display name |
| company_name | text | for business customers |
| email | text | |
| phone | text | |
| secondary_phone | text | |
| address | text | |
| city | text | |
| county | text | |
| postcode | text | |
| country | text | default 'United Kingdom' |
| date_of_birth | date | |
| customer_type | text | 'individual' or 'business' |
| status | text | 'active', 'inactive', 'archived' |
| source | text | acquisition channel |
| notes | text | free-form notes |
| tags | text[] | searchable labels |
| preferred_contact_method | text | 'email', 'sms', 'phone' |
| marketing_consent | boolean | GDPR |
| gdpr_consent | boolean | GDPR |
| lifetime_value | numeric | total spend to date |
| last_contacted_at | timestamptz | |
| last_booking_at | timestamptz | |
| customer_since | date | first engagement |
| avatar_url | text | |
| is_active | boolean | soft delete flag |
| created_by | uuid FK auth.users | |
| updated_by | uuid FK auth.users | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## Security
- RLS enabled: every row is scoped to authenticated users who are active members of the customer's business.
- Four separate policies: SELECT, INSERT, UPDATE, DELETE.
- Membership check: `EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = customers.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active')`

## Indexes
- `customers_business_id_idx` for fast tenant scoping
- `customers_business_email_idx` for email lookup / uniqueness within a business
- `customers_full_name_idx` for name search
- `customers_status_idx` for filtering by status
- `customers_is_active_idx` for soft-delete filtering
- `customers_tags_gin_idx` GIN index for array tag search
*/

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  full_name text,
  company_name text,
  email text,
  phone text,
  secondary_phone text,
  address text,
  city text,
  county text,
  postcode text,
  country text DEFAULT 'United Kingdom',
  date_of_birth date,
  customer_type text NOT NULL DEFAULT 'individual',
  status text NOT NULL DEFAULT 'active',
  source text,
  notes text,
  tags text[] DEFAULT '{}',
  preferred_contact_method text DEFAULT 'email',
  marketing_consent boolean NOT NULL DEFAULT false,
  gdpr_consent boolean NOT NULL DEFAULT false,
  lifetime_value numeric(12,2) NOT NULL DEFAULT 0,
  last_contacted_at timestamptz,
  last_booking_at timestamptz,
  customer_since date DEFAULT CURRENT_DATE,
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customers_business_id_idx ON customers(business_id);
CREATE INDEX IF NOT EXISTS customers_business_email_idx ON customers(business_id, email);
CREATE INDEX IF NOT EXISTS customers_full_name_idx ON customers(business_id, full_name);
CREATE INDEX IF NOT EXISTS customers_status_idx ON customers(business_id, status);
CREATE INDEX IF NOT EXISTS customers_is_active_idx ON customers(business_id, is_active);
CREATE INDEX IF NOT EXISTS customers_tags_gin_idx ON customers USING GIN(tags);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_customers" ON customers;
CREATE POLICY "members_select_customers" ON customers FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = customers.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
);

DROP POLICY IF EXISTS "members_insert_customers" ON customers;
CREATE POLICY "members_insert_customers" ON customers FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = customers.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
);

DROP POLICY IF EXISTS "members_update_customers" ON customers;
CREATE POLICY "members_update_customers" ON customers FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = customers.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = customers.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
);

DROP POLICY IF EXISTS "members_delete_customers" ON customers;
CREATE POLICY "members_delete_customers" ON customers FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = customers.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
);

CREATE OR REPLACE FUNCTION update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS customers_updated_at ON customers;
CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_customers_updated_at();
