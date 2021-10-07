import { ApolloServer, UserInputError } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import http from 'http'
import 'reflect-metadata'
import createFileStore from 'session-file-store'
import { buildSchema } from 'type-graphql'
import { COOKIE_NAME, sessionTTL, __prod__ } from './constants'
import { HelloResolver } from './resolvers/hello'
import { MyContext, MySession } from './types'

import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'

const whitelist = ['http://localhost:3000', 'https://studio.apollographql.com']

const main = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const FileStore = createFileStore(session)

  app.use(
    cors({
      origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true,
    })
  )
  app.use(
    session({
      name: COOKIE_NAME,
      cookie: {
        maxAge: sessionTTL,
        httpOnly: true,
        secure: __prod__,
      },
      secret: 'ysdfysd fasdfasdf aasdfasdf',
      resave: false,
      saveUninitialized: false,
      store: new FileStore({}),
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: true,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req, res }) =>
      ({
        req,
        session: req.session! as unknown as MySession,
        res,
      } as MyContext),
    formatError: (err) => {
      if (
        err.extensions?.code === 'INTERNAL_SERVER_ERROR' &&
        err.extensions?.exception?.validationErrors
      ) {
        //Coming from class-validator
        const ex = err.extensions?.exception
        return new UserInputError('Bad User Input', {
          validationError: ex.validationError ? ex.validationError : [],
          validationErrors: ex.validationErrors ? ex.validationErrors : [],
          exception: {
            stacktrace: ex.stacktrace ? ex.stacktrace : undefined,
            validationError: ex.validationError ? ex.validationError : [],
            validationErrors: ex.validationErrors ? ex.validationErrors : [],
            path: err.path ? err.path : undefined,
          },
        })
      }
      return err
    },
  })

  await apolloServer.start()
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
