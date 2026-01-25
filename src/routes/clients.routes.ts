import { Router } from 'express'
import { ClientController } from '@/controllers'
import { ClientRepository } from '@/repositories'
import { UserRepository } from '@/repositories'
import { validate, validateParams } from '@/middlewares/validate.middleware'
import { authMiddleware } from '@/middlewares/auth.middleware'
import {
  createClientSchema,
  updateClientSchema,
  updatePasswordSchema,
} from '@/validators/client.validator'
import { uuidParamSchema } from '@/validators/common.validator'

const router = Router()
const clientRepository = new ClientRepository()
const userRepository = new UserRepository()
const clientController = new ClientController(clientRepository, userRepository)

router.post('/', authMiddleware, validate(createClientSchema), (req, res) =>
  clientController.create(req, res),
)

router.get('/', authMiddleware, (req, res) => clientController.list(req, res))

router.get(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  (req, res) => clientController.getById(req, res),
)

router.put(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  validate(updateClientSchema),
  (req, res) => clientController.update(req, res),
)

router.delete(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  (req, res) => clientController.delete(req, res),
)

router.patch(
  '/password',
  authMiddleware,
  validate(updatePasswordSchema),
  (req, res) => clientController.updatePassword(req, res),
)

export { router }
