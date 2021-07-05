// A simple mock implementation of the original CacheService

import { Injectable } from '@nestjs/common'

type Data = { key: string; value: string; timerId: NodeJS.Timeout }

interface CachedDatabase {
  data: Data[]
}

const jitter = (max = 10) => Math.floor(Math.random() * max)
const normalizeTtl = (ttl: number) => Math.max(Math.min(3, ttl), 1)

@Injectable()
export class CacheServiceMock {
  private database: CachedDatabase
  constructor() {
    this.database = { data: [] }
  }

  public async close() {
    await this.clear()
    return await Promise.resolve('OK')
  }

  public async clear() {
    this.database.data.forEach(value => clearTimeout(value.timerId))
    this.database = { data: [] }
    return await Promise.resolve('OK')
  }

  public async setKey(key: string, value: string, ttl: number) {
    const data: Data = { key, value, timerId: null! }
    this.database.data.unshift(data)
    data.timerId = setTimeout(() => this.delete(key), ttl * 1e3)
    return await Promise.resolve('OK')
  }

  public async getKey(key: string): Promise<string | null> {
    const data = this.database.data.find(value => value.key === key)
    if (!data) return null
    return await Promise.resolve(data.value)
  }

  public async getKeys(...keys: string[]) {
    return await Promise.resolve(
      keys.map(key => {
        const data = this.database.data.find(value => value.key === key)
        if (!data) return null
        return data.value
      }),
    )
  }

  public async setJSON(key: string, value: Record<string, any>, ttl: number) {
    ttl = normalizeTtl(ttl) + jitter(1)
    return await this.setKey(key, JSON.stringify(value), ttl)
  }

  public async getJSON<R = any>(key: string): Promise<R | null> {
    const value = await this.getKey(key)
    if (value === null) return value
    return JSON.parse(value) as unknown as R
  }

  public async delete(...keys: string[]) {
    return await Promise.resolve(
      keys.reduce((count, key) => {
        const indexOfData = this.database.data.findIndex(value => value.key === key)
        this.database.data.splice(indexOfData, 1)
        return ++count
      }, 0),
    )
  }
}
