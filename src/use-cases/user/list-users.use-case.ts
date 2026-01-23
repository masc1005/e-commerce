import { UserRepository } from '@/repositories'

interface ListUsersResponse {
  id: string
  name: string
  email: string
  type: 'admin' | 'client'
}

export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<ListUsersResponse[]> {
    const users = await this.userRepository.list()

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
    }))
  }
}
