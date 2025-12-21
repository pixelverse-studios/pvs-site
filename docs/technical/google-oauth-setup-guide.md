# Google OAuth Setup Guide for Supabase

Complete guide to configure Google authentication for the PVS dashboard login.

---

## Part 1: Google Cloud Console Setup

### Step 1: Create OAuth 2.0 Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Sign in with your Google account (Phil or Sami)

2. **Create or Select Project**
   - If no project exists, click **"Create Project"**
   - Name it: `PixelVerse Studios` or similar
   - Click **"Create"**

3. **Configure OAuth Consent Screen** (First-time only)
   - Click **"OAuth consent screen"** in the left sidebar
   - Select **"External"** (unless you have Google Workspace)
   - Click **"Create"**
   - Fill in required fields:
     - App name: `PixelVerse Studios Dashboard`
     - User support email: `phil@pixelversestudios.io`
     - Developer contact: `phil@pixelversestudios.io`
   - Click **"Save and Continue"**
   - Skip "Scopes" (default is fine)
   - Skip "Test users" (not needed for External)
   - Click **"Back to Dashboard"**

4. **Create OAuth Client ID**
   - Click **"Credentials"** in the left sidebar
   - Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
   - Application type: **"Web application"**
   - Name: `PVS Dashboard - Production`

5. **Add Authorized Origins**
   - Under "Authorized JavaScript origins", click **"+ ADD URI"**
   - Add these URLs:
     - `http://localhost:3000` (for local development)
     - `https://pixelversestudios.io` (for production)
     - `https://www.pixelversestudios.io` (if using www)
     - Your Netlify/Vercel preview URL if needed

6. **Add Authorized Redirect URIs** (CRITICAL)
   - Under "Authorized redirect URIs", click **"+ ADD URI"**
   - Add your Supabase callback URL:
     - `https://yhijvzfgsucanbydmsif.supabase.co/auth/v1/callback`
   - This URL is specific to your Supabase project

7. **Create and Save Credentials**
   - Click **"Create"**
   - A popup will show your **Client ID** and **Client Secret**
   - **IMPORTANT:** Copy both values immediately
   - Store them securely (you'll need them in Part 2)

---

## Part 2: Supabase Configuration

### Step 1: Enable Google Provider

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `yhijvzfgsucanbydmsif`

2. **Navigate to Authentication Settings**
   - Click **"Authentication"** in the left sidebar
   - Click **"Providers"** tab

3. **Configure Google Provider**
   - Find **"Google"** in the provider list
   - Toggle it **ON** (enabled)
   - Paste the **Client ID** from Google Cloud Console
   - Paste the **Client Secret** from Google Cloud Console
   - Click **"Save"**

### Step 2: Verify Redirect URL

1. In the same Google provider settings, you should see:
   - **Callback URL (for OAuth):** `https://yhijvzfgsucanbydmsif.supabase.co/auth/v1/callback`
   - This MUST match what you added to Google Cloud Console

2. If it doesn't match, copy this URL and add it to Google Cloud Console (Part 1, Step 6)

---

## Part 3: Restrict Access to Allowed Emails

Run this SQL script in Supabase to ensure only Phil and Sami can log in.

### Step 1: Open SQL Editor

1. In Supabase Dashboard → Click **"SQL Editor"** in left sidebar
2. Click **"+ New query"**

### Step 2: Run This Script

```sql
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
```

### Step 3: Verify Installation

After running the script, you should see output confirming:

- ✅ Function `is_allowed_email` created
- ✅ Function `handle_new_user` created
- ✅ Trigger `on_auth_user_created` created

---

## Part 4: Testing the Setup

### Test 1: Allowed Email (Phil or Sami)

1. Visit: http://localhost:3000/login
2. Click **"Sign in with Google"**
3. Select Phil or Sami's Google account
4. Should redirect to `/dashboard` successfully

### Test 2: Unauthorized Email (Anyone Else)

1. Visit: http://localhost:3000/login
2. Click **"Sign in with Google"**
3. Select a different Google account
4. Should see error: `Access denied: This email is not authorized`

### Test 3: Protected Route Access

1. While logged OUT, visit: http://localhost:3000/dashboard
2. Should redirect to `/login?next=/dashboard`
3. After logging in, should redirect back to `/dashboard`

---

## Part 5: Adding Additional Users (Future)

If you need to grant access to another team member:

1. Open Supabase SQL Editor
2. Run this to update the allowed list:

```sql
-- Add new allowed email
CREATE OR REPLACE FUNCTION public.is_allowed_email(user_email text)
RETURNS boolean AS $$
BEGIN
  RETURN user_email IN (
    'phil@pixelversestudios.io',
    'sami@pixelversestudios.io',
    'newteammember@pixelversestudios.io'  -- Add new email here
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

3. The new user can now sign in with their Google account

---

## Troubleshooting

### Error: "Redirect URI mismatch"

**Cause:** Google redirect URI doesn't match Supabase callback URL

**Fix:**

1. Check Supabase callback URL: `https://yhijvzfgsucanbydmsif.supabase.co/auth/v1/callback`
2. Ensure it's EXACTLY in Google Cloud Console → Credentials → Authorized redirect URIs
3. No trailing slashes, exact match required

### Error: "Access denied: This email is not authorized"

**Cause:** User email not in allowed list

**Fix:**

1. Verify the email is spelled correctly in the SQL function
2. Check if trigger is enabled: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';`
3. Ensure user is signing in with the exact email in the allowed list

### Error: "Your project's URL and Key are required"

**Cause:** Missing environment variables

**Fix:**

1. Check `.env.local` has both:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Restart dev server after adding vars

### User can log in but can't access dashboard

**Cause:** Middleware not protecting routes

**Fix:**

1. Verify `middleware.ts` exists at project root
2. Check `protectedPaths` includes `/dashboard`
3. Restart dev server

---

## Security Notes

- **Anon Key is PUBLIC:** The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose (protected by RLS)
- **Service Role Key is SECRET:** Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- **Email validation happens server-side:** Trigger runs in Supabase, not in your app
- **OAuth handled by Supabase:** No credentials stored in your database
- **JWT tokens auto-refresh:** Middleware handles session management

---

## Files Reference

- Supabase client config: `lib/supabase/client.ts`
- Supabase server config: `lib/supabase/server.ts`
- Login page: `app/login/page.tsx`
- Dashboard: `app/dashboard/page.tsx`
- Auth middleware: `middleware.ts`
- OAuth callback: `app/auth/callback/route.ts`

---

**Last Updated:** 2025-11-23
**Maintained By:** Phil @ PixelVerse Studios
