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

// Set data to Redis with language support
export const setCache = async (key: string, data: any, expiration = 3600) => {
  try {
    // Format key with language if provided
    // const languageKey = language ? `${key}:${language}` : key;
    await redisClient.setEx(key, expiration, JSON.stringify(data));
  } catch (error) {
    console.error("Redis cache set error:", error);
  }
};

// Get data from Redis with language support
export const getCache = async (key: string) => {
  try {
    // Format key with language if provided
    // const languageKey = language ? `${key}:${language}` : key;
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

// Delete cache by key with language support
export const deleteCache = async (key: string, language?: string) => {
  try {
    // Format key with language if provided
    const languageKey = language ? `${key}:${language}` : key;
    await redisClient.del(languageKey);
  } catch (error) {
    console.error("Redis cache delete error:", error);
  }
};

// Clear cache with pattern with language support
export const clearCache = async (pattern: string) => {
  try {
    // Format pattern with language if provided
    // const languagePattern = language ? `${pattern}:${language}` : pattern;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error("Redis cache clear error:", error);
  }
};

// Generate a language-specific cache key
export const generateCacheKey = (baseKey: string, language?: string): string => {
  return language ? `${baseKey}:${language}` : baseKey;
};

export { connectRedis, redisClient };
