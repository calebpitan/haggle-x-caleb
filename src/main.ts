import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Configuration } from './utils/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const appConfig = app
    .get<ConfigService<Configuration>>(ConfigService)
    .get<Configuration['app']>('app')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.listen(appConfig!.port)
}
bootstrap()
