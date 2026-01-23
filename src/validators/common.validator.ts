import * as yup from 'yup'

export const paginationSchema = yup.object({
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(10),
})

export const uuidParamSchema = yup.object({
  id: yup.string().uuid('ID inválido').required('ID obrigatório'),
})

export const searchSchema = yup.object({
  q: yup.string(),
  sortBy: yup.string(),
  order: yup.string().oneOf(['asc', 'desc']).default('asc'),
})

export type PaginationInput = yup.InferType<typeof paginationSchema>
export type UuidParam = yup.InferType<typeof uuidParamSchema>
export type SearchInput = yup.InferType<typeof searchSchema>
