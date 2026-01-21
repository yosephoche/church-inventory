-- Church Inventory System - Add Status and Location Fields
-- Run this SQL in your Supabase SQL Editor

-- Add status column with Indonesian values
ALTER TABLE assets 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Terpakai';

-- Add location column
ALTER TABLE assets 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Add location_detail column for free text
ALTER TABLE assets 
ADD COLUMN IF NOT EXISTS location_detail TEXT;

-- Add check constraint for status (Indonesian values)
ALTER TABLE assets 
ADD CONSTRAINT check_status 
CHECK (status IN ('Terpakai', 'Tidak Terpakai', 'Rusak', 'Perbaikan'));

-- Add check constraint for location
ALTER TABLE assets 
ADD CONSTRAINT check_location 
CHECK (location IN ('Panggung', 'Lemari', 'Box') OR location IS NULL);

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);

-- Create index on location for faster filtering
CREATE INDEX IF NOT EXISTS idx_assets_location ON assets(location);

-- Update existing rows to have default status if NULL
UPDATE assets SET status = 'Terpakai' WHERE status IS NULL;
