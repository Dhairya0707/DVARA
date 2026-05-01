import buildApp from "./app.js";
import connectDB from "./config/db.js";
import redis from "./config/redis.js";
import dotenv from "dotenv";

dotenv.config();

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Redis connection is handled by its own event listeners in config/redis.js
    // but we can check it here if needed

    const app = await buildApp();
    const port = process.env.PORT || 8080;

    await app.listen({ port, host: "0.0.0.0" });
    console.log(`Server listening on http://0.0.0.0:${port}`);
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

startServer();
