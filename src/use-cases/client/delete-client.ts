import { ClientRepository } from '@/repositories/client.repository'

interface ExecuteParams {
  clientId: string
  authenticatedUserId: string
  authenticatedUserType: string
}

export class DeleteClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(params: ExecuteParams): Promise<{ message: string }> {
    const { clientId, authenticatedUserId, authenticatedUserType } = params

    const client = await this.clientRepository.findById(clientId)

    if (!client) {
      throw new Error('Client not found')
    }

    // Só o próprio cliente ou admin pode deletar
    if (authenticatedUserType !== 'admin' && client.userId !== authenticatedUserId) {
      throw new Error('You do not have permission to delete this client')
    }

    await this.clientRepository.delete(clientId)

    return { message: 'Client deleted successfully' }
  }
}
