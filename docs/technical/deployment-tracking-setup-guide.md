# Deployment Tracking System - Setup Guide

## Overview

Automated deployment tracking system using Git pre-push hooks. When you push code, a Git hook automatically:
1. Reads `docs/deployment_summary.md`
2. Sends deployment data to PVS API
3. Triggers email notification to project stakeholders
4. Resets the file to template

**Key Features:**
- ✅ Automatic deployment notifications via email
- ✅ Tracks changed URLs for Google Search Console re-indexing
- ✅ Separates client-facing summary from internal technical notes
- ✅ Blocks push if API call fails (ensures no missed deployments)
- ✅ Gracefully skips if summary is empty (normal dev workflow)

---

## Files Required

### 1. `docs/deployment_summary.md`
Template file with three sections:

```markdown
# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
-

## Notes for internal team
-

## Changed URLs
-
```

**Section Breakdown:**
- **Latest deploy summary** - Client-facing changes (sent in email as markdown)
- **Notes for internal team** - Technical details (stored in DB, NOT sent in email)
- **Changed URLs** - Full URLs affected by deployment (tracked for re-indexing)

---

### 2. `scripts/pre-push.js`
Node.js script that runs on `git push`. Copy this file exactly:

```javascript
#!/usr/bin/env node

/**
 * Git Pre-Push Hook - Deployment Tracking
 *
 * This script runs before each git push to:
 * 1. Read deployment_summary.md
 * 2. Send deployment data to PVS API
 * 3. Reset the file to template on success
 * 4. Block push on failure
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for better terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');

  if (!fs.existsSync(envPath)) {
    logError('.env.local file not found');
    return {};
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};

  envContent.split('\n').forEach(line => {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || !line.trim()) return;

    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });

  return envVars;
}

// Parse the deployment_summary.md file
function parseDeploymentSummary() {
  const summaryPath = path.join(__dirname, '..', 'docs', 'deployment_summary.md');

  if (!fs.existsSync(summaryPath)) {
    logError('deployment_summary.md not found');
    return null;
  }

  const content = fs.readFileSync(summaryPath, 'utf-8');

  // Extract sections using regex
  const deploySummaryMatch = content.match(/## Latest deploy summary\s*\n([\s\S]*?)(?=\n## |$)/);
  const internalNotesMatch = content.match(/## Notes for internal team\s*\n([\s\S]*?)(?=\n## |$)/);
  const changedUrlsMatch = content.match(/## Changed URLs\s*\n([\s\S]*?)(?=\n## |$)/);

  if (!deploySummaryMatch) {
    logError('Could not find "Latest deploy summary" section');
    return null;
  }

  const deploySummary = deploySummaryMatch[1].trim();
  const internalNotes = internalNotesMatch ? internalNotesMatch[1].trim() : '';
  const changedUrlsText = changedUrlsMatch ? changedUrlsMatch[1].trim() : '';

  // Parse URLs from the Changed URLs section
  const changedUrls = changedUrlsText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-') || line.startsWith('http'))
    .map(line => line.replace(/^-\s*/, '').trim())
    .filter(url => url.length > 0);

  // Check if deploy summary is empty (only contains a dash or is empty)
  if (!deploySummary || deploySummary === '-' || deploySummary.replace(/-/g, '').trim() === '') {
    logWarning('Deploy summary is empty - skipping deployment tracking');
    return { skip: true };
  }

  // Check if URLs are empty
  if (changedUrls.length === 0) {
    logWarning('No changed URLs found - skipping deployment tracking');
    return { skip: true };
  }

  return {
    deploy_summary: deploySummary,
    internal_notes: internalNotes || null,
    changed_urls: changedUrls,
    skip: false,
  };
}

// Send deployment data to API
async function sendDeployment(data, env) {
  const websiteId = env.PVS_WEBSITE_ID;
  const apiUrl = env.PVS_API_URL;

  if (!websiteId || !apiUrl) {
    logError('Missing required environment variables: PVS_WEBSITE_ID or PVS_API_URL');
    return false;
  }

  const endpoint = `${apiUrl}/api/deployments`;

  logInfo('Sending deployment to API...');
  logInfo(`Endpoint: ${endpoint}`);
  logInfo(`Website ID: ${websiteId}`);
  logInfo(`Changed URLs: ${data.changed_urls.length} URLs`);

  const payload = {
    website_id: websiteId,
    deploy_summary: data.deploy_summary,
    internal_notes: data.internal_notes,
    changed_urls: data.changed_urls,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      logError(`API request failed: ${response.status} ${response.statusText}`);
      console.error(errorData);
      return false;
    }

    const result = await response.json();
    logSuccess('Deployment created successfully!');
    logInfo(`Deployment ID: ${result.id}`);
    return true;
  } catch (error) {
    logError(`Failed to send deployment: ${error.message}`);
    return false;
  }
}

// Reset deployment_summary.md to template
function resetDeploymentSummary() {
  const summaryPath = path.join(__dirname, '..', 'docs', 'deployment_summary.md');

  const template = `# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
