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

-- Enable RLS. The service-role key (used by the admin panel / API) bypasses
-- RLS automatically, so the app keeps working.
ALTER TABLE public.sales_reps ENABLE ROW LEVEL SECURITY;

-- Lock down direct access. The old policies had no `TO` clause, so they applied
-- to PUBLIC — anon could read AND write the staff roster (name, email, role)
-- straight from the REST API. Drop them. With RLS enabled and no permissive
-- policy, anon/authenticated are denied; only the service role (which bypasses
-- RLS) can access. The app only touches sales_reps via the service-role key.
DROP POLICY IF EXISTS "Authenticated can read reps" ON public.sales_reps;
DROP POLICY IF EXISTS "Service role can manage reps" ON public.sales_reps;
