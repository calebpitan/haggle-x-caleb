export type Configuration = ReturnType<typeof configFactory>

const APP_NAME = 'haggle_x_caleb'

const configFactory = () => ({
  app: {
    name: APP_NAME,
    port: Number(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || 'development',
    production: process.env.NODE_ENV === 'production',
  },

  database: {
    redisUri: process.env.REDIS_URL || 'redis://localhost:6379',
  },
})

export default configFactory
