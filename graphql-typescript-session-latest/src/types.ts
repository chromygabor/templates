import { Request, Response } from 'express'
import { LowSync } from 'lowdb'
import { SessionDataPersistence } from 'lowdb-session-store'

export interface MySession {
  userId: string
}

export type MyContext = {
  req: Request & { session: Express.Session }
  res: Response
  session: MySession
}
