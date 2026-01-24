export interface CreateOrderDTO {
  clientId: string
  items: Omit<CreateOrderItemDTO, 'orderId'>[]
}

export interface CreateOrderItemDTO {
  orderId: string
  productId: string
  quantity: number
  unitPrice?: number
}

export interface OrderResponseDTO {
  id: string
  clientId: string
  status: 'received' | 'preparing' | 'dispatched' | 'delivered'
  orderDate: Date
  total: number
  createdAt: Date
  updatedAt: Date
}

export interface OrderItemResponseDTO {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  subtotal: number
  createdAt: Date
  updatedAt: Date
}

export interface UpdateOrderStatusDTO {
  status: 'received' | 'preparing' | 'dispatched' | 'delivered'
}
