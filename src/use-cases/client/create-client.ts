import { ClientRepository } from '@/repositories/client.repository'
import type { CreateClientDTO, ClientResponseDTO } from '@/types/client/dto'

interface CreateClientRequest {
  userId: string
  name: string
  contact: string
  address?: string
  status?: 'active' | 'inactive'
}

export class CreateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(data: CreateClientRequest): Promise<ClientResponseDTO> {
    // Verificar se já existe um client para este usuário
    const existingClient = await this.clientRepository.findByUserId(data.userId)

    if (existingClient) {
      throw new Error('User already has a client profile')
    }

    const clientData: CreateClientDTO = {
      userId: data.userId,
      name: data.name,
      contact: data.contact,
      address: data.address,
      status: data.status || 'active',
    }

    const client = await this.clientRepository.create(clientData)

    return client
  }
}
