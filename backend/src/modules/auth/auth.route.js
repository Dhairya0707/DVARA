import { register, login } from "./auth.controller.js";

//TODO : add schema here for validation
export default async function authRoutes(fastify, options) {
  fastify.post("/register", register);
  fastify.post("/login", login);
}
