import redis, { luaScript } from "../../config/redis.js";

export const checkLimit = async (request, reply) => {
  const { identifier } = request.body || {};
  const { cap, rate, key: apiKeyString } = request.apiKeyDoc;

  const userIdentifier = identifier || request.ip;

  try {
    const redisKey = `ratelimit:${apiKeyString}:${userIdentifier}`;
    const now = Math.floor(Date.now() / 1000);

    const result = await redis.eval(
      luaScript,
      1, // number of keys
      redisKey, // KEYS[1]
      cap, // ARGV[1]
      rate, // ARGV[2]
      now, // ARGV[3]
    );

    const [allowedStr, remainingStr] = result;

    const allowed = allowedStr === "true";
    const tokens = parseFloat(remainingStr);
    const remaining = Math.max(0, Math.floor(tokens));

    // 3. Set Headers
    reply.header("X-RateLimit-Limit", cap);
    reply.header("X-RateLimit-Remaining", remaining);

    if (!allowed) {
      // Calculate exact seconds until we have at least 1 token
      // tokens is current fractional amount (e.g. 0.3)
      // we need 1.0 - 0.3 = 0.7 more tokens.
      // time = 0.7 / rate
      const retryAfter = Math.ceil((1 - tokens) / rate);
      reply.header("Retry-After", retryAfter);
      return reply.code(429).send({
        allowed: false,
        remaining,
        retryAfter,
      });
    }

    return reply.send({
      allowed: true,
      remaining,
      retryAfter: 0,
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: "Server error :" + error });
  }
};
