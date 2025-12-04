-- Open-Corporation.com Supabase Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Saved Calculations Table
-- Stores user's saved tax calculations
CREATE TABLE IF NOT EXISTS saved_calculations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,  -- Clerk user ID
  name TEXT NOT NULL,
  inputs JSONB NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_saved_calculations_user_id ON saved_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_calculations_created_at ON saved_calculations(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE saved_calculations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own calculations
CREATE POLICY "Users can view own calculations"
  ON saved_calculations
  FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

-- Users can only insert their own calculations
CREATE POLICY "Users can insert own calculations"
  ON saved_calculations
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Users can only update their own calculations
CREATE POLICY "Users can update own calculations"
  ON saved_calculations
  FOR UPDATE
  USING (auth.jwt() ->> 'sub' = user_id)
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Users can only delete their own calculations
CREATE POLICY "Users can delete own calculations"
  ON saved_calculations
  FOR DELETE
  USING (auth.jwt() ->> 'sub' = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
DROP TRIGGER IF EXISTS update_saved_calculations_updated_at ON saved_calculations;
CREATE TRIGGER update_saved_calculations_updated_at
  BEFORE UPDATE ON saved_calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CLERK + SUPABASE INTEGRATION SETUP
-- ============================================
--
-- In your Clerk Dashboard:
-- 1. Go to JWT Templates
-- 2. Create a new template named "supabase"
-- 3. Use this template:
-- {
--   "aud": "authenticated",
--   "role": "authenticated",
--   "sub": "{{user.id}}"
-- }
--
-- In your Supabase Dashboard:
-- 1. Go to Authentication > Providers
-- 2. Enable JWT and add your Clerk signing key
--    (Found in Clerk Dashboard > API Keys > JWT Signing Key)
-- ============================================
