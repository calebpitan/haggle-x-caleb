import { RedisService } from 'nestjs-redis'
import { CacheService } from './cache.service'

const wait = async (time: number) => new Promise(resolve => setTimeout(() => resolve(time), time))

jest.mock('../caching/cache.service', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CacheServiceMock } = require('../../__mocks__/utils/caching/cache.service')
  return { CacheService: CacheServiceMock }
})

describe('CacheService', () => {
  let cacheService: CacheService
  const setKeys = async (
    cache: CacheService,
    keys: any[],
    values: any[],
    ttl: number | number[],
  ) => {
    return await Promise.all(
      keys.map(
        async (key, i) => await cache.setKey(key, values[i], Array.isArray(ttl) ? ttl[i] : ttl),
      ),
    )
  }

  beforeEach(() => {
    // The redis service is a dud, our mock doesn't require it
    cacheService = new CacheService({} as RedisService)
  })

  afterEach(async () => {
    await cacheService.clear()
    await cacheService.close()
  })

  it('#close', async () => {
    const key = 'key'
    const value = 'value'
    await cacheService.setKey(key, value, 1)
    await cacheService.close()
    const cachedValue = await cacheService.getKey(key)
    expect(cachedValue).toStrictEqual(null)
  })

  it('#clear', async () => {
    const key = 'key'
    const value = 'value'
    await cacheService.setKey(key, value, 1)
    await cacheService.close()
    const cachedValue = await cacheService.getKey(key)
    expect(cachedValue).toStrictEqual(null)
  })

  it('#setKey', async () => {
    const key = 'key'
    const value = 'value'
    const reply = await cacheService.setKey(key, value, 1)
    expect(reply).toEqual('OK')
  })

  it('#getKey', async () => {
    const key = 'key'
    const value = 'value'
    await cacheService.setKey(key, value, 1)
    const cachedValue = await cacheService.getKey(key)
    expect(cachedValue).toStrictEqual(value)
  })

  it('#getKeys', async () => {
    const keys = ['key1', 'key2', 'key3']
    const values = ['value1', 'value2', 'value3']
    await setKeys(cacheService, keys, values, 1)
    const cachedValues = await cacheService.getKeys(...keys)
    expect(cachedValues).toStrictEqual(values)
  })

  it('#setJSON', async () => {
    const key = 'key'
    const value = { value: 1, type: 'number' }
    const reply = await cacheService.setJSON(key, value, 1)
    expect(reply).toEqual('OK')
  })

  it('#getJSON', async () => {
    const key = 'key'
    const value = { value: 1, type: 'number' }
    await cacheService.setJSON(key, value, 1)
    const cachedValue = await cacheService.getJSON(key)
    expect(cachedValue).toStrictEqual(value)
  })

  it('#delete', async () => {
    const keys = ['key1', 'key2', 'key3']
    const values = ['value1', 'value2', 'value3']
    await setKeys(cacheService, keys, values, 1)

    //delete 1
    await cacheService.delete(keys[0])
    const reply = await cacheService.getKey(keys[0])
    expect(reply).toStrictEqual(null)

    // delete all
    await cacheService.delete(...keys.slice(1))
    const cachedValues = await cacheService.getKeys(...keys.slice(1))
    expect(cachedValues).toStrictEqual(Array(values.slice(1).length).fill(null))
  })

  describe('Time To Live (TTL)', () => {
    it('should expire key after TTL', async () => {
      const key = 'key'
      const value = 'value'
      await cacheService.setKey(key, value, 1)
      await wait(1000)
      const cachedValue = await cacheService.getKey(key)
      expect(cachedValue).toStrictEqual(null)
    })
  })
})
