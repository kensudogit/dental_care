# API service restore (Railway)

If the **api** service was deleted, Web (`dental_care`) may still have a stale `API_URL` and GraphQL will fail.

## Check current state

| URL | Deleted api symptom |
|-----|---------------------|
| `https://<old-api>/health` | `404 Application not found` |
| `https://<web>/status` | `health.ok: false`, stale `apiUrlEnv` |

## Option A — Recreate api service (2-service setup)

### 1. Add api service

1. Open [Railway Dashboard](https://railway.com) ? your project
2. **+ New** ? **GitHub Repo** ? same `dental_care` repository
3. Rename service to **`api`** (recommended; must match Web variable reference)

### 2. api Settings

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Config file path** | `/backend/railway.toml` |
| Builder | Dockerfile (`backend/Dockerfile`) |

**Variables**: do **not** set `API_URL` on the api service.

### 3. Public domain

1. api service ? **Settings** ? **Networking**
2. **Generate Domain**
3. Copy URL (e.g. `https://api-production-xxxx.up.railway.app`)

### 4. Verify api

```powershell
Invoke-RestMethod -Uri "https://<new-api>/health"
```

Expected: `{ "ok": true, "service": "dental-care-api", "version": "2.1.0-pagination" }`

GraphiQL: `https://<new-api>/graphql`

### 5. Update Web Variables

**dental_care** ? **Variables**:

| Name | Value |
|------|-------|
| `API_URL` | `https://<new-api>.up.railway.app` |

With reference (service name `api`):

1. **New Variable** ? Name: `API_URL`
2. Type `https://` first
3. **Add Reference** ? `api` ? `RAILWAY_PUBLIC_DOMAIN`

### 6. Redeploy

1. **api** first
2. **dental_care** second

### 7. Final check

```powershell
Invoke-RestMethod -Uri "https://<web>/status" | ConvertTo-Json -Depth 5
```

- `health.ok`: **true**
- `apiUrlResolved`: new api URL
- `apiVersion`: not null

---

## Option B — Unified mode (no separate api)

Root `Dockerfile` bundles Go API + Next.js.

1. **dental_care** ? **Variables** ? **delete `API_URL`**
2. Settings:
   - Root Directory: **empty**
   - Config file: `/railway.toml`
3. **Redeploy**

Success: `/status` shows `unifiedDeploy: true`, `health.ok: true`.

> Old URL `api-production-7f8b...` cannot be reused after delete.  
> Latest `start-unified.sh` falls back to embedded API when external `/health` fails.

---

## Railway CLI

```bash
railway login
cd C:\devlop\dental_care
railway link
railway add --service api --repo kensudogit/dental_care
```

Then set Root Directory = `backend`, Config = `/backend/railway.toml`, generate domain in Dashboard.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `404 Application not found` | Stale `API_URL` | Recreate api, update `API_URL` |
| `health.ok: false` | api down | Redeploy api |
| Web shows Go JSON at `/` | Web Root = `backend` | Set Root empty |
| `Unknown argument "page"` | Old api schema | Redeploy api from latest `main` |
