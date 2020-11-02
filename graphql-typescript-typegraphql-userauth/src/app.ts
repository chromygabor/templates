import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import mongoose from 'mongoose'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { COOKIE_NAME, __prod__ } from './constants'
import { HelloResolver } from './resolvers/hello'
import { UserResolver } from './resolvers/user'
import { Database, MyContext } from './types'
import fileStore from 'session-file-store'

const sessionTTL = 14 * 24 * 60 * 60

const adapter = new FileSync<Database>('data/db.json')
const db = low(adapter)

const FileStore = fileStore(session)

db.defaults({
  users: [],
}).write()

const main = async () => {
  const app = express()

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
      store: new FileStore({ path: 'data/sessions', ttl: sessionTTL }),
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) =>
      ({
        db,
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
