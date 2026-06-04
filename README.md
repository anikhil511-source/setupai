# SetupAI - Free Financial Calculators

A professional financial tools website with EMI, SIP, and Compound Interest calculators.

## 📁 Project Structure

```
setupai/
├── pages/
│   ├── _app.js              (App wrapper)
│   └── index.js             (Main page with all calculators)
├── styles/
│   ├── globals.css          (Global styles)
│   └── Home.module.css      (Home page styles)
├── package.json             (Dependencies)
├── next.config.js           (Next.js config)
├── .gitignore              (Git ignore file)
└── README.md               (This file)
```

## 🚀 Quick Start

### Step 1: Create GitHub Repository

1. Go to github.com
2. Click "New repository"
3. Name it: `setupai`
4. Make it PUBLIC
5. Click "Create repository"

### Step 2: Clone and Setup Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/setupai.git
cd setupai

# Create the folder structure
mkdir pages styles public

# Create all files (see file list below)
# ... (copy each file as per instructions)
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Run Locally (Optional Testing)

```bash
npm run dev
# Visit http://localhost:3000
```

### Step 5: Deploy to Vercel

1. Go to vercel.com
2. Click "Import Project"
3. Select "GitHub"
4. Choose "setupai" repository
5. Click "Deploy"
6. **Done!** Your website will be live in 2-3 minutes

## 📝 Files to Create

You need to create these files in your GitHub repository:

### Root Level
- `package.json`
- `next.config.js`
- `.gitignore`
- `README.md`

### pages/ folder
- `_app.js`
- `index.js`

### styles/ folder
- `globals.css`
- `Home.module.css`

## ✨ Features

- **EMI Calculator**: Calculate monthly EMI for loans
- **SIP Calculator**: Calculate investment returns
- **Compound Interest**: Calculate compound interest
- **Responsive Design**: Works on mobile, tablet, desktop
- **Ad Ready**: Spaces for Google AdSense
- **Professional UI**: Modern, attractive design

## 💰 Monetization

### Google AdSense Setup
1. Go to google.com/adsense
2. Sign up with Google account
3. Add your domain (setupai.com)
4. Get AdSense code
5. Add to `<head>` tag in `_app.js`

### Affiliate Links
- Add loan affiliate links in footer
- Add broker affiliate links in sidebar
- Add mutual fund links in SIP calculator

## 🎨 Customization

### Change Colors
Edit `styles/Home.module.css`:
- `#667eea` = Primary purple
- `#764ba2` = Secondary purple
- Change to your brand colors

### Add Your Name
Edit `pages/index.js`:
- Line 2: Change "SetupAI" to your name
- Line 3: Change tagline as needed

### Change Domain
After deployment on Vercel:
1. Buy domain (setupai.com)
2. Go to Vercel dashboard
3. Project Settings → Domains
4. Add custom domain
5. Follow DNS instructions

## 📊 SEO

The site is optimized for Google:
- Meta titles and descriptions ✓
- Mobile responsive ✓
- Fast loading ✓
- Semantic HTML ✓

Add more content for better ranking:
- Create blog posts
- Add FAQ section
- Share on social media

## 🔒 Privacy & Security

- No user data collection
- No cookies
- All calculations done locally
- No server requests for data

## 📞 Support

For issues:
1. Check error messages
2. Verify all files are created
3. Ensure Node.js is installed
4. Check internet connection

## 📄 License

MIT License - Feel free to use and modify

---

**Made with ❤️ for all Indians who want to manage their finances better**

Visit: setupai.com (after deployment)
