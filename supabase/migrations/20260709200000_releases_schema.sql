-- ── APP RELEASES & GLOBAL SYSTEM NOTIFICATIONS SCHEMA ──────────────────────

CREATE TABLE IF NOT EXISTS public.app_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    release_type VARCHAR(50) NOT NULL DEFAULT 'Feature', -- 'Feature', 'Improvement', 'Bug Fix', 'Security', 'System Update'
    published_at TIMESTAMPTZ,
    is_published BOOLEAN NOT NULL DEFAULT false,
    changelog_notes TEXT,
    deployment_id VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS public.user_release_reads (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    release_id UUID NOT NULL REFERENCES public.app_releases(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, release_id)
);

-- Enable RLS
ALTER TABLE public.app_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_release_reads ENABLE ROW LEVEL SECURITY;

-- Global Read Access for Published System Releases
CREATE POLICY "Any authenticated user can read published app releases"
    ON public.app_releases FOR SELECT
    TO authenticated
    USING (is_published = true);

-- User Read Tracking Policies
CREATE POLICY "Users can view their own release read states"
    ON public.user_release_reads FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can mark release as read"
    ON public.user_release_reads FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
