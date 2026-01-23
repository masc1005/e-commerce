import { ClientRepository } from '@/repositories/client.repository'
import type { ClientResponseDTO } from '@/types/client/dto'

interface ExecuteParams {
  clientId: string
  authenticatedUserId: string
  authenticatedUserType: string
}

export class GetClientByIdUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(params: ExecuteParams): Promise<ClientResponseDTO> {
    const { clientId, authenticatedUserId, authenticatedUserType } = params

    const client = await this.clientRepository.findById(clientId)

    if (!client) {
      throw new Error('Client not found')
    }

    if (
      authenticatedUserType !== 'admin' &&
      client.userId !== authenticatedUserId
    ) {
      throw new Error('You do not have permission to view this client')
    }

    return client
  }
}
