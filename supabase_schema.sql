-- Church Inventory System - Assets Table Schema
-- This SQL script creates the assets table for the Supabase database

-- Create the assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specification TEXT,
  purchase_date DATE,
  price NUMERIC(10, 2),
  notes TEXT,
  qrcode_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the name field for faster searches
CREATE INDEX IF NOT EXISTS idx_assets_name ON assets(name);

-- Create an index on the purchase_date field for filtering
CREATE INDEX IF NOT EXISTS idx_assets_purchase_date ON assets(purchase_date);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before any update
CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to read all assets
CREATE POLICY "Allow authenticated users to read assets"
  ON assets
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a policy to allow authenticated users to insert assets
CREATE POLICY "Allow authenticated users to insert assets"
  ON assets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create a policy to allow authenticated users to update assets
CREATE POLICY "Allow authenticated users to update assets"
  ON assets
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a policy to allow authenticated users to delete assets
CREATE POLICY "Allow authenticated users to delete assets"
  ON assets
  FOR DELETE
  TO authenticated
  USING (true);

-- Optional: Create a policy to allow public read access (if needed for QR code scanning)
-- Uncomment the following lines if you want unauthenticated users to view assets via QR codes
-- CREATE POLICY "Allow public read access to assets"
--   ON assets
--   FOR SELECT
--   TO anon
--   USING (true);
