import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
  redirectTo: z.string().optional(),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Enter your full name.')
      .max(120, 'Name must be 120 characters or fewer.'),
    email: z.string().trim().email('Enter a valid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Za-z]/, 'Password must include at least one letter.')
      .regex(/[0-9]/, 'Password must include at least one number.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Za-z]/, 'Password must include at least one letter.')
      .regex(/[0-9]/, 'Password must include at least one number.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export const resendVerificationSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResendVerificationInput = z.infer<
  typeof resendVerificationSchema
>;

