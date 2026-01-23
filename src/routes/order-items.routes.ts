import { Router } from 'express'
import { OrderItemController } from '@/controllers/order-item.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { validate, validateParams } from '@/middlewares/validate.middleware'
import {
  createOrderItemSchema,
  updateOrderItemSchema,
} from '@/validators/order-item.validator'
import { uuidParamSchema } from '@/validators/common.validator'

const router = Router()
const orderItemController = new OrderItemController()

router.post(
  '/',
  authMiddleware,
  validate(createOrderItemSchema),
  orderItemController.create.bind(orderItemController),
)

router.get(
  '/',
  authMiddleware,
  orderItemController.list.bind(orderItemController),
)

router.get(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  orderItemController.getById.bind(orderItemController),
)

router.put(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  validate(updateOrderItemSchema),
  orderItemController.update.bind(orderItemController),
)

router.delete(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  orderItemController.delete.bind(orderItemController),
)

export default router
