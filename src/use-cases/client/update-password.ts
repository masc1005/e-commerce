import { ClientRepository } from '@/repositories/client.repository'
import { UserRepository } from '@/repositories/user.repository'
import bcrypt from 'bcrypt'

interface ExecuteParams {
  currentPassword: string
  newPassword: string
  authenticatedUserId: string
}

export class UpdatePasswordUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(params: ExecuteParams): Promise<{ message: string }> {
    const { currentPassword, newPassword, authenticatedUserId } = params

    const client = await this.clientRepository.findByUserId(authenticatedUserId)

    if (!client) {
      throw new Error('Client not found')
    }

    const user = await this.userRepository.findById(authenticatedUserId)

    if (!user) {
      throw new Error('User not found')
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await this.userRepository.update(user.id, { password: hashedPassword })

    return { message: 'Password updated successfully' }
  }
}
