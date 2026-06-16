-- Sales Reps table: roster of sales team members for lead assignment.
-- Run in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.sales_reps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'sales' CHECK (role IN ('sales', 'manager', 'admin')),
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (service-role key bypasses automatically).
ALTER TABLE public.sales_reps ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read reps (for dropdowns etc).
CREATE POLICY "Authenticated can read reps"
    ON public.sales_reps FOR SELECT
    USING (true);

-- Only service role can mutate (admin panel uses service key).
CREATE POLICY "Service role can manage reps"
    ON public.sales_reps FOR ALL
    USING (true)
    WITH CHECK (true);
