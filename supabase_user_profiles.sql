-- User profiles table to track roles
-- Run this migration after supabase_schema.sql

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER function to check if current user is admin
-- This function bypasses RLS, preventing infinite recursion in policies
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles (uses function to avoid recursion)
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (is_admin());

-- Only admins can insert (invite users)
CREATE POLICY "Admins can invite users" ON user_profiles
  FOR INSERT WITH CHECK (is_admin());

-- Admins can update profiles
CREATE POLICY "Admins can update profiles" ON user_profiles
  FOR UPDATE USING (is_admin());

-- Admins can delete profiles (except self)
CREATE POLICY "Admins can delete profiles" ON user_profiles
  FOR DELETE USING (is_admin() AND id != auth.uid());

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup and create profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Note: To create the first admin user manually:
-- 1. Create a user through Supabase Auth dashboard
-- 2. Run: INSERT INTO user_profiles (id, email, role) VALUES ('<user-uuid>', '<email>', 'admin');
