import { Router } from 'express'
import { UserController } from '@/controllers'
import { UserRepository } from '@/repositories'
import { validate } from '@/middlewares/validate.middleware'
import { createUserSchema, loginSchema } from '@/validators'

const router = Router()
const userRepository = new UserRepository()
const userController = new UserController(userRepository)

router.post('/', validate(createUserSchema), (req, res) =>
  userController.create(req, res),
)

router.post('/login', validate(loginSchema), (req, res) =>
  userController.login(req, res),
)

router.get('/list', (req, res) =>
  userController.list(req, res),
)

export { router }
