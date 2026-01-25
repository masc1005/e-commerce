import { Request, Response } from 'express'
import { ClientRepository } from '@/repositories/client.repository'
import { UserRepository } from '@/repositories/user.repository'
import { CreateClientUseCase } from '@/use-cases/client/create-client'
import { ListClientsUseCase } from '@/use-cases/client/list-clients'
import { GetClientByIdUseCase } from '@/use-cases/client/get-client-by-id'
import { UpdateClientUseCase } from '@/use-cases/client/update-client'
import { DeleteClientUseCase } from '@/use-cases/client/delete-client'
import { UpdatePasswordUseCase } from '@/use-cases/client/update-password'

export class ClientController {
  private createClientUseCase: CreateClientUseCase
  private listClientsUseCase: ListClientsUseCase
  private getClientByIdUseCase: GetClientByIdUseCase
  private updateClientUseCase: UpdateClientUseCase
  private deleteClientUseCase: DeleteClientUseCase
  private updatePasswordUseCase: UpdatePasswordUseCase

  constructor(
    private clientRepository: ClientRepository,
    private userRepository: UserRepository,
  ) {
    this.createClientUseCase = new CreateClientUseCase(
      clientRepository,
      userRepository,
    )
    this.listClientsUseCase = new ListClientsUseCase(clientRepository)
    this.getClientByIdUseCase = new GetClientByIdUseCase(clientRepository)
    this.updateClientUseCase = new UpdateClientUseCase(clientRepository)
    this.deleteClientUseCase = new DeleteClientUseCase(clientRepository)
    this.updatePasswordUseCase = new UpdatePasswordUseCase(
      clientRepository,
      userRepository,
    )
  }

  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const userType = req.user?.type

      if (!userId || !userType) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      if (userType !== 'admin') {
        return res.status(403).json({ error: 'Only admins can create clients' })
      }

      const result = await this.createClientUseCase.execute({
        ...req.body,
        adminId: userId,
        adminType: userType,
      })

      return res.status(201).json({
        message: 'Client created successfully',
        data: {
          client: {
            id: result.id,
            userId: result.userId,
            name: result.name,
            contact: result.contact,
            address: result.address,
            status: result.status,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
          },
          generatedPassword: result.generatedPassword,
        },
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async list(req: Request, res: Response) {
    try {
      if (req.user?.type !== 'admin') throw new Error('Unathorized')

      const page = req.query.page
        ? parseInt(req.query.page as string)
        : undefined
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined

      const result = await this.listClientsUseCase.execute({ page, limit })

      return res.json(result)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const userType = req.user?.type

      if (!userId || !userType) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const client = await this.getClientByIdUseCase.execute({
        clientId: req.params.id as string,
        authenticatedUserId: userId,
        authenticatedUserType: userType,
      })

      return res.json({
        data: client,
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
      const userId = req.user?.id
      const userType = req.user?.type

      if (!userId || !userType) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const client = await this.updateClientUseCase.execute({
        clientId: req.params.id as string,
        data: req.body,
        authenticatedUserId: userId,
        authenticatedUserType: userType,
      })

      return res.json({
        message: 'Client updated successfully',
        data: client,
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
      const userId = req.user?.id
      const userType = req.user?.type

      if (!userId || !userType) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const result = await this.deleteClientUseCase.execute({
        clientId: req.params.id as string,
        authenticatedUserId: userId,
        authenticatedUserType: userType,
      })

      return res.json(result)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const result = await this.updatePasswordUseCase.execute({
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
        authenticatedUserId: userId,
      })

      return res.json(result)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}
