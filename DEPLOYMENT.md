# Deployment Guide - Estate Agents Council of Zimbabwe

## Production Stack
- **Database**: Neon Database (PostgreSQL)
- **Hosting**: Vercel
- **Authentication**: Clerk
- **Email**: ZeptoMail
- **Payments**: Stripe + PayNow

## Prerequisites

1. **Neon Database** (Already configured)
   - Database URL: `postgresql://neondb_owner:npg_6RkPzLfj0Noi@ep-wispy-unit-ad5uuk40-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - Schema has been pushed successfully

2. **Vercel Account**
   - Sign up at https://vercel.com
   - Install Vercel CLI: `npm i -g vercel`

3. **Clerk Account**
   - Production keys from https://dashboard.clerk.com

4. **ZeptoMail Account**
   - API keys from https://www.zoho.com/zeptomail/

## Deployment Steps

### Step 1: Prepare Local Build

```bash
# Test Vercel production build locally
npm run build:vercel

# Verify build output
ls -la dist/
ls -la dist/public/
ls -la api/

# Expected output:
# - dist/vercel.js (serverless function)
# - dist/public/ (frontend static files)
# - api/index.js (Vercel entry point)
```

### Step 2: Configure Vercel

```bash
# Login to Vercel
vercel login

# Link project
vercel link

# Set environment variables
vercel env add DATABASE_URL
# Paste: postgresql://neondb_owner:npg_6RkPzLfj0Noi@ep-wispy-unit-ad5uuk40-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

vercel env add SESSION_SECRET
# Generate a secure random string

vercel env add CLERK_SECRET_KEY
# Paste your Clerk secret key

vercel env add VITE_CLERK_PUBLISHABLE_KEY
# Paste your Clerk publishable key

vercel env add ZEPTOMAIL_API_KEY
# Paste your ZeptoMail API key

vercel env add Sender_Address
# Enter: sysadmin@estateagentscouncil.org

vercel env add Host
# Enter: api.zeptomail.eu

vercel env add Send_Mail_Token
# Paste your ZeptoMail send mail token

vercel env add ZEPTOMAIL_BASE_URL
# Enter: api.zeptomail.eu/

# PayNow credentials
vercel env add PAYNOW_INTEGRATION_ID
vercel env add PAYNOW_INTEGRATION_KEY
vercel env add PAYNOW_RETURN_URL
vercel env add PAYNOW_RESULT_URL
vercel env add BASE_URL
```

### Step 3: Deploy

```bash
# IMPORTANT: Commit all changes first
git add .
git commit -m "feat: complete Vercel production deployment preparation"
git push

# Deploy to production
vercel --prod

# Or let Vercel auto-deploy from GitHub (recommended):
# 1. Connect your repo to Vercel at vercel.com/dashboard
# 2. Every push to main branch will auto-deploy
```

### Step 4: Update Domain Settings

After deployment, Vercel will provide a URL (e.g., `your-app.vercel.app`). Update the following:

1. **PayNow URLs** in environment variables:
   ```
   PAYNOW_RETURN_URL=https://your-app.vercel.app/payment/return
   PAYNOW_RESULT_URL=https://your-app.vercel.app/api/payments/paynow/callback
   BASE_URL=https://your-app.vercel.app
   ```

2. **Clerk Settings**:
   - Add `https://your-app.vercel.app` to allowed domains in Clerk dashboard

3. **Custom Domain** (Optional):
   - In Vercel dashboard: Settings → Domains
   - Add your custom domain (e.g., estateagentscouncil.org)

## Environment Variables Reference

All environment variables should be set in Vercel Dashboard:
**Project → Settings → Environment Variables**

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `SESSION_SECRET` | Express session secret (generate random) | `super-secret-production-key` |
| `CLERK_SECRET_KEY` | Clerk backend secret key | `sk_live_...` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk frontend publishable key | `pk_live_...` |
| `ZEPTOMAIL_API_KEY` | ZeptoMail API token | `your-api-token` |
| `Sender_Address` | Email sender address | `sysadmin@estateagentscouncil.org` |
| `Host` | ZeptoMail host | `api.zeptomail.eu` |
| `Send_Mail_Token` | ZeptoMail send mail token | `your-send-token` |
| `ZEPTOMAIL_BASE_URL` | ZeptoMail base URL | `api.zeptomail.eu/` |
| `PAYNOW_INTEGRATION_ID` | PayNow integration ID | `21044` |
| `PAYNOW_INTEGRATION_KEY` | PayNow integration key | `your-key` |
| `PAYNOW_RETURN_URL` | PayNow return URL | `https://your-domain/payment/return` |
| `PAYNOW_RESULT_URL` | PayNow callback URL | `https://your-domain/api/payments/paynow/callback` |
| `BASE_URL` | Application base URL | `https://your-domain.vercel.app` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_CLOUD_PROJECT_ID` | GCS project ID | `your-project-id` |
| `GOOGLE_CLOUD_PRIVATE_KEY` | GCS service account key | `-----BEGIN PRIVATE KEY-----...` |
| `GOOGLE_CLOUD_CLIENT_EMAIL` | GCS service account email | `service@project.iam.gserviceaccount.com` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |

## Post-Deployment Verification

1. **Check Application**:
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

2. **Test Database Connection**:
   - Login to admin dashboard
   - Verify data loads correctly

3. **Test Email Service**:
   - Register a new applicant
   - Verify email is received

4. **Test Authentication**:
   - Login with Clerk
   - Verify session persists

5. **Test Payments**:
   - Process test PayNow payment
   - Verify callback URL is accessible

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles: `npm run check`

### Database Connection Issues
- Verify `DATABASE_URL` in environment variables
- Check Neon database is active
- Ensure `?sslmode=require` is in connection string

### API Routes Not Working
- Verify `vercel.json` routes configuration
- Check serverless function logs in Vercel dashboard
- Ensure `dist/vercel.js` exists after build
- Check that `api/index.js` correctly imports the serverless function
- Verify environment variables are set in Vercel dashboard

### Email Not Sending
- Verify ZeptoMail credentials
- Check sender address is verified in ZeptoMail
- Review server logs for email errors

## Monitoring

- **Vercel Analytics**: Built-in analytics in Vercel dashboard
- **Error Tracking**: Review serverless function logs
- **Database Metrics**: Neon dashboard for query performance

## Rollback

If deployment fails:
```bash
# Rollback to previous deployment
vercel rollback
```

## Continuous Deployment

Once set up, every push to your main branch will trigger automatic deployment:
1. Commit changes
2. Push to GitHub
3. Vercel automatically builds and deploys
4. Preview deployments for pull requests
