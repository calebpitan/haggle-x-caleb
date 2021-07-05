import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class Url {
  @Field({ description: 'Example field (placeholder)' })
  title!: string

  @Field({ description: `Description of the webpage parsed from the URL` })
  description!: string

  @Field({ description: `HREF to the image parsed from the webpage pointed to by the URL` })
  image!: string
}
