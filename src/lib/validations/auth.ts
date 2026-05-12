import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Informe um e-mail valido."),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .min(3, "Informe seu nome completo.")
    .max(80, "Use no maximo 80 caracteres."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
