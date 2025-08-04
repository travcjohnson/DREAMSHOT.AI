import { createClient } from 'redis';
import { env } from '@/config/env';

const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createClient> | undefined;
};

export const redis = globalForRedis.redis ??
  createClient({ url: env.REDIS_URL || 'redis://localhost:6379' });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// Cache utilities
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
    await redis.setEx(key, ttlSeconds, JSON.stringify(value));
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async exists(key: string): Promise<boolean> {
    return (await redis.exists(key)) === 1;
  },
};