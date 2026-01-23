import { Request, Response } from 'express'
import { ClientRepository } from '@/repositories/client.repository'
import { CreateClientUseCase } from '@/use-cases/client/create-client'
import { ListClientsUseCase } from '@/use-cases/client/list-clients'
import { GetClientByIdUseCase } from '@/use-cases/client/get-client-by-id'
import { UpdateClientUseCase } from '@/use-cases/client/update-client'
import { DeleteClientUseCase } from '@/use-cases/client/delete-client'

export class ClientController {
  private createClientUseCase: CreateClientUseCase
  private listClientsUseCase: ListClientsUseCase
  private getClientByIdUseCase: GetClientByIdUseCase
  private updateClientUseCase: UpdateClientUseCase
  private deleteClientUseCase: DeleteClientUseCase

  constructor(private clientRepository: ClientRepository) {
    this.createClientUseCase = new CreateClientUseCase(clientRepository)
    this.listClientsUseCase = new ListClientsUseCase(clientRepository)
    this.getClientByIdUseCase = new GetClientByIdUseCase(clientRepository)
    this.updateClientUseCase = new UpdateClientUseCase(clientRepository)
    this.deleteClientUseCase = new DeleteClientUseCase(clientRepository)
  }

  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const client = await this.createClientUseCase.execute({
        userId,
        ...req.body,
      })

      return res.status(201).json({
        message: 'Client created successfully',
        data: client,
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
      const clients = await this.listClientsUseCase.execute()

      return res.json({
        message: 'Clients found',
        data: clients,
      })
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
}
