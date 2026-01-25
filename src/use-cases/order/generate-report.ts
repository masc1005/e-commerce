import { OrderRepository } from '@/repositories/order.repository'

interface ExecuteParams {
  startDate?: Date
  endDate?: Date
  authenticatedUserType: string
}

export class GenerateOrderReportUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(params: ExecuteParams): Promise<string> {
    const { startDate, endDate, authenticatedUserType } = params

    if (authenticatedUserType !== 'admin') {
      throw new Error('Only admins can generate reports')
    }

    const filters: any = {}
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate

    const result = await this.orderRepository.list(
      { page: 1, limit: 10000 },
      filters,
    )
    const orders = result.data

    let csv =
      'ID,Cliente ID,Status,Data do Pedido,Total,Criado em,Atualizado em\n'

    for (const order of orders) {
      csv += `${order.id},${order.clientId},${order.status},${order.orderDate.toISOString()},${order.total},${order.createdAt.toISOString()},${order.updatedAt.toISOString()}\n`
    }

    return csv
  }
}
