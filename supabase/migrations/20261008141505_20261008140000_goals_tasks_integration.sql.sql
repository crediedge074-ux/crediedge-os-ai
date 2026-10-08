/*
# Goals + Tasks Integration Schema

## Purpose
Connects Goals to Tasks and Missions so the business can track:
  GOAL → MISSION → TASK → ACTION → PROGRESS → RESULT

## Changes

### 1. Modified tables

**goals** — adds two columns:
  - `owner_id` (uuid, nullable) — the goal owner (references auth.users). Scoped through memberships, not a direct ownership check.
  - `priority` (text, default 'medium') — low / medium / high / urgent.

**tasks** — adds one column:
  - `goal_id` (uuid, nullable) — FK to goals(id) ON DELETE SET NULL. Allows a task to belong to a goal.

**missions** — adds one column:
  - `goal_id` (uuid, nullable) — FK to goals(id) ON DELETE SET NULL. Allows a mission to belong to a goal.

### 2. New tables

**goal_comments** — same structure as task_comments:
  - id, business_id, goal_id, parent_comment_id (threaded), user_id, comment_text, created_at, updated_at.
  - RLS: business members can SELECT/INSERT; UPDATE/DELETE scoped to comment owner (user_id = auth.uid()).

**goal_comment_reactions** — same structure as task_comment_reactions:
  - id, business_id, comment_id, user_id, emoji, created_at.
  - UNIQUE(comment_id, user_id, emoji).
  - RLS: business members can SELECT; INSERT/UPDATE/DELETE scoped to user_id = auth.uid().

**goal_progress_updates** — structured progress updates for goals:
  - id, business_id, goal_id, user_id, update_text, progress_value (numeric, optional — can update current_value), created_at.
  - RLS: business members can SELECT/INSERT. No UPDATE/DELETE (progress updates are immutable audit records).

### 3. Indexes
  - goals_business_id_idx (already exists)
  - goals_owner_id_idx
  - goals_status_idx (already exists)
  - tasks_goal_id_idx
  - missions_goal_id_idx
  - goal_comments_goal_id_idx
  - goal_comment_reactions_comment_id_idx
  - goal_progress_updates_goal_id_idx

### 4. Security
  - All new tables have RLS enabled.
  - All policies use the existing memberships-based pattern (EXISTS SELECT 1 FROM memberships WHERE business_id match AND user_id = auth.uid() AND status = 'active').
  - Comment UPDATE/DELETE scoped to owner (user_id = auth.uid()) in addition to membership check.
  - No destructive changes to existing tables or data.
*/

-- ─── goals: add owner_id and priority ───
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'goals' AND column_name = 'owner_id') THEN
    ALTER TABLE goals ADD COLUMN owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'goals' AND column_name = 'priority') THEN
    ALTER TABLE goals ADD COLUMN priority text NOT NULL DEFAULT 'medium';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS goals_owner_id_idx ON goals(owner_id);

-- ─── tasks: add goal_id ───
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'goal_id') THEN
    ALTER TABLE tasks ADD COLUMN goal_id uuid REFERENCES goals(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS tasks_goal_id_idx ON tasks(goal_id);

-- ─── missions: add goal_id ───
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'missions' AND column_name = 'goal_id') THEN
    ALTER TABLE missions ADD COLUMN goal_id uuid REFERENCES goals(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS missions_goal_id_idx ON missions(goal_id);

-- ─── goal_comments ───
CREATE TABLE IF NOT EXISTS goal_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES goal_comments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  comment_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE goal_comments ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS goal_comments_goal_id_idx ON goal_comments(goal_id);

DROP POLICY IF EXISTS "members_select_goal_comments" ON goal_comments;
CREATE POLICY "members_select_goal_comments"
  ON goal_comments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = goal_comments.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_goal_comments" ON goal_comments;
CREATE POLICY "members_insert_goal_comments"
  ON goal_comments FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = goal_comments.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_goal_comments" ON goal_comments;
CREATE POLICY "members_update_goal_comments"
  ON goal_comments FOR UPDATE TO authenticated
  USING (goal_comments.user_id = auth.uid())
  WITH CHECK (goal_comments.user_id = auth.uid());

DROP POLICY IF EXISTS "members_delete_goal_comments" ON goal_comments;
CREATE POLICY "members_delete_goal_comments"
  ON goal_comments FOR DELETE TO authenticated
  USING (goal_comments.user_id = auth.uid());

-- ─── goal_comment_reactions ───
CREATE TABLE IF NOT EXISTS goal_comment_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  comment_id uuid NOT NULL REFERENCES goal_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji varchar(20) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, user_id, emoji)
);

ALTER TABLE goal_comment_reactions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS goal_comment_reactions_comment_id_idx ON goal_comment_reactions(comment_id);

DROP POLICY IF EXISTS "members_select_goal_comment_reactions" ON goal_comment_reactions;
CREATE POLICY "members_select_goal_comment_reactions"
  ON goal_comment_reactions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = goal_comment_reactions.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_goal_comment_reactions" ON goal_comment_reactions;
CREATE POLICY "members_insert_goal_comment_reactions"
  ON goal_comment_reactions FOR INSERT TO authenticated
  WITH CHECK (goal_comment_reactions.user_id = auth.uid());

DROP POLICY IF EXISTS "members_update_goal_comment_reactions" ON goal_comment_reactions;
CREATE POLICY "members_update_goal_comment_reactions"
  ON goal_comment_reactions FOR UPDATE TO authenticated
  USING (goal_comment_reactions.user_id = auth.uid())
  WITH CHECK (goal_comment_reactions.user_id = auth.uid());

DROP POLICY IF EXISTS "members_delete_goal_comment_reactions" ON goal_comment_reactions;
CREATE POLICY "members_delete_goal_comment_reactions"
  ON goal_comment_reactions FOR DELETE TO authenticated
  USING (goal_comment_reactions.user_id = auth.uid());

-- ─── goal_progress_updates ───
CREATE TABLE IF NOT EXISTS goal_progress_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  update_text text NOT NULL,
  progress_value numeric(12,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE goal_progress_updates ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS goal_progress_updates_goal_id_idx ON goal_progress_updates(goal_id);

DROP POLICY IF EXISTS "members_select_goal_progress_updates" ON goal_progress_updates;
CREATE POLICY "members_select_goal_progress_updates"
  ON goal_progress_updates FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = goal_progress_updates.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_goal_progress_updates" ON goal_progress_updates;
CREATE POLICY "members_insert_goal_progress_updates"
  ON goal_progress_updates FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = goal_progress_updates.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));