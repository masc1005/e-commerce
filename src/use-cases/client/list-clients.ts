import { ClientRepository } from '@/repositories/client.repository'
import type { ClientResponseDTO } from '@/types/client/dto'

export class ListClientsUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(): Promise<ClientResponseDTO[]> {
    const clients = await this.clientRepository.list()

    return clients
  }
}
