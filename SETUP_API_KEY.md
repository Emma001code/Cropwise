# 🔐 How to Set Up Your API Key Securely

## ⚠️ IMPORTANT: Never expose your API key!

Your API key must be stored in an `.env` file which is already ignored by git.

## Steps to Add Your New API Key:

### 1. Get Your New API Key
- Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
- Sign up or log in
- Create a new API key
- **Copy the key immediately** - you won't see it again!

### 2. Create `.env` File (if it doesn't exist)

In your project root directory, create a file named `.env`:

```env
PORT=3000
NODE_ENV=development
OPENROUTER_API_KEY=paste_your_new_key_here
```

### 3. Replace `paste_your_new_key_here` with your actual key

Example:
```env
PORT=3000
NODE_ENV=development
OPENROUTER_API_KEY=sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 4. Save the File

The `.env` file is already in `.gitignore`, so it will **NEVER** be committed to GitHub.

### 5. Restart Your Server

After adding the key, restart your server:
```bash
# Stop the current server (Ctrl+C)
npm start
```

## ✅ Security Checklist:

- [x] `.env` is in `.gitignore` (already done)
- [x] No API keys in code (already done)
- [ ] You created `.env` file with your key
- [ ] You verified `.env` is NOT tracked by git (`git status` should not show it)

## 🚀 For Deployment (Vercel/Other Platforms):

When deploying, add the API key as an **environment variable** in your hosting platform:

**Vercel:**
- Go to Project Settings → Environment Variables
- Add: `OPENROUTER_API_KEY` = `your_key_here`
- Select all environments (Production, Preview, Development)
- Save and redeploy

## ❌ What NOT to Do:

- ❌ Never commit `.env` file
- ❌ Never put API key in code
- ❌ Never share API key in screenshots
- ❌ Never commit API key to GitHub
- ❌ Never paste API key in chat/messages

## ✅ Safe Places for API Key:

- ✅ `.env` file (local only)
- ✅ Environment variables in hosting platform (Vercel, Render, etc.)
- ✅ Secret management services

---

**Your API key is now secure and will never be exposed!** 🔒

