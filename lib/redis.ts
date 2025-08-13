import { Redis } from 'ioredis'

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
}

// Create Redis client
let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis(redisConfig)
    
    redis.on('error', (error) => {
      console.error('❌ Redis connection error:', error)
    })
    
    redis.on('connect', () => {
    
    })
    
    redis.on('ready', () => {
    
    })
  }
  
  return redis
}

// Cache utility functions
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient()
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('❌ Redis get error:', error)
    return null
  }
}

export async function setCachedData<T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> {
  try {
    const client = getRedisClient()
    await client.setex(key, ttlSeconds, JSON.stringify(data))
  } catch (error) {
    console.error('❌ Redis set error:', error)
  }
}

export async function deleteCachedData(key: string): Promise<void> {
  try {
    const client = getRedisClient()
    await client.del(key)
  } catch (error) {
    console.error('❌ Redis delete error:', error)
  }
}

export async function clearCache(pattern: string = '*'): Promise<void> {
  try {
    const client = getRedisClient()
    const keys = await client.keys(pattern)
    if (keys.length > 0) {
      await client.del(...keys)
    
    }
  } catch (error) {
    console.error('❌ Redis clear cache error:', error)
  }
}

// Cache key generators
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|')
  return `${prefix}:${sortedParams}`
}

// Health check
export async function checkRedisHealth(): Promise<boolean> {
  try {
    const client = getRedisClient()
    await client.ping()
    return true
  } catch (error) {
    console.error('❌ Redis health check failed:', error)
    return false
  }
} 