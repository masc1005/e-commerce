import { Router } from 'express'
import { router as usersRoutes } from './users.routes'

const router = Router()

router.use('/users', usersRoutes)

export { router }
