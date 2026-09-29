import { Redis } from '@upstash/redis'
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from './env.js'

// In-memory cache fallback store
interface MemoryCacheEntry {
  value: any
  expiresAt: number
}

const memoryStore = new Map<string, MemoryCacheEntry>()

// Only instantiate Redis if the required credentials are provided
const hasRedisConfig = Boolean(UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN)

export const redis: any = hasRedisConfig
  ? new Redis({
    url: UPSTASH_REDIS_REST_URL as string,
    token: UPSTASH_REDIS_REST_TOKEN as string,
  })
  : {
      get: async <T>(key: string): Promise<T | null> => {
        const entry = memoryStore.get(key)
        if (!entry) return null
        if (Date.now() > entry.expiresAt) {
          memoryStore.delete(key)
          return null
        }
        return entry.value as T
      },
      setex: async (key: string, ttlSeconds: number, value: any): Promise<'OK'> => {
        memoryStore.set(key, {
          value,
          expiresAt: Date.now() + ttlSeconds * 1000,
        })
        return 'OK'
      },
      del: async (...keys: string[]): Promise<number> => {
        let count = 0
        for (const k of keys) {
          if (memoryStore.delete(k)) count++
          for (const memKey of memoryStore.keys()) {
            if (memKey.startsWith(k)) {
              memoryStore.delete(memKey)
              count++
            }
          }
        }
        return count
      },
      exists: async (key: string): Promise<number> => {
        const entry = memoryStore.get(key)
        if (!entry) return 0
        if (Date.now() > entry.expiresAt) {
          memoryStore.delete(key)
          return 0
        }
        return 1
      },
    }

// Cache key namespaces — keeps keys organised and easy to invalidate by prefix
export const CacheKey = {
  innovations: (id?: string) => id ? `innovations:${id}` : 'innovations:list',
  events: (id?: string) => id ? `events:${id}` : 'events:list',
  courses: (id?: string) => id ? `courses:${id}` : 'courses:list',
  news: (id?: string) => id ? `news:${id}` : 'news:list',
  partners: () => 'partners:list',
  resources: () => 'resources:list',
  user: (id: string) => `user:${id}`,
} as const

// Default TTLs in seconds
export const CacheTTL = {
  short: 60 * 5,        // 5 min  — frequently updated (events, news)
  medium: 60 * 30,       // 30 min — semi-static (courses, innovations)
  long: 60 * 60 * 6,   // 6 hrs  — static (partners, resources)
} as const

export async function withCache<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  if (redis) {
    try {
      const cached = await redis.get(key)
      if (cached !== null && cached !== undefined) return cached as T
    } catch (e) {
      console.warn(`[Cache GET error for ${key}]:`, e)
    }
  }

  const fresh = await fetcher()

  if (redis) {
    try {
      await redis.setex(key, ttl, fresh)
    } catch (e) {
      console.warn(`[Cache SETEX error for ${key}]:`, e)
    }
  }

  return fresh
}

