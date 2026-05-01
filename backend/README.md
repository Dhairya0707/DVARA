# DVARA Backend

Welcome to the **DVARA** (formerly Ratefiy) backend service! This repository powers the core functionality of DVARA, offering a highly performant API rate-limiting solution. The backend is built using modern JavaScript with a focus on speed, reliability, and security.

## 🚀 Tech Stack

- **Framework**: [Fastify](https://www.fastify.io/) - Extremely fast and low overhead web framework for Node.js.
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) for persisting users, API keys, and configurations.
- **Rate Limiting Engine**: [Redis](https://redis.io/) via `ioredis` executing a custom Lua script to implement a fast, atomic **Token Bucket Algorithm**.
- **Authentication**: JWT (`@fastify/jwt`) for secure user sessions and `bcryptjs` for password hashing.
- **Environment**: Node.js managed via `pnpm`.

---

## 📁 Project Structure

```text
backend/
├── src/
│   ├── app.js                 # App factory and plugin registration
│   ├── server.js              # Entry point to start the server
│   ├── config/                # Database and Redis configurations
│   ├── middleware/            # JWT Auth and API Key validation middleware
│   ├── models/                # Mongoose Database Models
│   ├── modules/               # Core business logic divided into modules
│   │   ├── auth/              # Authentication routes & controllers
│   │   ├── keys/              # API Key management routes & controllers
│   │   └── limiter/           # Rate limiter execution engine
│   └── utils/                 # Utility helpers (e.g., Lua Scripts)
├── .env                       # Environment variables
└── package.json               # Dependencies and scripts
```

---

## ⚙️ Setup & Installation

1. **Clone the repository** (if not already done).
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Set up Environment Variables**:
   Create a `.env` file in the root of the `backend/` folder based on `.env.example` (or configure the following):
   ```env
   PORT=8080
   MONGODB_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. **Start the Development Server**:
   ```bash
   pnpm dev
   ```
   The server will start (default is `http://localhost:8080`).

---

## 🗺️ API Routes

### General Routes

| Method | Endpoint  | Description                                          |
| ------ | --------- | ---------------------------------------------------- |
| `GET`  | `/`       | Welcome to DVARA API.                                |
| `GET`  | `/health` | Health check endpoint, returns status and timestamp. |

### Authentication (`/api/auth`)

Handles user registration and login.
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new account. |
| `POST` | `/api/auth/login` | Login to an account and receive a JWT. |

### API Key Management (`/api/keys`)

Manage rate-limit API Keys. **All routes require a valid JWT token in the `Authorization: Bearer <token>` header.**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/keys/` | Retrieve all API keys belonging to the authenticated user. |
| `POST` | `/api/keys/` | Create a new API key (set properties like `cap`, `rate`, etc.). |
| `PUT` | `/api/keys/:id` | Update configuration of a specific API key. |
| `DELETE`| `/api/keys/:id` | Delete an API key. |

### Rate Limiter Execution (`/v1`)

The core endpoint for consumers to check if their requests are within allowed limits based on the Token Bucket algorithm.
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/limit` | Validates the request against the configured limits. |

**Headers required for `/v1/limit`**:

- `x-api-key`: The API Key generated from the DVARA dashboard.

**Body (Optional) for `/v1/limit`**:

```json
{
  "identifier": "user_123_or_ip_address"
}
```

_Note: If `identifier` is not passed, the requester's IP address will be used by default._

---

## 🛠️ How Rate Limiting Works

The rate-limiting logic is powered by a high-performance **Lua script** evaluated directly inside Redis. This ensures atomic reads and writes of tokens, entirely avoiding race conditions.

1. The `/v1/limit` route validates the incoming `x-api-key` using a pre-handler middleware.
2. We extract the configured `cap` (maximum tokens) and `rate` (replenishment rate per second) linked to that key.
3. Redis evaluates the request and computes the remaining tokens.
4. Response headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`) are injected automatically to guide the consuming client.

---

## 📜 Scripts

- `pnpm start`: Runs the server using Node in production mode.
- `pnpm dev`: Runs the server using `nodemon` for local development.

---

_Built with ❤️ for DVARA_
