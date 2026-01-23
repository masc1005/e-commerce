import { UserRepository } from '@/repositories'
import { ClientRepository } from '@/repositories/client.repository'
import { LoginDTO } from '@/types/user/dto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    type: 'admin' | 'client'
  }
}

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private clientRepository: ClientRepository,
  ) {}

  async execute(input: LoginDTO): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(input.email)

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password)

    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    let clientId: string | undefined

    if (user.type === 'client') {
      const client = await this.clientRepository.findByUserId(user.id)
      if (client) {
        clientId = client.id
      }
    }

    const secret =
      process.env.JWT_SECRET || 'default-secret-change-in-production'
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: user.type,
        ...(clientId && { clientId }),
      },
      secret,
      { expiresIn: '7d' },
    )

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
      },
    }
  }
}
