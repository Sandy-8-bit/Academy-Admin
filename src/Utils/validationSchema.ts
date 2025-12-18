import { z } from 'zod'

export const SignInSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: 'Email must be at least 3 characters' })
    .email({ message: 'Enter a valid email address' }),

  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})
