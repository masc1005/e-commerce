export interface CreateOrderDTO {
  clientId: string
  items: CreateOrderItemDTO[]
}

export interface CreateOrderItemDTO {
  productId: string
  quantity: number
  unitPrice: number
}

export interface OrderResponseDTO {
  id: string
  clientId: string
  status: 'received' | 'preparing' | 'dispatched' | 'delivered'
  orderDate: Date
  total: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItemResponseDTO {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: string
  subtotal: string
  createdAt: Date
  updatedAt: Date
}

export interface UpdateOrderStatusDTO {
  status: 'received' | 'preparing' | 'dispatched' | 'delivered'
}
