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

  it('should create admin user when authenticated as admin', async () => {
    const adminUser = {
      id: 'admin-id',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed_password',
      type: 'admin' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

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
    vi.mocked(userRepository.findById).mockResolvedValue(adminUser)
    vi.mocked(userRepository.create).mockResolvedValue(mockUser)

    const result = await createUserUseCase.execute(
      {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        type: 'admin',
      },
      'admin-id',
    )

    expect(result.id).toBe(mockUser.id)
    expect(result.email).toBe(mockUser.email)
    expect(result.type).toBe('admin')
  })

  it('should throw error when non-admin tries to create admin user', async () => {
    const clientUser = {
      id: 'client-id',
      name: 'Client User',
      email: 'client@example.com',
      password: 'hashed_password',
      type: 'client' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(userRepository.exists).mockResolvedValue(false)
    vi.mocked(userRepository.findById).mockResolvedValue(clientUser)

    await expect(
      createUserUseCase.execute(
        {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          type: 'admin',
        },
        'client-id',
      ),
    ).rejects.toThrow(
      'Apenas administradores podem criar novos administradores',
    )
  })

  it('should throw error when unauthenticated user tries to create admin', async () => {
    vi.mocked(userRepository.exists).mockResolvedValue(false)

    await expect(
      createUserUseCase.execute({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        type: 'admin',
      }),
    ).rejects.toThrow(
      'Apenas administradores podem criar novos administradores',
    )
  })

  it('should create client user when not authenticated (public signup)', async () => {
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

    const result = await createUserUseCase.execute({
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
    })

    expect(result.id).toBe(mockUser.id)
    expect(result.email).toBe(mockUser.email)
    expect(result.type).toBe('client')
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
