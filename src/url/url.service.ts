import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import { Injectable } from '@nestjs/common'
import { UrlInput } from './dto/url.input'
import { Url } from './entities/url.entity'
import { CacheService } from '../utils/caching/cache.service'

@Injectable()
export class UrlService {
  constructor(private readonly cacheService: CacheService) {}

  async parse({ href }: UrlInput) {
    const cachedMetadata = await this.cacheService.getJSON<Url>(href)

    if (cachedMetadata) return cachedMetadata

    const response = await fetch(href, { method: 'GET' })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data = await response.text()

    const { window } = new JSDOM(data)
    const { document } = window
    const head = document.querySelector('head')
    const title = head!.querySelector('title')
    const description: HTMLMetaElement | null = head!.querySelector('meta[name="description"]')
    const link: HTMLLinkElement | null = head!.querySelector('link[rel="icon"]')

    const ogTitle: HTMLMetaElement | null = head!.querySelector('meta[property="og:title"]')
    const ogDescription: HTMLMetaElement | null = head!.querySelector(
      'meta[property="og:description"]',
    )
    const ogImage: HTMLMetaElement | null = head!.querySelector('meta[property="og:image"]')

    const metadata = {
      title: getMetaContent(ogTitle) || title!.textContent!,
      description: getMetaContent(ogDescription) || getMetaContent(description),
      image: getMetaContent(ogImage) || link?.getAttribute('href') || '',
    }

    await this.cacheService.setJSON(href, metadata, 60)

    return metadata
  }
}

function getMetaContent(el: HTMLMetaElement | null) {
  return el?.getAttribute('content') || ''
}
