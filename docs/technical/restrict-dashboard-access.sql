-- ================================================================
-- Email Restriction Policy for Dashboard Access
-- Run this in Supabase SQL Editor to restrict Google sign-ins
-- to Phil and Sami only.
-- ================================================================

-- Create a function to validate allowed emails
CREATE OR REPLACE FUNCTION public.is_allowed_email(user_email text)
RETURNS boolean AS $$
BEGIN
  RETURN user_email IN (
    'phil@pixelversestudios.io',
    'sami@pixelversestudios.io'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a hook function that runs before user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Check if email is in allowed list
  IF NOT public.is_allowed_email(NEW.email) THEN
    RAISE EXCEPTION 'Access denied: This email is not authorized to access the dashboard.'
      USING HINT = 'Contact phil@pixelversestudios.io for access.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that fires before INSERT on auth.users
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify the trigger was created
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
