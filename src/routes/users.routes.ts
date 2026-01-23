import { Router } from 'express'
import { UserController } from '@/controllers'
import { UserRepository } from '@/repositories'
import { validate, validateParams } from '@/middlewares/validate.middleware'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { createUserSchema, loginSchema, updateUserSchema } from '@/validators'
import { uuidParamSchema } from '@/validators/common.validator'

const router = Router()
const userRepository = new UserRepository()
const userController = new UserController(userRepository)

// POST /users - Criar usuário
router.post('/', validate(createUserSchema), (req, res) =>
  userController.create(req, res),
)

// POST /users/login - Login
router.post('/login', validate(loginSchema), (req, res) =>
  userController.login(req, res),
)

// GET /users - Listar todos os usuários
router.get('/', (req, res) => userController.list(req, res))

// GET /users/:id - Buscar usuário por ID
router.get(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  (req, res) => userController.getById(req, res),
)

// PUT /users/:id - Atualizar usuário
router.put(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  validate(updateUserSchema),
  (req, res) => userController.update(req, res),
)

// DELETE /users/:id - Deletar usuário
router.delete(
  '/:id',
  authMiddleware,
  validateParams(uuidParamSchema),
  (req, res) => userController.delete(req, res),
)

export { router }
