<div align="center">

<h1>⚡ DVARA</h1>

<p><strong>A production-grade, API-key-based rate limiting service built on the Token Bucket algorithm.</strong><br/>Powered by Fastify, Redis, and a Lua atomic script — with a full-stack dashboard to manage, test, and visualize your rate limits in real time.</p>

<br/>

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-5.x-000000?logo=fastify&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?logo=redis&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

<br/>

</div>

---

## ✨ What is DVARA?

DVARA is a **Rate-as-a-Service (RaaS)** backend that lets you issue API keys, configure custom rate limit policies (capacity + refill rate), and enforce them in real time via Redis.

Instead of every developer re-implementing rate limiting from scratch, DVARA offers a centralized gateway. You call one endpoint. It tells you: **allowed** or **blocked** — instantly.

**Built for backend engineers who want to demo production-level patterns, not toy examples.**

---

## 🏗 Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         DVARA System                         │
│                                                                │
│  ┌─────────────┐     ┌──────────────────────────────────────┐  │
│  │  Next.js    │     │          Fastify Backend             │  │
│  │  Dashboard  │────▶│                                      │  │
│  │  (Frontend) │     │  ┌──────────────┐  ┌─────────────┐  │  │
│  └─────────────┘     │  │  Auth Routes │  │  Key Routes │  │  │
│                       │  │  /api/auth   │  │  /api/keys  │  │  │
│                       │  └──────────────┘  └─────────────┘  │  │
│                       │                                      │  │
│                       │       ┌──────────────────────┐       │  │
│                       │       │   Rate Limit Route   │       │  │
│                       │       │      POST /v1/limit  │       │  │
│  Your API Client ────▶│       │                      │       │  │
│  (x-api-key header)  │       │  ① Validate API Key  │       │  │
│                       │       │  ② Lua Script→Redis  │       │  │
│                       │       │  ③ Return Decision   │       │  │
│                       │       └──────────┬───────────┘       │  │
│                       │                  │                    │  │
│                       └──────────────────┼────────────────────┘  │
│                                          │                        │
│                       ┌──────────────────▼────────┐              │
│                       │  Redis (Token Bucket State) │             │
│                       │  HMSET ratelimit:{key}:{id}  │             │
│                       │    tokens: 9.3               │             │
│                       │    last_refill: 1714393200   │             │
│                       └─────────────────────────────┘             │
│                                                                    │
│         ┌──────────────────┐                                       │
│         │ MongoDB           │ (User + API Key storage)             │
│         │ users, api_keys  │                                       │
│         └──────────────────┘                                       │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 The Core: Token Bucket Algorithm

This is the most important part. The rate limiting logic lives in a **single Lua script executed atomically in Redis**.

### Why Lua + Redis?

In a distributed environment, a check-then-act pattern in application code has a race condition:

```
Thread A reads: tokens = 1  ✓
Thread B reads: tokens = 1  ✓  ← Both think they're allowed
Thread A writes: tokens = 0
Thread B writes: tokens = 0  ← But now you served 2 requests at capacity 1!
```

By using a **Lua script**, Redis executes the entire logic **atomically as a single operation**. No race conditions. No double-spending of tokens.

### The Algorithm (`tokenBucket.lua`)

```lua
-- KEYS[1]: ratelimit:{api_key}:{identifier}
-- ARGV[1]: cap       (max token capacity)
-- ARGV[2]: rate      (tokens refilled per second)
-- ARGV[3]: now       (current unix timestamp in seconds)

local key = KEYS[1]
local cap, rate, now = tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])

-- 1. Read current bucket state from Redis hash
local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(bucket[1])
local last_refill = tonumber(bucket[2])

-- 2. Initialize on first request
if not tokens then
    tokens = cap
    last_refill = now
else
    -- 3. Refill: time_elapsed × rate (capped at max capacity)
    local elapsed = math.max(0, now - last_refill)
    tokens = math.min(cap, tokens + (elapsed * rate))
    last_refill = now
end

-- 4. Consume one token if available
local allowed = false
if tokens >= 1 then
    tokens = tokens - 1
    allowed = true
end

-- 5. Persist new state with a 10-minute expiry (auto-cleanup)
redis.call('HMSET', key, 'tokens', tokens, 'last_refill', last_refill)
redis.call('EXPIRE', key, 600)

return { tostring(allowed), tostring(tokens) }
```

### Key Properties

| Property               | Detail                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------- |
| **Atomic**             | Entire check-and-update is one Redis operation. Zero race conditions.                   |
| **Fractional tokens**  | Tokens are stored as floats (e.g. `9.3`), enabling precise sub-second refill rates.     |
| **Auto-cleanup**       | Each key expires after 10 minutes of inactivity — no Redis memory leak.                 |
| **Per-user isolation** | Key is `ratelimit:{api_key}:{identifier}` — each user gets their own bucket.            |
| **Burst support**      | The `cap` param allows bursting up to the max, then throttling to the sustained `rate`. |

