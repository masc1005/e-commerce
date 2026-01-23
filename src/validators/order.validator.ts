import * as yup from 'yup'

export const createOrderSchema = yup.object({
  clientId: yup
    .string()
    .uuid('ID do cliente inválido')
    .required('ID do cliente obrigatório'),
  items: yup
    .array()
    .of(
      yup.object({
        productId: yup
          .string()
          .uuid('ID do produto inválido')
          .required('ID do produto obrigatório'),
        quantity: yup
          .number()
          .integer()
          .min(1, 'Quantidade deve ser no mínimo 1')
          .required('Quantidade obrigatória'),
        unitPrice: yup
          .number()
          .positive('Preço deve ser positivo')
          .required('Preço obrigatório'),
      }),
    )
    .min(1, 'Pedido deve ter ao menos 1 item')
    .required('Itens obrigatórios'),
})

export const updateOrderStatusSchema = yup.object({
  status: yup
    .string()
    .oneOf(
      ['received', 'preparing', 'dispatched', 'delivered'],
      'Status inválido',
    )
    .required('Status obrigatório'),
})

export type CreateOrderInput = yup.InferType<typeof createOrderSchema>
export type UpdateOrderStatusInput = yup.InferType<
  typeof updateOrderStatusSchema
>
