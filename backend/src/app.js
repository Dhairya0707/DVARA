import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.route.js";
import keyRoutes from "./modules/keys/key.route.js";
import limiterRoutes from "./modules/limiter/limiter.route.js";

dotenv.config();

const buildApp = async () => {
  const app = Fastify({
    logger: true,
  });

  // Register plugins
  await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || "supersecretkey",
  });

  // Register routes
  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(keyRoutes, { prefix: "/api/keys" });
  await app.register(limiterRoutes, { prefix: "/v1" });
  app.get("/health", async (request, reply) => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // Root route
  app.get("/", async (request, reply) => {
    return { message: "Welcome to DVARA API" };
  });

  return app;
};

export default buildApp;
