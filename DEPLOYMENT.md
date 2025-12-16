# Deployment Guide

This guide will help you deploy your Mom's Virtual Gallery to Vercel, making it accessible online.

## Prerequisites

- A GitHub account (free)
- A Vercel account (free) - [Sign up at vercel.com](https://vercel.com/signup)
- Your project code pushed to a GitHub repository

## Step 1: Push to GitHub

If you haven't already pushed your code to GitHub:

1. Initialize git repository (if not done):
```bash
git init
git add .
git commit -m "Initial commit: Mom's Virtual Gallery"
```

2. Create a new repository on GitHub:
   - Go to [github.com](https://github.com) and sign in
   - Click the "+" icon in the top right → "New repository"
   - Name it: `moms-gallery` (or any name you prefer)
   - Make it **Private** if you want it personal
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/moms-gallery.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com) and sign in**
   - Sign in with GitHub for easiest integration

2. **Click "New Project"**

3. **Import your repository:**
   - You'll see a list of your GitHub repositories
   - Find "moms-gallery" (or whatever you named it)
   - Click "Import"

4. **Configure project:**
   - **Project Name:** `moms-gallery` (or choose a custom name)
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)

5. **Environment Variables:** (None needed for this project)

6. **Click "Deploy"**

Vercel will:
- Install dependencies
- Build your project
- Deploy it to a URL like: `moms-gallery.vercel.app`

This process takes 2-5 minutes.

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow the prompts, then deploy to production
vercel --prod
```

## Step 3: Test Your Deployment

1. **Visit your live URL:**
   - Vercel will show you the URL after deployment
   - It will look like: `https://moms-gallery.vercel.app`

2. **Test all features:**
   - ✓ Landing page loads
   - ✓ 3D gallery works (try movement, inspect, tour)
   - ✓ Fallback view works
   - ✓ Settings persist
   - ✓ All artworks display correctly
   - ✓ Mobile responsiveness (especially fallback view)

3. **Test on different devices:**
   - Desktop browser (Chrome, Firefox, Safari, Edge)
   - Laptop (test with mouse/trackpad)
   - Mobile (test fallback view)
   - Tablet (test both views)

## Step 4: Custom Domain (Optional)

To use a custom domain like `gallery.yourdomain.com`:

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Enter your custom domain
   - Follow DNS configuration instructions