-

## Notes for internal team
-

## Changed URLs
-
`;

  fs.writeFileSync(summaryPath, template, 'utf-8');
  logSuccess('deployment_summary.md reset to template');
}

// Main execution
async function main() {
  log('\n🚀 Running pre-push deployment tracking hook...\n', 'bold');

  // Load environment variables
  const env = loadEnvFile();

  // Parse deployment summary
  const data = parseDeploymentSummary();

  if (!data) {
    logError('Failed to parse deployment_summary.md');
    log('\n❌ Push blocked due to errors\n', 'red');
    process.exit(1);
  }

  // Skip if summary is empty
  if (data.skip) {
    logInfo('Skipping deployment tracking (empty summary or no URLs)');
    log('\n✅ Push allowed\n', 'green');
    process.exit(0);
  }

  // Send deployment to API
  const success = await sendDeployment(data, env);

  if (!success) {
    logError('Failed to create deployment record');
    log('\n❌ Push blocked - fix the error and try again\n', 'red');
    process.exit(1);
  }

  // Reset the file on success
  resetDeploymentSummary();

  log('\n✅ Deployment tracked successfully - push allowed\n', 'green');
  process.exit(0);
}

// Run the script
main().catch(error => {
  logError(`Unexpected error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
```

---

### 3. `scripts/install-hooks.js`
One-time installer script. Copy this file exactly:

```javascript
#!/usr/bin/env node

