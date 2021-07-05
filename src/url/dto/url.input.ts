import { InputType, Field } from '@nestjs/graphql'
import { IsUrl } from 'class-validator'

@InputType()
export class UrlInput {
  @Field({ description: `URL to parse` })
  @IsUrl()
  href!: string
}
