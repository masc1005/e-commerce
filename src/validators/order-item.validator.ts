import * as yup from 'yup'

export const createOrderItemSchema = yup.object({
  orderId: yup
    .string()
    .uuid('ID do pedido inválido')
    .required('ID do pedido obrigatório'),
  productId: yup
    .string()
    .uuid('ID do produto inválido')
    .required('ID do produto obrigatório'),
  quantity: yup
    .number()
    .integer()
    .min(1, 'Quantidade deve ser no mínimo 1')
    .required('Quantidade obrigatória'),
})

export const updateOrderItemSchema = yup.object({
  quantity: yup
    .number()
    .integer()
    .min(1, 'Quantidade deve ser no mínimo 1')
    .required('Quantidade obrigatória'),
})

export type CreateOrderItemInput = yup.InferType<typeof createOrderItemSchema>
export type UpdateOrderItemInput = yup.InferType<typeof updateOrderItemSchema>
