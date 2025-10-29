# ✅ Deployment Checklist for Vercel

## 📋 Pre-Deployment Checklist

- [x] Code committed and pushed to GitHub
- [x] `serviceAccountKey.json` is in `.gitignore` (not committed)
- [x] No hardcoded API keys in code
- [x] CSS loading fix applied

---

## 🔐 Step 1: Add Environment Variables to Vercel

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

### Required Variables:

1. **Firebase Configuration:**
   ```
   FIREBASE_PROJECT_ID = cropwise-f602d
   FIREBASE_CLIENT_EMAIL = firebase-adminsdk-fbsvc@cropwise-f602d.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY = (copy the ENTIRE private_key from serviceAccountKey.json, including -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----)
   ```
   
   ⚠️ **For FIREBASE_PRIVATE_KEY**: Open `serviceAccountKey.json`, copy the entire value of `"private_key"` (including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines).

2. **OpenRouter API Key:**
   ```
   OPENROUTER_API_KEY = (your OpenRouter API key)
   ```

3. **Set for all environments:**
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development

4. Click **Save** after adding each variable

---

## 🚀 Step 2: Deploy

After pushing to GitHub:
- Vercel will **auto-deploy** if connected to your repository
- OR manually trigger deployment in Vercel dashboard

---

## ✅ Step 3: Verify Deployment

### Check Deployment Logs:
1. Go to Vercel → Your deployment → **Functions** tab
2. Click on a function → **Logs**
3. Look for:
   - ✅ `✅ Firebase Admin initialized successfully`
   - ✅ `✅ Loaded X users from Firestore` (after migration)
   - ✅ `✅ Migrated X users/products to Firestore` (first time only)

### Test Your Application:
1. **Visit deployed URL**
2. **Login Page**: Should be **styled correctly** (CSS loading fixed!)
3. **Admin Login Test**:
   - Email: `Chibuikeemmanuel879@gmail.com`
   - Password: `Emma22##`
   - Should see admin controls and all products
4. **Test Products**: Navigate to Products page - should see all 8 products
5. **Test New User Registration**: Register a new user - should work

---

## 🗄️ Step 4: Verify Data Migration

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your project: `cropwise-f602d`
3. Navigate to **Firestore Database**
4. Check collections:
   - `users` - should have 2 users
   - `products` - should have 8 products
   - `agriculturists` - should have 2 agriculturists
   - `orders` - should be empty (or have existing orders)

---

## 🔍 Troubleshooting

### If CSS still not loading:
- Check Vercel logs for static file serving errors
- Verify `styles.css` exists in project root
- Check browser console for 404 errors on CSS file

### If Firebase not initializing:
- Verify all 3 Firebase environment variables are set correctly
- Check that `FIREBASE_PRIVATE_KEY` includes full key with BEGIN/END markers
- Check Vercel logs for specific error messages

### If data not persisting:
- Check Vercel logs to confirm Firebase initialized
- Verify migration completed (look for migration messages in logs)
- Check Firestore Console to verify data exists

### If admin can't login:
- Verify user was migrated to Firestore
- Check Firebase Console → Firestore → `users` collection
- Check that user email/password match (`Chibuikeemmanuel879@gmail.com` / `Emma22##`)

---

## 📝 Post-Deployment Notes

✅ **After successful deployment:**
- All data persists across redeployments
- New users can register and login
- Admin functions work correctly
- Products remain visible
- CSS/styles load properly
- Everything works as it does locally

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel deployment logs first
2. Check Firebase Console → Firestore Database
3. Compare local vs deployed behavior
4. Review error messages in browser console (F12)

Good luck with your deployment! 🚀

