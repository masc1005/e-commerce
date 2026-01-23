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

export const addItemsToOrderSchema = yup.object({
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
      }),
    )
    .min(1, 'Deve haver ao menos 1 item')
    .required('Itens obrigatórios'),
})

export const removeItemsFromOrderSchema = yup.object({
  itemIds: yup
    .array()
    .of(yup.string().uuid('ID do item inválido'))
    .min(1, 'Deve haver ao menos 1 item')
    .required('IDs dos itens obrigatórios'),
})

export type CreateOrderInput = yup.InferType<typeof createOrderSchema>
export type UpdateOrderStatusInput = yup.InferType<
  typeof updateOrderStatusSchema
>
export type AddItemsToOrderInput = yup.InferType<typeof addItemsToOrderSchema>
export type RemoveItemsFromOrderInput = yup.InferType<
  typeof removeItemsFromOrderSchema
>
