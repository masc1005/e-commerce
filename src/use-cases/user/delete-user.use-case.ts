import { UserRepository } from '@/repositories'

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.delete(id)

    if (!user) {
      throw new Error('User not found')
    }

    return { message: 'User deleted successfully' }
  }
}
