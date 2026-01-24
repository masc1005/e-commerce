import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LoginUserUseCase } from '@/use-cases/user/login-user.use-case'
import { UserRepository } from '@/repositories/user.repository'
import { ClientRepository } from '@/repositories/client.repository'
import bcrypt from 'bcrypt'

vi.mock('bcrypt')

describe('LoginUserUseCase', () => {
  let loginUserUseCase: LoginUserUseCase
  let userRepository: UserRepository
  let clientRepository: ClientRepository

  beforeEach(() => {
    userRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updatePassword: vi.fn(),
    } as any

    clientRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as any

    loginUserUseCase = new LoginUserUseCase(userRepository, clientRepository)
    vi.clearAllMocks()
  })

  it('should login admin user successfully', async () => {
    const mockUser = {
      id: 'user-id',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed_password',
      type: 'admin' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const result = await loginUserUseCase.execute({
      email: 'admin@example.com',
      password: 'password123',
    })

    expect(result.user.id).toBe(mockUser.id)
    expect(result.user.email).toBe(mockUser.email)
    expect(result.user.type).toBe(mockUser.type)
    expect(result.token).toBeDefined()
    expect(typeof result.token).toBe('string')
  })

  it('should login client user and include clientId in token', async () => {
    const mockUser = {
      id: 'user-id',
      name: 'Client User',
      email: 'client@example.com',
      password: 'hashed_password',
      type: 'client' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockClient = {
      id: 'client-id',
      userId: 'user-id',
      name: 'John Doe',
      contact: '11999999999',
      address: 'Street 123',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser)
    vi.mocked(clientRepository.findByUserId).mockResolvedValue(mockClient)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const result = await loginUserUseCase.execute({
      email: 'client@example.com',
      password: 'password123',
    })

    expect(result.user).toBeDefined()
    expect(result.token).toBeDefined()
    expect(clientRepository.findByUserId).toHaveBeenCalledWith('user-id')
  })

  it('should throw error when user not found', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(undefined as any)

    await expect(
      loginUserUseCase.execute({
        email: 'nonexistent@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow('Invalid credentials')
  })

  it('should throw error when password is incorrect', async () => {
    const mockUser = {
      id: 'user-id',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed_password',
      type: 'admin' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser)
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    await expect(
      loginUserUseCase.execute({
        email: 'admin@example.com',
        password: 'wrong_password',
      }),
    ).rejects.toThrow('Invalid credentials')
  })
})
