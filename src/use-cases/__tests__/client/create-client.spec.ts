import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateClientUseCase } from '@/use-cases/client/create-client'
import { ClientRepository } from '@/repositories/client.repository'
import { UserRepository } from '@/repositories/user.repository'

describe('CreateClientUseCase', () => {
  let createClientUseCase: CreateClientUseCase
  let clientRepository: ClientRepository
  let userRepository: UserRepository

  beforeEach(() => {
    clientRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as any

    userRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updatePassword: vi.fn(),
    } as any

    createClientUseCase = new CreateClientUseCase(
      clientRepository,
      userRepository,
    )
  })

  it('should create client when authenticated as admin', async () => {
    const mockUser = {
      id: 'user-id',
      name: 'John Doe',
      email: 'client@example.com',
      password: 'hashed_password',
      type: 'client' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockClient = {
      id: 'client-id',
      userId: 'admin-id',
      name: 'John Doe',
      contact: '11999999999',
      address: 'Street 123',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(userRepository.findByEmail).mockResolvedValue(undefined as any)
    vi.mocked(userRepository.create).mockResolvedValue(mockUser)
    vi.mocked(clientRepository.create).mockResolvedValue(mockClient)

    const result = await createClientUseCase.execute({
      email: 'client@example.com',
      name: 'John Doe',
      contact: '11999999999',
      address: 'Street 123',
      adminId: 'admin-id',
      adminType: 'admin',
    })

    expect(result.id).toBe(mockClient.id)
    expect(result.name).toBe(mockClient.name)
    expect(result.contact).toBe(mockClient.contact)
    expect(result.generatedPassword).toBeDefined()
    expect(result.generatedPassword.length).toBeGreaterThan(6)
  })

  it('should throw error when non-admin tries to create client', async () => {
    await expect(
      createClientUseCase.execute({
        email: 'client@example.com',
        name: 'John Doe',
        contact: '11999999999',
        adminId: 'client-id',
        adminType: 'client',
      }),
    ).rejects.toThrow('Only admins can create clients')

    expect(userRepository.create).not.toHaveBeenCalled()
    expect(clientRepository.create).not.toHaveBeenCalled()
  })
})
