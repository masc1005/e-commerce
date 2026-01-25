import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from '@/config/swagger'
import { defaultRateLimiter } from '@/config/rate-limit'
import { router as usersRoutes } from './users.routes'
import { router as clientsRoutes } from './clients.routes'
import { router as productsRoutes } from './products.routes'
import { router as ordersRoutes } from './orders.routes'
import orderItemsRoutes from './order-items.routes'

const router = Router()

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  })
})

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

router.use('/api', defaultRateLimiter)
router.use('/api/users', usersRoutes)
router.use('/api/clients', clientsRoutes)
router.use('/api/products', productsRoutes)
router.use('/api/orders', ordersRoutes)
router.use('/api/order-items', orderItemsRoutes)

export { router }
