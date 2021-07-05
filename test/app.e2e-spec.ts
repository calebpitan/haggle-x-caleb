import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => await app.close())

  it('/graphql (POST)', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `
        {
          url(url: {href: "https://calebpitan.com"}) {
            title
            description
            image
          }
        }
        `,
        variables: {},
      })
      .expect(200)
  })

  it('Query #url', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `
        {
          url(url: {href: "https://calebpitan.com"}) {
            title
            description
            image
          }
        }
        `,
        variables: {},
      })
    expect(response.body).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "url": Object {
            "description": "Hi, I am Caleb! This is just one of the places where I'm domiciled on the internet as a proprietor not a tenant. A place where I write about tech, coding, web applications and frameworks like Node.js, React and so much more.",
            "image": "https://www.calebpitan.com/static/d0e4aa37fda944bdbcae2f285eca8c78/37d5a/ninja.png",
            "title": "Caleb Pitan",
          },
        },
      }
    `)
  })
})
