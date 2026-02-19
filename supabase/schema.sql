-- ================================================================
-- plus. AI Marketing Studio — Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor → New Query → Run
-- ================================================================

-- 1. Chat Messages (AI chat history)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_messages (session_id, created_at);

-- 2. Contacts (form submissions)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. KOL Database (influencers)
CREATE TABLE IF NOT EXISTS kol_database (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  handle TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  followers TEXT NOT NULL,
  engagement_rate TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Analytics Events (user actions tracking)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  page TEXT NOT NULL,
  metadata JSONB,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events (event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events (session_id);

-- ================================================================
-- Row Level Security (RLS)
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE kol_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Chat messages: anon and authenticated can insert & read
CREATE POLICY "Allow anon insert chat" ON chat_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon read chat" ON chat_messages
  FOR SELECT TO anon, authenticated USING (true);

-- Contacts: anon and authenticated can insert, only authenticated can read
CREATE POLICY "Allow anon insert contact" ON contacts
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated read contacts" ON contacts
  FOR SELECT TO authenticated USING (true);

-- KOL database: anon and authenticated can read, only authenticated can modify
CREATE POLICY "Allow anon read kol" ON kol_database
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow authenticated insert kol" ON kol_database
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update kol" ON kol_database
  FOR UPDATE TO authenticated USING (true);

-- Analytics: anon and authenticated can insert, only authenticated can read
CREATE POLICY "Allow anon insert analytics" ON analytics_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated read analytics" ON analytics_events
  FOR SELECT TO authenticated USING (true);

-- ================================================================
-- Seed KOL Data (optional — matches existing mockData.ts)
-- ================================================================

INSERT INTO kol_database (name, handle, category, followers, engagement_rate, price, tags, verified)
VALUES
  ('Sasa Kuliner', '@sasaeats', 'F&B', '45K', '5.2%', 350000, ARRAY['Micro', 'Halal'], true),
  ('OOTD Budi', '@budistyle', 'Fashion', '120K', '3.8%', 1200000, ARRAY['Macro', 'Style'], true),
  ('Gadget Rina', '@rinatech', 'Technology', '25K', '8.5%', 500000, ARRAY['Nano', 'Review'], false),
  ('Mama Dapur', '@mamacooks', 'F&B', '80K', '4.1%', 750000, ARRAY['Micro', 'Resep'], true),
  ('Fit with Andi', '@andifit', 'Health', '200K', '2.9%', 2500000, ARRAY['Macro', 'Gym'], true),
  ('Travel Santuy', '@santuytrip', 'Travel', '60K', '6.0%', 900000, ARRAY['Micro', 'Trip'], false)
ON CONFLICT (handle) DO NOTHING;
