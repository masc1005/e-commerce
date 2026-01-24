import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UpdateClientUseCase } from '@/use-cases/client/update-client'
import { ClientRepository } from '@/repositories/client.repository'

describe('UpdateClientUseCase', () => {
  let updateClientUseCase: UpdateClientUseCase
  let clientRepository: ClientRepository

  beforeEach(() => {
    clientRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as any

    updateClientUseCase = new UpdateClientUseCase(clientRepository)
  })

  it('should update client when user is admin', async () => {
    const mockClient = {
      id: 'client-id',
      userId: 'user-id',
      name: 'Updated Name',
      contact: '11988888888',
      address: 'New Address',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(clientRepository.findById).mockResolvedValue(mockClient)
    vi.mocked(clientRepository.update).mockResolvedValue(mockClient)

    const result = await updateClientUseCase.execute({
      clientId: 'client-id',
      data: {
        name: 'Updated Name',
        contact: '11988888888',
      },
      authenticatedUserId: 'admin-id',
      authenticatedUserType: 'admin',
    })

    expect(result).toEqual(mockClient)
    expect(clientRepository.update).toHaveBeenCalledWith('client-id', {
      name: 'Updated Name',
      contact: '11988888888',
    })
  })

  it('should allow client to update their own data', async () => {
    const mockClient = {
      id: 'client-id',
      userId: 'user-id',
      name: 'Self Updated Name',
      contact: '11977777777',
      address: 'Self Updated Address',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(clientRepository.findById).mockResolvedValue(mockClient)
    vi.mocked(clientRepository.update).mockResolvedValue(mockClient)

    const result = await updateClientUseCase.execute({
      clientId: 'client-id',
      data: {
        name: 'Self Updated Name',
        contact: '11977777777',
      },
      authenticatedUserId: 'client-id',
      authenticatedUserType: 'client',
    })

    expect(result).toEqual(mockClient)
  })

  it('should throw error when client tries to update another client', async () => {
    const mockClient = {
      id: 'other-client-id',
      userId: 'user-id',
      name: 'Other Client',
      contact: '11999999999',
      address: 'Street 123',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(clientRepository.findById).mockResolvedValue(mockClient)

    await expect(
      updateClientUseCase.execute({
        clientId: 'other-client-id',
        data: {
          name: 'Hacker',
        },
        authenticatedUserId: 'client-id',
        authenticatedUserType: 'client',
      }),
    ).rejects.toThrow('You do not have permission to update this client')

    expect(clientRepository.update).not.toHaveBeenCalled()
  })
})
