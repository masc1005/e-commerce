import { Router } from 'express'
import { router as usersRoutes } from './users.routes'
import { router as clientsRoutes } from './clients.routes'
import { router as productsRoutes } from './products.routes'
import { router as ordersRoutes } from './orders.routes'
import orderItemsRoutes from './order-items.routes'

const router = Router()

router.use('/users', usersRoutes)
router.use('/clients', clientsRoutes)
router.use('/products', productsRoutes)
router.use('/orders', ordersRoutes)
router.use('/order-items', orderItemsRoutes)

export { router }
