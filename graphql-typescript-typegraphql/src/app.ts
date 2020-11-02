import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { MyContext } from './types'

const main = async () => {
  const app = express()

  //connect to db here

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
    context: ({ req, res }) =>
      ({
        req,
        session: req.session!,
        res,
      } as MyContext),
  })

  apolloServer.applyMiddleware({ app, cors: false })
  app.listen(4000, () => {
    console.log('server started on localhost:4000')
  })
}
try {
  main()
} catch (error) {
  console.error(error)
}
