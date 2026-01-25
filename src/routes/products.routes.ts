import { Router } from 'express'
import { ProductController } from '@/controllers/product.controller'
import { ProductRepository } from '@/repositories/product.repository'
import { validate, validateParams } from '@/middlewares/validate.middleware'
import { authMiddleware } from '@/middlewares/auth.middleware'
import {
  createProductSchema,
  updateProductSchema,
} from '@/validators/product.validator'
import { uuidParamSchema } from '@/validators/common.validator'

const router = Router()
const productRepository = new ProductRepository()
const productController = new ProductController(productRepository)

router.post('/', authMiddleware, validate(createProductSchema), (req, res) =>
  productController.create(req, res),
)

router.get('/', authMiddleware, (req, res) => productController.list(req, res))

router.get(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  (req, res) => productController.getById(req, res),
)

router.put(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  validate(updateProductSchema),
  (req, res) => productController.update(req, res),
)

router.delete(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  (req, res) => productController.delete(req, res),
)

export { router }
