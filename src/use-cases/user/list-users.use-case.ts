import { UserRepository } from '@/repositories'
import { PaginationParams, PaginatedResponse } from '@/types/common'

interface ListUsersResponse {
  id: string
  name: string
  email: string
  type: 'admin' | 'client'
}

export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<ListUsersResponse>> {
    const result = await this.userRepository.list(params)

    return {
      data: result.data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
      })),
      pagination: result.pagination,
    }
  }
}
