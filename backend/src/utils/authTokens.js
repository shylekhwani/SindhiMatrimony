import { redis } from "../config/redisConfig.js";
import { createJWT } from "../utils/authJWT.js";
import { v4 as uuidv4 } from "uuid";
import { getUserById } from "../repository/userRepo.js";

export const generateTokens = async (user) => {
  const accessToken = createJWT(
    { id: user.id, email: user.email, role: user.role },
    "15m",
  );

  const refreshToken = uuidv4();

  // Store token → user
  await redis
    .multi()
    .set(
      `refresh:${refreshToken}`,
      user.id,
      "EX",
      7 * 24 * 60 * 60, // 7 days
    )
    .sadd(`user_sessions:${user.id}`, refreshToken) // Store user → tokens
    .exec();

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (oldRefreshToken) => {
  const userId = await redis.get(`refresh:${oldRefreshToken}`);

  if (!userId) {
    throw new Error("Invalid refresh token");
  }

  // Rotate refresh token
  const newRefreshToken = uuidv4();

  await redis
    .multi()
    .del(`refresh:${oldRefreshToken}`)
    .srem(`user_sessions:${userId}`, oldRefreshToken)
    .set(`refresh:${newRefreshToken}`, userId, "EX", 7 * 24 * 60 * 60)
    .sadd(`user_sessions:${userId}`, newRefreshToken)
    .exec();

  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const newAccessToken = createJWT(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    "15m",
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutAllDevices = async (userId) => {
  const key = `user_sessions:${userId}`;

  const tokens = await redis.smembers(key);

  if (tokens.length === 0) return;

  if (tokens.length > 0) {
    const pipeline = redis.pipeline();

    for (const token of tokens) {
      pipeline.del(`refresh:${token}`);
    }

    pipeline.del(key);
    await pipeline.exec();
  }
};
