-- Migration: Fix RLS infinite recursion in user_profiles table
-- Run this in Supabase SQL Editor to fix existing database

-- 1. Create a SECURITY DEFINER function to check if user is admin
-- This function bypasses RLS, preventing recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can invite users" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;

-- 3. Recreate policies using the function
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles (uses function to avoid recursion)
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (is_admin());

-- Admins can insert (invite users)
CREATE POLICY "Admins can invite users" ON user_profiles
  FOR INSERT WITH CHECK (is_admin());

-- Admins can update profiles
CREATE POLICY "Admins can update profiles" ON user_profiles
  FOR UPDATE USING (is_admin());

-- Admins can delete profiles (except self)
CREATE POLICY "Admins can delete profiles" ON user_profiles
  FOR DELETE USING (is_admin() AND id != auth.uid());
