const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["ADMIN", "PARENT", "STUDENT"]).default("STUDENT"),
  parentId: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida")
});

const walletTransactionSchema = z.object({
  amount: z.number().positive("El monto debe ser positivo"),
  type: z.enum(["CREDIT", "DEBIT"]),
  description: z.string().min(1, "La descripción es requerida")
});

module.exports = {
  registerSchema,
  loginSchema,
  walletTransactionSchema
};
