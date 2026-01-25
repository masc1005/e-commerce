import { UserRepository } from '@/repositories'
import { CreateUserDTO, UserResponseDTO } from '@/types/user/dto'
import bcrypt from 'bcrypt'

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    input: CreateUserDTO,
    requestingUserId?: string,
  ): Promise<UserResponseDTO> {
    const userExists = await this.userRepository.exists(input.email)

    if (userExists) {
      throw new Error('Email already exists')
    }

    let userType: 'admin' | 'client' = 'client'

    if (input.type === 'admin') {
      if (!requestingUserId) {
        throw new Error('Only administrators can create new administrators')
      }

      const requestingUser =
        await this.userRepository.findById(requestingUserId)
      if (!requestingUser || requestingUser.type !== 'admin') {
        throw new Error('Only administrators can create new administrators')
      }

      userType = 'admin'
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)

    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      type: userType,
    })

    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  }
}
