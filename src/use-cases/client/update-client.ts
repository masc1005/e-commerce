import { ClientRepository } from '@/repositories/client.repository'
import type { UpdateClientDTO, ClientResponseDTO } from '@/types/client/dto'

interface ExecuteParams {
  clientId: string
  data: UpdateClientDTO
  authenticatedUserId: string
  authenticatedUserType: string
}

export class UpdateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(params: ExecuteParams): Promise<ClientResponseDTO> {
    const { clientId, data, authenticatedUserId, authenticatedUserType } =
      params

    const client = await this.clientRepository.findById(clientId)

    if (!client) {
      throw new Error('Client not found')
    }

    if (
      authenticatedUserType !== 'admin' &&
      client.userId !== authenticatedUserId
    ) {
      throw new Error('You do not have permission to update this client')
    }

    const updatedClient = await this.clientRepository.update(clientId, data)

    if (!updatedClient) {
      throw new Error('Failed to update client')
    }

    return updatedClient
  }
}
