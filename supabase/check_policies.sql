-- ================================================================
-- SIMPLE FIX: Disable RLS temporarily for testing
-- Run this in Supabase Dashboard → SQL Editor → Run
-- ================================================================

-- Check current policies first
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('chat_messages', 'contacts', 'kol_database', 'analytics_events')
ORDER BY tablename;
