import { Router } from 'express'
import { OrderController } from '@/controllers/order.controller'
import { OrderRepository } from '@/repositories/order.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { OrderItemRepository } from '@/repositories/order-item.repository'
import { validate, validateParams } from '@/middlewares/validate.middleware'
import { authMiddleware } from '@/middlewares/auth.middleware'
import {
  createOrderSchema,
  updateOrderStatusSchema,
  addItemsToOrderSchema,
  removeItemsFromOrderSchema,
} from '@/validators/order.validator'
import { uuidParamSchema } from '@/validators/common.validator'

const router = Router()
const orderRepository = new OrderRepository()
const productRepository = new ProductRepository()
const orderItemRepository = new OrderItemRepository()
const orderController = new OrderController(
  orderRepository,
  productRepository,
  orderItemRepository,
)

router.post('/', authMiddleware, validate(createOrderSchema), (req, res) =>
  orderController.create(req, res),
)

router.get('/', authMiddleware, (req, res) => orderController.list(req, res))

router.get(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  (req, res) => orderController.getById(req, res),
)

router.patch(
  '/:id/status',
  authMiddleware,
  validateParams(uuidParamSchema),
  validate(updateOrderStatusSchema),
  (req, res) => orderController.updateStatus(req, res),
)

router.post(
  '/:id/items',
  authMiddleware,
  validateParams(uuidParamSchema),
  validate(addItemsToOrderSchema),
  (req, res) => orderController.addItems(req, res),
)

router.delete(
  '/:id/items',
  authMiddleware,
  validateParams(uuidParamSchema),
  validate(removeItemsFromOrderSchema),
  (req, res) => orderController.removeItems(req, res),
)

router.delete(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  (req, res) => orderController.delete(req, res),
)

export { router }
