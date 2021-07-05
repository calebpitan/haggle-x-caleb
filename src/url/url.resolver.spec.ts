import { Test, TestingModule } from '@nestjs/testing'
import { UrlResolver } from './url.resolver'
import { UrlService } from './url.service'
import { CacheService } from '../utils/caching/cache.service'

jest.mock('../utils/caching/cache.service', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CacheServiceMock } = require('../../__mocks__/utils/caching/cache.service')
  return { CacheService: CacheServiceMock }
})

describe('UrlResolver', () => {
  let resolver: UrlResolver
  let service: UrlService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlResolver, UrlService, CacheService],
    }).compile()

    resolver = module.get<UrlResolver>(UrlResolver)
    service = module.get<UrlService>(UrlService)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  it("#url (should parse a webpage from it's URL into metadata)", async () => {
    jest
      .spyOn(service, 'parse')
      .mockImplementation(() =>
        Promise.resolve({ title: 'title', description: 'description', image: 'image' }),
      )
    const metadata = await resolver.url({ href: 'great/url' })

    expect(metadata.title).toBeDefined()
    expect(metadata.description).toBeDefined()
    expect(metadata.image).toBeDefined()
    expect(metadata).toMatchInlineSnapshot(`
      Object {
        "description": "description",
        "image": "image",
        "title": "title",
      }
    `)
  })
})
