import { Injectable } from '@nestjs/common'
import { RedisService } from 'nestjs-redis'

const jitter = (max = 10) => Math.floor(Math.random() * max)

@Injectable()
export class CacheService {
  private client: ReturnType<RedisService['getClient']>
  constructor(private readonly redisService: RedisService) {
    this.client = this.redisService.getClient()
  }

  public async close() {
    return await this.client.quit()
  }

  public async clear() {
    return await this.client.flushdb()
  }

  public async setKey(key: string, value: string, ttl: number) {
    return await this.client.setex(key, ttl + jitter(2), value)
  }

  public async getKey(key: string): Promise<string | null> {
    const value = await this.client.get(key)
    return value
  }

  public async getKeys(...keys: string[]) {
    return await this.client.mget(...keys)
  }

  public async setJSON(key: string, value: Record<string, any>, ttl: number) {
    return await this.client.setex(key, ttl + jitter(2), JSON.stringify(value))
  }

  public async getJSON<R = any>(key: string): Promise<R | null> {
    const value = await this.client.get(key)
    if (value === null) return value
    return JSON.parse(value) as unknown as R
  }

  public async delete(...keys: string[]) {
    return await this.client.del(...keys)
  }
}
