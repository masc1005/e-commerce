import { Router } from 'express'
import { OrderItemController } from '@/controllers/order-item.controller'
import { OrderItemRepository } from '@/repositories/order-item.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { OrderRepository } from '@/repositories/order.repository'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { validate, validateParams } from '@/middlewares/validate.middleware'
import {
  createOrderItemSchema,
  updateOrderItemSchema,
} from '@/validators/order-item.validator'
import { uuidParamSchema } from '@/validators/common.validator'

const router = Router()
const orderItemRepository = new OrderItemRepository()
const productRepository = new ProductRepository()
const orderRepository = new OrderRepository()
const orderItemController = new OrderItemController(
  orderItemRepository,
  productRepository,
  orderRepository,
)

router.post('/', authMiddleware, validate(createOrderItemSchema), (req, res) =>
  orderItemController.create(req, res),
)

router.get('/', authMiddleware, (req, res) =>
  orderItemController.list(req, res),
)

router.get(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  (req, res) => orderItemController.getById(req, res),
)

router.put(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  validate(updateOrderItemSchema),
  (req, res) => orderItemController.update(req, res),
)

router.delete(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  (req, res) => orderItemController.delete(req, res),
)

export default router
