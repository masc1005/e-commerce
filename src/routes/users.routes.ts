import { Router } from 'express'
import { UserController } from '@/controllers'
import { UserRepository } from '@/repositories'
import { ClientRepository } from '@/repositories/client.repository'
import { validate, validateParams } from '@/middlewares/validate.middleware'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { createUserSchema, loginSchema, updateUserSchema } from '@/validators'
import { uuidParamSchema } from '@/validators/common.validator'

const router = Router()
const userRepository = new UserRepository()
const clientRepository = new ClientRepository()
const userController = new UserController(userRepository, clientRepository)

router.post('/', validate(createUserSchema), (req, res) =>
  userController.create(req, res),
)

router.post('/login', validate(loginSchema), (req, res) =>
  userController.login(req, res),
)

router.get('/', (req, res) => userController.list(req, res))

router.get(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  (req, res) => userController.getById(req, res),
)

router.put(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  validate(updateUserSchema),
  (req, res) => userController.update(req, res),
)

router.delete(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  (req, res) => userController.delete(req, res),
)

export { router }
