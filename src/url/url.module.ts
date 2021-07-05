import { Module } from '@nestjs/common'
import { UrlService } from './url.service'
import { UrlResolver } from './url.resolver'
import { CacheService } from '../utils/caching/cache.service'

@Module({
  providers: [UrlResolver, UrlService, CacheService],
})
export class UrlModule {}
