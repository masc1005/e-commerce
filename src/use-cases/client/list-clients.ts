import { ClientRepository } from '@/repositories/client.repository'
import { PaginationParams, PaginatedResponse } from '@/types/common'
import type { ClientResponseDTO } from '@/types/client/dto'

export class ListClientsUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(params?: PaginationParams): Promise<PaginatedResponse<ClientResponseDTO>> {
    return await this.clientRepository.list(params)
  }
}
