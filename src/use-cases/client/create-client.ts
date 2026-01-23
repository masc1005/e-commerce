import { ClientRepository } from '@/repositories/client.repository'
import { UserRepository } from '@/repositories/user.repository'
import type { CreateClientDTO, ClientResponseDTO } from '@/types/client/dto'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

interface CreateClientRequest {
  email: string
  name: string
  contact: string
  address?: string
  status?: 'active' | 'inactive'
}

interface CreateClientResponse extends ClientResponseDTO {
  generatedPassword: string
}

export class CreateClientUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(data: CreateClientRequest): Promise<CreateClientResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {
      throw new Error('Email already registered')
    }

    const generatedPassword = crypto.randomBytes(8).toString('hex')
    const hashedPassword = await bcrypt.hash(generatedPassword, 10)

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      type: 'client',
    })

    const clientData: CreateClientDTO = {
      userId: user.id,
      name: data.name,
      contact: data.contact,
      address: data.address,
      status: data.status || 'active',
    }

    const client = await this.clientRepository.create(clientData)

    return {
      ...client,
      generatedPassword,
    }
  }
}
