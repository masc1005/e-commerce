import * as yup from 'yup'

// Schema para paginação
export const paginationSchema = yup.object({
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(10),
})

// Schema para UUID params
export const uuidParamSchema = yup.object({
  id: yup.string().uuid('ID inválido').required('ID obrigatório'),
})

// Schema para busca
export const searchSchema = yup.object({
  q: yup.string(),
  sortBy: yup.string(),
  order: yup.string().oneOf(['asc', 'desc']).default('asc'),
})

// Tipos
export type PaginationInput = yup.InferType<typeof paginationSchema>
export type UuidParam = yup.InferType<typeof uuidParamSchema>
export type SearchInput = yup.InferType<typeof searchSchema>
