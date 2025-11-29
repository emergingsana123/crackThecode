# Vercel Deployment Guide

## 🚀 Deploying CrackTheCode to Vercel

### Prerequisites
- GitHub repository with your code
- Vercel account (free tier available)
- OpenAI API key

### 📁 Project Structure for Vercel
```
crackThecode/
├── api/
│   └── index.js          # Serverless API function
├── dist/                 # Built React frontend (auto-generated)
├── src/                  # React source code
├── vercel.json          # Vercel configuration
├── package.json         # Build scripts and dependencies
└── .env.example         # Environment variables template
```

### 🔧 Deployment Steps

#### 1. Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

#### 2. Deploy via GitHub (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the configuration

#### 3. Set Environment Variables
In your Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add these variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: `production`

#### 4. Deploy via CLI (Alternative)
```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 🎯 Key Configuration Files

#### `vercel.json`
- Routes frontend requests to static files
- Routes API requests to serverless functions
- Sets function timeout and environment variables

#### `api/index.js`
- Express app converted to serverless function
- Handles all `/api/*` routes
- Includes OpenAI integration and vulnerability analysis

### 🔍 Testing Deployment

After deployment, test these endpoints:
- **Frontend**: `https://your-app.vercel.app`
- **API Health**: `https://your-app.vercel.app/api/health`
- **Chat API**: `POST https://your-app.vercel.app/api/chat`

### 🚨 Important Notes

#### SpacetimeDB Consideration
⚠️ **SpacetimeDB Integration**: This deployment setup focuses on the frontend and AI API. For full functionality including SpacetimeDB features:

1. **Option A**: Deploy SpacetimeDB separately and update connection URLs
2. **Option B**: Use this for frontend-only features and deploy SpacetimeDB on a different platform
3. **Option C**: Consider using Vercel's database offerings for simpler data needs

#### Build Process
- Vercel automatically runs `vercel-build` script
- Frontend builds to `dist/` directory
- API functions are serverless (no persistent state)

#### Environment Variables
- Set in Vercel dashboard, not in code
- Use `.env.example` as reference
- Never commit actual `.env` files

### 🐛 Troubleshooting

#### Build Failures
- Check TypeScript compilation errors
- Verify all dependencies are in `package.json`
- Test build locally: `npm run vercel-build`

#### API Errors
- Check OpenAI API key is set correctly
- Verify function timeout settings in `vercel.json`
- Check serverless function logs in Vercel dashboard

#### Frontend Issues
- Ensure static files are in `dist/` directory
- Check routing configuration in `vercel.json`
- Verify React Router paths work with Vercel routing

### 📊 Monitoring
- Use Vercel dashboard for deployment logs
- Monitor function execution and errors
- Set up alerts for API failures

### 💰 Costs
- Frontend hosting: Free on Vercel
- API functions: Free tier includes generous limits
- OpenAI API: Pay per usage

---

🎉 Your CrackTheCode app should now be live on Vercel!
