import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateUserUseCase } from '@/use-cases/user/create-user.use-case'
import { UserRepository } from '@/repositories/user.repository'

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase
  let userRepository: UserRepository

  beforeEach(() => {
    userRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      exists: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updatePassword: vi.fn(),
    } as any

    createUserUseCase = new CreateUserUseCase(userRepository)
  })

  it('should create user when authenticated as admin', async () => {
    const mockUser = {
      id: 'user-id',
      name: 'New User',
      email: 'newuser@example.com',
      password: 'hashed_password',
      type: 'admin' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(userRepository.exists).mockResolvedValue(false)
    vi.mocked(userRepository.create).mockResolvedValue(mockUser)

    const result = await createUserUseCase.execute({
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      type: 'admin',
    })

    expect(result.id).toBe(mockUser.id)
    expect(result.email).toBe(mockUser.email)
    expect(result.type).toBe(mockUser.type)
  })

  it('should throw error when email already exists', async () => {
    vi.mocked(userRepository.exists).mockResolvedValue(true)

    await expect(
      createUserUseCase.execute({
        name: 'New User',
        email: 'existing@example.com',
        password: 'password123',
        type: 'admin',
      }),
    ).rejects.toThrow('Email already exists')
  })

  it('should hash password before storing', async () => {
    const mockUser = {
      id: 'user-id',
      name: 'New User',
      email: 'newuser@example.com',
      password: 'hashed_password',
      type: 'client' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(userRepository.exists).mockResolvedValue(false)
    vi.mocked(userRepository.create).mockResolvedValue(mockUser)

    await createUserUseCase.execute({
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
    })

    expect(userRepository.create).toHaveBeenCalled()
    const createCall = vi.mocked(userRepository.create).mock.calls[0][0]
    expect(createCall.password).not.toBe('password123')
  })
})
