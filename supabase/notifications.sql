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

-- Enable RLS (service-role key bypasses automatically).
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated to read notifications.
CREATE POLICY "Authenticated can read notifications"
    ON public.notifications FOR SELECT
    USING (true);

-- Service role can manage.
CREATE POLICY "Service role can manage notifications"
    ON public.notifications FOR ALL
    USING (true)
    WITH CHECK (true);

-- Index for fast unread queries.
CREATE INDEX IF NOT EXISTS idx_notifications_unread
    ON public.notifications (is_read, created_at DESC)
    WHERE is_read = false;
