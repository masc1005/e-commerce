import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { router } from '@/routes'

const server = express()

server.use(cors())
server.use(express.json())
server.use(router)

server.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Swagger docs available at http://localhost:${process.env.SERVER_PORT}/api-docs`,
  )
})
