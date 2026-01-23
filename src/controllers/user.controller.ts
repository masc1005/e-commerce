import { Request, Response } from 'express'
import { UserRepository } from '@/repositories'
import {
  CreateUserUseCase,
  LoginUserUseCase,
  ListUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '@/use-cases/user'

export class UserController {
  private createUserUseCase: CreateUserUseCase
  private loginUserUseCase: LoginUserUseCase
  private listUsersUseCase: ListUsersUseCase
  private getUserByIdUseCase: GetUserByIdUseCase
  private updateUserUseCase: UpdateUserUseCase
  private deleteUserUseCase: DeleteUserUseCase

  constructor(userRepository: UserRepository) {
    this.createUserUseCase = new CreateUserUseCase(userRepository)
    this.loginUserUseCase = new LoginUserUseCase(userRepository)
    this.listUsersUseCase = new ListUsersUseCase(userRepository)
    this.getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
    this.updateUserUseCase = new UpdateUserUseCase(userRepository)
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository)
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
      const users = await this.listUsersUseCase.execute()

      return res.json({
        data: users,
      })
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = await this.getUserByIdUseCase.execute(
        req.params.id as string,
      )

      return res.json({
        data: user,
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await this.updateUserUseCase.execute(
        req.params.id as string,
        req.body,
      )

      return res.json({
        message: 'User updated successfully',
        data: user,
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const result = await this.deleteUserUseCase.execute(
        req.params.id as string,
      )

      return res.json(result)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}
