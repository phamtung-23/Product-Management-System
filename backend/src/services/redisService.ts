import { createClient } from "redis";

const redisClient = createClient({
  url:
    process.env.REDIS_URL ||
    `redis://${process.env.REDIS_HOST || "localhost"}:${
      process.env.REDIS_PORT || "6379"
    }`,
});

redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
};

// Set data to Redis
export const setCache = async (key: string, data: any, expiration = 3600) => {
  try {
    await redisClient.setEx(key, expiration, JSON.stringify(data));
  } catch (error) {
    console.error("Redis cache set error:", error);
  }
};

// Get data from Redis
export const getCache = async (key: string) => {
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error("Redis cache get error:", error);
    return null;
  }
};

// Delete cache by key
export const deleteCache = async (key: string) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Redis cache delete error:", error);
  }
};

// Clear cache with pattern
export const clearCache = async (pattern: string) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error("Redis cache clear error:", error);
  }
};

export { connectRedis, redisClient };
