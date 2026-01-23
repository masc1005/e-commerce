export interface CreateProductDTO {
  name: string
  description?: string
  price: number
  stock?: number
}

export interface ProductResponseDTO {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  createdAt: Date
  updatedAt: Date
}

export interface UpdateProductDTO {
  name?: string
  description?: string
  price?: number
  stock?: number
}
