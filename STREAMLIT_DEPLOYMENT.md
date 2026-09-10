# SmartLedger Deployment Guide: Streamlit Community Cloud (100% Free Hosting)

**24-Hour Swarnandhra College Hackathon 2026 — Problem Statement 2**

Streamlit Community Cloud is a free hosting platform provided by Streamlit for deploying Python & AI applications directly from GitHub.

---

## Step-by-Step Deployment Instructions

### Step 1: Push Code to GitHub
Ensure all repository files including `app.py`, `requirements.txt`, and `.streamlit/config.toml` are pushed to your GitHub repository.

---

### Step 2: Sign Up / Log In to Streamlit Community Cloud
1. Go to **[share.streamlit.io](https://share.streamlit.io)**.
2. Sign in using your **GitHub account**.

---

### Step 3: Create & Deploy New App
1. Click **Create app** (top right corner).
2. Fill in the repository configuration:
   - **Repository**: Select `your-username/smart-ledger`
   - **Branch**: `main` or `master`
   - **Main file path**: `app.py`
   - **App URL**: `smart-ledger-ai.streamlit.app` (customizable)

---

### Step 4: Configure Secrets & Environment Variables (Optional for Supabase & Gemini)
In your Streamlit App Dashboard, click **Advanced settings** -> **Secrets** and paste:

```toml
GEMINI_API_KEY = "your_google_gemini_api_key"
NEXT_PUBLIC_SUPABASE_URL = "https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY = "ey...your_supabase_anon_key"
```

---

### Step 5: Launch!
Click **Deploy!**. Your app will build in ~60 seconds and be live for free at:
`https://smart-ledger-ai.streamlit.app`

---

## Included Streamlit Artifacts
- `app.py`: Full multi-page AI Accounting & Multi-Agent platform ([app.py](file:///b:/My_Files/Archives/smart%20Ledger/app.py))
- `requirements.txt`: Python package dependencies ([requirements.txt](file:///b:/My_Files/Archives/smart%20Ledger/requirements.txt))
- `.streamlit/config.toml`: Custom UI styling ([config.toml](file:///b:/My_Files/Archives/smart%20Ledger/.streamlit/config.toml))
