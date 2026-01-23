import { Request, Response } from 'express'
import { UserRepository } from '@/repositories'
import {
  CreateUserUseCase,
  LoginUserUseCase,
  ListUsersUseCase,
} from '@/use-cases/user'

export class UserController {
  private createUserUseCase: CreateUserUseCase
  private loginUserUseCase: LoginUserUseCase
  private listUsersUseCase: ListUsersUseCase

  constructor(userRepository: UserRepository) {
    this.createUserUseCase = new CreateUserUseCase(userRepository)
    this.loginUserUseCase = new LoginUserUseCase(userRepository)
    this.listUsersUseCase = new ListUsersUseCase(userRepository)
  }

  async create(req: Request, res: Response) {
    try {
      const user = await this.createUserUseCase.execute(req.body)

      return res.status(201).json({
        message: 'User created successfully',
        data: user,
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await this.loginUserUseCase.execute(req.body)

      return res.json({
        message: 'Login successful',
        data: result,
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async list(req: Request, res: Response) {
    try {
      const result = await this.listUsersUseCase.execute()

      return res.json({
        message: 'Users founded',
        data: result,
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}
