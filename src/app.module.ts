import { join } from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { UrlModule } from './url/url.module'
import configuration from './utils/config/configuration'
import { CacheModule } from './utils/caching/cache.module'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    CacheModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      // Turn on introspection and playground in production
      introspection: true,
      playground: true,
    }),
    UrlModule,
  ],
})
export class AppModule {}
