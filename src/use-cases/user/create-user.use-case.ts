import { UserRepository } from '@/repositories'
import { CreateUserDTO, UserResponseDTO } from '@/types/user/dto'
import bcrypt from 'bcrypt'

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: CreateUserDTO): Promise<UserResponseDTO> {
    const userExists = await this.userRepository.exists(input.email)

    if (userExists) {
      throw new Error('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)

    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      type: input.type || 'client',
    })

    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  }
}
