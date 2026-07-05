# Render Environment Variables Setup

## Required Environment Variables for Render Deployment

When deploying to Render, you need to configure these environment variables in your service settings.

### How to Add Environment Variables on Render:

1. Go to your Render Dashboard: https://dashboard.render.com/
2. Select your **mediremind-ai** service
3. Click on the **"Environment"** tab in the left sidebar
4. Click **"Add Environment Variable"** for each variable below
5. After adding all variables, click **"Save Changes"** (this will trigger a redeploy)

---

## Environment Variables to Add:

### 1. NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`
- **Description**: Sets the application to production mode

### 2. GEMINI_API_KEY
- **Key**: `GEMINI_API_KEY`
- **Value**: `AIzaSyB8RN6Jh1lpEdutyNOyo3T7aSmnQFsQkVzZiMCq6LFURCeB08Q`
- **Description**: Your Google Gemini AI API key for AI-powered features
- **⚠️ Important**: Keep this secret! Never commit to Git

### 3. PORT (Optional - Auto-set by Render)
- **Key**: `PORT`
- **Value**: `10000`
- **Description**: Render automatically sets this, but you can specify it if needed

### 4. APP_URL (Set after first deployment)
- **Key**: `APP_URL`
- **Value**: `https://your-app-name.onrender.com`
- **Description**: Your deployed application URL
- **Note**: You'll get this URL after your first deployment, then update this variable

---

## Step-by-Step Render Deployment with Environment Variables:

### First Deployment:

```
NODE_ENV=production
GEMINI_API_KEY=AIzaSyB8RN6Jh1lpEdutyNOyo3T7aSmnQFsQkVzZiMCq6LFURCeB08Q
```

### After First Deployment:

Once you get your Render URL (e.g., `https://mediremind-ai.onrender.com`), add:

```
APP_URL=https://your-actual-render-url.onrender.com
```

Then save to redeploy.

---

## Quick Copy-Paste Format:

For easy setup, here are the variables in a format you can reference:

```
NODE_ENV=production
GEMINI_API_KEY=AIzaSyB8RN6Jh1lpEdutyNOyo3T7aSmnQFsQkVzZiMCq6LFURCeB08Q
APP_URL=https://mediremind-ai.onrender.com
```

*(Remember to update APP_URL with your actual Render service URL)*

---

## Security Best Practices:

✅ **Do:**
- Keep your API keys in environment variables
- Use Render's encrypted environment variable storage
- Rotate API keys periodically

❌ **Don't:**
- Commit `.env` files to Git (already in `.gitignore`)
- Share API keys publicly
- Hardcode secrets in your source code

---

## Verifying Environment Variables:

After deployment, you can verify your environment variables are loaded:

1. Check the Render logs for any environment-related errors
2. Visit your app's `/api/health` endpoint
3. Test AI features that require the Gemini API key

---

## Troubleshooting:

**Problem**: API not working after deployment
- **Solution**: Verify `GEMINI_API_KEY` is set correctly (no extra quotes or spaces)

**Problem**: Wrong API URL in responses
- **Solution**: Update `APP_URL` to match your actual Render service URL

**Problem**: App crashes on startup
- **Solution**: Check that `NODE_ENV=production` is set

---

## Local Development vs Production:

### Local (.env file):
```
NODE_ENV=development
GEMINI_API_KEY=AIzaSyB8RN6Jh1lpEdutyNOyo3T7aSmnQFsQkVzZiMCq6LFURCeB08Q
APP_URL=http://localhost:3000
PORT=3001
```

### Production (Render Environment Variables):
```
NODE_ENV=production
GEMINI_API_KEY=AIzaSyB8RN6Jh1lpEdutyNOyo3T7aSmnQFsQkVzZiMCq6LFURCeB08Q
APP_URL=https://mediremind-ai.onrender.com
PORT=10000
```

---

## Need Help?

- [Render Environment Variables Docs](https://render.com/docs/configure-environment-variables)
- [Google AI Studio - API Keys](https://makersuite.google.com/app/apikey)

Your environment is now ready for deployment! 🚀
