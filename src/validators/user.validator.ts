import * as yup from 'yup'

// Schema para criar usuário
export const createUserSchema = yup.object({
  name: yup
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .required('Nome obrigatório'),
  email: yup.string().email('Email inválido').required('Email obrigatório'),
  password: yup
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .required('Senha obrigatória'),
  type: yup
    .string()
    .oneOf(['admin', 'client'], 'Tipo inválido')
    .default('client'),
})

// Schema para atualizar usuário
export const updateUserSchema = yup.object({
  name: yup.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: yup.string().email('Email inválido'),
  password: yup.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  type: yup.string().oneOf(['admin', 'client'], 'Tipo inválido'),
})

// Schema para login
export const loginSchema = yup.object({
  email: yup.string().email('Email inválido').required('Email obrigatório'),
  password: yup.string().required('Senha obrigatória'),
})

// Tipos TypeScript inferidos
export type CreateUserInput = yup.InferType<typeof createUserSchema>
export type UpdateUserInput = yup.InferType<typeof updateUserSchema>
export type LoginInput = yup.InferType<typeof loginSchema>