### Retry-After Calculation

When a request is blocked, the controller calculates the **exact** seconds until the client can retry:

```js
// tokens = fractional remaining (e.g. 0.3 tokens left)
// We need 1 full token. Time = (1 - 0.3) / rate
const retryAfter = Math.ceil((1 - tokens) / rate);
reply.header("Retry-After", retryAfter);
```

This is more accurate than the naive `1 / rate` approximation because it accounts for the partial tokens already in the bucket.

### Response Headers (DX)

Every response from `/v1/limit` includes standard rate limit headers:

```
X-RateLimit-Limit: 10        ← configured cap for this key
X-RateLimit-Remaining: 7     ← tokens left after this request
Retry-After: 3               ← (only on 429) seconds until allowed
```

---

## 📁 Project Structure

```
DVARA/
├── backend/
│   ├── src/
│   │   ├── app.js                        ← Fastify app factory (routes + plugins)
│   │   ├── server.js                     ← Entry point, DB + Redis connect
│   │   ├── config/
│   │   │   ├── db.js                     ← MongoDB connection (Mongoose)
│   │   │   └── redis.js                  ← Redis client + Lua script loader
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js         ← JWT verification (dashboard routes)
│   │   │   └── apikey.middleware.js       ← API key validation (rate limit routes)
│   │   ├── models/
│   │   │   ├── user.model.js             ← User schema (email + hashed password)
│   │   │   └── apikey.model.js           ← ApiKey schema (name, key, cap, rate)
│   │   ├── modules/
│   │   │   ├── auth/                     ← Register + Login (JWT issued)
│   │   │   ├── keys/                     ← CRUD for API keys (auth-protected)
│   │   │   └── limiter/
│   │   │       ├── limiter.route.js      ← POST /v1/limit (schema + preHandler)
│   │   │       └── limiter.controller.js ← Token bucket consumption logic
│   │   └── utils/
│   │       └── redis/
│   │           └── scripts/
│   │               └── tokenBucket.lua   ← ⭐ The atomic rate limit script
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── app/
    │   ├── layout.js                     ← Root layout
    │   ├── globals.css                   ← Design system (Sarvam light theme)
    │   ├── login/page.js                 ← Login page
    │   ├── register/page.js              ← Register page
    │   ├── dashboard/page.js             ← API key management
    │   └── test/page.js                  ← Interactive request simulator
    ├── lib/
    │   └── api.js                        ← Axios instance (base URL + auth header)
    ├── package.json
    └── .env.local
```

---

## 🔐 Two-Layer Security Model

DVARA uses **two separate middleware chains**:

### 1. `auth.middleware.js` — Dashboard Security

- Guards all `/api/keys` routes (create, read, update, delete API keys)
- Verifies a **Fastify JWT** token
- Validates `request.user.id` exists — rejects malformed tokens that pass signature but lack claims

```
POST /api/keys  →  authenticate()  →  createKey()
```

### 2. `apikey.middleware.js` — Rate Limit Gateway

- Guards the `/v1/limit` route (the actual rate-checking endpoint)
- Validates `x-api-key` header against MongoDB
- Attaches `{cap, rate, key}` to `request.apiKeyDoc` for the controller

```
POST /v1/limit  →  validateApiKey()  →  checkLimit()
```

This separation means dashboard users and API consumers are fully decoupled with different auth flows.

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 20`
- Redis (running locally or via cloud — Upstash, Redis Cloud)
- MongoDB (local or Atlas)
- pnpm (`npm i -g pnpm`)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/dvara.git
cd dvara
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=5002
MONGO_URI=mongodb://localhost:27017/dvara
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_key_here
```

Install dependencies and start:

```bash
pnpm install
pnpm dev
```

Backend starts at `http://localhost:5002`.

### 3. Frontend Setup

```bash
cd ../frontend
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5002
```

Install dependencies and start:

```bash
pnpm install
pnpm dev
```

Frontend starts at `http://localhost:3000`.

---

## 📡 API Reference

### Auth

| Method | Endpoint             | Auth | Description               |
| ------ | -------------------- | ---- | ------------------------- |
| `POST` | `/api/auth/register` | —    | Create a new user account |
| `POST` | `/api/auth/login`    | —    | Login and receive a JWT   |

**Register / Login body:**

```json
{
  "email": "dev@example.com",
  "password": "secret123"
}
```

