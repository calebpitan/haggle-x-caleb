import { Test, TestingModule } from '@nestjs/testing'
import { UrlService } from './url.service'
import { CacheService } from '../utils/caching/cache.service'

jest.mock('../utils/caching/cache.service', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CacheServiceMock } = require('../../__mocks__/utils/caching/cache.service')
  return { CacheService: CacheServiceMock }
})

jest.mock('node-fetch', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fetch = require('../../__mocks__/fetch')
  return fetch
})

describe('UrlService', () => {
  let service: UrlService
  let cache: CacheService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService, CacheService],
    }).compile()

    service = module.get<UrlService>(UrlService)
    cache = module.get<CacheService>(CacheService)
  })

  afterEach(async () => cache.close())

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should throw error if request fails', () => {
    const parsedUrl = service.parse({ href: 'error/url' })
    expect(parsedUrl).rejects.toThrow(Error)
  })

  it("#parse (should parse a webpage from it's URL into metadata)", async () => {
    const parsedUrl = await service.parse({ href: 'great/url' })

    expect(parsedUrl.title).toBeDefined()
    expect(parsedUrl.description).toBeDefined()
    expect(parsedUrl.image).toBeDefined()
    expect(parsedUrl).toMatchInlineSnapshot(`
      Object {
        "description": "Mock webpage written in HTML for testing only.",
        "image": "https://www.w3.org/images/html.jpg",
        "title": "Mock Webpage Title",
      }
    `)
  })
})
