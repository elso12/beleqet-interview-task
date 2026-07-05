# Deploy TODAY — copy/paste checklist

## A. Render — beleqet-api → Environment

Add every variable below (click **Add Environment Variable** for each).

### 1. Database
Open **beleqet-db** → **Connections** → copy **Internal Database URL**

| Key | Value |
|-----|--------|
| `DATABASE_URL` | `postgresql://...` (Internal URL from beleqet-db) |

### 2. Redis (ONE variable — easiest)
Upstash dashboard → your database → **Redis URL** (TLS). Paste the full URL:

| Key | Value |
|-----|--------|
| `REDIS_URL` | `rediss://default:YOUR_PASSWORD@willing-chow-70411.upstash.io:6379` |

### 3. Required app vars

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `JWT_ACCESS_SECRET` | run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_ACCESS_EXPIRES` | `15m` |
| `JWT_REFRESH_EXPIRES` | `30d` |
| `FRONTEND_URL` | `https://your-app.vercel.app` (update after Vercel) |

Click **Save Changes** → wait until **Live**.

Test: `https://YOUR-SERVICE.onrender.com/api/v1/jobs/stats`

---

## B. Vercel — frontend

1. vercel.com → Import **beleqet-interview-task**
2. Root Directory: **`frontend`**
3. Branch: **`main`**
4. Environment variable:

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_API_URL` | `https://beleqet-api.onrender.com` (your Render URL) |

5. Deploy → copy Vercel URL → update `FRONTEND_URL` on Render → Save

---

## Demo logins (auto-seeded on deploy)

- `employer@beleqet.com` / `Password123!`
- `seeker@beleqet.com` / `Password123!`
