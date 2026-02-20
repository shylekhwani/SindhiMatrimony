import { redis } from "../config/redisConfig.js";

const MESSAGE_LIMIT = 10; // max messages
const WINDOW_SECONDS = 5; // time window

export const checkMessageSpam = async (userId) => {
  const key = `spam:messages:${userId}`;

  // Increment counter
  const count = await redis.incr(key);

  // If first message, set expiry
  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  if (count > MESSAGE_LIMIT) {
    return false; // blocked
  }

  return true; // allowed
};
