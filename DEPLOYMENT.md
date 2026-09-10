# SmartLedger Deployment Guide: Railway & Supabase Cloud (Free Tier)

**24-Hour Swarnandhra College Hackathon 2026 — Problem Statement 2**

This guide provides instructions to connect **Supabase Cloud PostgreSQL** and deploy the web application on **Railway** for free.

---

## Part 1: Supabase Cloud Database Setup (Free Tier)

1. **Sign Up**: Go to [supabase.com](https://supabase.com) and create a free account.
2. **New Project**: Click **New Project**, select an organization, name your project `smartledger-db`, and set a strong database password.
3. **Database Schema Setup**:
   - Open the **SQL Editor** tab in your Supabase Dashboard.
   - Paste the contents of [`supabase/schema.sql`](file:///b:/My_Files/Archives/smart%20Ledger/supabase/schema.sql) and click **Run**.
4. **Copy API Credentials**:
   - Go to **Project Settings** -> **API**.
   - Copy `Project URL` (e.g., `https://xyz.supabase.co`) and `anon` `public` key (`ey...`).

---

## Part 2: Deploying Application to Railway (Free Tier)

1. **Sign Up**: Go to [railway.app](https://railway.app) and sign in with GitHub.
2. **Deploy Project**:
   - Click **+ New Project** -> **Deploy from GitHub Repo**.
   - Select the `smart-ledger` repository.
3. **Configure Environment Variables**:
   In your Railway Service -> **Variables**, add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3000
   ```
4. **Generate Public Domain**:
   - In Railway, navigate to **Settings** -> **Networking**.
   - Click **Generate Domain** (e.g., `smartledger.up.railway.app`).
5. **Verify Deployment**:
   Open `https://your-domain.up.railway.app/api/health` to confirm HTTP 200 `HEALTHY`.

---

## Configuration Files Included

- `railway.json`: Deployment start command and healthcheck path.
- `nixpacks.toml`: Node.js 20 build optimization.
- `supabase/schema.sql`: Table structure and RLS policy setup.
