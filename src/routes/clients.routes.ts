import { Router } from 'express'
import { ClientController } from '@/controllers/client.controller'
import { ClientRepository } from '@/repositories/client.repository'
import { validate, validateParams } from '@/middlewares/validate.middleware'
import { authMiddleware } from '@/middlewares/auth.middleware'
import {
  createClientSchema,
  updateClientSchema,
} from '@/validators/client.validator'
import { uuidParamSchema } from '@/validators/common.validator'

const router = Router()
const clientRepository = new ClientRepository()
const clientController = new ClientController(clientRepository)

router.post(
  '/',
  authMiddleware,
  validate(createClientSchema),
  (req, res) => clientController.create(req, res),
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

export { router }
