# Vercel Email Configuration Guide

## Problem
Emails work locally but fail on Vercel deployment because environment variables aren't automatically synced.

## Solution

### Step 1: Configure Environment Variables in Vercel

1. **Navigate to Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Select your project: `Nadimpalli-Informatics-LLP`

2. **Add Environment Variable**
   - Settings → Environment Variables
   - Click "Add New"
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_UioJViGA_6GXqxtC756XLiig62Cdnp3Ro`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

### Step 2: Redeploy

**Option A - Trigger Auto-Deploy:**
```bash
cd /Users/chepuriharikiran/Desktop/github/Nadimpalli-Informatics-LLP
git commit --allow-empty -m "Configure Resend API for production"
git push
```

**Option B - Manual Redeploy:**
- Vercel Dashboard → Deployments
- Click "..." on latest deployment
- Select "Redeploy"

### Step 3: Verify Email Functionality

After deployment completes, test the contact form on your live site:
- Visit: `https://your-domain.vercel.app/contact` (or wherever your contact form is)
- Submit a test message
- Check `nadimpalliinformatics@gmail.com` for the email

## Current Configuration

### Email Service: Resend
- **API Key**: Configured in `.env.local` ✅
- **From Address**: `Nadimpalli Informatics <onboarding@resend.dev>`
- **To Address**: `nadimpalliinformatics@gmail.com`

### Important Notes

> [!WARNING]
> The current setup uses Resend's test domain `onboarding@resend.dev`, which has sending limits. For production, consider setting up a custom domain.

## Production Best Practices

### Setup Custom Domain (Recommended)

1. **Add Domain to Resend:**
   - Go to: https://resend.com/domains
   - Click "Add Domain"
   - Enter your domain (e.g., `nadimpalliinformatics.com`)

2. **Configure DNS Records:**
   Add these records to your domain provider:
   - SPF Record
   - DKIM Record
   - DMARC Record
   (Resend will provide exact values)

3. **Update Code:**
   Edit `src/app/actions.ts` line 27:
   ```typescript
   from: 'Nadimpalli Informatics <contact@nadimpalliinformatics.com>'
   ```

## Troubleshooting

### Email still not sending after deployment?

1. **Check Vercel Logs:**
   - Dashboard → Deployments → Select deployment → Runtime Logs
   - Look for "Email sent successfully!" or error messages

2. **Verify Environment Variable:**
   - Settings → Environment Variables
   - Confirm `RESEND_API_KEY` is set for Production

3. **Check Resend Dashboard:**
   - https://resend.com/emails
   - View sent emails and error logs

4. **API Key Validity:**
   - https://resend.com/api-keys
   - Ensure the key hasn't been revoked

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Email service not configured" | Missing env var | Add `RESEND_API_KEY` to Vercel |
| "403 Forbidden" | Invalid API key | Check key in Resend dashboard |
| "Domain not verified" | Using custom domain without verification | Complete DNS verification |
| "Rate limit exceeded" | Too many test emails | Wait or upgrade plan |

## Testing Locally

```bash
# Test email functionality locally
node test-contact-email.js
```

Expected output:
```
✅ Direct Email Delivery Test PASSED!
📧 Email ID: <email-id>
📬 Sent to: nadimpalliinformatics@gmail.com
```
