# 🔥 Firebase Firestore Setup Guide for Cropwise

## Step-by-Step Implementation

### **Step 1: Create Firebase Project** (5 minutes)

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `cropwise` (or your choice)
4. Click **Continue**
5. **Optional:** Disable Google Analytics (or enable if you want)
6. Click **Create project**
7. Wait for project creation (30 seconds)
8. Click **Continue**

---

### **Step 2: Enable Firestore Database** (2 minutes)

1. In Firebase Console, click **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for now, we'll add security rules later)
4. Select your location: Choose closest to your users (e.g., `us-central` or `europe-west`)
5. Click **Enable**
6. Wait for database to be created (~30 seconds)

---

### **Step 3: Get Service Account Key** (3 minutes)

1. In Firebase Console, click the **⚙️ Gear icon** (top left) → **Project settings**
2. Go to **Service accounts** tab
3. Click **Generate new private key**
4. Click **Generate key** in the popup
5. A JSON file will download - **SAVE THIS FILE SECURELY**
6. Rename it to: `serviceAccountKey.json`
7. **IMPORTANT:** This file contains sensitive credentials - never commit it to git!

---

### **Step 4: Configure Environment Variables** (2 minutes)

1. Open your `.env` file (create it if it doesn't exist)
2. Add Firebase configuration (you'll get these from Firebase Console → Project Settings → General)

**Get from Firebase Console:**
- Go to **Project Settings** → **General** tab
- Scroll to **Your apps** section
- If no web app exists, click **</>** icon to create one
- Copy the config values

Add to `.env`:
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
```

**OR use serviceAccountKey.json file** (easier):
- Place `serviceAccountKey.json` in your project root
- Code will automatically use it

---

### **Step 5: Update .gitignore** (1 minute)

Make sure `.gitignore` has:
```
# Firebase
serviceAccountKey.json
.firebase/
firebase-debug.log
```

---

### **Step 6: Code Migration** (I'll do this for you)

The code will be updated to:
1. Use Firestore instead of JSON files
2. Migrate existing data (admin account, products)
3. Keep all functionality working

---

## ✅ After Implementation

Your app will:
- ✅ Store users in Firestore (persists through redeployments)
- ✅ Store products in Firestore (persists)
- ✅ Store orders in Firestore (persists)
- ✅ Store agriculturists in Firestore (persists)
- ✅ Admin account preserved
- ✅ All features work the same

---

## 🔒 Security Rules (Important - Do After Setup)

1. Go to Firestore Database → **Rules** tab
2. Update rules to secure your data (I'll provide the rules)
3. Click **Publish**

---

## 📊 Firebase Console

You can view all your data in:
- Firebase Console → Firestore Database → **Data** tab
- See users, products, orders, agriculturists in real-time

---

## 🚀 Ready to Start?

Tell me when you've completed Steps 1-3, and I'll implement the code migration!

**What you need:**
- ✅ Firebase project created
- ✅ Firestore enabled
- ✅ Service account key downloaded (`serviceAccountKey.json`)

Then I'll:
- Update `server.js` to use Firestore
- Migrate your existing data
- Test everything works

