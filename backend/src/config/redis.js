import Redis from "ioredis";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const redis = new Redis(process.env.REDIS_URL, {
//   maxRetriesPerRequest: null,
// });

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  connectTimeout: 10000, // Wait 10s for connection
  keepAlive: 1000, // Keep the connection alive
  family: 4, // Use IPv4 to avoid potential DNS issues
});

export const luaScript = fs.readFileSync(
  path.join(__dirname, "../utils/redis/scripts/tokenBucket.lua"),
  "utf8",
);

redis.on("connect", () => {
  console.log("Redis Connected");
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});

export default redis;
