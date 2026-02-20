# WellQR — Calendar QR Generator

A web app that generates QR codes containing ICS calendar invites, with rotating messaging zones shared across all devices and locations.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Upstash Redis

**Option A — Via Vercel Marketplace (recommended):**

1. Go to [vercel.com/marketplace/upstash](https://vercel.com/marketplace/upstash)
2. Click "Add Integration"
3. Select your WellQR project
4. Create a new Redis database (free tier is fine)
5. Environment variables are set automatically

**Option B — Manual:**

1. Create a free account at [upstash.com](https://upstash.com)
2. Create a Redis database
3. Copy the REST URL and token from the dashboard
4. Add to your `.env.local`:

```
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy

Push to GitHub. Vercel auto-deploys on push to `main`.

## How It Works

- **Screen 1 (Config):** Staff adds rotating messages to 4 zones (top, bottom, left, right). Messages are stored in Upstash Redis, shared across all devices.
- **Screen 2 (Form):** Staff enters appointment details (title, date, time, etc.)
- **Screen 3 (Output):** Patient-facing screen shows QR code surrounded by the current rotation messages. Each generation advances to the next message per zone.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | Framework (UI + API routes) |
| Tailwind CSS | Styling |
| Upstash Redis | Shared message storage |
| QR Server API | QR code generation |

## File Structure

```
wellqr-next/
├── app/
│   ├── layout.js         # Root layout + metadata
│   ├── page.js           # Main app (3-screen flow)
│   ├── globals.css        # Tailwind directives
│   └── api/
│       └── zones/
│           └── route.js   # GET/POST for zone messages
├── public/
│   └── calendar.svg       # Favicon
├── package.json
├── next.config.mjs
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── .gitignore
```
