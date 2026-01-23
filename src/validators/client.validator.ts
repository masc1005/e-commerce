import * as yup from 'yup'

export const createClientSchema = yup.object({
  name: yup.string().required('Name is required'),
  contact: yup.string().required('Contact is required'),
  address: yup.string().optional(),
  status: yup.string().oneOf(['active', 'inactive']).optional(),
})

export const updateClientSchema = yup.object({
  name: yup.string().optional(),
  contact: yup.string().optional(),
  address: yup.string().optional(),
  status: yup.string().oneOf(['active', 'inactive']).optional(),
})
