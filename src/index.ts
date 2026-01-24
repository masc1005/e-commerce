import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import swaggerUi from 'swagger-ui-express'
import { router } from '@/routes'
import { swaggerSpec } from '@/config/swagger'

const server = express()

server.use(cors())
server.use(express.json())

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
server.use('/api', router)

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`)
  console.log(`Swagger docs available at http://localhost:${process.env.SERVER_PORT}/api-docs`)
})
