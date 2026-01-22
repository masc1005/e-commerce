import express from 'express'
import cors from 'cors'

import 'dotenv/config'

import { drizzle } from 'drizzle-orm/node-postgres'

const db = drizzle(process.env.DATABASE_URL!)

const server = express()

server.use(cors())
server.use(express.json())

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Server Runin' on port ${process.env.SERVER_PORT}`)
})
