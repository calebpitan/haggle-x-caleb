import { Resolver, Query, Args } from '@nestjs/graphql'
import { UrlService } from './url.service'
import { Url } from './entities/url.entity'
import { UrlInput } from './dto/url.input'

@Resolver(() => Url)
export class UrlResolver {
  constructor(private readonly urlService: UrlService) {}

  @Query(() => Url, { name: 'url' })
  url(@Args('url') url: UrlInput): Promise<Url> {
    return this.urlService.parse(url)
  }
}
