import { Router } from 'express'
import { router as usersRoutes } from './users.routes'
import { router as clientsRoutes } from './clients.routes'

const router = Router()

router.use('/users', usersRoutes)
router.use('/clients', clientsRoutes)

export { router }
