import * as yup from 'yup'

// Schema para criar cliente
export const createClientSchema = yup.object({
  userId: yup.string().uuid('ID do usuário inválido').required('ID do usuário obrigatório'),
  name: yup.string().min(3, 'Nome deve ter no mínimo 3 caracteres').required('Nome obrigatório'),
  contact: yup.string().min(10, 'Contato inválido').required('Contato obrigatório'),
  address: yup.string(),
  status: yup.string().oneOf(['active', 'inactive'], 'Status inválido').default('active'),
})

// Schema para atualizar cliente
export const updateClientSchema = yup.object({
  name: yup.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  contact: yup.string().min(10, 'Contato inválido'),
  address: yup.string(),
  status: yup.string().oneOf(['active', 'inactive'], 'Status inválido'),
})

// Tipos TypeScript
export type CreateClientInput = yup.InferType<typeof createClientSchema>
export type UpdateClientInput = yup.InferType<typeof updateClientSchema>
