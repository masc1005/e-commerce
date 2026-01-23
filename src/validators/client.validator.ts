import * as yup from 'yup'

export const createClientSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
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

export const updatePasswordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'New password must be at least 8 characters')
    .required('New password is required'),
})
