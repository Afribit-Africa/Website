# Vercel Deployment Guide - Afribit Africa Website

## 🚀 Quick Deploy to Vercel

### Prerequisites
1. GitHub repository: `https://github.com/Afribit-Africa/Website`
2. Vercel account (sign up at https://vercel.com)
3. All environment variables ready

---

## 📋 Required Environment Variables

Copy these to your Vercel project settings under **Settings → Environment Variables**

### 🔐 BTCPay Server Configuration
```bash
BTCPAY_HOST=https://pay.afribit.africa
BTCPAY_STORE_ID=DSVtab28GMx3qYVw4FkkZr1vzjEZ6fFmhgc6SQNtYcxg
BTCPAY_API_KEY=852c4c7e2b03b90bdb88a1fdd2711a7ff9904929
NEXT_PUBLIC_BTCPAY_STORE_ID=DSVtab28GMx3qYVw4FkkZr1vzjEZ6fFmhgc6SQNtYcxg
```

### 📧 Email Configuration (SMTP)
```bash
SMTP_HOST=mail.afribit.africa
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@afribit.africa
SMTP_PASSWORD=N422ZoTK3aOM
EMAIL_FROM=info@afribit.africa
EMAIL_FROM_NAME=Afribit Africa
```

### 🤖 hCaptcha Configuration
```bash
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=8f1c3650-7f0c-461c-95f2-a8344cfac1f2
HCAPTCHA_SECRET_KEY=ES_98f4f7abded14b4e83abbfefe1027331
```

### 🌐 Application Configuration
```bash
NEXT_PUBLIC_SITE_URL=https://afribit.africa
NEXT_PUBLIC_SITE_NAME=Afribit Africa
NODE_ENV=production
```

### 🔒 Security Configuration
```bash
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

### 📊 Optional - Google Analytics
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```
*(Leave empty for now, add later when you create a GA4 property)*

### 🗄️ Database Configuration (Optional)
```bash
DATABASE_URL=mysql://mdawidah_afribit:G5H1t_cAsvIA@mdawidahomestay.com:3306/mdawidah_afribit
```
*(Only needed if you implement database features in the future)*

---

## 📝 Step-by-Step Deployment Instructions

### 1. Push Code to GitHub

**Option A: If repository doesn't exist, create it first:**
1. Go to https://github.com/Afribit-Africa
2. Click "New Repository"
3. Name it: `Website`
4. Make it Public or Private
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

Then run:
```bash
git remote set-url origin https://github.com/Afribit-Africa/Website.git
git push -u origin main
```

**Option B: If repository already exists:**
```bash
git push -u origin main
```

---

### 2. Deploy to Vercel

#### Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com/new
2. **Import Git Repository**:
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose "GitHub"
   - Find `Afribit-Africa/Website`
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add each variable from the list above
   - Select environment: **Production**, **Preview**, and **Development** (all three)
   - Click "Add" for each variable

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://your-project.vercel.app`

6. **Add Custom Domain**:
   - Go to **Settings → Domains**
   - Add `afribit.africa` and `www.afribit.africa`
   - Update DNS records as shown by Vercel

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? [Select your account]
# - Link to existing project? N
# - Project name? afribit-africa
# - Directory? ./
# - Override settings? N

# Add environment variables
vercel env add BTCPAY_HOST
vercel env add BTCPAY_STORE_ID
# ... (repeat for all variables)

# Deploy to production
vercel --prod
```

---

## ✅ Post-Deployment Checklist

### Immediate Testing
- [ ] Visit your Vercel URL
- [ ] Test homepage loads correctly
- [ ] Check all navigation links work
- [ ] Test donation page
- [ ] Create a test Lightning invoice
- [ ] Verify QR code displays correctly
- [ ] Test mobile responsiveness
- [ ] Check all images load

### BTCPay Integration Verification
- [ ] Visit `/donate` page
- [ ] Select donation tier
- [ ] Click "Continue to Payment"
- [ ] Verify Lightning invoice generates
- [ ] Confirm QR code shows Lightning invoice (starts with `lnbc`)
- [ ] Test wallet link button (opens Lightning wallet)

### Performance Checks
- [ ] Check Lighthouse score (aim for 90+ performance)
- [ ] Test Core Web Vitals
- [ ] Verify GSAP animations run smoothly
- [ ] Test page transitions between routes
- [ ] Confirm app preloader shows on initial load

### Security Verification
- [ ] Rate limiting active (test 21+ requests to `/api/donations/create`)
- [ ] Security headers present (check browser dev tools → Network → Response Headers)
- [ ] Error boundary catches errors gracefully
- [ ] No sensitive data exposed in client-side code

---

## 🎯 Custom Domain Setup (afribit.africa)

### DNS Configuration

Add these DNS records at your domain registrar:

```
Type: A
Name: @
Value: 76.76.19.19
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Alternative (if using Cloudflare):**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: Auto
Proxy: Orange Cloud (Proxied)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
Proxy: Orange Cloud (Proxied)
```

---

## 🔧 Troubleshooting

### Build Fails
**Error:** "Module not found" or "Cannot find module"
**Solution:** Ensure all dependencies are in `package.json`. Run locally:
```bash
npm install
npm run build
```

### Environment Variables Not Working
**Error:** BTCPay returns errors or features don't work
**Solution:** 
1. Check variable names exactly match (case-sensitive)
2. Ensure `NEXT_PUBLIC_*` prefix for client-side vars
3. Redeploy after adding variables

### Images Not Loading
**Error:** 404 on images
**Solution:** 
- Verify images are in `public/` folder
- Check file paths use forward slashes `/`
- Ensure filenames match exactly (case-sensitive)

### Rate Limiting Too Aggressive
**Issue:** Users getting blocked too quickly
**Solution:** Increase `RATE_LIMIT_MAX` to 200-500 in production

---

## 📈 Recommended Next Steps After Deployment

1. **Set up Google Analytics**:
   - Create GA4 property at https://analytics.google.com
   - Add measurement ID to `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Redeploy

2. **Monitor Performance**:
   - Check Vercel Analytics dashboard
   - Set up error tracking (Sentry recommended)
   - Monitor BTCPay invoice creation success rate

3. **Security Enhancements**:
   - Consider adding Cloudflare for DDoS protection
   - Enable Vercel's "Automatically block suspicious traffic"
   - Set up monitoring alerts

4. **BTCPay Webhooks** (Optional):
   - Generate webhook secret
   - Add to environment variables
   - Implement webhook handlers for payment notifications

---

## 🆘 Support

**Vercel Issues:** https://vercel.com/support
**Next.js Docs:** https://nextjs.org/docs
**BTCPay Server Docs:** https://docs.btcpayserver.org

---

## 📊 Expected Build Output

```
✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (5/5)
✓ Collecting build traces
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         120 kB
├ ○ /donate                             8.4 kB         125 kB
├ ○ /maps                               6.1 kB         122 kB
└ ○ /programs                           7.3 kB         124 kB

○ (Static)  prerendered as static content

Build completed in ~60-90 seconds
```

---

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Site loads at Vercel URL
- ✅ Lightning invoices generate correctly
- ✅ All pages accessible
- ✅ Animations run smoothly
- ✅ Mobile version works perfectly

**Live Site:** https://afribit.africa (after DNS propagation)
**Vercel Dashboard:** https://vercel.com/dashboard

---

*Generated: November 2, 2025*
*Next.js Version: 16.0.0*
*Node.js Required: 18.x or higher*
