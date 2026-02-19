-- ================================================================
-- FIX v2: Drop ALL existing policies and recreate
-- Run this in Supabase Dashboard → SQL Editor → New Query → Run
-- ================================================================

-- Step 1: Drop ALL policies on all tables
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('chat_messages', 'contacts', 'kol_database', 'analytics_events')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- Step 2: Make sure RLS is enabled
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE kol_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Step 3: Create correct policies with explicit role targeting

-- Chat messages
CREATE POLICY "chat_insert" ON chat_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "chat_select" ON chat_messages
  FOR SELECT TO anon, authenticated USING (true);

-- Contacts
CREATE POLICY "contacts_insert" ON contacts
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contacts_select" ON contacts
  FOR SELECT TO authenticated USING (true);

-- KOL database
CREATE POLICY "kol_select" ON kol_database
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "kol_insert" ON kol_database
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "kol_update" ON kol_database
  FOR UPDATE TO authenticated USING (true);

-- Analytics events
CREATE POLICY "analytics_insert" ON analytics_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "analytics_select" ON analytics_events
  FOR SELECT TO authenticated USING (true);
