import * as yup from 'yup'

// Schema para criar produto
export const createProductSchema = yup.object({
  name: yup
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .required('Nome obrigatório'),
  description: yup.string(),
  price: yup
    .number()
    .positive('Preço deve ser positivo')
    .required('Preço obrigatório'),
  stock: yup
    .number()
    .integer()
    .min(0, 'Estoque não pode ser negativo')
    .default(0),
})

// Schema para atualizar produto
export const updateProductSchema = yup.object({
  name: yup.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: yup.string(),
  price: yup.number().positive('Preço deve ser positivo'),
  stock: yup.number().integer().min(0, 'Estoque não pode ser negativo'),
})

// Tipos TypeScript
export type CreateProductInput = yup.InferType<typeof createProductSchema>
export type UpdateProductInput = yup.InferType<typeof updateProductSchema>
