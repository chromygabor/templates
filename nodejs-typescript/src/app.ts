import cors from 'cors'
import express from 'express'

const main = async () => {
  const app = express()

  //connect to db here

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )

  app.listen(4000, () => {
    console.log('server started on localhost:4000')
  })
}
try {
  main()
} catch (error) {
  console.error(error)
}
