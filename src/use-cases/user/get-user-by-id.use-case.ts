import { UserRepository } from '@/repositories'

interface GetUserByIdResponse {
  id: string
  name: string
  email: string
  type: 'admin' | 'client'
  createdAt: Date
  updatedAt: Date
}

export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<GetUserByIdResponse> {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new Error('User not found')
    }

    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword as GetUserByIdResponse
  }
}