2. **Popular domain registrars:**
   - [Namecheap](https://www.namecheap.com)
   - [Google Domains](https://domains.google)
   - [GoDaddy](https://www.godaddy.com)

3. **Update DNS:**
   - Add CNAME record pointing to Vercel
   - Wait for DNS propagation (5 minutes - 48 hours)

## Step 5: Share with Mom!

### Create a Nice Presentation

**Option 1: Greeting Card**
- Write a physical card
- Include the URL and brief instructions
- Add: "Your very own art gallery!"

**Option 2: Email**
```
Subject: A Christmas Gift Just for You 🎁

Dear Mom,

I made something special for you this Christmas – a virtual gallery 
showcasing your beautiful artwork!

Visit: https://moms-gallery.vercel.app

To explore:
• Click "Enter 3D Gallery" for an immersive experience
  - Use WASD or arrow keys to walk around
  - Click on paintings to read about them
  - Try the "Guided Tour" button!

• Or click "Browse Collection" for a simpler view

I hope you love walking through your own gallery as much as I loved 
creating it.

Merry Christmas!
Love, [Your Name]
```

**Option 3: QR Code**
- Generate QR code at [qr-code-generator.com](https://www.qr-code-generator.com)
- Print it on a card
- She can scan with her phone

### Instructions to Include

**Simple version:**
1. Visit the link
2. Click "Enter 3D Gallery"
3. Click on the screen, then use arrow keys to move
4. Click on paintings to see them up close

**Tech-savvy version:**
- WASD or arrows to move
- Mouse to look around
- E to inspect artwork
- Try the Guided Tour!

## Automatic Updates

With Vercel + GitHub integration:

1. **Make changes** to your code locally
2. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Update artwork descriptions"
   git push
   ```
3. **Vercel automatically rebuilds and redeploys** (takes 2-3 minutes)
4. Your live site updates automatically!

This makes it easy to:
- Add more artworks
- Update descriptions
- Fix any issues
- Improve features over time

## Monitoring & Analytics (Optional)

### Vercel Analytics
- Enable in Vercel Dashboard → Analytics
- See page views, performance metrics
- Understand how mom (and others) use the gallery

### Add Custom Messages
- Update the landing page with seasonal greetings
- Add new personal notes to artworks
- Modify the thank you message

## Troubleshooting Deployment

### Build fails on Vercel

**Check build logs:**
- In Vercel Dashboard → Deployments
- Click the failed deployment
- Read error messages

**Common fixes:**
1. Ensure all dependencies are in `package.json`
2. Verify no TypeScript errors: `npm run build` locally
3. Check that artwork files exist in `public/art/`

### Site loads but 3D gallery doesn't work

**Possible causes:**
1. Browser doesn't support WebGL → fallback should work
2. Images not loading → check artwork paths
3. Large files causing slow load → optimize images

**Solutions:**
- Test in Chrome/Firefox/Safari (latest versions)
- Check browser console for errors (F12)
- Verify all artwork images uploaded

### Images don't appear

1. **Check file paths:**
   - Files must be in `public/art/`
   - Paths in `artworks.ts` must match exactly
   - Case-sensitive!

2. **Push images to GitHub:**
   ```bash
   git add public/art/*
   git commit -m "Add artwork images"
   git push
   ```

3. **Vercel will rebuild automatically**

### Slow performance

1. **Optimize images:**
   - Resize to max 2048px
   - Compress with TinyPNG
   - Use JPG instead of PNG

2. **Lower default quality:**
   - Edit `src/data/galleryConfig.ts`
   - Set `quality: 'medium'` in defaultSettings

3. **Enable motion-reduced mode** for older devices

## Security & Privacy

### Keep it Private
- **GitHub:** Make repository private
- **Vercel:** Projects are public by default but hard to find without URL
- **Custom domain:** Don't use obvious naming

### Password Protection (Optional)
- Vercel Pro plan offers password protection
- Or use Next.js authentication (requires code changes)

### Share Selectively
- Only share URL with people you trust
- Vercel doesn't index sites in search engines by default

## Cost

**Completely Free for this project:**
- GitHub: Free for unlimited private repos
- Vercel: Free tier includes:
  - 100 GB bandwidth/month (more than enough)
  - Automatic HTTPS
  - Unlimited deployments
  - Custom domains
  - No credit card required

**If you exceed limits** (very unlikely for a personal gallery):
- Vercel will notify you
- Can upgrade to Pro ($20/month) or optimize

## Next Steps

After deployment:

1. **Bookmark the URL** for easy access
2. **Test on mom's actual devices** before Christmas
3. **Consider making a video** showing how to use it
4. **Plan seasonal updates** (New Year message, Birthday gallery update)
5. **Think about expanding:**
   - Add more artworks over time
   - Create separate galleries for different themes
   - Share with family members

## Support & Updates

### Getting Help
- Check [Vercel Documentation](https://vercel.com/docs)
- Browse [Next.js Docs](https://nextjs.org/docs)
- Review project README.md

### Keeping Updated
- Monitor Vercel deployment status
- Check Vercel email for any issues
- Test periodically to ensure everything works

### Making Changes
1. Edit code locally
2. Test with `npm run dev`
3. Commit and push to GitHub
4. Vercel deploys automatically
5. Verify changes live in 2-3 minutes

---

## Quick Reference: Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Deployment successful
- [ ] Live URL works
- [ ] 3D gallery tested
- [ ] Fallback view tested
- [ ] All artworks load correctly
- [ ] Tested on multiple browsers
- [ ] Tested on target devices
- [ ] URL shared with mom
- [ ] Instructions provided
- [ ] (Optional) Custom domain configured

---

**Congratulations!** 🎉 Your mom's gallery is now live and ready to be gifted!

**Your URL:** `https://_________.vercel.app`

**Share Date:** __________

**Mom's Reaction:** __________ ❤️

