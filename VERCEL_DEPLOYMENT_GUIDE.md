# 🚀 Vercel Deployment Guide for Cropwise

## 📋 Before Deploying

### ✅ What Will Work After Deployment:

1. **Admin Login**: You'll be able to log into your admin account (`Chibuikeemmanuel879@gmail.com`) with password `Emma22##`
2. **Existing Products**: All 8 products will be visible
3. **Existing Users**: Both users will be able to log in
4. **New User Registration**: New users can register and access all features
5. **Data Persistence**: All data persists across deployments

### ⚠️ Important: Firebase Setup Required

Your app needs Firebase credentials on Vercel to persist data. Without it, data resets on each redeployment.

---

## 🔧 Step 1: Get Firebase Credentials from Your serviceAccountKey.json

Open your `serviceAccountKey.json` file and copy these 3 values:

```json
{
  "project_id": "cropwise-f602d",
  "client_email": "firebase-adminsdk-fbsvc@cropwise-f602d.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCPKdL0wCuTHOgc\n..."
}
```

You need:
- `project_id` 
- `client_email`
- `private_key` (the ENTIRE key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

---

## 🔐 Step 2: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these 3 variables:

   **Variable 1:**
   - **Name**: `FIREBASE_PROJECT_ID`
   - **Value**: `cropwise-f602d`
   - **Environment**: Production, Preview, Development (select all)

   **Variable 2:**
   - **Name**: `FIREBASE_CLIENT_EMAIL`
   - **Value**: `firebase-adminsdk-fbsvc@cropwise-f602d.iam.gserviceaccount.com`
   - **Environment**: Production, Preview, Development (select all)

   **Variable 3:**
   - **Name**: `FIREBASE_PRIVATE_KEY`
   - **Value**: (Copy the ENTIRE `private_key` value from serviceAccountKey.json, including the BEGIN and END markers)
   - **Environment**: Production, Preview, Development (select all)

   ⚠️ **Important for PRIVATE_KEY**: When copying, make sure to include the newlines (`\n`). Vercel will handle this automatically, but if you see issues, you can copy the entire key as a single line.

4. **Also add your existing environment variables:**
   - `OPENROUTER_API_KEY` = (your OpenRouter API key)

5. Click **Save** after adding each variable

---

## 🚀 Step 3: Deploy to Vercel

### Option A: Deploy from GitHub (Recommended)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Add Firebase Firestore integration"
   git push origin main
   ```

2. Go to Vercel dashboard → Your project → **Deployments**
3. Click **Redeploy** (or it will auto-deploy if connected to GitHub)

### Option B: Deploy via Vercel CLI

```bash
vercel --prod
```

---

## ✅ Step 4: Verify Deployment

After deployment:

1. **Check Logs**: Go to Vercel → Your deployment → **Functions** → Click on a function → **Logs**
   - You should see: `✅ Firebase Admin initialized successfully`
   - You should see: `✅ Loaded X users from Firestore` (after first migration)

2. **Test Admin Login**:
   - Go to your deployed URL
   - Login with: `Chibuikeemmanuel879@gmail.com` / `Emma22##`
   - You should see admin controls

3. **Check Products**:
   - Navigate to Products page
   - All 8 products should be visible

4. **Test New User Registration**:
   - Register a new user
   - Verify they can login and see products

---

## 🗄️ Step 5: Initial Data Migration

On **first deployment** with Firebase, your existing data will be automatically migrated:

- The app detects if Firestore is empty
- It reads from JSON files (for backup/migration)
- Copies all data to Firestore
- You'll see migration logs in Vercel logs

**After migration**, all new data goes directly to Firestore.

---

## 🔍 Troubleshooting

### Problem: "Firebase initialization failed"

**Solution**: 
- Check that all 3 environment variables are set correctly
- Make sure `FIREBASE_PRIVATE_KEY` includes the full key with BEGIN/END markers
- Verify the keys are set for the correct environment (Production/Preview)

### Problem: Data not persisting

**Solution**:
- Check Vercel logs for Firebase errors
- Verify environment variables are saved
- Make sure you redeployed after adding environment variables

### Problem: Admin can't login / Products not showing

**Solution**:
- Check if initial migration ran (check Vercel logs)
- If migration didn't happen, you may need to manually add initial data to Firestore
- Or temporarily remove JSON files from `.gitignore` for first deployment, then add them back

### Problem: Fallback to JSON files

**Solution**:
- This means Firebase isn't initialized
- Check environment variables are correct
- Check Vercel logs for specific error messages

---

## 📊 What Happens After Deployment:

### ✅ With Firebase Set Up:
- ✅ Admin can login immediately
- ✅ All products visible
- ✅ New users can register
- ✅ All data persists across redeployments
- ✅ No data loss

### ❌ Without Firebase Set Up:
- ⚠️ Data resets on each redeployment
- ⚠️ Users/products disappear after redeploy
- ⚠️ Only works until next deployment

---

## 🎯 Summary

**Before pushing to GitHub:**
1. ✅ Code is ready
2. ✅ Firebase code supports environment variables
3. ✅ Fallback to JSON files if Firebase fails

**On Vercel:**
1. Add `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
2. Add `OPENROUTER_API_KEY`
3. Deploy
4. Verify in logs that Firebase initialized
5. Test admin login and products

**After deployment:**
- Everything works as it does locally
- Data persists forever
- New users see all features

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Check Firebase Console → Firestore Database to verify data is there
4. Test locally first (make sure Firebase works locally)