/**
 * Git Hooks Installer
 *
 * This script installs the pre-push hook that triggers deployment tracking.
 * Run this once after cloning the repository or when setting up a new dev environment.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function installPrePushHook() {
  const gitHooksDir = path.join(__dirname, '..', '.git', 'hooks');
  const prePushHookPath = path.join(gitHooksDir, 'pre-push');
  const prePushScriptPath = path.join(__dirname, 'pre-push.js');

  // Check if .git directory exists
  if (!fs.existsSync(path.join(__dirname, '..', '.git'))) {
    logError('Not a git repository - .git directory not found');
    return false;
  }

  // Create hooks directory if it doesn't exist
  if (!fs.existsSync(gitHooksDir)) {
    fs.mkdirSync(gitHooksDir, { recursive: true });
    logInfo('Created .git/hooks directory');
  }

  // Check if pre-push hook already exists
  if (fs.existsSync(prePushHookPath)) {
    logWarning('pre-push hook already exists');
    logInfo('Reading existing hook...');

    const existingContent = fs.readFileSync(prePushHookPath, 'utf-8');

    // Check if it's our hook
    if (existingContent.includes('pre-push.js')) {
      logInfo('Existing hook is our deployment tracking hook - updating...');
    } else {
      logWarning('Existing hook is NOT our deployment tracking hook');
      logWarning('Backing up existing hook to pre-push.backup');
      fs.writeFileSync(`${prePushHookPath}.backup`, existingContent, 'utf-8');
    }
  }

  // Create the pre-push hook that calls our Node.js script
  const hookContent = `#!/bin/sh
#
# Pre-push hook for deployment tracking
# Automatically installed by scripts/install-hooks.js
#

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Run the Node.js pre-push script
node "$PROJECT_ROOT/scripts/pre-push.js"

# Exit with the same code as the Node.js script
exit $?
`;

  fs.writeFileSync(prePushHookPath, hookContent, 'utf-8');

  // Make the hook executable
  fs.chmodSync(prePushHookPath, '755');

  logSuccess('pre-push hook installed successfully!');
  return true;
}

function checkEnvironmentVariables() {
  const envPath = path.join(__dirname, '..', '.env.local');

  if (!fs.existsSync(envPath)) {
    logWarning('.env.local file not found');
    logInfo('Copy .env.example to .env.local and fill in the values');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');

  const requiredVars = ['PVS_WEBSITE_ID', 'PVS_API_URL', 'PVS_BASE_URL'];
  const missingVars = [];

  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    logWarning('Missing required environment variables in .env.local:');
    missingVars.forEach(varName => {
      log(`  - ${varName}`, 'yellow');
    });
    logInfo('Add these variables to .env.local (see .env.example)');
    return false;
  }

  logSuccess('All required environment variables found');
  return true;
}

// Main execution
function main() {
  log('\n🔧 Installing Git hooks for deployment tracking...\n', 'bold');

  // Install pre-push hook
  const hookInstalled = installPrePushHook();

  if (!hookInstalled) {
    log('\n❌ Failed to install hooks\n', 'red');
    process.exit(1);
  }

  // Check environment variables
  log('\n📝 Checking environment variables...\n', 'cyan');
  const envOk = checkEnvironmentVariables();

  if (!envOk) {
    log('\n⚠️  Hooks installed but environment variables need attention\n', 'yellow');
    log('The pre-push hook will skip deployment tracking if env vars are missing\n', 'yellow');
  } else {
    log('\n✅ Setup complete! Deployment tracking is active.\n', 'green');
  }

  log('📚 How it works:', 'cyan');
  log('  1. Update docs/deployment_summary.md with your changes');
  log('  2. Commit your code');
  log('  3. Run `git push` - the hook will automatically track the deployment');
  log('  4. The deployment_summary.md file will be reset after successful tracking\n');
}

main();
```

---

## Setup Instructions

### Step 1: Get Project-Specific Information

You'll need from the client:
1. **Website ID** (UUID from PVS database)
2. **Website Base URL** (e.g., `https://www.clientsite.com`)

The API URL is always: `https://pvs-server-62hx7.ondigitalocean.app`

---

### Step 2: Create Required Files

1. **Create `docs/deployment_summary.md`** with the template shown above
2. **Create `scripts/pre-push.js`** - copy the entire script
3. **Create `scripts/install-hooks.js`** - copy the entire script
4. Make scripts executable:
   ```bash
   chmod +x scripts/pre-push.js
   chmod +x scripts/install-hooks.js
   ```

---

### Step 3: Update Environment Variables

Add to `.env.local` (these are LOCAL ONLY - not needed in Netlify/Vercel):

```bash
# Deployment Tracking (Local Git Hooks Only)
PVS_WEBSITE_ID=<uuid-from-database>
PVS_API_URL=https://pvs-server-62hx7.ondigitalocean.app
PVS_BASE_URL=https://www.clientsite.com
```

Add to `.env.example`:

```bash
# Deployment Tracking (Local Git Hooks Only)
PVS_WEBSITE_ID=your-website-uuid-here
PVS_API_URL=https://your-api-domain.com
PVS_BASE_URL=https://www.yourdomain.com
```

---

### Step 4: Install Git Hooks

Run once in the project:

```bash
node scripts/install-hooks.js
```

Expected output:
```
🔧 Installing Git hooks for deployment tracking...

✅ pre-push hook installed successfully!

📝 Checking environment variables...

✅ All required environment variables found

✅ Setup complete! Deployment tracking is active.
```

---

### Step 5: Update Project Documentation

Add this section to the project's main documentation file (e.g., `CLAUDE.md` or `README.md`):

```markdown
### Deployment Summary Workflow

**CRITICAL: After completing each task or feature, update `docs/deployment_summary.md` with a high-level summary**

This file is automatically processed by a Git pre-push hook that sends deployment data to the PVS API and triggers an email notification. Keep summaries concise and non-technical.

#### When to Update:
- After completing any feature, fix, or enhancement
- Before waiting for user to commit/push changes
- Each time you finish a discrete unit of work
- **MUST include all affected URLs** in the "Changed URLs" section

#### Format:
The file has **three required sections**:

1. **Latest deploy summary** - Client-facing changes (sent in email)
   - Use markdown formatting (bullet points, **bold**, *italic*)
   - Write in plain language (non-technical summaries)
   - Focus on WHAT changed, not HOW it was implemented

2. **Notes for internal team** - Technical details (NOT sent in email)
   - Use markdown formatting
   - Include environment variables, technical notes, internal tasks
   - This section is stored but NOT sent to clients

3. **Changed URLs** - List all affected page URLs
   - Use bullet points (- https://www.clientsite.com/page)
   - Include full URLs with protocol
   - These URLs are tracked for Google Search Console re-indexing

#### Example Good Entries:
- ✅ "Added contact form with email notifications"
- ✅ "Fixed mobile navigation menu bug"
- ✅ "Updated homepage hero section with new imagery"

#### Example Bad Entries:
- ❌ "Implemented React Hook Form with Zod validation schema"
- ❌ "Refactored Button component to use Tailwind variants"

#### Process:
1. Complete your work on a feature/task
2. Update `docs/deployment_summary.md`:
   - Add user-friendly bullet points to "Latest deploy summary"
   - Add technical details to "Notes for internal team" (optional)
   - Add all affected URLs to "Changed URLs"
3. Commit your code
4. Run `git push` - the pre-push hook will:
   - Read deployment_summary.md
   - Send data to PVS API
   - Trigger email notification
   - Automatically reset the file to template

**IMPORTANT:**
- The pre-push Git hook automatically processes and resets this file
- All three sections (deploy summary, internal notes, changed URLs) are required
- Use markdown formatting for the summary and notes sections
- If summary or URLs are empty, the hook will skip deployment tracking
```

---

## How Developers Use It

### Daily Workflow:

1. **Make code changes** as usual
2. **Update `docs/deployment_summary.md`** after completing features:
   ```markdown
   ## Latest deploy summary
   - Added new pricing page with interactive calculator
   - Fixed login form validation on mobile

   ## Notes for internal team
   - Updated Stripe webhook endpoint URL in .env
   - Requires re-deployment of API server

   ## Changed URLs
   - https://www.clientsite.com/pricing
   - https://www.clientsite.com/login
   ```
3. **Commit changes**: `git commit -m "feat: add pricing calculator"`
4. **Push**: `git push` ← Hook runs automatically
5. **File resets** to template automatically
6. **Email sent** to stakeholders with deployment details

---

## Troubleshooting

### Hook doesn't run on push
- Run `node scripts/install-hooks.js` again
- Check that `.git/hooks/pre-push` exists and is executable
- Verify the hook contains the correct Node.js script path

### Push blocked with "Missing environment variables"
- Ensure `.env.local` exists with all three variables
- Check variable names match exactly: `PVS_WEBSITE_ID`, `PVS_API_URL`, `PVS_BASE_URL`

### Push blocked with "API request failed"
- Verify API server is running
- Check `PVS_API_URL` is correct
- Check `PVS_WEBSITE_ID` exists in database
- Check network connectivity

### Hook skips deployment tracking
- This is normal if `deployment_summary.md` is empty
- Add content to "Latest deploy summary" and "Changed URLs" sections
- The dash (`-`) alone is considered empty

### Email not received
- Check that the website has a `contact_email` in the database
- Check API server logs for email sending errors
- Verify Resend API key is configured on server

---

## Testing the Setup

After installation, test with a dummy deployment:

1. Update `docs/deployment_summary.md`:
   ```markdown
   ## Latest deploy summary
   - Test deployment tracking system

   ## Notes for internal team
   - This is a test deployment

   ## Changed URLs
   - https://www.clientsite.com/
   ```

2. Commit: `git commit -m "test: deployment tracking"`

3. Push: `git push`

4. Expected output:
   ```
   🚀 Running pre-push deployment tracking hook...

   ℹ️  Sending deployment to API...
   ℹ️  Endpoint: https://pvs-server-62hx7.ondigitalocean.app/api/deployments
   ℹ️  Website ID: <your-uuid>
   ℹ️  Changed URLs: 1 URLs
   ✅ Deployment created successfully!
   ℹ️  Deployment ID: <deployment-uuid>
   ✅ deployment_summary.md reset to template

   ✅ Deployment tracked successfully - push allowed
   ```

5. Check email for deployment notification

---

## FAQ

**Q: Do I need to add environment variables to Netlify/Vercel?**
A: No, these are local-only. The Git hook runs on your machine before push.

**Q: What if I want to push without tracking a deployment?**
A: Leave `deployment_summary.md` empty (just dashes). The hook will skip automatically.

**Q: Can I push if the API is down?**
A: No, the hook will block the push. This ensures no deployments are missed. Fix the API or temporarily disable the hook if needed.

**Q: How do I disable the hook temporarily?**
A: Rename `.git/hooks/pre-push` to `.git/hooks/pre-push.disabled`

**Q: How do I re-enable after disabling?**
A: Rename back to `.git/hooks/pre-push` or run `node scripts/install-hooks.js`

**Q: What if I have an existing pre-push hook?**
A: The installer will back it up to `.git/hooks/pre-push.backup`. You'll need to manually merge both hooks.

---

## Summary Checklist

When setting up in a new project:

- [ ] Create `docs/deployment_summary.md` with template
- [ ] Create `scripts/pre-push.js` (copy entire script)
- [ ] Create `scripts/install-hooks.js` (copy entire script)
- [ ] Make scripts executable (`chmod +x scripts/*.js`)
- [ ] Get `PVS_WEBSITE_ID` from database
- [ ] Add three environment variables to `.env.local`
- [ ] Add environment variables to `.env.example`
- [ ] Run `node scripts/install-hooks.js`
- [ ] Update project documentation (CLAUDE.md or README.md)
- [ ] Test with dummy deployment
- [ ] Verify email notification received

---

## Support

For issues or questions:
- Check troubleshooting section above
- Review API server logs at: `https://pvs-server-62hx7.ondigitalocean.app`
- Verify database has correct website entry with `contact_email`

---

**Last Updated:** 2025-11-24
**Version:** 1.0
**Compatible With:** Node.js 18+, Git 2.0+
