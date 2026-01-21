-- Church Inventory System - Update RLS Policies for Anonymous Access
-- Run this SQL in your Supabase SQL Editor to allow unauthenticated access

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read assets" ON assets;
DROP POLICY IF EXISTS "Allow authenticated users to insert assets" ON assets;
DROP POLICY IF EXISTS "Allow authenticated users to update assets" ON assets;
DROP POLICY IF EXISTS "Allow authenticated users to delete assets" ON assets;

-- Create new policies that allow anonymous (anon) users to manage assets
-- This is suitable for internal church use without authentication

-- Allow anyone to read all assets (needed for QR code scanning)
CREATE POLICY "Allow public read access to assets"
  ON assets
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to insert new assets
CREATE POLICY "Allow public insert access to assets"
  ON assets
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to update assets
CREATE POLICY "Allow public update access to assets"
  ON assets
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete assets
CREATE POLICY "Allow public delete access to assets"
  ON assets
  FOR DELETE
  TO anon, authenticated
  USING (true);
