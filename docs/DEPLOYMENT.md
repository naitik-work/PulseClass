# PulseClass Production Deployment Guide

A step-by-step production runbook for deploying **PulseClass** using a modern, scalable cloud architecture:
- **Frontend**: [Vercel](https://vercel.com) (or Render Static Site)
- **Backend**: [Render Web Service](https://render.com) (persistent WebSocket/Socket.io support)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (managed database cluster)

---

## Architecture Overview

```
                               ┌────────────────────────────────┐
                               │       Client / Browser         │
                               └───────┬────────────────┬───────┘
                                       │ HTTPS          │ WSS (WebSockets)
                                       ▼                ▼
┌────────────────────────────┐  ┌────────────────────────────────┐
│       Frontend Host        │  │          Backend Host          │
│          Vercel            │  │        Render Web Service      │
│     (or Render Static)     │  │                                │
│                            │  │  - Express REST API (/api)     │
│  - React 19 + Vite Static  │  │  - Persistent Socket.io Server │
│  - Global Edge CDN         │  │  - Rate Limiting & Auth Guards │
│  - SPA Rewrite (vercel.json│  │  - Reverse proxy trust enabled │
└────────────────────────────┘  └───────────────┬────────────────┘
                                                │ TLS / Mongoose
                                                ▼
                                ┌────────────────────────────────┐
                                │         Database Host          │
                                │      MongoDB Atlas Cluster     │
                                └────────────────────────────────┘
```

> [!IMPORTANT]
> **Why Render for Backend?**
> PulseClass relies on Socket.io for live classroom rooms, server-authoritative pulse countdown timers, and instant anonymous vote distribution aggregation. Serverless platforms (such as Vercel Functions or AWS Lambda) do **not** support persistent stateful WebSocket connections. A persistent container/VM service like **Render Web Service** is required.

---

## 1. MongoDB Atlas Configuration

1. **Create an Atlas Cluster**:
   - Log in to [MongoDB Atlas](https://cloud.mongodb.com).
   - Create a free (M0) or production-tier cluster.
2. **Configure Database User**:
   - Navigate to **Security** → **Database Access**.
   - Click **Add New Database User**.
   - Choose **Password Authentication**, enter a username, generate a secure password, and select **Read and write to any database**.
3. **Configure IP Access List (Crucial)**:
   - Navigate to **Security** → **Network Access**.
   - Click **Add IP Address**.
   - Select **Allow Access From Anywhere (`0.0.0.0/0`)** because cloud platforms like Render use dynamic egress IP addresses.
4. **Obtain Connection String**:
   - Click **Databases** → **Connect** → **Drivers** (Node.js).
   - Copy the SRV connection string:
     ```text
     mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/pulseclass?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your credentials and specify `/pulseclass` as the database name.

---

## 2. Backend Deployment (Render Web Service)

1. **Create a New Web Service**:
   - Log in to [Render](https://dashboard.render.com).
   - Click **New +** → **Web Service**.
   - Connect your GitHub / GitLab repository containing `PulseClass`.
2. **Service Configuration**:
   | Setting | Value |
   | :--- | :--- |
   | **Name** | `pulseclass-backend` (or your preferred name) |
   | **Region** | Choose the region closest to your users / Atlas cluster |
   | **Branch** | `main` |
   | **Root Directory** | `server` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
3. **Set Environment Variables**:
   Under **Environment Variables**, add the following:

   | Key | Example Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production error handling & secure cookies |
   | `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection URI |
   | `JWT_SECRET` | *(64+ random chars)* | Minimum 32 characters; generate with `openssl rand -hex 32` |
   | `CLIENT_URL` | `https://your-frontend.vercel.app` | Production frontend domain (no trailing slash) |
   | `PORT` | `10000` | Optional (Render injects this automatically) |

4. **Deploy Service**:
   - Click **Create Web Service**.
   - Once deployed, note your service URL (e.g., `https://pulseclass-backend.onrender.com`).
   - Verify health: Open `https://pulseclass-backend.onrender.com/health` in your browser. It should return `{"status":"ok"}`.

---

## 3. Frontend Deployment (Vercel)

1. **Import Project**:
   - Log in to [Vercel](https://vercel.com).
   - Click **Add New...** → **Project**.
   - Select your `PulseClass` repository.
2. **Project Settings**:
   | Setting | Value |
   | :--- | :--- |
   | **Framework Preset** | `Vite` |
   | **Root Directory** | `client` *(Click "Edit" and select `client`)* |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |
   | **Install Command** | `npm install` |
3. **Set Environment Variables**:
   Under **Environment Variables**, configure:

   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | `https://pulseclass-backend.onrender.com` | Backend root URL (no trailing slash) |
   | `VITE_SOCKET_URL` | `https://pulseclass-backend.onrender.com` | Backend WebSocket URL (matches API URL) |

4. **Deploy**:
   - Click **Deploy**.
   - Vercel automatically honors `client/vercel.json` for SPA routing (redirecting all non-static paths to `/index.html`).
   - Note your live production URL (e.g. `https://pulseclass.vercel.app`).
5. **Update Backend CORS (`CLIENT_URL`)**:
   - Go back to your **Render Web Service** dashboard.
   - Update `CLIENT_URL` to match your actual Vercel domain: `https://pulseclass.vercel.app`.
   - Render will automatically trigger a redeploy with the updated origin.

---

## 4. Alternative: Frontend on Render Static Site

If you prefer to host both frontend and backend on Render:
1. Click **New +** → **Static Site**.
2. **Root Directory**: `client`
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: `https://pulseclass-backend.onrender.com`
   - `VITE_SOCKET_URL`: `https://pulseclass-backend.onrender.com`
6. **Redirects & Rewrites**:
   - Add a rewrite rule:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: `Rewrite`

---

## 5. Production Verification Checklist

Follow this smoke-test workflow to verify the deployed application:

- [ ] **Health Endpoint**: Navigate to `https://<backend-url>/health` → returns `{ "status": "ok" }`.
- [ ] **Landing Page**: Navigate to `https://<frontend-url>` → verifies styles, animations, and dark/light mode toggle.
- [ ] **SPA Deep Linking**: Manually refresh `https://<frontend-url>/login` → verifies that the page reloads without a 404 error.
- [ ] **User Signup / Login**: Create a new instructor account (`/signup`) → verify JWT token issuance and successful redirect to `/dashboard`.
- [ ] **Institute & Classroom Creation**:
  - Create an Institute (e.g. "Acme University").
  - Create a Classroom (e.g. "CS201").
- [ ] **Socket.io Connection**:
  - Open the browser DevTools Console.
  - Launch a session (`/session/:id`).
  - Confirm the log message: `Socket connected`.
- [ ] **Real-Time Pulse (Dual-Tab Test)**:
  - Tab 1 (Instructor): Launch a Quick Pulse (`Q` key or palette).
  - Tab 2 (Student in incognito tab): Join the classroom session and cast a response.
  - Verify that the instructor dashboard updates the live distribution bar chart in real time without refreshing.
- [ ] **Session End & Report**:
  - Click **End Session**.
  - Navigate to `/session/:id/report` → confirm aggregated analytics charts render accurately.

---

## 6. Common Deployment Errors & Troubleshooting

### 1. `CORS policy blocked access from origin`
- **Cause**: The `CLIENT_URL` environment variable on Render does not match the frontend domain, or contains an unintended trailing slash.
- **Fix**: In the Render dashboard, ensure `CLIENT_URL` is set to `https://your-app.vercel.app` (without a trailing slash `/`). The backend supports comma-separated domains if testing multiple environments (e.g., `http://localhost:5173,https://your-app.vercel.app`).

### 2. `Socket connection error` / Disconnects in Production
- **Cause**:
  1. `VITE_SOCKET_URL` was not set on the frontend prior to build, causing the client to connect to `window.location`.
  2. The backend is deployed on a serverless platform that does not support persistent WebSockets.
- **Fix**: Confirm backend is running as a Render Web Service, set `VITE_SOCKET_URL=https://<backend-url>` in Vercel, and trigger a **Redeploy** with "Clear Cache" in Vercel.

### 3. HTTP 404 on Browser Page Refresh
- **Cause**: Client-side routing (`react-router-dom`) is handled in JavaScript, but the static host tries to serve a physical directory.
- **Fix**:
  - On **Vercel**: Handled automatically by `client/vercel.json`.
  - On **Render Static Site**: Add a rewrite rule under **Redirects/Rewrites**: `/*` → `/index.html` (Action: `Rewrite`).

### 4. `MongooseServerSelectionError: connection timed out`
- **Cause**: MongoDB Atlas Network Access is blocking incoming connections from the hosting provider.
- **Fix**: In MongoDB Atlas, go to **Network Access** → **IP Access List** and ensure `0.0.0.0/0` is added.

### 5. Render Free Tier Spin-Down Delay
- **Symptom**: First API request takes 30–50 seconds to respond.
- **Explanation**: Render's free tier spins down services after 15 minutes of inactivity.
- **Fix**: Upgrading to Render's "Starter" tier ($7/mo) keeps the instance running 24/7 without cold starts.
