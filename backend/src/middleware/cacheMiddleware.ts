import { Request, Response, NextFunction } from "express";
import { getCache, setCache } from "../services/redisService";

// TTL in seconds - 1 hour by default
const DEFAULT_EXPIRATION = 3600;

export const cacheMiddleware = (
  prefix: string,
  expiration = DEFAULT_EXPIRATION
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Skip caching for non-GET requests
      if (req.method !== "GET") {
        return next();
      }

      // Create a cache key based on the URL and query params
      const queryParams = new URLSearchParams(
        req.query as Record<string, string>
      ).toString();
      const cacheKey = `${prefix}:${req.path}:${queryParams || "default"}`;

      // Try to get cached data
      const cachedData = await getCache(cacheKey);

      if (cachedData) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return res.status(200).json(cachedData);
      }

      console.log(`Cache miss for key: ${cacheKey}`);

      // Store original send method to intercept the response
      const originalSend = res.send;
      // Override send method
      res.send = function (this: Response, body: any): Response {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const responseBody = JSON.parse(body);
          // Cache the response
          setCache(cacheKey, responseBody, expiration).catch((err) => {
            console.error("Failed to cache response:", err);
          });
        }

        // Call the original send method
        return originalSend.call(this, body);
      } as any;

      next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      next();
    }
  };
};
