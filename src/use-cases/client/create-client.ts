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
  adminId: string
  adminType: string
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
    if (data.adminType !== 'admin') {
      throw new Error('Only admins can create clients')
    }

    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {
      const existingClient =
        await this.clientRepository.findByUserIdWithAnyStatus(existingUser.id)

      if (existingClient && existingClient.status === 'inactive') {
        const generatedPassword = crypto.randomBytes(8).toString('hex')
        const hashedPassword = await bcrypt.hash(generatedPassword, 10)

        await this.userRepository.update(existingUser.id, {
          name: data.name,
          password: hashedPassword,
        })

        const reactivatedClient = await this.clientRepository.update(
          existingClient.id,
          {
            name: data.name,
            contact: data.contact,
            address: data.address,
            status: 'active',
          },
        )

        if (!reactivatedClient) {
          throw new Error('Failed to reactivate client')
        }

        return {
          ...reactivatedClient,
          generatedPassword,
        }
      }

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

    try {
      const clientData: CreateClientDTO = {
        id: user.id,
        userId: data.adminId,
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
    } catch (error) {
      await this.userRepository.delete(user.id)
      throw new Error(
        'Failed to create client. User registration was rolled back.',
      )
    }
  }
}