**Login response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "email": "dev@example.com" }
}
```

---

### API Key Management

> All routes require `Authorization: Bearer <jwt>` header.

| Method   | Endpoint        | Description               |
| -------- | --------------- | ------------------------- |
| `POST`   | `/api/keys`     | Create a new API key      |
| `GET`    | `/api/keys`     | List all your API keys    |
| `PUT`    | `/api/keys/:id` | Update cap/rate for a key |
| `DELETE` | `/api/keys/:id` | Delete an API key         |

**Create key body:**

```json
{
  "name": "Production Key",
  "cap": 10,
  "rate": 2
}
```

- `cap`: Maximum number of tokens (burst ceiling)
- `rate`: Tokens refilled **per second** (e.g. `0.1667` = 10 req/min)

**Create key response:**

```json
{
  "_id": "...",
  "name": "Production Key",
  "key": "rk_live_a3d7f...",
  "cap": 10,
  "rate": 2,
  "createdAt": "2026-04-29T..."
}
```

---

### Rate Limit Check ⭐

> This is the endpoint your own API's clients call.

| Method | Endpoint    | Auth               | Description                   |
| ------ | ----------- | ------------------ | ----------------------------- |
| `POST` | `/v1/limit` | `x-api-key` header | Check if a request is allowed |

**Headers:**

```
x-api-key: rk_live_a3d7f...
```

**Body (optional):**

```json
{
  "identifier": "user_123"
}
```

> If `identifier` is omitted, the client's IP address is used automatically.

**Response — Allowed (200):**

```json
{
  "allowed": true,
  "remaining": 9,
  "retryAfter": 0
}
```

**Response — Blocked (429):**

```json
{
  "allowed": false,
  "remaining": 0,
  "retryAfter": 3
}
```

**Response Headers (always):**

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
Retry-After: 3        ← only on 429
```

---

### Health Check

```
GET /health
→ { "status": "ok", "timestamp": "2026-04-29T16:30:00.000Z" }
```

---

## 🧮 Smart Rate Calculator

The dashboard includes a **Smart Rate Calculator** to remove the guesswork from setting `cap` and `rate`.

Instead of manually calculating tokens-per-second, you specify:

- **"I want to allow X requests per [second / minute / hour]"**

The calculator derives:

- `cap` = `X` (burst ceiling = sustained limit for simplicity)
- `rate` = `X / period_in_seconds` (exact refill speed)

**Example:** 5 requests per minute

```
cap  = 5
rate = 5 / 60 = 0.08333 tokens/second
```

You can toggle the calculator off and set `cap`/`rate` manually for fine-tuned control.

---

## 🎬 Test Panel — Request Lifecycle Visualizer

The `/test` page lets you fire requests against your own API keys and observe the results in real time:

1. **Client** node pulses — request is being sent
2. **DVARA** node glows — token bucket is being evaluated atomically in Redis
3. **Result** node lights up **green** (allowed) or **red** (blocked)

Each result in the log shows:

- `ALLOWED` / `BLOCKED` status
- Response latency in milliseconds
- Remaining tokens
- Retry-After seconds (when blocked)
- HTTP status code

---

## 🛠 Tech Stack

### Backend

| Tech                   | Role                                                            |
| ---------------------- | --------------------------------------------------------------- |
| **Fastify**            | High-performance HTTP framework with built-in schema validation |
| **Redis**              | Token bucket state storage + atomic Lua execution               |
| **MongoDB + Mongoose** | User and API key persistence                                    |
| **@fastify/jwt**       | JWT generation and verification                                 |
| **Lua**                | Atomic rate limit script (executed server-side in Redis)        |

### Frontend

| Tech                | Role                                            |
| ------------------- | ----------------------------------------------- |
| **Next.js 16**      | App Router, SSR-ready React framework           |
| **Tailwind CSS v4** | Utility-first styling with custom design tokens |
| **Axios**           | API client with JWT interceptor                 |
| **Lucide React**    | Icon library                                    |

---

## 🔒 Environment Variables

### Backend (`.env`)

| Variable     | Required | Description                   |
| ------------ | -------- | ----------------------------- |
| `PORT`       | Yes      | Server port (default: `5002`) |
| `MONGO_URI`  | Yes      | MongoDB connection string     |
| `REDIS_URL`  | Yes      | Redis connection URL          |
| `JWT_SECRET` | Yes      | Secret for signing JWT tokens |

### Frontend (`.env.local`)

| Variable              | Required | Description      |
| --------------------- | -------- | ---------------- |
| `NEXT_PUBLIC_API_URL` | Yes      | Backend base URL |

---

## 🧩 Extending DVARA

### Add a new rate limit strategy

1. Create a new Lua script in `backend/src/utils/redis/scripts/`
2. Load it in `redis.js` similar to `tokenBucket.lua`
3. Add a `strategy` field to the `ApiKey` model
4. Switch strategies in `limiter.controller.js` based on `request.apiKeyDoc.strategy`

### Add an SDK / client library

The `/v1/limit` endpoint is intentionally simple — just an HTTP POST with an API key header. Any language can integrate it:

```python
# Python example
import requests

response = requests.post(
    "https://your-dvara.com/v1/limit",
    headers={"x-api-key": "rk_live_..."},
    json={"identifier": "user_42"}
)
data = response.json()
if not data["allowed"]:
    retry_after = data["retryAfter"]
    # handle backoff
```

---

## 📝 License

MIT © 2026 — Built with precision for India's developer ecosystem.

---

<div align="center">
<strong>⭐ If you find DVARA useful, give it a star!</strong>
</div>
