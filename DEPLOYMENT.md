# Deploying MediRemind AI to Render

This guide walks you through deploying your MediRemind AI application to Render.

## Prerequisites

1. A [Render account](https://render.com/) (free tier available)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. A Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Deployment Steps

### Step 1: Push Your Code to Git

If you haven't already, initialize and push your code to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create a New Web Service on Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** button and select **"Web Service"**
3. Connect your Git repository (GitHub/GitLab/Bitbucket)
4. Select your `mediremind-ai` repository

### Step 3: Configure Your Web Service

Render will detect the `render.yaml` file automatically. If not, use these settings:

- **Name**: `mediremind-ai` (or your preferred name)
- **Region**: Choose the closest to your users (e.g., Oregon, Frankfurt)
- **Branch**: `main` (or your default branch)
- **Runtime**: `Node`
- **Build Command**: 
  ```bash
  npm install && npm run build && npm run build:server
  ```
- **Start Command**: 
  ```bash
  node dist-server/index.js
  ```
- **Plan**: Free (or select a paid plan for better performance)

### Step 4: Set Environment Variables

Add the following environment variables in the Render dashboard:

1. Click on **"Environment"** tab in your service settings
2. Add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Enables production mode |
| `GEMINI_API_KEY` | `AIzaSyB8RN6Jh1lpEdutyNOyo3T7aSmnQFsQkVzZiMCq6LFURCeB08Q` | Your Google Gemini API key |
| `APP_URL` | `https://your-app-name.onrender.com` | Your Render app URL (you'll get this after first deploy) |

**Important**: Keep your `GEMINI_API_KEY` secret and never commit it to Git!

📖 **See [RENDER_ENV_SETUP.md](./RENDER_ENV_SETUP.md) for detailed environment variable setup instructions.**

### Step 5: Deploy

1. Click **"Create Web Service"** or **"Deploy"**
2. Render will start building and deploying your application
3. This process typically takes 3-5 minutes
4. Watch the build logs for any errors

### Step 6: Update APP_URL

After your first successful deployment:

1. Copy your service URL (e.g., `https://mediremind-ai.onrender.com`)
2. Go back to the **Environment** tab
3. Update the `APP_URL` variable with your actual URL
4. Click **"Save Changes"** (this will trigger a redeploy)

### Step 7: Access Your App

Once deployed, your app will be available at:
```
https://your-app-name.onrender.com
```

## Database Considerations

Your app uses SQLite which stores data in a file (`data/mediremind.db`). 

### ⚠️ Important Limitations

**Free Tier Render services have ephemeral storage**, meaning:
- The database file will be lost when your service restarts or sleeps
- This is fine for testing but **NOT recommended for production**

### Production Database Options

For a production deployment, consider upgrading to one of these:

1. **PostgreSQL on Render** (Recommended)
   - Render offers managed PostgreSQL databases
   - Persistent data storage
   - Free tier available with limitations

2. **External Database Services**
   - [Supabase](https://supabase.com/) (PostgreSQL, free tier)
   - [PlanetScale](https://planetscale.com/) (MySQL, free tier)
   - [MongoDB Atlas](https://www.mongodb.com/atlas) (NoSQL, free tier)

To migrate from SQLite to PostgreSQL, you'll need to:
- Replace `better-sqlite3` with `pg` or an ORM like Prisma
- Update database connection code in `server/db.ts`
- Adjust SQL queries for PostgreSQL compatibility

## Troubleshooting

### Build Fails

- Check build logs for error messages
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### App Doesn't Start

- Check if `PORT` environment variable is set to `10000`
- Review application logs in Render dashboard
- Ensure start command is `node dist-server/index.js`

### Database Issues

- Remember: SQLite data is ephemeral on free tier
- Check if `data` directory is being created properly
- Consider migrating to PostgreSQL for persistence

### API Errors

- Verify `GEMINI_API_KEY` is set correctly
- Check API key is valid in Google AI Studio
- Review API rate limits and quotas

## Free Tier Limitations

Render's free tier includes:
- ✅ 750 hours per month (enough for 24/7 uptime)
- ⚠️ Service sleeps after 15 minutes of inactivity
- ⚠️ Cold starts take 30-60 seconds
- ⚠️ Ephemeral storage (database resets on restart)
- ✅ Automatic HTTPS
- ✅ Custom domains supported

To avoid sleep and storage limitations, consider upgrading to a paid plan ($7/month+).

## Updating Your Deployment

To deploy updates:

1. Make your code changes locally
2. Commit and push to your repository:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. Render will automatically detect changes and redeploy

You can also enable/disable auto-deploy in your service settings.

## Monitoring

- **Logs**: View real-time logs in Render dashboard
- **Metrics**: Monitor CPU, memory usage, and request counts
- **Health Check**: Your app has a `/api/health` endpoint for monitoring

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- Check application logs for debugging

---

## Quick Deploy Checklist

- [ ] Code pushed to Git repository
- [ ] Render account created
- [ ] Web service created and connected to repo
- [ ] Build command: `npm install && npm run build && npm run build:server`
- [ ] Start command: `node dist-server/index.js`
- [ ] `NODE_ENV=production` set
- [ ] `GEMINI_API_KEY` set (from Google AI Studio)
- [ ] `APP_URL` updated with actual Render URL
- [ ] First deployment successful
- [ ] App accessible via Render URL
- [ ] (Optional) Custom domain configured
- [ ] (Recommended) Plan database migration for production

Good luck with your deployment! 🚀
