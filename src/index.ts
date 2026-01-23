import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { router } from '@/routes'

const server = express()

server.use(cors())
server.use(express.json())

server.use('/api', router)

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`)
})
