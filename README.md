# Cropwise – Farmer-Friendly Agricultural Platform

Cropwise helps farmers manage daily activities with tools for weather tracking, crop planning, product sourcing, expert support, and an integrated AI assistant.

## Live Demo

[https://cropwise-hkm1.onrender.com](https://cropwise-hkm1.onrender.com)

## Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Configuration Reference](#configuration-reference)
- [Usage Highlights](#usage-highlights)
- [Project Layout](#project-layout)
- [API Overview](#api-overview)
- [Tech Stack](#tech-stack)
- [Support](#support)
- [License](#license)

## Features

- User accounts with profile management and role-based access (admin, farmer, agriculturist).
- Product catalogue with cart, checkout flow, and order tracking.
- Agriculturist directory with enrollment, profile editing, and admin moderation.
- Real-time weather dashboard powered by OpenWeatherMap.
- Conversation assistant backed by OpenRouter-hosted AI models.
- Firestore-backed persistence with JSON fallbacks for offline testing.

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/Emma001code/cropwise.git
cd cropwise
npm install
```

### 2. Configure environment variables

Copy the template and fill in your own secrets:

```bash
cp env.example .env
```

Update `.env` with the following values:

```
PORT=3000
NODE_ENV=development
OPENROUTER_API_KEY=sk-your-openrouter-key
WEATHER_API_KEY=your-open-weather-map-key
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=service-account-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> Keep the private key wrapped in quotes and replace literal newlines with `\n` if you copy/paste.

### 3. Provide Firebase credentials

For local development, place `serviceAccountKey.json` in the project root (download it from the Firebase console where you created the Firestore database). This file is already ignored by git.

Vercel or other hosted deployments must rely on the environment variables listed above—do **not** upload the JSON file to production.

Refer to `FIREBASE_SETUP_GUIDE.md` if you need a walkthrough on creating the project and enabling Firestore.

### 4. Run the server

```bash
npm run dev   # auto reload in development
# or
npm start     # production-style launch
```

The app serves both API routes and static pages on [http://localhost:3000](http://localhost:3000).

### 5. Log in with sample data

The first boot loads data from Firestore. If the database is empty, it migrates the bundled JSON fixtures automatically. After that, everything persists in Firestore.

- Admin email: `Chibuikeemmanuel879@gmail.com`
- Admin password: `*****`

You can change or disable this account once you sign in—just keep one admin user available for deployment day.

## Configuration Reference

- `OPENROUTER_API_KEY` – required for the chatbot. Create one at [openrouter.ai/keys](https://openrouter.ai/keys).
- `WEATHER_API_KEY` – use your OpenWeatherMap API key for weather data.
- `FIREBASE_*` – copy the values from the service account JSON. On Vercel, paste them exactly as shown in the JSON (remember to escape newlines for the private key).
- `serviceAccountKey.json` – only needed locally. Never commit it.

If Firebase credentials are missing, the server falls back to the JSON files (`users.json`, `products.json`, etc.). That mode works for quick demos but will not persist anything after a redeploy.

## Usage Highlights

- **Accounts**: register, log in, update profile, reset password, and stay signed in via JWT tokens stored in `localStorage`.
- **Admin dashboard**: manage users, approve agriculturists, upload products, and review orders—all relying on the admin role check.
- **Marketplace**: browse initial inventory, add to cart, place orders, and review status in `orders.html`.
- **Agriculturists**: farmers can enroll themselves, edit their profile, and appear in the public directory. Admins can moderate or remove entries.
- **Weather**: switch between °C/°F, search by city, and review a 7-day forecast.
- **AI Assistant**: chat through `/ai-assistant` with responses proxied through the backend so your key stays private.

## Project Layout

```
Cropwise/
├── server.js                # Express server and API routes
├── styles.css               # Shared styling for HTML pages
├── *.html                   # Standalone pages served by Express
├── src/                     # React-in-progress version (not used in build)
├── users.json               # Data fixtures (fallback only)
├── products.json            # Data fixtures (fallback only)
├── orders.json              # Data fixtures (fallback only)
├── agriculturists.json      # Data fixtures (fallback only)
├── FIREBASE_SETUP_GUIDE.md  # Detailed Firestore setup guide
├── DEPLOYMENT_CHECKLIST.md  # Pre-deploy checklist
├── env.example              # Environment template
└── README.md
```

Static assets live inside `images/`. Chatbot experiments and alternative entry points are under `chatbot_server.py` and `templates/`.

## API Overview

### Auth

```
POST /api/signup          # create account
POST /api/login           # authenticate
POST /api/logout          # clear session
GET  /api/check-admin/:email
```

### Products & Orders

```
GET    /api/products
POST   /api/products          # admin only
PUT    /api/products/:id
DELETE /api/products/:id

POST   /api/orders
GET    /api/orders            # admin only
DELETE /api/orders/:id        # admin only
```

### Agriculturists

```
GET    /api/agriculturists
POST   /api/agriculturists
PUT    /api/agriculturists/:id
DELETE /api/agriculturists/:id   # admin only
```

### AI Assistant & Weather

```
POST /api/ai-chat        # proxies requests to OpenRouter
GET  /api/weather        # proxy option for secure weather calls (optional)
```

Responses are JSON. Frontend pages consume these endpoints via `fetch`.

## Tech Stack

- **Backend**: Node.js, Express, Firebase Admin SDK, Firestore, Multer, Bcrypt, JSON Web Tokens.
- **Frontend**: HTML5, CSS3, vanilla JavaScript. SVG icons replace all emoji toggles for a consistent UI.
- **Integrations**: OpenRouter (chatbot), OpenWeatherMap (forecast), Formspree (contact forms).
- **Tooling**: Nodemon, dotenv, ESLint (through IDE), Render/Vercel for hosting.

## Support

- Check `SETUP_API_KEY.md`, `FIREBASE_SETUP_GUIDE.md`, and `DEPLOYMENT_CHECKLIST.md` for deeper setup notes.
- File an issue on GitHub or write to `e.ngwoke@alustudent.com` if something blocks you.

## Acknowledgements

- Farmers who shared feedback during early field trials.
- OpenRouter and DeepSeek teams for maintaining reliable AI endpoints.
- Firebase Support resources for their Firestore examples and tooling tips.
- OpenWeatherMap for the comprehensive weather datasets.
- ALU peers and mentors who reviewed requirements and provided design critiques.

## License

MIT License – see [LICENSE](LICENSE).

---

Built for farmers everywhere who want reliable digital tools without the steep learning curve. 
