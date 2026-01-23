import { UserRepository } from '@/repositories'
import { UpdateUserDTO } from '@/types/user/dto'
import bcrypt from 'bcrypt'

interface UpdateUserResponse {
  id: string
  name: string
  email: string
  type: 'admin' | 'client'
  createdAt: Date
  updatedAt: Date
}

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, input: UpdateUserDTO): Promise<UpdateUserResponse> {
    const userExists = await this.userRepository.findById(id)

    if (!userExists) {
      throw new Error('User not found')
    }

    if (input.email && input.email !== userExists.email) {
      const emailExists = await this.userRepository.exists(input.email)
      if (emailExists) {
        throw new Error('Email already exists')
      }
    }

    const updateData = { ...input }
    if (input.password) {
      updateData.password = await bcrypt.hash(input.password, 10)
    }

    const user = await this.userRepository.update(id, updateData)

    if (!user) {
      throw new Error('Failed to update user')
    }

    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword as UpdateUserResponse
  }
}
