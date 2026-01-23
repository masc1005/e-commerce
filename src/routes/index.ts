import { Router } from 'express'
import { router as usersRoutes } from './users.routes'
import { router as clientsRoutes } from './clients.routes'
import { router as productsRoutes } from './products.routes'
import { router as ordersRoutes } from './orders.routes'

const router = Router()

router.use('/users', usersRoutes)
router.use('/clients', clientsRoutes)
router.use('/products', productsRoutes)
router.use('/orders', ordersRoutes)

export { router }
