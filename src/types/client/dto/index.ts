export interface CreateClientDTO {
  userId: string
  name: string
  contact: string
  address?: string
  status?: 'active' | 'inactive'
}

export interface ClientResponseDTO {
  id: string
  userId: string
  name: string
  contact: string
  address: string | null
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

export interface UpdateClientDTO {
  name?: string
  contact?: string
  address?: string
  status?: 'active' | 'inactive'
}
