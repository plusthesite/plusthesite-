-- Notifications table: in-app notification center for the admin panel.
-- Run in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('new_lead', 'new_opportunity', 'lead_converted', 'task_overdue', 'system')),
    title TEXT NOT NULL,
    message TEXT,
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS. The service-role key (used by /api/admin/notifications after an
-- admin-session check) bypasses RLS automatically, so the admin notification
-- center keeps working.
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Lock down direct access. The old "USING (true)" SELECT policy had no
-- `TO authenticated` clause, so it applied to PUBLIC — meaning anyone holding
-- the public anon key could read every notification straight from the REST API,
-- bypassing the route. Drop both permissive policies. With RLS enabled and no
-- permissive policy, anon/authenticated are denied; only the service role
-- (which bypasses RLS) can access.
DROP POLICY IF EXISTS "Authenticated can read notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role can manage notifications" ON public.notifications;

-- Index for fast unread queries.
CREATE INDEX IF NOT EXISTS idx_notifications_unread
    ON public.notifications (is_read, created_at DESC)
    WHERE is_read = false;
