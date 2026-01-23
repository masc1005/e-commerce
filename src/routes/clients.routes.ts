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

// POST /clients - Criar client
router.post(
  '/',
  authMiddleware,
  validate(createClientSchema),
  (req, res) => clientController.create(req, res),
)

// GET /clients - Listar todos os clients
router.get('/', authMiddleware, (req, res) => clientController.list(req, res))

// GET /clients/:id - Buscar client por ID
router.get(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  (req, res) => clientController.getById(req, res),
)

// PUT /clients/:id - Atualizar client
router.put(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  validate(updateClientSchema),
  (req, res) => clientController.update(req, res),
)

// DELETE /clients/:id - Deletar client
router.delete(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  (req, res) => clientController.delete(req, res),
)

export { router }
