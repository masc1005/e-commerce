export interface CreateUserDTO {
  id?: string
  name: string
  email: string
  password: string
  type?: 'admin' | 'client'
}

export interface UserResponseDTO {
  id: string
  name: string
  email: string
  type: 'admin' | 'client'
  createdAt: Date
  updatedAt: Date
}

export interface UpdateUserDTO {
  name?: string
  email?: string
  password?: string
  type?: 'admin' | 'client'
}

export interface LoginDTO {
  email: string
  password: string
}
