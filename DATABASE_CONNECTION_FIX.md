# Database Connection Timeout Fix

## Problem
`ETIMEDOUT` error when connecting to MySQL database from Vercel production.
Your database host `mdawidahomestay.com:3306` is blocking Vercel's servers.

## Solutions

### Option 1: Whitelist Vercel IPs in cPanel (Recommended)

1. **Login to cPanel** at your hosting provider (mdawidahomestay.com)
2. Go to **"Remote MySQL"** section
3. Add these Vercel IP ranges:
   ```
   76.76.21.0/24
   76.223.0.0/20
   ```
4. Or use wildcard: `%` (allows all IPs - less secure but works)

**Steps in cPanel:**
- cPanel → Databases → Remote MySQL
- Click "Add Access Host"
- Enter: `76.76.21.%` (Vercel's IP range)
- Click "Add Host"
- Repeat for `76.223.%`

### Option 2: Enable Remote MySQL Globally

1. **cPanel → Remote MySQL**
2. Add access host: `%` (wildcard - allows all IPs)
3. This is less secure but will work immediately

### Option 3: Use Connection Pooling with Longer Timeout

Add to your `DATABASE_URL`:
```
mysql://mdawidah_afribit:G5H1t_cAsvIA@mdawidahomestay.com:3306/mdawidah_afribit?connectTimeout=60000
```

Update in Vercel:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `DATABASE_URL` with the timeout parameter

### Option 4: Migrate to Cloud Database (Long-term)

For production reliability, consider:
- **PlanetScale** (free tier, optimized for serverless)
- **Railway** (free tier with MySQL)
- **AWS RDS** (free tier for 12 months)
- **DigitalOcean Managed MySQL** ($15/month)

These are designed for serverless environments and don't have IP whitelist issues.

## Immediate Fix (Do This Now)

1. **Check if Remote MySQL is enabled:**
   - SSH into your server: `ssh mdawidah@mdawidahomestay.com`
   - Or use cPanel → Terminal
   - Run: `mysql -u root -p -e "SELECT host, user FROM mysql.user WHERE user='mdawidah_afribit';"`
   - If it shows `localhost` only, that's the problem

2. **Enable Remote Access in cPanel:**
   - cPanel → Remote MySQL
   - Add: `%` (temporary - allows all)
   - Or specific: `76.76.21.%` and `76.223.%` (Vercel IPs)

3. **Verify Firewall:**
   - Port 3306 must be open
   - Contact your hosting provider if needed

4. **Test Connection:**
   - From your local machine: `mysql -h mdawidahomestay.com -u mdawidah_afribit -p`
   - If this fails, the problem is definitely firewall/remote access

## Quick Test After Fix

After enabling remote access, redeploy on Vercel:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

## Alternative: Use Vercel PostgreSQL

Vercel offers built-in PostgreSQL (free tier):
1. Vercel Dashboard → Storage → Create Database → PostgreSQL
2. Migrate your schema (I can help with this)
3. Update DATABASE_URL in Vercel

---

**Current Status:**
- ❌ Database: Blocking Vercel IPs
- ✅ Code: Working (query is correct)
- ✅ Credentials: Valid
- ⏳ Action Required: Enable remote MySQL access

**Priority: CRITICAL** - Site cannot accept merchant submissions until fixed.
